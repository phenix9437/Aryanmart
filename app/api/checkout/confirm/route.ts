import { NextResponse } from 'next/server';
import { OrderType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import logger from '@/lib/logger';
import { calculateGst } from '@/lib/gst';
import { verifyPayment } from '@/lib/mock-payment';
import { computeStockStatus } from '@/lib/pricing';
import {
  buildCartResponse,
  getOrderTypeForRole,
  loadUserCart,
  validateStockForItems,
} from '@/lib/cart-helpers';

export async function POST(request: Request) {
  try {
    const { userId, role } = await requireAuth(request);
    const body = await request.json();
    const { paymentOrderId, addressId, mockOutcome } = body;

    if (!paymentOrderId || !addressId) {
      return NextResponse.json(
        { success: false, message: 'paymentOrderId and addressId are required' },
        { status: 400 }
      );
    }

    const verification = await verifyPayment(
      paymentOrderId,
      mockOutcome ?? 'success'
    );

    if (!verification.success) {
      return NextResponse.json(
        { success: false, message: 'Payment failed' },
        { status: 402 }
      );
    }

    const cart = await loadUserCart(userId);
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Cart is empty' },
        { status: 400 }
      );
    }

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      return NextResponse.json(
        { success: false, message: 'Address not found' },
        { status: 404 }
      );
    }

    const insufficientItems = validateStockForItems(cart.items);
    if (insufficientItems) {
      return NextResponse.json(
        {
          success: false,
          message: 'Some items are no longer available. Please review your cart.',
          insufficientItems,
        },
        { status: 409 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const { items: resolvedItems, totals } = await buildCartResponse(cart, role);
    const shippingCharge = 0;
    const totalAmount = totals.grandTotal + shippingCharge;
    const orderType = getOrderTypeForRole(role) as OrderType;
    const gstin =
      role === 'B2B' || role === 'GOVT' ? user.gstin ?? undefined : undefined;

    try {
      const order = await prisma.$transaction(async (tx) => {
        const createdOrder = await tx.order.create({
          data: {
            userId,
            addressId,
            orderType,
            status: 'CONFIRMED',
            paymentStatus: 'PAID',
            subtotal: totals.subtotal,
            gstAmount: totals.totalGst,
            shippingCharge,
            discount: 0,
            totalAmount,
            gstin,
            paymentId: verification.paymentId,
            paymentMethod: 'mock_payment',
          },
        });

        for (const line of resolvedItems) {
          const cartItem = cart.items.find(
            (item) => item.variantId === line.variantId
          );
          if (!cartItem) continue;

          const gst = calculateGst(
            line.quantity * line.unitPrice,
            line.product.gstRate
          );

          await tx.orderItem.create({
            data: {
              orderId: createdOrder.id,
              productId: line.product.id,
              variantId: line.variantId,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              gstRate: line.product.gstRate,
              gstAmount: gst.gstAmount,
              totalPrice: gst.totalWithGst,
            },
          });

          const updatedVariant = await tx.productVariant.update({
            where: { id: cartItem.variantId },
            data: { stock: { decrement: line.quantity } },
          });

          const stockStatus = computeStockStatus(updatedVariant.stock);

          if (stockStatus !== updatedVariant.stockStatus) {
            await tx.productVariant.update({
              where: { id: cartItem.variantId },
              data: { stockStatus },
            });
          }
        }

        await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

        return createdOrder;
      });

      logger.info('Order confirmed', {
        orderId: order.id,
        userId,
        totalAmount: order.totalAmount,
      });

      return NextResponse.json(
        {
          success: true,
          data: {
            orderId: order.id,
            orderNumber: order.id,
            totalAmount: order.totalAmount,
            status: order.status,
          },
        },
        { status: 201 }
      );
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            'Some items are no longer available. Please review your cart.',
        },
        { status: 409 }
      );
    }
  } catch (error) {
    return handleApiError(error, {
      path: '/api/checkout/confirm',
      method: 'POST',
    });
  }
}

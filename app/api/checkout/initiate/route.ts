import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import { createPaymentOrder } from '@/lib/mock-payment';
import {
  buildCartResponse,
  loadUserCart,
  validateStockForItems,
} from '@/lib/cart-helpers';

export async function POST(request: Request) {
  try {
    const { userId, role } = await requireAuth(request);
    const body = await request.json();
    const { addressId } = body;

    if (!addressId || typeof addressId !== 'string') {
      return NextResponse.json(
        { success: false, message: 'addressId is required' },
        { status: 400 }
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
          message: 'Some items in your cart no longer have sufficient stock',
          insufficientItems,
        },
        { status: 409 }
      );
    }

    const { totals } = await buildCartResponse(cart, role);

    // Free shipping placeholder — real logic later: free above ₹5000, else a flat fee
    const shippingCharge = 0;
    const grandTotal = totals.grandTotal + shippingCharge;

    const paymentOrder = await createPaymentOrder(grandTotal);

    return NextResponse.json({
      success: true,
      data: {
        paymentOrderId: paymentOrder.paymentOrderId,
        amount: grandTotal,
        totals,
        shippingCharge,
      },
    });
  } catch (error) {
    return handleApiError(error, {
      path: '/api/checkout/initiate',
      method: 'POST',
    });
  }
}

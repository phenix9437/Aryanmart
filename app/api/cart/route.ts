import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import {
  buildCartResponse,
  getOrCreateCart,
  loadUserCart,
  validateQuantityAgainstVariant,
} from '@/lib/cart-helpers';

export async function GET(request: Request) {
  try {
    const { userId, role } = await requireAuth(request);
    await getOrCreateCart(userId);

    const cart = await loadUserCart(userId);
    if (!cart) {
      return NextResponse.json({
        success: true,
        data: {
          items: [],
          totals: {
            subtotal: 0,
            totalGst: 0,
            grandTotal: 0,
            itemBreakdowns: [],
          },
        },
      });
    }

    const data = await buildCartResponse(cart, role);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleApiError(error, { path: '/api/cart', method: 'GET' });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireAuth(request);
    const body = await request.json();
    const { variantId, quantity } = body;

    if (!variantId || typeof variantId !== 'string') {
      return NextResponse.json(
        { success: false, message: 'variantId is required' },
        { status: 400 }
      );
    }

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant || !variant.isActive) {
      return NextResponse.json(
        { success: false, message: 'Variant not found' },
        { status: 404 }
      );
    }

    const cart = await getOrCreateCart(userId);
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, variantId },
    });

    const newQuantity = existingItem
      ? existingItem.quantity + Number(quantity)
      : Number(quantity);

    const validation = validateQuantityAgainstVariant(newQuantity, variant);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 }
      );
    }

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          variantId,
          quantity: newQuantity,
        },
      });
    }

    return NextResponse.json(
      { success: true, message: 'Added to cart' },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, { path: '/api/cart', method: 'POST' });
  }
}

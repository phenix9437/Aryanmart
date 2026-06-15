import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import {
  findOwnedCartItem,
  validateQuantityAgainstVariant,
} from '@/lib/cart-helpers';

export async function PATCH(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const { userId } = await requireAuth(request);
    const body = await request.json();
    const quantity = Number(body.quantity);

    const cartItem = await findOwnedCartItem(params.itemId, userId);
    if (!cartItem) {
      return NextResponse.json(
        { success: false, message: 'Cart item not found' },
        { status: 404 }
      );
    }

    const validation = validateQuantityAgainstVariant(
      quantity,
      cartItem.variant
    );
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, message: validation.message },
        { status: 400 }
      );
    }

    await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
    });

    return NextResponse.json({ success: true, message: 'Cart updated' });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/cart/${params.itemId}`,
      method: 'PATCH',
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { itemId: string } }
) {
  try {
    const { userId } = await requireAuth(request);

    const cartItem = await findOwnedCartItem(params.itemId, userId);
    if (!cartItem) {
      return NextResponse.json(
        { success: false, message: 'Cart item not found' },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({ where: { id: cartItem.id } });

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/cart/${params.itemId}`,
      method: 'DELETE',
    });
  }
}

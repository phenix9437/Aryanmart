import { NextResponse } from 'next/server';
import { OrderStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import logger from '@/lib/logger';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await requireRole(request, ['ADMIN', 'SALES']);
    const body = await request.json();

    const order = await prisma.order.findUnique({ where: { id: params.id } });
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    if (!body.status || !(body.status in OrderStatus)) {
      return NextResponse.json(
        { success: false, message: 'A valid order status is required' },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: { status: body.status as OrderStatus },
    });

    logger.info('Admin updated order status', {
      adminUserId: userId,
      orderId: params.id,
      previousStatus: order.status,
      newStatus: updatedOrder.status,
    });

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/admin/orders/${params.id}`,
      method: 'PATCH',
    });
  }
}

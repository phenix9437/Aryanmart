import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';

export async function GET(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const { userId, role } = await requireAuth(request);
    const isStaff = role === 'ADMIN' || role === 'SALES';

    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: {
        address: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { sortOrder: 'asc' } },
                brand: true,
                category: true,
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!order || (!isStaff && order.userId !== userId)) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/orders/${params.orderId}`,
      method: 'GET',
    });
  }
}

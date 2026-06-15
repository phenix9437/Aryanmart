import { NextResponse } from 'next/server';
import { OrderStatus, OrderType, PaymentStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import {
  buildPaginationMeta,
  parsePaginationParams,
} from '@/lib/validators/pagination';

export async function GET(request: Request) {
  try {
    await requireRole(request, ['ADMIN', 'SALES']);
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePaginationParams(searchParams);

    const where: Prisma.OrderWhereInput = {};
    const statusParam = searchParams.get('status');
    const orderTypeParam = searchParams.get('orderType');
    const paymentStatusParam = searchParams.get('paymentStatus');

    if (statusParam && statusParam in OrderStatus) {
      where.status = statusParam as OrderStatus;
    }
    if (orderTypeParam && orderTypeParam in OrderType) {
      where.orderType = orderTypeParam as OrderType;
    }
    if (paymentStatusParam && paymentStatusParam in PaymentStatus) {
      where.paymentStatus = paymentStatusParam as PaymentStatus;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              companyName: true,
              role: true,
              firstName: true,
              lastName: true,
            },
          },
          address: true,
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: { orderBy: { sortOrder: 'asc' }, take: 1 },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: orders,
      meta: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    return handleApiError(error, {
      path: '/api/admin/orders',
      method: 'GET',
    });
  }
}

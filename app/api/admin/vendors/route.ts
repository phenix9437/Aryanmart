import { NextResponse } from 'next/server';
import { Prisma, VendorStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import {
  buildPaginationMeta,
  parsePaginationParams,
} from '@/lib/validators/pagination';

export async function GET(request: Request) {
  try {
    await requireRole(request, ['ADMIN']);
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePaginationParams(searchParams);
    const statusParam = searchParams.get('status');

    const where: Prisma.VendorWhereInput = {};

    if (statusParam && statusParam in VendorStatus) {
      where.approvalStatus = statusParam as VendorStatus;
    }

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              companyName: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.vendor.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: vendors,
      meta: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    return handleApiError(error, {
      path: '/api/admin/vendors',
      method: 'GET',
    });
  }
}

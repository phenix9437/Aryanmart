import { NextResponse } from 'next/server';
import { Prisma, RfqStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import logger from '@/lib/logger';
import {
  buildPaginationMeta,
  parsePaginationParams,
} from '@/lib/validators/pagination';
import { generateRfqNumber, validateRfqInput } from '@/lib/validators/rfq';

function isStaff(role: string) {
  return role === 'ADMIN' || role === 'SALES';
}

export async function POST(request: Request) {
  try {
    const { userId, role } = await requireAuth(request);
    const body = await request.json();
    const validation = validateRfqInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    let gstin =
      typeof body.gstin === 'string' && body.gstin.trim()
        ? body.gstin.trim()
        : null;

    if (!gstin && (role === 'B2B' || role === 'GOVT')) {
      gstin = user.gstin;
    }

    const rfq = await prisma.rfq.create({
      data: {
        userId,
        rfqNumber: generateRfqNumber(),
        items: body.items as Prisma.InputJsonValue,
        requirementsText:
          typeof body.requirementsText === 'string'
            ? body.requirementsText
            : null,
        deliveryLocation: body.deliveryLocation.trim(),
        requiredByDate: body.requiredByDate
          ? new Date(body.requiredByDate)
          : null,
        gstin,
        status: 'SUBMITTED',
      },
    });

    logger.info('RFQ submitted', { rfqNumber: rfq.rfqNumber, userId });

    return NextResponse.json(
      {
        success: true,
        data: { id: rfq.id, rfqNumber: rfq.rfqNumber, status: rfq.status },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, { path: '/api/rfq', method: 'POST' });
  }
}

export async function GET(request: Request) {
  try {
    const { userId, role } = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePaginationParams(searchParams);
    const statusParam = searchParams.get('status');

    const where: Prisma.RfqWhereInput = isStaff(role) ? {} : { userId };

    if (statusParam && statusParam in RfqStatus) {
      where.status = statusParam as RfqStatus;
    }

    const [rfqs, total] = await Promise.all([
      prisma.rfq.findMany({
        where,
        include: isStaff(role)
          ? {
              user: {
                select: {
                  email: true,
                  companyName: true,
                  role: true,
                  firstName: true,
                  lastName: true,
                },
              },
            }
          : undefined,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.rfq.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: rfqs,
      meta: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    return handleApiError(error, { path: '/api/rfq', method: 'GET' });
  }
}

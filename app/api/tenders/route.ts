import { NextResponse } from 'next/server';
import { Prisma, TenderStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import {
  buildPaginationMeta,
  parsePaginationParams,
} from '@/lib/validators/pagination';
import { validateTenderInput } from '@/lib/validators/tender';

function isStaff(role: string) {
  return role === 'ADMIN' || role === 'SALES';
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireRole(request, ['GOVT', 'B2B', 'ADMIN']);
    const body = await request.json();
    const validation = validateTenderInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const tenderNumber =
      typeof body.tenderNumber === 'string' && body.tenderNumber.trim()
        ? body.tenderNumber.trim()
        : null;

    const tender = await prisma.tender.create({
      data: {
        userId,
        tenderNumber,
        issuingAuthority: body.issuingAuthority.trim(),
        docUrl: typeof body.docUrl === 'string' ? body.docUrl : null,
        deadline: body.deadline ? new Date(body.deadline) : null,
        notes: typeof body.notes === 'string' ? body.notes : null,
        status: tenderNumber ? 'SUBMITTED' : 'DRAFT',
      },
    });

    return NextResponse.json(
      { success: true, data: tender },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, { path: '/api/tenders', method: 'POST' });
  }
}

export async function GET(request: Request) {
  try {
    const { userId, role } = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePaginationParams(searchParams);
    const statusParam = searchParams.get('status');

    const where: Prisma.TenderWhereInput = isStaff(role) ? {} : { userId };

    if (statusParam && statusParam in TenderStatus) {
      where.status = statusParam as TenderStatus;
    }

    const [tenders, total] = await Promise.all([
      prisma.tender.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.tender.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: tenders,
      meta: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    return handleApiError(error, { path: '/api/tenders', method: 'GET' });
  }
}

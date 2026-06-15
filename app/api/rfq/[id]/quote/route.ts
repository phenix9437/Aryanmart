import { NextResponse } from 'next/server';
import { RfqStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import logger from '@/lib/logger';

const ALLOWED_QUOTE_STATUSES: RfqStatus[] = [
  'UNDER_REVIEW',
  'QUOTED',
  'NEGOTIATING',
  'REJECTED',
  'EXPIRED',
];

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await requireRole(request, ['ADMIN', 'SALES']);
    const body = await request.json();

    const rfq = await prisma.rfq.findUnique({ where: { id: params.id } });
    if (!rfq) {
      return NextResponse.json(
        { success: false, message: 'RFQ not found' },
        { status: 404 }
      );
    }

    if (body.status && !ALLOWED_QUOTE_STATUSES.includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          message: `status must be one of: ${ALLOWED_QUOTE_STATUSES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    if (body.quotedAmount != null) {
      const amount = Number(body.quotedAmount);
      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json(
          { success: false, message: 'quotedAmount must be a positive number' },
          { status: 400 }
        );
      }
    }

    const updatedRfq = await prisma.rfq.update({
      where: { id: params.id },
      data: {
        ...(body.quotedAmount != null && {
          quotedAmount: Number(body.quotedAmount),
        }),
        ...(typeof body.salesNotes === 'string' && {
          salesNotes: body.salesNotes,
        }),
        ...(body.status && { status: body.status as RfqStatus }),
        assignedSalesId: rfq.assignedSalesId ?? userId,
      },
    });

    logger.info('RFQ quoted by sales', {
      rfqNumber: updatedRfq.rfqNumber,
      salesUserId: userId,
      status: updatedRfq.status,
    });

    return NextResponse.json({ success: true, data: updatedRfq });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/rfq/${params.id}/quote`,
      method: 'PATCH',
    });
  }
}

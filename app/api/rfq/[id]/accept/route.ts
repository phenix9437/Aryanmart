import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';

const ACCEPTABLE_STATUSES = new Set(['QUOTED', 'NEGOTIATING']);

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await requireAuth(request);

    const rfq = await prisma.rfq.findUnique({ where: { id: params.id } });
    if (!rfq) {
      return NextResponse.json(
        { success: false, message: 'RFQ not found' },
        { status: 404 }
      );
    }

    if (rfq.userId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    if (!ACCEPTABLE_STATUSES.has(rfq.status)) {
      return NextResponse.json(
        {
          success: false,
          message: 'This RFQ cannot be accepted in its current state',
        },
        { status: 400 }
      );
    }

    const updatedRfq = await prisma.rfq.update({
      where: { id: params.id },
      data: { status: 'ACCEPTED' },
    });

    return NextResponse.json({
      success: true,
      data: updatedRfq,
      message:
        'Quote accepted. Our sales team will contact you to finalize the order.',
    });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/rfq/${params.id}/accept`,
      method: 'PATCH',
    });
  }
}

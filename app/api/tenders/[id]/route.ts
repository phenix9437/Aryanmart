import { NextResponse } from 'next/server';
import { Prisma, TenderStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';

function isStaff(role: string) {
  return role === 'ADMIN' || role === 'SALES';
}

const STAFF_ONLY_STATUSES: TenderStatus[] = [
  'MATCHED',
  'QUOTED',
  'WON',
  'LOST',
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, role } = await requireAuth(request);

    const tender = await prisma.tender.findUnique({
      where: { id: params.id },
    });

    if (!tender) {
      return NextResponse.json(
        { success: false, message: 'Tender not found' },
        { status: 404 }
      );
    }

    if (!isStaff(role) && tender.userId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: tender });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/tenders/${params.id}`,
      method: 'GET',
    });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, role } = await requireAuth(request);
    const body = await request.json();

    const tender = await prisma.tender.findUnique({
      where: { id: params.id },
    });

    if (!tender) {
      return NextResponse.json(
        { success: false, message: 'Tender not found' },
        { status: 404 }
      );
    }

    const isOwner = tender.userId === userId;
    const staff = isStaff(role);

    if (!isOwner && !staff) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    let updateData: Prisma.TenderUpdateInput = {};

    if (isOwner && !staff) {
      if (body.status && STAFF_ONLY_STATUSES.includes(body.status)) {
        return NextResponse.json(
          {
            success: false,
            message: 'You cannot set this status on your own tender',
          },
          { status: 403 }
        );
      }

      updateData = {
        ...(typeof body.tenderNumber === 'string' && {
          tenderNumber: body.tenderNumber.trim() || null,
        }),
        ...(typeof body.issuingAuthority === 'string' && {
          issuingAuthority: body.issuingAuthority.trim(),
        }),
        ...(typeof body.docUrl === 'string' && { docUrl: body.docUrl }),
        ...(body.deadline != null && {
          deadline: body.deadline ? new Date(body.deadline) : null,
        }),
        ...(typeof body.notes === 'string' && { notes: body.notes }),
      };
    } else if (staff) {
      updateData = {
        ...(body.status &&
          body.status in TenderStatus && {
            status: body.status as TenderStatus,
          }),
        ...(body.matchedProducts != null && {
          matchedProducts: body.matchedProducts as Prisma.InputJsonValue,
        }),
        ...(typeof body.notes === 'string' && { notes: body.notes }),
      };
    }

    const updatedTender = await prisma.tender.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedTender });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/tenders/${params.id}`,
      method: 'PATCH',
    });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';

function isStaff(role: string) {
  return role === 'ADMIN' || role === 'SALES';
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, role } = await requireAuth(request);

    const rfq = await prisma.rfq.findUnique({
      where: { id: params.id },
      include: isStaff(role)
        ? {
            user: {
              select: {
                email: true,
                phone: true,
                companyName: true,
                gstin: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          }
        : undefined,
    });

    if (!rfq) {
      return NextResponse.json(
        { success: false, message: 'RFQ not found' },
        { status: 404 }
      );
    }

    if (!isStaff(role) && rfq.userId !== userId) {
      return NextResponse.json(
        { success: false, message: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: rfq });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/rfq/${params.id}`,
      method: 'GET',
    });
  }
}

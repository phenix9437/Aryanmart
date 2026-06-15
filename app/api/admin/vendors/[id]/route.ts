import { NextResponse } from 'next/server';
import { VendorStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import logger from '@/lib/logger';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await requireRole(request, ['ADMIN']);
    const body = await request.json();

    const vendor = await prisma.vendor.findUnique({ where: { id: params.id } });
    if (!vendor) {
      return NextResponse.json(
        { success: false, message: 'Vendor not found' },
        { status: 404 }
      );
    }

    if (
      !body.approvalStatus ||
      !(body.approvalStatus in VendorStatus)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'approvalStatus must be PENDING, APPROVED, or SUSPENDED',
        },
        { status: 400 }
      );
    }

    const approvalStatus = body.approvalStatus as VendorStatus;

    const updatedVendor = await prisma.vendor.update({
      where: { id: params.id },
      data: {
        approvalStatus,
        ...(approvalStatus === 'APPROVED' && {
          approvedAt: new Date(),
        }),
      },
      include: {
        user: {
          select: { email: true, companyName: true },
        },
      },
    });

    logger.info('Admin updated vendor approval', {
      adminUserId: userId,
      vendorId: params.id,
      approvalStatus,
    });

    return NextResponse.json({ success: true, data: updatedVendor });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/admin/vendors/${params.id}`,
      method: 'PATCH',
    });
  }
}

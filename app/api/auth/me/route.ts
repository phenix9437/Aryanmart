import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { handleApiError } from '@/lib/apiError';

export async function GET(request: Request) {
  try {
    let token: string | null = null;
    const authHeader = request.headers.get('Authorization');

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else {
      token = cookies().get('auth_token')?.value ?? null;
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const vendor =
      user.role === 'VENDOR'
        ? await prisma.vendor.findUnique({
            where: { userId: user.id },
            select: { approvalStatus: true, companyName: true },
          })
        : null;

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        gstin: user.gstin,
        kycStatus: user.kycStatus,
        creditLimit: user.creditLimit,
        creditUsed: user.creditUsed,
        ...(vendor && { vendor }),
      },
    });
  } catch (error) {
    return handleApiError(error, { path: '/api/auth/me', method: 'GET' });
  }
}

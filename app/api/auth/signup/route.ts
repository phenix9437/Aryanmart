import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { validateSignupInput } from '@/lib/validators/auth';
import { handleApiError } from '@/lib/apiError';
import logger from '@/lib/logger';
import { KycStatus, Role } from '@prisma/client';

function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateSignupInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const email = (body.email as string).trim();
    const role = body.role as Role;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(body.password as string);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
        firstName: typeof body.firstName === 'string' ? body.firstName : null,
        lastName: typeof body.lastName === 'string' ? body.lastName : null,
        companyName:
          typeof body.companyName === 'string' ? body.companyName.trim() : null,
        gstin:
          typeof body.gstin === 'string'
            ? body.gstin.trim().toUpperCase()
            : null,
        kycStatus: role === Role.B2C ? KycStatus.VERIFIED : KycStatus.PENDING,
      },
    });

    const token = generateToken({ userId: user.id, role: user.role });

    logger.info('User signup successful', { email: user.email, role: user.role });

    const response = NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          kycStatus: user.kycStatus,
        },
      },
      { status: 201 }
    );

    setAuthCookie(response, token);
    return response;
  } catch (error) {
    return handleApiError(error, { path: '/api/auth/signup', method: 'POST' });
  }
}

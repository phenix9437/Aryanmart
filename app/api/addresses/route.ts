import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';

function validateAddressInput(body: Record<string, unknown>) {
  const errors: string[] = [];
  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const line1 = typeof body.line1 === 'string' ? body.line1.trim() : '';
  const city = typeof body.city === 'string' ? body.city.trim() : '';
  const state = typeof body.state === 'string' ? body.state.trim() : '';
  const pincode = typeof body.pincode === 'string' ? body.pincode.trim() : '';

  if (!fullName) errors.push('fullName is required');
  if (!phone) errors.push('phone is required');
  if (!line1) errors.push('line1 is required');
  if (!city) errors.push('city is required');
  if (!state) errors.push('state is required');
  if (!pincode) errors.push('pincode is required');
  else if (!/^\d{6}$/.test(pincode)) errors.push('pincode must be 6 digits');

  return { valid: errors.length === 0, errors, fullName, phone, line1, city, state, pincode };
}

export async function GET(request: Request) {
  try {
    const { userId } = await requireAuth(request);

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, data: addresses });
  } catch (error) {
    return handleApiError(error, { path: '/api/addresses', method: 'GET' });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await requireAuth(request);
    const body = await request.json();
    const validation = validateAddressInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const isDefault = body.isDefault === true;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        label: typeof body.label === 'string' ? body.label : null,
        fullName: validation.fullName,
        phone: validation.phone,
        line1: validation.line1,
        line2: typeof body.line2 === 'string' ? body.line2 : null,
        city: validation.city,
        state: validation.state,
        pincode: validation.pincode,
        gstin: typeof body.gstin === 'string' ? body.gstin : null,
        isDefault,
      },
    });

    return NextResponse.json(
      { success: true, data: address },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, { path: '/api/addresses', method: 'POST' });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import { generateUniqueSlug } from '@/lib/admin-helpers';
import { validateBrandInput } from '@/lib/validators/admin';

export async function POST(request: Request) {
  try {
    await requireRole(request, ['ADMIN']);
    const body = await request.json();
    const validation = validateBrandInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const name = body.name.trim();
    const slug = await generateUniqueSlug('brand', name);

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        logoUrl: typeof body.logoUrl === 'string' ? body.logoUrl : null,
        description:
          typeof body.description === 'string' ? body.description : null,
        isFeatured: body.isFeatured === true,
      },
    });

    return NextResponse.json(
      { success: true, data: brand },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, {
      path: '/api/admin/brands',
      method: 'POST',
    });
  }
}

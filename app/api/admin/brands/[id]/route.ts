import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import { generateUniqueSlug } from '@/lib/admin-helpers';
import { validateBrandInput } from '@/lib/validators/admin';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(request, ['ADMIN']);
    const body = await request.json();

    const brand = await prisma.brand.findUnique({ where: { id: params.id } });
    if (!brand) {
      return NextResponse.json(
        { success: false, message: 'Brand not found' },
        { status: 404 }
      );
    }

    const validation = validateBrandInput(body, true);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) {
      updateData.name = body.name.trim();
      updateData.slug = await generateUniqueSlug(
        'brand',
        body.name,
        params.id
      );
    }
    if (body.logoUrl !== undefined) updateData.logoUrl = body.logoUrl;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const updatedBrand = await prisma.brand.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedBrand });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/admin/brands/${params.id}`,
      method: 'PATCH',
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(request, ['ADMIN']);

    const brand = await prisma.brand.findUnique({
      where: { id: params.id },
      include: { _count: { select: { products: true } } },
    });

    if (!brand) {
      return NextResponse.json(
        { success: false, message: 'Brand not found' },
        { status: 404 }
      );
    }

    if (brand._count.products > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Cannot delete a brand with existing products. Reassign or delete those products first.',
        },
        { status: 409 }
      );
    }

    await prisma.brand.delete({ where: { id: params.id } });

    return NextResponse.json({
      success: true,
      message: 'Brand deleted',
    });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/admin/brands/${params.id}`,
      method: 'DELETE',
    });
  }
}

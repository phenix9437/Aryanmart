import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import {
  generateUniqueSlug,
  wouldCreateCategoryCycle,
} from '@/lib/admin-helpers';
import { validateCategoryInput } from '@/lib/validators/admin';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(request, ['ADMIN']);
    const body = await request.json();

    const category = await prisma.category.findUnique({
      where: { id: params.id },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    const merged = {
      name: body.name ?? category.name,
      level: body.level ?? category.level,
      parentId:
        body.parentId !== undefined ? body.parentId : category.parentId,
    };

    const validation = validateCategoryInput(
      { ...body, ...merged },
      true
    );

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
        'category',
        body.name,
        params.id
      );
    }

    if (body.description !== undefined) updateData.description = body.description;
    if (body.iconUrl !== undefined) updateData.iconUrl = body.iconUrl;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.level !== undefined) updateData.level = body.level;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;
    if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
    if (body.metaDesc !== undefined) updateData.metaDesc = body.metaDesc;

    if (body.parentId !== undefined) {
      if (body.parentId) {
        const parent = await prisma.category.findUnique({
          where: { id: body.parentId },
        });
        if (!parent) {
          return NextResponse.json(
            { success: false, message: 'Parent category not found' },
            { status: 400 }
          );
        }

        const cycle = await wouldCreateCategoryCycle(
          params.id,
          body.parentId
        );
        if (cycle) {
          return NextResponse.json(
            {
              success: false,
              message: 'Cannot set parent: would create a circular reference',
            },
            { status: 400 }
          );
        }
      }
      updateData.parentId = body.parentId;
    }

    const updatedCategory = await prisma.category.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/admin/categories/${params.id}`,
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

    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        _count: { select: { children: true, products: true } },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    if (category._count.children > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Cannot delete a category with sub-categories. Remove or reassign them first.',
        },
        { status: 409 }
      );
    }

    if (category._count.products > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Cannot delete a category with existing products. Reassign or delete those products first.',
        },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id: params.id } });

    return NextResponse.json({
      success: true,
      message: 'Category deleted',
    });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/admin/categories/${params.id}`,
      method: 'DELETE',
    });
  }
}

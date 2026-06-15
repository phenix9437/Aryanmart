import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import logger from '@/lib/logger';
import {
  generateUniqueSlug,
} from '@/lib/admin-helpers';
import { validateCategoryInput } from '@/lib/validators/admin';

export async function POST(request: Request) {
  try {
    const { userId } = await requireRole(request, ['ADMIN']);
    const body = await request.json();
    const validation = validateCategoryInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

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
    }

    const name = body.name.trim();
    const slug = await generateUniqueSlug('category', name);

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description:
          typeof body.description === 'string' ? body.description : null,
        iconUrl: typeof body.iconUrl === 'string' ? body.iconUrl : null,
        imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl : null,
        parentId: body.parentId ?? null,
        level: body.level ?? (body.parentId ? 2 : 1),
        isFeatured: body.isFeatured === true,
        sortOrder:
          typeof body.sortOrder === 'number' ? body.sortOrder : 0,
        metaTitle: typeof body.metaTitle === 'string' ? body.metaTitle : null,
        metaDesc: typeof body.metaDesc === 'string' ? body.metaDesc : null,
      },
    });

    logger.info('Admin created category', {
      adminUserId: userId,
      categoryName: category.name,
    });

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, {
      path: '/api/admin/categories',
      method: 'POST',
    });
  }
}

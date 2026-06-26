import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import logger from '@/lib/logger';
import { generateUniqueSlug } from '@/lib/admin-helpers';
import { validateCategoryInput } from '@/lib/validators/admin';

export async function GET(request: Request) {
  try {
    await requireRole(request, ['ADMIN', 'SALES']);
    const { searchParams } = new URL(request.url);
    const flat = searchParams.get('flat') === 'true';

    // Fetch all categories with parent info and product count
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true, children: true } },
      },
      orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
    });

    if (flat) {
      return NextResponse.json({ success: true, data: categories });
    }

    // Build tree: L1 with nested children
    const l1 = categories.filter((c) => !c.parentId);
    const tree = l1.map((parent) => ({
      ...parent,
      children: categories.filter((c) => c.parentId === parent.id),
    }));

    return NextResponse.json({ success: true, data: tree });
  } catch (error) {
    return handleApiError(error, {
      path: '/api/admin/categories',
      method: 'GET',
    });
  }
}

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

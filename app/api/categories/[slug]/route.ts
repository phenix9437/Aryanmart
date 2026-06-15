import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/apiError';

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const category = await prisma.category.findFirst({
      where: { slug: params.slug, isActive: true },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/categories/${params.slug}`,
      method: 'GET',
    });
  }
}

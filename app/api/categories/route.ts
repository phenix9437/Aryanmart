import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/apiError';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const levelParam = searchParams.get('level');
    const parentId = searchParams.get('parentId');
    const featured = searchParams.get('featured');

    const where: {
      isActive: boolean;
      level?: number;
      parentId?: string | null;
      isFeatured?: boolean;
    } = { isActive: true };

    if (levelParam) {
      where.level = parseInt(levelParam, 10);
    }

    if (parentId) {
      where.parentId = parentId;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return handleApiError(error, { path: '/api/categories', method: 'GET' });
  }
}

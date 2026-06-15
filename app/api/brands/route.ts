import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/apiError';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');

    const where: { isActive: boolean; isFeatured?: boolean } = { isActive: true };

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const brands = await prisma.brand.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });

    return NextResponse.json({ success: true, data: brands });
  } catch (error) {
    return handleApiError(error, { path: '/api/brands', method: 'GET' });
  }
}

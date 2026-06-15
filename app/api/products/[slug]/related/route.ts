import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/apiError';
import { getAuthUser } from '@/lib/auth-helpers';
import { resolvePrice } from '@/lib/pricing';
import {
  getDefaultVariant,
  sanitizePricingForRole,
} from '@/lib/catalog-helpers';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const authUser = await getAuthUser(request);
    const userRole = authUser?.role ?? null;

    const product = await prisma.product.findFirst({
      where: { slug: params.slug, isActive: true },
      select: { id: true, categoryId: true },
    });

    if (!product || !product.categoryId) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const related = await prisma.product.findMany({
      where: {
        isActive: true,
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: {
        brand: true,
        variants: { where: { isActive: true } },
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      take: 8,
    });

    const data = await Promise.all(
      related.map(async (item) => {
        const variant = getDefaultVariant(item.variants);
        const pricing = variant
          ? await resolvePrice(
              {
                id: variant.id,
                mrp: variant.mrp,
                b2cPrice: variant.b2cPrice,
                b2bPrice: variant.b2bPrice,
              },
              userRole
            )
          : {
              mrp: 0,
              price: 0,
              priceType: 'b2c' as const,
              savings: 0,
              savingsPercent: 0,
            };

        return {
          id: item.id,
          name: item.name,
          slug: item.slug,
          sku: item.sku,
          brand: item.brand
            ? {
                name: item.brand.name,
                slug: item.brand.slug,
                logoUrl: item.brand.logoUrl,
              }
            : null,
          image: item.images[0]?.url ?? null,
          pricing: sanitizePricingForRole(pricing, userRole),
          stockStatus: variant?.stockStatus,
          moq: variant?.moq,
        };
      })
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/products/${params.slug}/related`,
      method: 'GET',
    });
  }
}

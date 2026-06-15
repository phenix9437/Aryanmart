import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/apiError';
import { getAuthUser } from '@/lib/auth-helpers';
import { resolvePrice } from '@/lib/pricing';
import { computeReviewStats, sanitizePricingForRole } from '@/lib/catalog-helpers';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const authUser = await getAuthUser(request);
    const userRole = authUser?.role ?? null;

    const product = await prisma.product.findFirst({
      where: { slug: params.slug, isActive: true },
      include: {
        brand: true,
        category: {
          include: { parent: true },
        },
        variants: {
          where: { isActive: true },
          orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
        },
        images: { orderBy: { sortOrder: 'asc' } },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const variantsWithResolvedPricing = await Promise.all(
      product.variants.map(async (variant) => {
        const pricing = await resolvePrice(
          {
            id: variant.id,
            mrp: variant.mrp,
            b2cPrice: variant.b2cPrice,
            b2bPrice: variant.b2bPrice,
          },
          userRole
        );

        return {
          id: variant.id,
          variantName: variant.variantName,
          sku: variant.sku,
          attributes: variant.attributes,
          moq: variant.moq,
          stock: variant.stock,
          stockStatus: variant.stockStatus,
          weight: variant.weight,
          dimensions: variant.dimensions,
          imageUrl: variant.imageUrl,
          isDefault: variant.isDefault,
          pricing: sanitizePricingForRole(pricing, userRole),
        };
      })
    );

    const reviews = product.reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      title: review.title,
      body: review.body,
      isVerified: review.isVerified,
      createdAt: review.createdAt,
      reviewer: {
        name: [review.user.firstName, review.user.lastName?.charAt(0)]
          .filter(Boolean)
          .join(' ')
          .trim(),
      },
    }));

    const reviewStats = computeReviewStats(product.reviews);

    const {
      variants: _variants,
      reviews: _reviews,
      ...productData
    } = product;

    return NextResponse.json({
      success: true,
      data: {
        ...productData,
        variants: variantsWithResolvedPricing,
        reviews,
        reviewStats,
      },
    });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/products/${params.slug}`,
      method: 'GET',
    });
  }
}

import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/apiError';
import { getAuthUser } from '@/lib/auth-helpers';
import {
  buildPaginationMeta,
  parsePaginationParams,
} from '@/lib/validators/pagination';
import { resolvePrice } from '@/lib/pricing';
import {
  getCategoryIdsForSlug,
  getDefaultVariant,
  sanitizePricingForRole,
} from '@/lib/catalog-helpers';

const productInclude = {
  brand: true,
  category: true,
  variants: {
    where: { isActive: true },
  },
  images: { orderBy: { sortOrder: 'asc' as const }, take: 1 },
} satisfies Prisma.ProductInclude;

async function shapeProductForList(
  product: Prisma.ProductGetPayload<{ include: typeof productInclude }>,
  userRole: string | null
) {
  const variant = getDefaultVariant(product.variants);
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
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    hsnCode: product.hsnCode,
    isGemListed: product.isGemListed,
    certifications: product.certifications,
    brand: product.brand
      ? {
          name: product.brand.name,
          slug: product.brand.slug,
          logoUrl: product.brand.logoUrl,
        }
      : null,
    category: product.category
      ? { name: product.category.name, slug: product.category.slug }
      : null,
    image: product.images[0]?.url ?? null,
    pricing: sanitizePricingForRole(pricing, userRole),
    stockStatus: variant?.stockStatus,
    moq: variant?.moq,
  };
}

export async function GET(request: Request) {
  try {
    const authUser = await getAuthUser(request);
    const userRole = authUser?.role ?? null;

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();
    const categorySlug = searchParams.get('category');
    const brandParam = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const certificationsParam = searchParams.get('certifications');
    const inStock = searchParams.get('inStock');
    const sort = searchParams.get('sort') || 'relevance';
    const { page, limit, skip } = parsePaginationParams(searchParams);

    const where: Prisma.ProductWhereInput = { isActive: true };
    const andConditions: Prisma.ProductWhereInput[] = [];

    if (q) {
      andConditions.push({
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { sku: { contains: q, mode: 'insensitive' } },
        ],
      });
    }

    if (categorySlug) {
      const categoryIds = await getCategoryIdsForSlug(categorySlug);
      if (!categoryIds) {
        return NextResponse.json({
          success: true,
          data: [],
          meta: buildPaginationMeta(0, page, limit),
        });
      }
      where.categoryId = { in: categoryIds };
    }

    if (brandParam) {
      const brandSlugs = brandParam.split(',').map((s) => s.trim()).filter(Boolean);
      if (brandSlugs.length > 0) {
        where.brand = { slug: { in: brandSlugs } };
      }
    }

    if (minPrice || maxPrice) {
      const priceFilter: Prisma.FloatFilter = {};
      if (minPrice) priceFilter.gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.lte = parseFloat(maxPrice);
      andConditions.push({
        variants: {
          some: {
            isActive: true,
            b2cPrice: priceFilter,
          },
        },
      });
    }

    if (certificationsParam) {
      const certs = certificationsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (certs.length > 0) {
        where.certifications = { hasSome: certs };
      }
    }

    if (inStock === 'true') {
      andConditions.push({
        variants: {
          some: {
            isActive: true,
            stockStatus: { in: ['IN_STOCK', 'LOW_STOCK'] },
          },
        },
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    const total = await prisma.product.count({ where });

    let products: Prisma.ProductGetPayload<{ include: typeof productInclude }>[];

    // Prisma cannot orderBy nested variant b2cPrice in a single query — sort in memory for price sorts.
    if (sort === 'price_asc' || sort === 'price_desc') {
      const allProducts = await prisma.product.findMany({
        where,
        include: productInclude,
      });

      allProducts.sort((a, b) => {
        const priceA = getDefaultVariant(a.variants)?.b2cPrice ?? 0;
        const priceB = getDefaultVariant(b.variants)?.b2cPrice ?? 0;
        return sort === 'price_asc' ? priceA - priceB : priceB - priceA;
      });

      products = allProducts.slice(skip, skip + limit);
    } else {
      const orderBy: Prisma.ProductOrderByWithRelationInput[] =
        sort === 'newest'
          ? [{ createdAt: 'desc' }]
          : [{ isFeatured: 'desc' }, { createdAt: 'desc' }];

      products = await prisma.product.findMany({
        where,
        include: productInclude,
        orderBy,
        skip,
        take: limit,
      });
    }

    const data = await Promise.all(
      products.map((product) => shapeProductForList(product, userRole))
    );

    return NextResponse.json({
      success: true,
      data,
      meta: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    return handleApiError(error, { path: '/api/products', method: 'GET' });
  }
}

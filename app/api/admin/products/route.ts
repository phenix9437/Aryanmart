import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import logger from '@/lib/logger';
import { generateUniqueSlug } from '@/lib/admin-helpers';
import { validateProductInput } from '@/lib/validators/admin';
import { computeStockStatus } from '@/lib/pricing';

export async function POST(request: Request) {
  try {
    const { userId } = await requireRole(request, ['ADMIN']);
    const body = await request.json();
    const validation = validateProductInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    const sku = body.sku.trim();
    const existingSku = await prisma.product.findUnique({ where: { sku } });
    if (existingSku) {
      return NextResponse.json(
        { success: false, message: 'SKU already exists' },
        { status: 409 }
      );
    }

    if (body.brandId) {
      const brand = await prisma.brand.findUnique({
        where: { id: body.brandId },
      });
      if (!brand) {
        return NextResponse.json(
          { success: false, message: 'Brand not found' },
          { status: 400 }
        );
      }
    }

    if (body.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: body.categoryId },
      });
      if (!category) {
        return NextResponse.json(
          { success: false, message: 'Category not found' },
          { status: 400 }
        );
      }
    }

    const name = body.name.trim();
    const slug = await generateUniqueSlug('product', name);
    const variants = body.variants as Array<Record<string, unknown>>;
    const singleVariant = variants.length === 1;

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name,
          slug,
          sku,
          brandId: body.brandId ?? null,
          categoryId: body.categoryId ?? null,
          description:
            typeof body.description === 'string' ? body.description : null,
          richDescription:
            typeof body.richDescription === 'string'
              ? body.richDescription
              : null,
          hsnCode: typeof body.hsnCode === 'string' ? body.hsnCode : null,
          gstRate: body.gstRate != null ? Number(body.gstRate) : 18,
          isGemListed: body.isGemListed === true,
          isFeatured: body.isFeatured === true,
          certifications: Array.isArray(body.certifications)
            ? body.certifications
            : [],
          tags: Array.isArray(body.tags) ? body.tags : [],
          metaTitle:
            typeof body.metaTitle === 'string' ? body.metaTitle : null,
          metaDesc: typeof body.metaDesc === 'string' ? body.metaDesc : null,
        },
      });

      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        const variantSku =
          typeof v.sku === 'string' && v.sku.trim()
            ? v.sku.trim()
            : `${sku}-V${i + 1}`;

        const existingVariantSku = await tx.productVariant.findUnique({
          where: { sku: variantSku },
        });
        if (existingVariantSku) {
          throw new Error('VARIANT_SKU_EXISTS');
        }

        const stock = v.stock !== undefined ? Number(v.stock) : 0;

        await tx.productVariant.create({
          data: {
            productId: created.id,
            variantName:
              typeof v.variantName === 'string' ? v.variantName : null,
            sku: variantSku,
            attributes: (v.attributes as Prisma.InputJsonValue) ?? undefined,
            mrp: Number(v.mrp),
            b2cPrice: Number(v.b2cPrice),
            b2bPrice:
              v.b2bPrice != null && v.b2bPrice !== ''
                ? Number(v.b2bPrice)
                : null,
            moq: v.moq !== undefined ? Number(v.moq) : 1,
            stock,
            stockStatus: computeStockStatus(stock),
            weight: v.weight != null ? Number(v.weight) : null,
            dimensions:
              (v.dimensions as Prisma.InputJsonValue) ?? undefined,
            imageUrl: typeof v.imageUrl === 'string' ? v.imageUrl : null,
            isDefault: singleVariant || v.isDefault === true,
          },
        });
      }

      return tx.product.findUnique({
        where: { id: created.id },
        include: { variants: true, brand: true, category: true },
      });
    });

    logger.info('Admin created product', {
      adminUserId: userId,
      productName: name,
      sku,
    });

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'VARIANT_SKU_EXISTS') {
      return NextResponse.json(
        { success: false, message: 'Variant SKU already exists' },
        { status: 409 }
      );
    }
    return handleApiError(error, {
      path: '/api/admin/products',
      method: 'POST',
    });
  }
}

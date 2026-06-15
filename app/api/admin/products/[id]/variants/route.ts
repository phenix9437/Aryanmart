import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import { validateVariantPrices } from '@/lib/validators/admin';
import { computeStockStatus } from '@/lib/pricing';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(request, ['ADMIN']);
    const body = await request.json();

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const mrp = Number(body.mrp);
    const b2cPrice = Number(body.b2cPrice);
    const b2bPrice =
      body.b2bPrice != null && body.b2bPrice !== ''
        ? Number(body.b2bPrice)
        : null;
    const moq = body.moq !== undefined ? Number(body.moq) : 1;
    const stock = body.stock !== undefined ? Number(body.stock) : 0;

    const priceErrors = validateVariantPrices(mrp, b2cPrice, b2bPrice);
    const errors = [...priceErrors];

    if (!Number.isInteger(moq) || moq <= 0) {
      errors.push('moq must be a positive integer');
    }
    if (!Number.isInteger(stock) || stock < 0) {
      errors.push('stock must be a non-negative integer');
    }

    const variantSku =
      typeof body.sku === 'string' && body.sku.trim()
        ? body.sku.trim()
        : null;

    if (!variantSku) {
      errors.push('sku is required');
    } else {
      const existing = await prisma.productVariant.findUnique({
        where: { sku: variantSku },
      });
      if (existing) {
        errors.push('Variant SKU already exists');
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    const variant = await prisma.productVariant.create({
      data: {
        productId: params.id,
        variantName:
          typeof body.variantName === 'string' ? body.variantName : null,
        sku: variantSku!,
        attributes: (body.attributes as Prisma.InputJsonValue) ?? undefined,
        mrp,
        b2cPrice,
        b2bPrice,
        moq,
        stock,
        stockStatus: computeStockStatus(stock),
        weight: body.weight != null ? Number(body.weight) : null,
        dimensions: (body.dimensions as Prisma.InputJsonValue) ?? undefined,
        imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl : null,
      },
    });

    return NextResponse.json(
      { success: true, data: variant },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error, {
      path: `/api/admin/products/${params.id}/variants`,
      method: 'POST',
    });
  }
}

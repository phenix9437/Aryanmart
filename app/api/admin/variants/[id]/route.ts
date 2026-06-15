import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import { validateVariantPrices } from '@/lib/validators/admin';
import { computeStockStatus } from '@/lib/pricing';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(request, ['ADMIN']);
    const body = await request.json();

    const variant = await prisma.productVariant.findUnique({
      where: { id: params.id },
    });

    if (!variant) {
      return NextResponse.json(
        { success: false, message: 'Variant not found' },
        { status: 404 }
      );
    }

    const mrp = body.mrp !== undefined ? Number(body.mrp) : variant.mrp;
    const b2cPrice =
      body.b2cPrice !== undefined ? Number(body.b2cPrice) : variant.b2cPrice;
    const b2bPrice =
      body.b2bPrice !== undefined
        ? body.b2bPrice != null && body.b2bPrice !== ''
          ? Number(body.b2bPrice)
          : null
        : variant.b2bPrice;

    if (
      body.mrp !== undefined ||
      body.b2cPrice !== undefined ||
      body.b2bPrice !== undefined
    ) {
      const priceErrors = validateVariantPrices(mrp, b2cPrice, b2bPrice);
      if (priceErrors.length > 0) {
        return NextResponse.json(
          { success: false, errors: priceErrors },
          { status: 400 }
        );
      }
    }

    const updateData: Prisma.ProductVariantUpdateInput = {};

    if (body.mrp !== undefined) updateData.mrp = mrp;
    if (body.b2cPrice !== undefined) updateData.b2cPrice = b2cPrice;
    if (body.b2bPrice !== undefined) updateData.b2bPrice = b2bPrice;
    if (body.moq !== undefined) updateData.moq = Number(body.moq);
    if (body.stock !== undefined) {
      const stock = Number(body.stock);
      updateData.stock = stock;
      updateData.stockStatus = computeStockStatus(stock);
    }
    if (body.weight !== undefined) {
      updateData.weight = body.weight != null ? Number(body.weight) : null;
    }
    if (body.dimensions !== undefined) {
      updateData.dimensions = body.dimensions as Prisma.InputJsonValue;
    }
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const updatedVariant = await prisma.productVariant.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedVariant });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/admin/variants/${params.id}`,
      method: 'PATCH',
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(request, ['ADMIN']);

    const variant = await prisma.productVariant.findUnique({
      where: { id: params.id },
    });

    if (!variant) {
      return NextResponse.json(
        { success: false, message: 'Variant not found' },
        { status: 404 }
      );
    }

    const activeVariantCount = await prisma.productVariant.count({
      where: { productId: variant.productId, isActive: true },
    });

    if (activeVariantCount <= 1 && variant.isActive) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Cannot delete the only variant of a product. Deactivate the product instead.',
        },
        { status: 409 }
      );
    }

    const orderItemCount = await prisma.orderItem.count({
      where: { variantId: params.id },
    });

    if (orderItemCount > 0) {
      await prisma.productVariant.update({
        where: { id: params.id },
        data: { isActive: false },
      });

      return NextResponse.json({
        success: true,
        message: 'Variant deactivated (has order history)',
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.pricingTier.deleteMany({ where: { variantId: params.id } });
      await tx.cartItem.deleteMany({ where: { variantId: params.id } });
      await tx.productVariant.delete({ where: { id: params.id } });
    });

    return NextResponse.json({
      success: true,
      message: 'Variant removed',
    });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/admin/variants/${params.id}`,
      method: 'DELETE',
    });
  }
}

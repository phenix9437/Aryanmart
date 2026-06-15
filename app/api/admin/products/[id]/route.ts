import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-helpers';
import { handleApiError } from '@/lib/apiError';
import { generateUniqueSlug } from '@/lib/admin-helpers';
import { validateProductInput } from '@/lib/validators/admin';

export async function PATCH(
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

    const validation = validateProductInput(body, true);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    if (body.sku && body.sku.trim() !== product.sku) {
      const collision = await prisma.product.findUnique({
        where: { sku: body.sku.trim() },
      });
      if (collision && collision.id !== params.id) {
        return NextResponse.json(
          { success: false, message: 'SKU already exists' },
          { status: 409 }
        );
      }
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

    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) {
      updateData.name = body.name.trim();
      updateData.slug = await generateUniqueSlug(
        'product',
        body.name,
        params.id
      );
    }
    if (body.sku !== undefined) updateData.sku = body.sku.trim();
    if (body.brandId !== undefined) updateData.brandId = body.brandId;
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.richDescription !== undefined) {
      updateData.richDescription = body.richDescription;
    }
    if (body.hsnCode !== undefined) updateData.hsnCode = body.hsnCode;
    if (body.gstRate !== undefined) updateData.gstRate = Number(body.gstRate);
    if (body.isGemListed !== undefined) updateData.isGemListed = body.isGemListed;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.certifications !== undefined) {
      updateData.certifications = body.certifications;
    }
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.metaTitle !== undefined) updateData.metaTitle = body.metaTitle;
    if (body.metaDesc !== undefined) updateData.metaDesc = body.metaDesc;

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
      include: { variants: true, brand: true, category: true },
    });

    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/admin/products/${params.id}`,
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

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { variants: { select: { id: true } } },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    const orderItemCount = await prisma.orderItem.count({
      where: { productId: params.id },
    });

    if (orderItemCount > 0) {
      await prisma.product.update({
        where: { id: params.id },
        data: { isActive: false },
      });

      return NextResponse.json({
        success: true,
        message:
          'Product deactivated (has order history, cannot be permanently deleted)',
      });
    }

    await prisma.$transaction(async (tx) => {
      const variantIds = product.variants.map((v) => v.id);

      if (variantIds.length > 0) {
        await tx.pricingTier.deleteMany({
          where: { variantId: { in: variantIds } },
        });
        await tx.cartItem.deleteMany({
          where: { variantId: { in: variantIds } },
        });
        await tx.productVariant.deleteMany({
          where: { productId: params.id },
        });
      }

      await tx.productImage.deleteMany({ where: { productId: params.id } });
      await tx.review.deleteMany({ where: { productId: params.id } });
      await tx.wishlist.deleteMany({ where: { productId: params.id } });
      await tx.product.delete({ where: { id: params.id } });
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted',
    });
  } catch (error) {
    return handleApiError(error, {
      path: `/api/admin/products/${params.id}`,
      method: 'DELETE',
    });
  }
}

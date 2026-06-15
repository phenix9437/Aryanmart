import { prisma } from './prisma';
import { resolvePrice } from './pricing';
import { calculateCartTotals } from './gst';
import { sanitizePricingForRole } from './catalog-helpers';

const cartInclude = {
  items: {
    include: {
      variant: {
        include: {
          product: {
            include: {
              images: { orderBy: { sortOrder: 'asc' as const }, take: 1 },
            },
          },
        },
      },
    },
  },
} as const;

export async function getOrCreateCart(userId: string) {
  const existing = await prisma.cart.findUnique({ where: { userId } });
  if (existing) return existing;

  return prisma.cart.create({ data: { userId } });
}

export async function loadUserCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: cartInclude,
  });

  return cart;
}

export async function buildCartResponse(
  cart: NonNullable<Awaited<ReturnType<typeof loadUserCart>>>,
  userRole: string
) {
  const resolvedItems = await Promise.all(
    cart.items.map(async (item) => {
      const variant = item.variant;
      const product = variant.product;
      const pricing = await resolvePrice(
        {
          id: variant.id,
          mrp: variant.mrp,
          b2cPrice: variant.b2cPrice,
          b2bPrice: variant.b2bPrice,
        },
        userRole,
        item.quantity
      );

      return {
        id: item.id,
        quantity: item.quantity,
        variantId: variant.id,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images[0]?.url ?? variant.imageUrl ?? null,
          gstRate: product.gstRate,
        },
        variant: {
          id: variant.id,
          sku: variant.sku,
          variantName: variant.variantName,
          mrp: variant.mrp,
          stock: variant.stock,
          stockStatus: variant.stockStatus,
          moq: variant.moq,
        },
        pricing: sanitizePricingForRole(pricing, userRole),
        unitPrice: pricing.price,
      };
    })
  );

  const totals = calculateCartTotals(
    resolvedItems.map((item) => ({
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      gstRate: item.product.gstRate,
    }))
  );

  return { items: resolvedItems, totals };
}

export type ResolvedCartLine = Awaited<
  ReturnType<typeof buildCartResponse>
>['items'][number];

export function validateStockForItems(
  items: Array<{
    id: string;
    quantity: number;
    variant: { stock: number; sku: string; product: { name: string } };
  }>
) {
  const insufficientItems = items
    .filter((item) => item.quantity > item.variant.stock)
    .map((item) => ({
      cartItemId: item.id,
      productName: item.variant.product.name,
      sku: item.variant.sku,
      requested: item.quantity,
      available: item.variant.stock,
    }));

  return insufficientItems.length > 0 ? insufficientItems : null;
}

export async function findOwnedCartItem(itemId: string, userId: string) {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: {
      cart: true,
      variant: { include: { product: true } },
    },
  });

  if (!cartItem || cartItem.cart.userId !== userId) {
    return null;
  }

  return cartItem;
}

export function validateQuantityAgainstVariant(
  quantity: number,
  variant: { moq: number; stock: number }
): { valid: true } | { valid: false; message: string } {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { valid: false, message: 'Quantity must be a positive integer' };
  }

  if (quantity < variant.moq) {
    return {
      valid: false,
      message: `Minimum order quantity is ${variant.moq}`,
    };
  }

  if (quantity > variant.stock) {
    return { valid: false, message: 'Insufficient stock available' };
  }

  return { valid: true };
}

export function getOrderTypeForRole(role: string): 'B2C' | 'B2B' {
  return role === 'B2B' || role === 'GOVT' ? 'B2B' : 'B2C';
}

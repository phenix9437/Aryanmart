import { prisma } from './prisma';
import type { StockStatus } from '@prisma/client';

const LOW_STOCK_THRESHOLD = 10;

export function computeStockStatus(stock: number): StockStatus {
  if (stock === 0) return 'OUT_OF_STOCK';
  if (stock <= LOW_STOCK_THRESHOLD) return 'LOW_STOCK';
  return 'IN_STOCK';
}

export interface ResolvedPrice {
  mrp: number;
  price: number;
  priceType: 'b2c' | 'b2b' | 'tiered';
  savings: number;
  savingsPercent: number;
  tierBreaks?: { minQty: number; price: number }[];
}

type VariantInput = {
  mrp: number;
  b2cPrice: number;
  b2bPrice: number | null;
  id: string;
};

function calcSavings(mrp: number, price: number) {
  const savings = mrp - price;
  const savingsPercent = mrp > 0 ? Math.round((savings / mrp) * 100) : 0;
  return { savings, savingsPercent };
}

function buildB2cPrice(variant: VariantInput): ResolvedPrice {
  const { savings, savingsPercent } = calcSavings(variant.mrp, variant.b2cPrice);
  return {
    mrp: variant.mrp,
    price: variant.b2cPrice,
    priceType: 'b2c',
    savings,
    savingsPercent,
  };
}

export async function resolvePrice(
  variant: VariantInput,
  userRole: string | null,
  quantity: number = 1
): Promise<ResolvedPrice> {
  const isWholesaleViewer =
    (userRole === 'B2B' || userRole === 'GOVT') && variant.b2bPrice != null;

  if (!isWholesaleViewer) {
    return buildB2cPrice(variant);
  }

  const now = new Date();

  const allTiers = await prisma.pricingTier.findMany({
    where: {
      variantId: variant.id,
      validFrom: { lte: now },
      OR: [{ validTo: null }, { validTo: { gte: now } }],
    },
    orderBy: { minQty: 'asc' },
  });

  const matchingTier = allTiers.find(
    (tier) =>
      tier.minQty <= quantity &&
      (tier.maxQty == null || tier.maxQty >= quantity)
  );

  const tierBreaks = allTiers.map((tier) => ({
    minQty: tier.minQty,
    price: tier.price,
  }));

  if (matchingTier) {
    const { savings, savingsPercent } = calcSavings(variant.mrp, matchingTier.price);
    return {
      mrp: variant.mrp,
      price: matchingTier.price,
      priceType: 'tiered',
      savings,
      savingsPercent,
      tierBreaks,
    };
  }

  const { savings, savingsPercent } = calcSavings(variant.mrp, variant.b2bPrice!);
  return {
    mrp: variant.mrp,
    price: variant.b2bPrice!,
    priceType: 'b2b',
    savings,
    savingsPercent,
    tierBreaks,
  };
}

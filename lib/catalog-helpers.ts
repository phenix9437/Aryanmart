import type { ProductVariant, StockStatus } from '@prisma/client';
import type { ResolvedPrice } from './pricing';

export function getDefaultVariant<T extends ProductVariant>(variants: T[]): T | undefined {
  return variants.find((v) => v.isDefault) ?? variants[0];
}

export async function getCategoryIdsForSlug(slug: string): Promise<string[] | null> {
  const { prisma } = await import('./prisma');
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!category) return null;

  const children = await prisma.category.findMany({
    where: { parentId: category.id, isActive: true },
    select: { id: true },
  });

  return [category.id, ...children.map((c) => c.id)];
}

export function computeReviewStats(
  reviews: { rating: number }[]
) {
  const totalReviews = reviews.length;
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;

  for (const review of reviews) {
    if (review.rating >= 1 && review.rating <= 5) {
      breakdown[review.rating]++;
    }
  }

  const averageRating =
    totalReviews > 0
      ? Math.round(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10
        ) / 10
      : 0;

  return { averageRating, totalReviews, breakdown };
}

export function sanitizePricingForRole(
  pricing: ResolvedPrice,
  userRole: string | null
): ResolvedPrice {
  const isWholesaleViewer = userRole === 'B2B' || userRole === 'GOVT';
  if (isWholesaleViewer) return pricing;

  const { tierBreaks: _tierBreaks, ...rest } = pricing;
  return rest;
}

export type ListProductShape = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  hsnCode: string | null;
  isGemListed: boolean;
  certifications: string[];
  brand: { name: string; slug: string; logoUrl: string | null } | null;
  category: { name: string; slug: string } | null;
  image: string | null;
  pricing: ResolvedPrice;
  stockStatus: StockStatus | undefined;
  moq: number | undefined;
};

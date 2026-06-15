import { prisma } from './prisma';
import { slugify } from './validators/admin';

type SlugEntity = 'category' | 'brand' | 'product';

async function slugExists(
  entity: SlugEntity,
  slug: string,
  excludeId?: string
): Promise<boolean> {
  if (entity === 'category') {
    const row = await prisma.category.findUnique({ where: { slug } });
    return !!row && row.id !== excludeId;
  }
  if (entity === 'brand') {
    const row = await prisma.brand.findUnique({ where: { slug } });
    return !!row && row.id !== excludeId;
  }
  const row = await prisma.product.findUnique({ where: { slug } });
  return !!row && row.id !== excludeId;
}

export async function generateUniqueSlug(
  entity: SlugEntity,
  baseText: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(baseText);
  let candidate = base;
  let counter = 2;

  while (await slugExists(entity, candidate, excludeId)) {
    candidate = `${base}-${counter}`;
    counter++;
  }

  return candidate;
}

export async function isCategoryDescendantOf(
  ancestorId: string,
  categoryId: string
): Promise<boolean> {
  let currentId: string | null = categoryId;

  while (currentId) {
    if (currentId === ancestorId) {
      return true;
    }

    const nextId: string | null = await prisma.category
      .findUnique({
        where: { id: currentId },
        select: { parentId: true },
      })
      .then((result) => result?.parentId ?? null);

    currentId = nextId;
  }

  return false;
}

export async function wouldCreateCategoryCycle(
  categoryId: string,
  newParentId: string
): Promise<boolean> {
  if (categoryId === newParentId) {
    return true;
  }

  return isCategoryDescendantOf(categoryId, newParentId);
}

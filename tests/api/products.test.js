/**
 * AryanMart — Catalog API tests
 * Requires seeded database: npx prisma db push && npx prisma db seed
 */

process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:1234@localhost:5433/aryanmart_db';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

const { GET: getCategories } = require('../../app/api/categories/route');
const { GET: getProducts } = require('../../app/api/products/route');
const { GET: getProductBySlug } = require('../../app/api/products/[slug]/route');
const { resolvePrice } = require('../../lib/pricing');

async function jsonResponse(handler, url, options = {}) {
  const response = await handler(new Request(url, options));
  const body = await response.json();
  return { status: response.status, body };
}

describe('Catalog API', () => {
  test('GET /api/categories returns at least 9 categories', async () => {
    const { status, body } = await jsonResponse(
      getCategories,
      'http://localhost/api/categories'
    );
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThanOrEqual(9);
  });

  test('GET /api/categories?level=1 returns only L1 categories', async () => {
    const { status, body } = await jsonResponse(
      getCategories,
      'http://localhost/api/categories?level=1'
    );
    expect(status).toBe(200);
    expect(body.data.length).toBeGreaterThan(0);
    for (const cat of body.data) {
      expect(cat.parentId).toBeNull();
      expect(cat.level).toBe(1);
    }
  });

  test('GET /api/products returns paginated results with meta', async () => {
    const { status, body } = await jsonResponse(
      getProducts,
      'http://localhost/api/products'
    );
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta).toMatchObject({
      total: expect.any(Number),
      page: expect.any(Number),
      limit: expect.any(Number),
      totalPages: expect.any(Number),
    });
  });

  test('GET /api/products?category=wires-cables filters by category', async () => {
    const { status, body } = await jsonResponse(
      getProducts,
      'http://localhost/api/products?category=wires-cables'
    );
    expect(status).toBe(200);
    expect(body.data.length).toBeGreaterThan(0);
    for (const product of body.data) {
      expect(product.category.slug).toBe('wires-cables');
    }
  });

  test('GET /api/products?q=polycab returns the seeded Polycab product', async () => {
    const { status, body } = await jsonResponse(
      getProducts,
      'http://localhost/api/products?q=polycab'
    );
    expect(status).toBe(200);
    const slugs = body.data.map((p) => p.slug);
    expect(slugs).toContain('polycab-4mm-fr-house-wire-90m');
  });

  test('GET /api/products/[slug] returns full product detail with variants', async () => {
    const response = await getProductBySlug(
      new Request('http://localhost/api/products/polycab-4mm-fr-house-wire-90m'),
      { params: { slug: 'polycab-4mm-fr-house-wire-90m' } }
    );
    const detail = await response.json();

    expect(response.status).toBe(200);
    expect(detail.success).toBe(true);
    expect(detail.data.slug).toBe('polycab-4mm-fr-house-wire-90m');
    expect(Array.isArray(detail.data.variants)).toBe(true);
    expect(detail.data.variants.length).toBeGreaterThan(0);
    expect(detail.data.variants[0].pricing).toBeDefined();
    expect(detail.data.reviewStats).toBeDefined();
  });
});

describe('resolvePrice()', () => {
  test("returns priceType 'b2c' when role is null", async () => {
    const result = await resolvePrice(
      { id: 'test-variant', mrp: 1250, b2cPrice: 980, b2bPrice: 880 },
      null
    );
    expect(result.priceType).toBe('b2c');
    expect(result.price).toBe(980);
    expect(result.tierBreaks).toBeUndefined();
  });

  test("returns priceType 'b2b' when role is 'B2B' and b2bPrice exists", async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const variant = await prisma.productVariant.findFirst({
      where: { b2bPrice: { not: null } },
    });

    expect(variant).not.toBeNull();

    const result = await resolvePrice(
      {
        id: variant.id,
        mrp: variant.mrp,
        b2cPrice: variant.b2cPrice,
        b2bPrice: variant.b2bPrice,
      },
      'B2B'
    );

    await prisma.$disconnect();

    expect(result.priceType).toBe('b2b');
    expect(result.price).toBe(variant.b2bPrice);
    expect(result.tierBreaks).toBeDefined();
  });
});

describe('B2B pricing isolation', () => {
  test('anonymous requests never expose b2b pricing or tierBreaks', async () => {
    const { status, body } = await jsonResponse(
      getProducts,
      'http://localhost/api/products'
    );
    expect(status).toBe(200);

    for (const product of body.data) {
      expect(product.pricing.priceType).toBe('b2c');
      expect(product.pricing.tierBreaks).toBeUndefined();
    }
  });
});

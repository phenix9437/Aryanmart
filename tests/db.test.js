/**
 * AryanMart — Database integration tests
 * Run AFTER migration and seed: npm test
 */

// Set env before any imports
process.env.PORT = '5001';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/aryanmart_db';
process.env.JWT_SECRET = 'test_secret';
process.env.JWT_EXPIRES_IN = '7d';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.RAZORPAY_KEY_ID = 'rzp_test';
process.env.RAZORPAY_KEY_SECRET = 'rzp_secret';
process.env.NODE_ENV = 'test';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

// ── Test 1 ─────────────────────────────────────────────────────────
test('can connect to database', async () => {
  const result = await prisma.$queryRaw`SELECT 1 AS result`;
  expect(result).toBeDefined();
});

// ── Test 2 ─────────────────────────────────────────────────────────
test('users table has 4 records', async () => {
  const count = await prisma.user.count();
  expect(count).toBe(4);
});

// ── Test 3 ─────────────────────────────────────────────────────────
test('admin user exists with correct role', async () => {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@aryanmart.com' },
  });
  expect(admin).not.toBeNull();
  expect(admin.role).toBe('ADMIN');
});

// ── Test 4 ─────────────────────────────────────────────────────────
test('all products have at least one variant with b2cPrice > 0', async () => {
  const products = await prisma.product.findMany({
    include: { variants: true },
  });
  expect(products.length).toBeGreaterThan(0);
  for (const product of products) {
    expect(product.variants.length).toBeGreaterThanOrEqual(1);
    for (const variant of product.variants) {
      expect(variant.b2cPrice).toBeGreaterThan(0);
    }
  }
});

// ── Test 5 ─────────────────────────────────────────────────────────
test('category hierarchy has at least 5 child categories', async () => {
  const children = await prisma.category.findMany({
    where: { parentId: { not: null } },
  });
  expect(children.length).toBeGreaterThanOrEqual(5);
});

// ── Test 6 ─────────────────────────────────────────────────────────
test('B2B user has GSTIN set', async () => {
  const b2bUser = await prisma.user.findFirst({
    where: { role: 'B2B' },
  });
  expect(b2bUser).not.toBeNull();
  expect(b2bUser.gstin).not.toBeNull();
});

/**
 * AryanMart — Admin CMS API tests
 */

process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:1234@localhost:5433/aryanmart_db';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

const {
  slugify,
  validateProductInput,
} = require('../../lib/validators/admin');
const { POST: createCategory } = require('../../app/api/admin/categories/route');
const { DELETE: deleteCategory } = require('../../app/api/admin/categories/[id]/route');
const { POST: createProduct } = require('../../app/api/admin/products/route');
const { DELETE: deleteProduct } = require('../../app/api/admin/products/[id]/route');
const { DELETE: deleteVariant } = require('../../app/api/admin/variants/[id]/route');
const { POST: login } = require('../../app/api/auth/login/route');

async function loginAs(email) {
  const response = await login(
    new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'Test@1234' }),
    })
  );
  const body = await response.json();
  return body.token;
}

function authedRequest(url, token, options = {}) {
  return new Request(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
}

describe('Admin validators', () => {
  test('slugify("Polycab 4mm FR Wire") returns "polycab-4mm-fr-wire"', () => {
    expect(slugify('Polycab 4mm FR Wire')).toBe('polycab-4mm-fr-wire');
  });

  test('validateProductInput rejects b2cPrice > mrp', () => {
    const result = validateProductInput({
      name: 'Test',
      sku: 'TEST-001',
      variants: [{ mrp: 100, b2cPrice: 150, stock: 10 }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('b2cPrice'))).toBe(true);
  });

  test('validateProductInput rejects b2bPrice > b2cPrice', () => {
    const result = validateProductInput({
      name: 'Test',
      sku: 'TEST-002',
      variants: [{ mrp: 200, b2cPrice: 150, b2bPrice: 160, stock: 10 }],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('b2bPrice'))).toBe(true);
  });
});

describe('Admin CMS integration', () => {
  let b2cToken;
  let adminToken;
  let createdCategoryId;
  let createdProductId;
  let createdVariantId;

  beforeAll(async () => {
    b2cToken = await loginAs('customer@gmail.com');
    adminToken = await loginAs('admin@aryanmart.com');
  });

  test('non-admin (B2C) gets 403 when trying to create a category', async () => {
    const response = await createCategory(
      authedRequest('http://localhost/api/admin/categories', b2cToken, {
        method: 'POST',
        body: JSON.stringify({ name: 'Blocked Category', level: 1 }),
      })
    );
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
  });

  test('ADMIN can create a new category successfully', async () => {
    const response = await createCategory(
      authedRequest('http://localhost/api/admin/categories', adminToken, {
        method: 'POST',
        body: JSON.stringify({
          name: `Test Category ${Date.now()}`,
          level: 1,
          sortOrder: 99,
        }),
      })
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.slug).toBeDefined();
    createdCategoryId = body.data.id;
  });

  test('ADMIN can create a new product with one variant', async () => {
    const sku = `ADM-TEST-${Date.now()}`;
    const response = await createProduct(
      authedRequest('http://localhost/api/admin/products', adminToken, {
        method: 'POST',
        body: JSON.stringify({
          name: 'Admin Test Product',
          sku,
          gstRate: 18,
          hsnCode: '85444999',
          variants: [
            {
              sku: `${sku}-DEFAULT`,
              mrp: 1000,
              b2cPrice: 800,
              b2bPrice: 700,
              stock: 50,
              moq: 1,
            },
          ],
        }),
      })
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.variants).toHaveLength(1);
    expect(body.data.variants[0].isDefault).toBe(true);
    createdProductId = body.data.id;
    createdVariantId = body.data.variants[0].id;
  });

  test('attempting to delete a category that has products returns 409', async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const category = await prisma.category.findFirst({
      where: { slug: 'wires-cables' },
    });
    await prisma.$disconnect();

    const response = await deleteCategory(
      authedRequest(
        `http://localhost/api/admin/categories/${category.id}`,
        adminToken,
        { method: 'DELETE' }
      ),
      { params: { id: category.id } }
    );
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.success).toBe(false);
    expect(body.message).toContain('products');
  });

  test('attempting to delete a product with order history soft-deletes', async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const product = await prisma.product.findFirst({
      where: { slug: 'polycab-4mm-fr-house-wire-90m' },
      include: { variants: true },
    });

    const customer = await prisma.user.findUnique({
      where: { email: 'customer@gmail.com' },
    });

    const existingOrder = await prisma.order.findFirst({
      where: { userId: customer.id },
    });

    if (!existingOrder) {
      const address = await prisma.address.create({
        data: {
          userId: customer.id,
          fullName: 'Test',
          phone: '9999999999',
          line1: 'Test',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
        },
      });

      const order = await prisma.order.create({
        data: {
          userId: customer.id,
          addressId: address.id,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          subtotal: 980,
          gstAmount: 176.4,
          totalAmount: 1156.4,
          items: {
            create: {
              productId: product.id,
              variantId: product.variants[0].id,
              quantity: 1,
              unitPrice: 980,
              gstRate: 18,
              gstAmount: 176.4,
              totalPrice: 1156.4,
            },
          },
        },
      });
      void order;
    }

    await prisma.$disconnect();

    const response = await deleteProduct(
      authedRequest(
        `http://localhost/api/admin/products/${product.id}`,
        adminToken,
        { method: 'DELETE' }
      ),
      { params: { id: product.id } }
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toContain('deactivated');

    const { PrismaClient: PC } = require('@prisma/client');
    const prisma2 = new PC();
    const stillExists = await prisma2.product.findUnique({
      where: { id: product.id },
    });
    await prisma2.$disconnect();

    expect(stillExists).not.toBeNull();
    expect(stillExists.isActive).toBe(false);
  });

  test('attempting to delete the last variant of a product returns 409', async () => {
    expect(createdVariantId).toBeDefined();

    const response = await deleteVariant(
      authedRequest(
        `http://localhost/api/admin/variants/${createdVariantId}`,
        adminToken,
        { method: 'DELETE' }
      ),
      { params: { id: createdVariantId } }
    );
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.success).toBe(false);
    expect(body.message).toContain('only variant');
  });

  afterAll(async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    if (createdProductId) {
      const orderItems = await prisma.orderItem.count({
        where: { productId: createdProductId },
      });
      if (orderItems === 0) {
        const variants = await prisma.productVariant.findMany({
          where: { productId: createdProductId },
        });
        const variantIds = variants.map((v) => v.id);
        if (variantIds.length) {
          await prisma.pricingTier.deleteMany({
            where: { variantId: { in: variantIds } },
          });
          await prisma.cartItem.deleteMany({
            where: { variantId: { in: variantIds } },
          });
        }
        await prisma.productVariant.deleteMany({
          where: { productId: createdProductId },
        });
        await prisma.product.delete({ where: { id: createdProductId } });
      }
    }

    if (createdCategoryId) {
      await prisma.category.delete({ where: { id: createdCategoryId } }).catch(() => {});
    }

    await prisma.product.update({
      where: { slug: 'polycab-4mm-fr-house-wire-90m' },
      data: { isActive: true },
    }).catch(() => {});

    await prisma.$disconnect();
  });
});

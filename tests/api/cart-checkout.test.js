/**
 * AryanMart — Cart & checkout tests
 * Requires seeded database: npx prisma db push && npx prisma db seed
 */

process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:1234@localhost:5433/aryanmart_db';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

const { calculateGst, calculateCartTotals } = require('../../lib/gst');
const {
  createPaymentOrder,
  verifyPayment,
} = require('../../lib/mock-payment');
const { POST: addToCart } = require('../../app/api/cart/route');
const { POST: initiateCheckout } = require('../../app/api/checkout/initiate/route');
const { POST: confirmCheckout } = require('../../app/api/checkout/confirm/route');
const { POST: createAddress } = require('../../app/api/addresses/route');
const { POST: login } = require('../../app/api/auth/login/route');

async function getCustomerToken() {
  const response = await login(
    new Request('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'customer@gmail.com',
        password: 'Test@1234',
      }),
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

describe('GST helpers', () => {
  test('calculateGst(1000, 18) returns gstAmount: 180, totalWithGst: 1180', () => {
    const result = calculateGst(1000, 18);
    expect(result.gstAmount).toBe(180);
    expect(result.totalWithGst).toBe(1180);
    expect(result.taxableAmount).toBe(1000);
  });

  test('calculateCartTotals() with 2 items correctly sums subtotal and totalGst', () => {
    const result = calculateCartTotals([
      { quantity: 2, unitPrice: 100, gstRate: 18 },
      { quantity: 1, unitPrice: 500, gstRate: 18 },
    ]);

    expect(result.subtotal).toBe(700);
    expect(result.totalGst).toBe(126);
    expect(result.grandTotal).toBe(826);
    expect(result.itemBreakdowns).toHaveLength(2);
  });
});

describe('Mock payment', () => {
  test('createPaymentOrder() returns a paymentOrderId starting with mock_order_', async () => {
    const order = await createPaymentOrder(1500);
    expect(order.paymentOrderId.startsWith('mock_order_')).toBe(true);
    expect(order.amount).toBe(1500);
    expect(order.status).toBe('created');
  });

  test("verifyPayment(id, 'success') returns success: true, status: 'paid'", async () => {
    const result = await verifyPayment('mock_order_test', 'success');
    expect(result.success).toBe(true);
    expect(result.status).toBe('paid');
    expect(result.paymentId).toMatch(/^mock_pay_/);
  });

  test("verifyPayment(id, 'failure') returns success: false, status: 'failed'", async () => {
    const result = await verifyPayment('mock_order_test', 'failure');
    expect(result.success).toBe(false);
    expect(result.status).toBe('failed');
    expect(result.paymentId).toBe('');
  });
});

describe('Cart integration', () => {
  let token;
  let variantId;
  let originalMoq;
  let originalStock;

  beforeAll(async () => {
    token = await getCustomerToken();
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const variant = await prisma.productVariant.findFirst({
      where: { isActive: true, isDefault: true },
    });
    variantId = variant.id;
    originalMoq = variant.moq;
    originalStock = variant.stock;
    await prisma.$disconnect();
  });

  afterEach(async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { moq: originalMoq, stock: originalStock },
    });
    const user = await prisma.user.findUnique({
      where: { email: 'customer@gmail.com' },
    });
    const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    await prisma.$disconnect();
  });

  test('adding an item below MOQ to cart returns 400', async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.productVariant.update({
      where: { id: variantId },
      data: { moq: 5 },
    });
    await prisma.$disconnect();

    const response = await addToCart(
      authedRequest('http://localhost/api/cart', token, {
        method: 'POST',
        body: JSON.stringify({ variantId, quantity: 2 }),
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Minimum order quantity is 5');
  });

  test('adding an item with quantity exceeding stock returns 400', async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    await prisma.$disconnect();

    const response = await addToCart(
      authedRequest('http://localhost/api/cart', token, {
        method: 'POST',
        body: JSON.stringify({
          variantId,
          quantity: variant.stock + 100,
        }),
      })
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Insufficient stock available');
  });

  test("full checkout flow creates an Order and decrements stock", async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const variantBefore = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    const orderQty = 1;

    const addResponse = await addToCart(
      authedRequest('http://localhost/api/cart', token, {
        method: 'POST',
        body: JSON.stringify({ variantId, quantity: orderQty }),
      })
    );
    expect(addResponse.status).toBe(201);

    const addressResponse = await createAddress(
      authedRequest('http://localhost/api/addresses', token, {
        method: 'POST',
        body: JSON.stringify({
          fullName: 'Priya Singh',
          phone: '9876543210',
          line1: '12 MG Road',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          isDefault: true,
        }),
      })
    );
    const addressBody = await addressResponse.json();
    expect(addressResponse.status).toBe(201);

    const initiateResponse = await initiateCheckout(
      authedRequest('http://localhost/api/checkout/initiate', token, {
        method: 'POST',
        body: JSON.stringify({ addressId: addressBody.data.id }),
      })
    );
    const initiateBody = await initiateResponse.json();
    expect(initiateResponse.status).toBe(200);
    expect(initiateBody.data.paymentOrderId).toBeDefined();

    const confirmResponse = await confirmCheckout(
      authedRequest('http://localhost/api/checkout/confirm', token, {
        method: 'POST',
        body: JSON.stringify({
          paymentOrderId: initiateBody.data.paymentOrderId,
          addressId: addressBody.data.id,
          mockOutcome: 'success',
        }),
      })
    );
    const confirmBody = await confirmResponse.json();
    expect(confirmResponse.status).toBe(201);
    expect(confirmBody.data.orderId).toBeDefined();
    expect(confirmBody.data.status).toBe('CONFIRMED');

    const variantAfter = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    expect(variantAfter.stock).toBe(variantBefore.stock - orderQty);

    const order = await prisma.order.findUnique({
      where: { id: confirmBody.data.orderId },
      include: { items: true },
    });
    expect(order).not.toBeNull();
    expect(order.paymentStatus).toBe('PAID');
    expect(order.items).toHaveLength(1);

    const cart = await prisma.cart.findUnique({
      where: { userId: order.userId },
      include: { items: true },
    });
    expect(cart.items).toHaveLength(0);

    await prisma.$disconnect();
  });
});

/**
 * AryanMart — RFQ & Tender API tests
 */

process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:1234@localhost:5433/aryanmart_db';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';

const { validateRfqInput } = require('../../lib/validators/rfq');
const { validateTenderInput } = require('../../lib/validators/tender');
const { POST: submitRfq } = require('../../app/api/rfq/route');
const { GET: getRfqById } = require('../../app/api/rfq/[id]/route');
const { POST: submitTender } = require('../../app/api/tenders/route');
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

const validRfq = {
  items: [{ productName: 'Cat6 Cable', quantity: 100, unit: 'meters' }],
  deliveryLocation: 'Delhi NCR',
};

describe('RFQ validators', () => {
  test('validateRfqInput() rejects empty items array', () => {
    const result = validateRfqInput({
      items: [],
      deliveryLocation: 'Delhi',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('non-empty'))).toBe(true);
  });

  test('validateRfqInput() rejects item with quantity <= 0', () => {
    const result = validateRfqInput({
      items: [{ productName: 'Wire', quantity: 0 }],
      deliveryLocation: 'Delhi',
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('positive'))).toBe(true);
  });

  test('validateRfqInput() accepts a valid minimal RFQ', () => {
    const result = validateRfqInput(validRfq);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe('Tender validators', () => {
  test('validateTenderInput() rejects missing issuingAuthority', () => {
    const result = validateTenderInput({ deadline: '2030-01-01' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('issuingAuthority is required');
  });
});

describe('RFQ & Tender integration', () => {
  let b2cToken;
  let govtToken;
  let adminToken;
  let userARfqId;

  beforeAll(async () => {
    b2cToken = await loginAs('customer@gmail.com');
    govtToken = await loginAs('govt@pwd.gov.in');
    adminToken = await loginAs('admin@aryanmart.com');
  });

  test('a B2C user can submit an RFQ successfully', async () => {
    const response = await submitRfq(
      authedRequest('http://localhost/api/rfq', b2cToken, {
        method: 'POST',
        body: JSON.stringify(validRfq),
      })
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.rfqNumber).toMatch(/^RFQ-\d{4}-\d{5}$/);
    expect(body.data.status).toBe('SUBMITTED');
    userARfqId = body.data.id;
  });

  test('a B2C user CANNOT submit a tender (expect 403)', async () => {
    const response = await submitTender(
      authedRequest('http://localhost/api/tenders', b2cToken, {
        method: 'POST',
        body: JSON.stringify({
          issuingAuthority: 'PWD Delhi',
        }),
      })
    );
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
  });

  test('a GOVT user CAN submit a tender (expect 201)', async () => {
    const response = await submitTender(
      authedRequest('http://localhost/api/tenders', govtToken, {
        method: 'POST',
        body: JSON.stringify({
          issuingAuthority: 'Ministry of Defence',
          tenderNumber: 'TND-2026-001',
          deadline: '2030-06-30',
        }),
      })
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('SUBMITTED');
  });

  test("User A cannot view User B's RFQ by ID (expect 403)", async () => {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const b2bUser = await prisma.user.findUnique({
      where: { email: 'b2b@testcompany.com' },
    });
    const b2bRfq = await prisma.rfq.create({
      data: {
        userId: b2bUser.id,
        rfqNumber: `RFQ-TEST-${Date.now()}`,
        items: [{ productName: 'Private item', quantity: 1 }],
        deliveryLocation: 'Mumbai',
        status: 'SUBMITTED',
      },
    });
    await prisma.$disconnect();

    const response = await getRfqById(
      authedRequest(`http://localhost/api/rfq/${b2bRfq.id}`, b2cToken),
      { params: { id: b2bRfq.id } }
    );
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.success).toBe(false);
  });

  test('ADMIN role CAN view any user RFQ', async () => {
    expect(userARfqId).toBeDefined();

    const response = await getRfqById(
      authedRequest(`http://localhost/api/rfq/${userARfqId}`, adminToken),
      { params: { id: userARfqId } }
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.id).toBe(userARfqId);
    expect(body.data.user).toBeDefined();
  });
});

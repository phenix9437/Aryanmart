const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Test@1234', 10);

  // ── USERS ──────────────────────────────────────────────────────────
  const [admin, b2b, govt, b2c] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@aryanmart.com' },
      update: {},
      create: {
        email: 'admin@aryanmart.com',
        passwordHash,
        role: 'ADMIN',
        firstName: 'Aryan',
        lastName: 'Admin',
        kycStatus: 'VERIFIED',
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'b2b@testcompany.com' },
      update: {},
      create: {
        email: 'b2b@testcompany.com',
        passwordHash,
        role: 'B2B',
        firstName: 'Rajesh',
        lastName: 'Kumar',
        companyName: 'Test Infra Pvt Ltd',
        gstin: '07AABCU9603R1ZP',
        kycStatus: 'VERIFIED',
        creditLimit: 500000,
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'govt@pwd.gov.in' },
      update: {},
      create: {
        email: 'govt@pwd.gov.in',
        passwordHash,
        role: 'GOVT',
        firstName: 'Suresh',
        lastName: 'Sharma',
        companyName: 'PWD Delhi',
        kycStatus: 'VERIFIED',
        emailVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'customer@gmail.com' },
      update: {},
      create: {
        email: 'customer@gmail.com',
        passwordHash,
        role: 'B2C',
        firstName: 'Priya',
        lastName: 'Singh',
        emailVerified: true,
      },
    }),
  ]);

  console.log(`✅ Users: ${[admin, b2b, govt, b2c].map((u) => u.email).join(', ')}`);

  // ── CATEGORIES ─────────────────────────────────────────────────────
  const telecom = await prisma.category.upsert({
    where: { slug: 'telecom-products' },
    update: {},
    create: { name: 'Telecom Products', slug: 'telecom-products', level: 1 },
  });

  const networking = await prisma.category.upsert({
    where: { slug: 'networking' },
    update: {},
    create: { name: 'Networking', slug: 'networking', level: 1 },
  });

  const electrical = await prisma.category.upsert({
    where: { slug: 'electrical' },
    update: {},
    create: { name: 'Electrical', slug: 'electrical', level: 1 },
  });

  const cctv = await prisma.category.upsert({
    where: { slug: 'cctv-security' },
    update: {},
    create: { name: 'CCTV & Security', slug: 'cctv-security', level: 1 },
  });

  const itHardware = await prisma.category.upsert({
    where: { slug: 'it-hardware' },
    update: {},
    create: { name: 'IT Hardware', slug: 'it-hardware', level: 1 },
  });

  const govtDefense = await prisma.category.upsert({
    where: { slug: 'govt-defense' },
    update: {},
    create: { name: 'Govt & Defense', slug: 'govt-defense', level: 1, isFeatured: true },
  });

  // L2 categories
  const [ofcFiber, telecomEnclosures, structuredCabling, wiresCables] = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'ofc-fiber' },
      update: {},
      create: { name: 'OFC & Fiber', slug: 'ofc-fiber', level: 2, parentId: telecom.id },
    }),
    prisma.category.upsert({
      where: { slug: 'telecom-enclosures' },
      update: {},
      create: { name: 'Telecom Enclosures', slug: 'telecom-enclosures', level: 2, parentId: telecom.id },
    }),
    prisma.category.upsert({
      where: { slug: 'structured-cabling' },
      update: {},
      create: { name: 'Structured Cabling', slug: 'structured-cabling', level: 2, parentId: networking.id },
    }),
    prisma.category.upsert({
      where: { slug: 'wires-cables' },
      update: {},
      create: { name: 'Wires & Cables', slug: 'wires-cables', level: 2, parentId: electrical.id },
    }),
  ]);

  console.log('✅ Categories: 10 created (6 L1, 4 L2)');

  // ── BRANDS ─────────────────────────────────────────────────────────
  const brandData = [
    { name: 'Polycab', slug: 'polycab' },
    { name: 'D-Link', slug: 'd-link' },
    { name: 'Hikvision', slug: 'hikvision' },
    { name: 'Sterlite', slug: 'sterlite' },
    { name: 'TP-Link', slug: 'tp-link' },
    { name: 'Legrand', slug: 'legrand' },
  ];

  const brands = {};
  for (const b of brandData) {
    brands[b.slug] = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
  }

  console.log(`✅ Brands: ${Object.keys(brands).join(', ')}`);

  // ── PRODUCTS ───────────────────────────────────────────────────────
  const product1 = await prisma.product.upsert({
    where: { sku: 'PCB-FR4-90M' },
    update: {},
    create: {
      name: 'Polycab 4mm FR House Wire - 90m',
      slug: 'polycab-4mm-fr-house-wire-90m',
      sku: 'PCB-FR4-90M',
      brandId: brands['polycab'].id,
      categoryId: wiresCables.id,
      hsnCode: '85444999',
      gstRate: 18,
      isGemListed: true,
      certifications: ['BIS', 'ISI', 'Make in India'],
      specs: {
        conductor: 'Copper',
        insulation: 'PVC FR',
        voltage: '1100V',
        length: '90 meters',
        color: 'Red/Blue/Yellow/Green/Black',
      },
      variants: {
        create: {
          sku: 'PCB-FR4-90M-DEFAULT',
          mrp: 1250,
          b2cPrice: 980,
          b2bPrice: 880,
          moq: 1,
          stock: 250,
          stockStatus: 'IN_STOCK',
          isDefault: true,
        },
      },
    },
  });

  const product2 = await prisma.product.upsert({
    where: { sku: 'DLK-CAT6-305M' },
    update: {},
    create: {
      name: 'D-Link Cat6 UTP LAN Cable - 305m Box',
      slug: 'd-link-cat6-utp-lan-cable-305m',
      sku: 'DLK-CAT6-305M',
      brandId: brands['d-link'].id,
      categoryId: structuredCabling.id,
      hsnCode: '85444290',
      gstRate: 18,
      certifications: ['BIS'],
      specs: {
        category: 'Cat6',
        type: 'UTP',
        length: '305 meters',
        conductor: '23 AWG',
        jacket: 'PVC',
        color: 'Grey',
      },
      variants: {
        create: {
          sku: 'DLK-CAT6-305M-DEFAULT',
          mrp: 6500,
          b2cPrice: 5800,
          b2bPrice: 5200,
          moq: 1,
          stock: 80,
          stockStatus: 'IN_STOCK',
          isDefault: true,
        },
      },
    },
  });

  const product3 = await prisma.product.upsert({
    where: { sku: 'HKV-DS2CD2143G2I' },
    update: {},
    create: {
      name: 'Hikvision 4MP AcuSense IP Dome Camera',
      slug: 'hikvision-4mp-acusense-ip-dome-camera',
      sku: 'HKV-DS2CD2143G2I',
      brandId: brands['hikvision'].id,
      categoryId: cctv.id,
      hsnCode: '85258090',
      gstRate: 18,
      certifications: ['CE', 'FCC', 'BIS'],
      specs: {
        resolution: '4MP',
        type: 'Dome',
        ir_range: '40 meters',
        poe: 'Yes',
        ip_rating: 'IP67',
        storage: 'MicroSD up to 256GB',
      },
      variants: {
        create: {
          sku: 'HKV-DS2CD2143G2I-DEFAULT',
          mrp: 4500,
          b2cPrice: 3800,
          b2bPrice: 3400,
          moq: 1,
          stock: 45,
          stockStatus: 'IN_STOCK',
          isDefault: true,
        },
      },
    },
  });

  console.log(`✅ Products: ${[product1, product2, product3].map((p) => p.sku).join(', ')}`);
  console.log('');
  console.log('✅ Seed complete — users, categories, brands, products created');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

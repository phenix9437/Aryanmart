export type Certification = 'bis' | 'gem' | 'make-in-india' | 'iso' | 'defence';

export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  icon: string;
  featured?: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  sku: string;
  hsnCode: string;
  categorySlug: string;
  image: string;
  mrp: number;
  price: number;
  b2bPrice: number;
  gstRate: number;
  stock: number;
  moq: number;
  certifications: Certification[];
  description: string;
  specs: { key: string; value: string }[];
}

export const categories: Category[] = [
  { id: '1', name: 'Telecom Products', slug: 'telecom', productCount: 2400, icon: 'radio' },
  { id: '2', name: 'Networking', slug: 'networking', productCount: 1850, icon: 'network' },
  { id: '3', name: 'Electrical Cables', slug: 'electrical', productCount: 3200, icon: 'zap' },
  { id: '4', name: 'CCTV & Security', slug: 'cctv', productCount: 980, icon: 'camera' },
  { id: '5', name: 'IT Hardware', slug: 'it-hardware', productCount: 760, icon: 'server' },
  { id: '6', name: 'Industrial Electrical', slug: 'industrial-electrical', productCount: 1420, icon: 'factory' },
  {
    id: '7',
    name: 'Government & Defense Supplies',
    slug: 'govt-defense',
    productCount: 540,
    icon: 'shield',
    featured: true,
  },
  { id: '8', name: 'Optical Fiber', slug: 'optical-fiber', productCount: 890, icon: 'cable' },
];

export const products: Product[] = [
  {
    id: 'p1',
    slug: 'hfcl-24f-armored-ofc-cable',
    name: 'HFCL 24F Armored OFC Cable — Outdoor Grade',
    brand: 'HFCL',
    sku: 'AM-OFC-24F-ARM',
    hsnCode: '85447090',
    categorySlug: 'telecom',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=600&fit=crop',
    mrp: 12500,
    price: 9800,
    b2bPrice: 9200,
    gstRate: 18,
    stock: 48,
    moq: 10,
    certifications: ['bis', 'gem', 'make-in-india'],
    description:
      'High-performance 24-fiber armored optical fiber cable for outdoor backbone deployments. Suitable for telecom, enterprise, and defense infrastructure projects.',
    specs: [
      { key: 'Fiber Count', value: '24F' },
      { key: 'Cable Type', value: 'Armored Outdoor' },
      { key: 'Standard Length', value: '305m drum' },
      { key: 'Attenuation', value: '≤0.35 dB/km @1310nm' },
    ],
  },
  {
    id: 'p2',
    slug: 'polycab-cat6a-lan-cable-305m',
    name: 'Polycab Cat6A LAN Cable 305m Box',
    brand: 'Polycab',
    sku: 'AM-CAT6A-305',
    hsnCode: '85444999',
    categorySlug: 'networking',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=600&fit=crop',
    mrp: 8900,
    price: 7200,
    b2bPrice: 6800,
    gstRate: 18,
    stock: 120,
    moq: 5,
    certifications: ['bis', 'iso'],
    description: 'Premium Cat6A structured cabling for 10Gbps enterprise networks.',
    specs: [
      { key: 'Category', value: 'Cat6A' },
      { key: 'Length', value: '305m' },
      { key: 'Conductor', value: '23 AWG Solid Copper' },
    ],
  },
  {
    id: 'p3',
    slug: 'hikvision-4mp-ip-bullet-camera',
    name: 'Hikvision 4MP IP Bullet Camera — Outdoor',
    brand: 'Hikvision',
    sku: 'AM-HIK-4MP-BUL',
    hsnCode: '85258900',
    categorySlug: 'cctv',
    image: 'https://images.unsplash.com/photo-1557597774-9d271bf572fe?w=600&h=600&fit=crop',
    mrp: 6200,
    price: 4890,
    b2bPrice: 4500,
    gstRate: 18,
    stock: 35,
    moq: 2,
    certifications: ['bis', 'iso'],
    description: 'Weatherproof 4MP IP bullet camera with night vision and PoE support.',
    specs: [
      { key: 'Resolution', value: '4MP' },
      { key: 'Lens', value: '2.8mm fixed' },
      { key: 'Protection', value: 'IP67' },
    ],
  },
  {
    id: 'p4',
    slug: 'havells-fr-cable-2-5sqmm',
    name: 'Havells FR Cable 2.5 sq.mm — 90m Coil',
    brand: 'Havells',
    sku: 'AM-HAV-FR-2.5',
    hsnCode: '85444920',
    categorySlug: 'electrical',
    image: 'https://images.unsplash.com/photo-1621905251189-08f45a786051?w=600&h=600&fit=crop',
    mrp: 1850,
    price: 1420,
    b2bPrice: 1280,
    gstRate: 18,
    stock: 200,
    moq: 20,
    certifications: ['bis', 'make-in-india'],
    description: 'Flame retardant electrical wire for residential and commercial wiring.',
    specs: [
      { key: 'Size', value: '2.5 sq.mm' },
      { key: 'Length', value: '90m coil' },
      { key: 'Type', value: 'FR PVC Insulated' },
    ],
  },
  {
    id: 'p5',
    slug: 'd-link-24-port-gigabit-switch',
    name: 'D-Link 24-Port Gigabit Managed Switch',
    brand: 'D-Link',
    sku: 'AM-DLK-24G-SW',
    hsnCode: '85176290',
    categorySlug: 'networking',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
    mrp: 18500,
    price: 15200,
    b2bPrice: 14100,
    gstRate: 18,
    stock: 18,
    moq: 1,
    certifications: ['iso'],
    description: 'Enterprise managed switch with VLAN, QoS, and SNMP management.',
    specs: [
      { key: 'Ports', value: '24x Gigabit + 4x SFP' },
      { key: 'Management', value: 'Web/SNMP' },
      { key: 'Rack Mount', value: '1U' },
    ],
  },
  {
    id: 'p6',
    slug: 'apc-1kva-online-ups',
    name: 'APC 1KVA Online UPS — Rack/Tower',
    brand: 'APC',
    sku: 'AM-APC-1KVA',
    hsnCode: '85044090',
    categorySlug: 'it-hardware',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56550a0?w=600&h=600&fit=crop',
    mrp: 32000,
    price: 26500,
    b2bPrice: 24800,
    gstRate: 18,
    stock: 12,
    moq: 1,
    certifications: ['iso', 'bis'],
    description: 'Double-conversion online UPS for server and network equipment protection.',
    specs: [
      { key: 'Capacity', value: '1KVA / 800W' },
      { key: 'Topology', value: 'Online Double Conversion' },
      { key: 'Form Factor', value: 'Rack/Tower 2U' },
    ],
  },
];

export const brands = [
  'Polycab', 'Finolex', 'Havells', 'D-Link', 'TP-Link',
  'Hikvision', 'Dahua', 'APC', 'Schneider', 'Legrand', 'Sterlite', 'HFCL',
];

export const heroSlides = [
  {
    title: "India's Trusted Telecom & Network Supply Partner",
    subtitle: 'Shop OFC & Structured Cabling — Authorized dealer for 500+ brands',
    ctaPrimary: { label: 'Shop Telecom', href: '/category/telecom' },
    ctaSecondary: { label: 'Request Quote', href: '/rfq' },
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&h=600&fit=crop',
  },
  {
    title: 'Government & Defense Procurement Simplified',
    subtitle: 'GeM Listed | DGS&D Approved | Compliance docs on request',
    ctaPrimary: { label: 'Explore Govt Supplies', href: '/category/govt-defense' },
    ctaSecondary: { label: 'Tender Portal', href: '/tender' },
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&h=600&fit=crop',
  },
  {
    title: 'Bulk Orders? Get a Quote in 2 Hours',
    subtitle: 'MOQ pricing, credit terms, dedicated relationship manager',
    ctaPrimary: { label: 'Request Bulk Quote', href: '/rfq' },
    ctaSecondary: { label: 'B2B Login', href: '/account/b2b' },
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&h=600&fit=crop',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

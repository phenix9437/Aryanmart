# AryanMart Site Information Architecture

**Version:** 1.0  
**Last Updated:** June 2026

This document defines the complete hierarchical taxonomy for AryanMart navigation (L1 → L2 → L3).

---

## Primary Navigation Tree

```
AryanMart
├── Telecom Products (L1)
│   ├── OFC & Fiber (L2)
│   │   ├── SC/LC Connectors (L3)
│   │   ├── Splice Trays (L3)
│   │   ├── Patch Cords (L3)
│   │   └── ODF Boxes (L3)
│   └── Telecom Enclosures (L2)
│       ├── Wall-mount Cabinets (L3)
│       ├── Floor-standing Racks (L3)
│       └── Cable Managers (L3)
│
├── Networking (L1)
│   ├── Structured Cabling (L2)
│   │   ├── Cat5e/Cat6/Cat6A Cables (L3)
│   │   ├── Patch Panels (L3)
│   │   └── Keystone Jacks (L3)
│   └── Active Networking (L2)
│       ├── Managed Switches (L3)
│       ├── Unmanaged Switches (L3)
│       └── PoE Switches (L3)
│
├── Electrical (L1)
│   ├── Wires & Cables (L2)
│   │   ├── FR Cables (L3)
│   │   ├── FRLS Cables (L3)
│   │   ├── ZHFR Cables (L3)
│   │   ├── Armored Cables (L3)
│   │   └── Flexible Cables by Voltage Rating (L3)
│   └── Protection Devices (L2)
│       ├── MCB (L3)
│       ├── RCCB (L3)
│       ├── ELCB (L3)
│       ├── Surge Protectors (L3)
│       └── Isolators (L3)
│
├── CCTV & Security (L1)
│   ├── IP Cameras (L2)
│   │   ├── Fixed Dome (L3)
│   │   ├── Bullet (L3)
│   │   ├── PTZ (L3)
│   │   └── Fisheye — Indoor/Outdoor (L3)
│   └── Recording Systems (L2)
│       ├── NVR (L3)
│       ├── DVR (L3)
│       ├── Hybrid Systems (L3)
│       └── Video Analytics (L3)
│
├── IT Hardware (L1)
│   ├── Servers & Storage (L2)
│   │   ├── Rack Servers (L3)
│   │   ├── Tower Servers (L3)
│   │   ├── NAS (L3)
│   │   ├── SAN (L3)
│   │   └── DAS (L3)
│   └── UPS & Power (L2)
│       ├── Online UPS (L3)
│       ├── Offline UPS (L3)
│       ├── Stabilizers (L3)
│       └── PDUs (L3)
│
└── Govt & Defense (L1)
    ├── Defense Supplies (L2)
    │   ├── MIL-spec Cables (L3)
    │   ├── Ruggedized Networking (L3)
    │   └── Field Communication (L3)
    └── GeM / Tender (L2)
        ├── GeM-listed Products (L3)
        ├── Rate Contract Items (L3)
        └── CPWD Approved (L3)
```

---

## Secondary Navigation (Utility / Header)

| Link | Destination | Audience |
|------|-------------|----------|
| Track Order | `/account/orders` | All |
| Government Procurement | `/tender` | Govt / Defense |
| Become a Vendor | `/vendor/register` | Vendors |
| City Selector | Modal / preference | All |
| Get Bulk Quote | `/rfq` | B2B |
| Login / Account | `/account` | All |

---

## Account Area IA

```
/account
├── Overview (default)
├── /account/orders — Order History
├── /account/rfqs — My RFQs
├── /account/b2b — B2B Dashboard (B2B role only)
├── /account/tenders — My Tenders (Govt role only)
└── /account/wishlist — Saved Products
```

---

## Admin Area IA (Protected)

```
/admin
├── Dashboard
├── Orders
├── Catalog (Products, Categories, Brands)
├── Users (B2C, B2B, Govt)
├── RFQs
├── Tenders
├── Vendors
├── Pricing & Coupons
└── Settings
```

---

## Vendor Area IA

```
/vendor
├── /vendor/register — Onboarding
└── /vendor/dashboard
    ├── Products
    ├── Inventory
    ├── Orders / Fulfillment
    └── Settlements
```

---

## Footer Navigation

**Quick Links:** Products, Brands, RFQ, Tender Portal, Blog, Careers  
**Support:** Contact, Track Order, Returns, FAQs, Technical Support, Download Catalog  
**Legal:** Privacy Policy, Terms, Sitemap

---

## URL Mapping Reference

| IA Level | URL Pattern |
|----------|-------------|
| L1 Category | `/category/[slug]` |
| L2 Sub-Category | `/category/[l1-slug]/[l2-slug]` |
| L3 Filtered PLP | `/category/[l1-slug]/[l2-slug]/[l3-slug]` |
| Product | `/product/[slug]` |
| Brand | `/brand/[slug]` |

See [../sitemap.md](../sitemap.md) for complete URL list.

---

## Megamenu Quick Links (Header Row 3)

Telecom | Networking | Electrical | CCTV | IT Hardware | Govt Supplies

Each quick link resolves to the corresponding L1 category PLP.

---

## Search & Discovery

- **Omnisearch:** Product name, brand, SKU, HSN code
- **Category pre-filter:** Dropdown in search bar
- **Faceted filters:** Brand, price, certifications, stock, category-specific attributes
- **Breadcrumbs:** Category-rich with schema.org structured data

---

## Content Pages (Marketing / Trust)

- `/about` — Company overview
- `/contact` — Contact form + office details
- `/careers` — Job listings
- `/blog` — Product guides, compliance articles
- `/support`, `/returns`, `/shipping-policy`, `/privacy-policy`, `/terms`

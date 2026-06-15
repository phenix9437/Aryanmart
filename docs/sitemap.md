# AryanMart Sitemap

**Version:** 1.0  
**Last Updated:** June 2026

Complete URL structure for the AryanMart platform.

---

## Public — Shop & Catalog

| URL | Page | Notes |
|-----|------|-------|
| `/` | Homepage | Hero, categories, featured products, trust sections |
| `/products` | All Products — Master PLP | Full catalog listing |
| `/category/[slug]` | Category PLP — L1 | Top-level category |
| `/category/[l1-slug]/[l2-slug]` | Sub-Category PLP — L2 | Second-level category |
| `/category/[l1-slug]/[l2-slug]/[l3-slug]` | L3 Filtered PLP | Product type filter |
| `/product/[slug]` | Product Detail Page | Full PDP with specs, pricing, RFQ |
| `/brand/[slug]` | Brand Page | Brand catalog + authorized dealer badge |
| `/search?q=...` | Search Results Page | Full-text + faceted search |

---

## Cart & Checkout

| URL | Page | Notes |
|-----|------|-------|
| `/cart` | Cart Page | Review items, apply coupons |
| `/checkout` | Checkout Flow | Multi-step: address, GSTIN, payment |
| `/checkout/success` | Order Confirmation | Order ID, tracking link |

---

## RFQ (Request for Quotation)

| URL | Page | Notes |
|-----|------|-------|
| `/rfq` | RFQ Submission Form | 3-step form |
| `/rfq/track/[id]` | RFQ Status Tracker | Customer-facing status |

---

## Government / Tender

| URL | Page | Notes |
|-----|------|-------|
| `/tender` | Government Tender Portal | Browse active tenders |
| `/tender/[id]` | Tender Detail + Product Matching | Compliance docs, product match |

---

## User Account

| URL | Page | Role |
|-----|------|------|
| `/account` | User Dashboard | All authenticated users |
| `/account/orders` | Order History | All |
| `/account/rfqs` | My RFQs | All |
| `/account/b2b` | B2B Dashboard | B2B accounts |
| `/account/tenders` | My Tenders | Govt users |
| `/account/wishlist` | Saved Products | All |

---

## Vendor

| URL | Page | Notes |
|-----|------|-------|
| `/vendor/register` | Vendor Onboarding | Document upload, approval flow |
| `/vendor/dashboard` | Vendor Control Panel | Products, inventory, fulfillment |

---

## Admin (Protected)

| URL | Page | Notes |
|-----|------|-------|
| `/admin/*` | Admin Dashboard | All admin routes protected by RBAC |

Suggested admin sub-routes:
- `/admin/orders`
- `/admin/products`
- `/admin/categories`
- `/admin/users`
- `/admin/rfqs`
- `/admin/tenders`
- `/admin/vendors`
- `/admin/coupons`
- `/admin/settings`

---

## Marketing & Support

| URL | Page |
|-----|------|
| `/about` | About AryanMart |
| `/contact` | Contact Us |
| `/careers` | Careers |
| `/blog` | Blog / Resources |
| `/support` | Support Center |
| `/returns` | Returns Policy |
| `/shipping-policy` | Shipping Policy |
| `/privacy-policy` | Privacy Policy |
| `/terms` | Terms of Service |

---

## Dynamic Route Patterns Summary

```
/                           → Homepage
/products                   → Master PLP
/category/:slug             → L1 category
/category/:l1/:l2           → L2 sub-category
/category/:l1/:l2/:l3       → L3 filtered PLP
/product/:slug              → PDP
/brand/:slug                → Brand page
/search                     → Search (query param: q)
/cart                       → Shopping cart
/checkout                   → Checkout
/checkout/success           → Order confirmation
/rfq                        → RFQ form
/rfq/track/:id              → RFQ tracker
/tender                     → Tender portal
/tender/:id                 → Tender detail
/account                    → Account hub
/account/orders             → Order history
/account/rfqs               → User RFQs
/account/b2b                → B2B dashboard
/account/tenders            → Govt tender dashboard
/account/wishlist           → Wishlist
/vendor/register            → Vendor onboarding
/vendor/dashboard           → Vendor panel
/admin/*                    → Admin (wildcard)
```

---

## SEO Considerations

- Canonical URLs on all PLP/PDP pages
- Structured data: Product, BreadcrumbList, Organization on homepage
- Sitemap XML generated at `/sitemap.xml` (Phase 3)
- robots.txt at `/robots.txt`

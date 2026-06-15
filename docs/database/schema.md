# AryanMart Database Schema

**Version:** 1.0  
**Database:** PostgreSQL 15+  
**ORM:** Prisma  
**Last Updated:** June 2026

Supporting stores: Redis (session/cache), Elasticsearch (product search index).

---

## Entity Relationship Overview

```
users ──────┬──── orders ────── order_items ────── product_variants
            │                                      │
            ├──── rfqs ────── rfq_responses        │
            │                                      │
            ├──── tenders                          │
            │                                      │
            └──── vendors ────── products ────────┘
                                    │
                    categories ◄────┤
                    brands ◄────────┤
                    pricing_tiers ◄─┘
                    coupons ────── orders
```

---

## Core Entities

### users

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| email | VARCHAR | Unique, required |
| phone | VARCHAR | OTP login |
| role | ENUM | `b2c`, `b2b`, `vendor`, `admin`, `govt` |
| gstin | VARCHAR | B2B/Govt — validated |
| pan | VARCHAR | KYC |
| company_name | VARCHAR | B2B/Govt |
| credit_limit | DECIMAL | B2B credit account |
| kyc_status | ENUM | `pending`, `verified`, `rejected` |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**Relations:** orders, rfqs, addresses, tenders (govt), vendors

---

### products

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| sku | VARCHAR | Unique base SKU |
| name | VARCHAR | Display name |
| slug | VARCHAR | URL slug |
| brand_id | UUID | FK → brands |
| category_id | UUID | FK → categories |
| description | TEXT | Rich text |
| specs | JSONB | Key-value technical specs |
| hsn_code | VARCHAR | GST HSN |
| gst_rate | DECIMAL | e.g. 18.00 |
| is_gem_listed | BOOLEAN | GeM badge |
| certifications | TEXT[] | BIS, ISI, ISO, etc. |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**Relations:** categories, brands, product_variants, pricing_tiers

---

### product_variants

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| product_id | UUID | FK → products |
| attributes | JSONB | e.g. `{ "length": "305m", "color": "blue" }` |
| sku_variant | VARCHAR | Unique variant SKU |
| stock | INTEGER | Available quantity |
| b2c_price | DECIMAL | Retail price |
| b2b_price | DECIMAL | Wholesale base price |
| moq | INTEGER | Minimum order qty (B2B) |
| weight | DECIMAL | kg — shipping calc |
| images | TEXT[] | S3 URLs |

**Relations:** products, order_items

---

### categories

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | VARCHAR | Display name |
| slug | VARCHAR | URL slug |
| parent_id | UUID | Self-ref — null for L1 |
| level | INTEGER | 1, 2, or 3 |
| icon_url | VARCHAR | Category tile icon |
| is_featured | BOOLEAN | Homepage showcase |
| sort_order | INTEGER | Nav ordering |

**Relations:** products, categories (self-referential parent/children)

---

### brands

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | VARCHAR | e.g. Polycab, Hikvision |
| slug | VARCHAR | URL slug |
| logo_url | VARCHAR | Brand logo |
| is_authorized | BOOLEAN | Authorized dealer flag |

---

### orders

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → users |
| order_type | ENUM | `b2c`, `b2b`, `rfq`, `tender` |
| status | ENUM | `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled` |
| items | JSONB | Snapshot of line items |
| billing_address | JSONB | |
| shipping_address | JSONB | |
| gstin | VARCHAR | Invoice GSTIN |
| po_number | VARCHAR | B2B purchase order |
| total_amount | DECIMAL | |
| gst_amount | DECIMAL | |
| payment_status | ENUM | `pending`, `paid`, `failed`, `refunded` |
| created_at | TIMESTAMP | |

**Relations:** users, order_items, coupons (optional)

---

### order_items

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| order_id | UUID | FK → orders |
| product_variant_id | UUID | FK → product_variants |
| quantity | INTEGER | |
| unit_price | DECIMAL | Price at time of order |
| gst_rate | DECIMAL | |

---

### rfqs

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → users (nullable for guest) |
| items | JSONB | Product requirements array |
| requirements_text | TEXT | Free-form notes |
| delivery_location | VARCHAR | Pincode + state |
| required_by | DATE | Target delivery date |
| status | ENUM | `pending`, `quoted`, `negotiating`, `accepted`, `rejected` |
| assigned_sales_id | UUID | FK → users (admin/sales) |
| quoted_amount | DECIMAL | Sales team quote |
| created_at | TIMESTAMP | |

**Relations:** users, rfq_responses

---

### rfq_responses

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| rfq_id | UUID | FK → rfqs |
| responder_id | UUID | Sales user |
| amount | DECIMAL | |
| notes | TEXT | |
| valid_until | DATE | |
| created_at | TIMESTAMP | |

---

### tenders

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → users (govt) |
| tender_number | VARCHAR | External tender ref |
| issuing_authority | VARCHAR | e.g. CPWD, DRDO |
| doc_url | VARCHAR | S3 uploaded tender doc |
| deadline | DATE | Submission deadline |
| status | ENUM | `draft`, `active`, `submitted`, `awarded`, `closed` |
| matched_products | JSONB | Product match results |
| compliance_docs | TEXT[] | BIS/IS cert URLs |
| created_at | TIMESTAMP | |

**Relations:** users, orders (on award)

---

### vendors

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → users |
| company_name | VARCHAR | |
| gst_cert_url | VARCHAR | S3 |
| iso_cert_url | VARCHAR | S3 (optional) |
| approval_status | ENUM | `pending`, `approved`, `suspended` |
| commission_rate | DECIMAL | % commission |
| settlement_cycle | ENUM | `weekly`, `monthly` |

**Relations:** users, products (vendor-listed)

---

### pricing_tiers

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| product_id | UUID | FK → products |
| user_segment | ENUM | `b2c`, `b2b`, `govt` |
| min_qty | INTEGER | Tier start |
| max_qty | INTEGER | Tier end (null = unlimited) |
| price | DECIMAL | Tier price |
| discount_pct | DECIMAL | Optional discount display |
| valid_from | DATE | |
| valid_to | DATE | Nullable |

**Relations:** products, users (contract-specific tiers in Phase 2+)

---

### coupons

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| code | VARCHAR | Unique coupon code |
| type | ENUM | `percent`, `flat`, `free_ship` |
| value | DECIMAL | Discount value |
| min_order | DECIMAL | Minimum cart value |
| user_segment | ENUM | `all`, `b2c`, `b2b` |
| usage_limit | INTEGER | Max redemptions |
| expiry | TIMESTAMP | |

**Relations:** orders

---

### addresses

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → users |
| label | VARCHAR | Home, Office, Site |
| line1, line2 | VARCHAR | |
| city, state, pincode | VARCHAR | |
| is_default | BOOLEAN | |

---

## Indexing Strategy

| Table | Index | Purpose |
|-------|-------|---------|
| products | slug, sku, category_id, brand_id | Lookup & filter |
| products | specs (GIN on JSONB) | Spec queries |
| product_variants | sku_variant, product_id | Variant lookup |
| categories | slug, parent_id, level | Nav tree |
| orders | user_id, status, created_at | Account history |
| rfqs | user_id, status | RFQ dashboard |
| Elasticsearch | full product index | Search & facets |

---

## Redis Keys (Cache Layer)

| Key Pattern | TTL | Purpose |
|-------------|-----|---------|
| `session:{id}` | 24h | User session |
| `cart:{userId\|guestId}` | 7d | Cart persistence |
| `otp:{phone}` | 5m | OTP verification |
| `rate:{ip}` | 1m | API rate limit |

---

## Related Documents

- [../architecture/ADR-001.md](../architecture/ADR-001.md)
- [../architecture/tech-stack.md](../architecture/tech-stack.md)
- [../features.md](../features.md)

# AryanMart Technical Stack

**Version:** 1.0  
**Last Updated:** June 2026

This document defines the technology choices and rationale for the AryanMart ecommerce platform.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Client (Browser / Mobile Web)                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│  Next.js 14 (App Router) — Vercel                           │
│  Tailwind CSS + shadcn/ui | Zustand | TanStack Query        │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST / tRPC
┌──────────────────────────▼──────────────────────────────────┐
│  Node.js + Express API — AWS EC2/ECS                          │
│  NextAuth.js | Razorpay/PayU | MSG91 | SendGrid             │
└──────┬─────────────────┬─────────────────┬────────────────────┘
       │                 │                 │
┌──────▼──────┐  ┌───────▼───────┐  ┌─────▼──────────┐
│ PostgreSQL  │  │ Redis 7+      │  │ Elasticsearch  │
│ 15+ Prisma  │  │ Cache/Session │  │ 8.x Search     │
└─────────────┘  └───────────────┘  └────────────────┘
                           │
                  ┌────────▼────────┐
                  │ AWS S3 +        │
                  │ CloudFront CDN  │
                  └─────────────────┘
```

---

## Layer-by-Layer Choices

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend Framework | Next.js 14 (App Router) | SSR for SEO, ISR for catalog pages, RSC for performance |
| Styling | Tailwind CSS + shadcn/ui | Rapid component building, design token support |
| State Management | Zustand + React Query (TanStack) | Global cart/user state + server state caching |
| Backend API | Node.js + Express (REST) with tRPC | Familiar, scalable, typed end-to-end |
| Primary Database | PostgreSQL 15+ via Prisma ORM | ACID compliance for orders, JSONB for product specs |
| Search Engine | Elasticsearch 8.x | Full-text + faceted search for 10k+ SKU catalog |
| Cache Layer | Redis 7+ | Session cache, cart persistence, rate limiting |
| File Storage | AWS S3 + CloudFront CDN | Product images, catalogs, compliance documents |
| Payment Gateway | Razorpay (primary) + PayU (fallback) | India-first, UPI + NetBanking + Cards + EMI |
| Authentication | NextAuth.js + JWT + OTP (MSG91) | Multi-role auth, GSTIN-linked B2B accounts |
| Email / Notifications | SendGrid + MSG91 + Firebase | Order updates, RFQ alerts, tender reminders |
| Hosting | Vercel (frontend) + AWS EC2/ECS (backend) | Edge-optimized Next.js + scalable backend |
| CI/CD | GitHub Actions | Automated tests + deployment pipelines |

---

## Frontend Stack Details

### Next.js 14 App Router
- Server Components for catalog PLPs and static content
- Client Components for cart, checkout, filters, interactive dashboards
- Route groups: `(shop)`, `(account)`, `(admin)`, `(vendor)`
- Middleware for role-based route protection

### Tailwind CSS + shadcn/ui
- Design tokens mapped in `tailwind.config.js` (see `/docs/design-tokens.md`)
- shadcn/ui for accessible primitives: Dialog, Sheet, Accordion, Select, etc.
- Custom components built on top of shadcn base

### State Management
- **Zustand:** Cart, user session hints, UI preferences (grid/list view)
- **TanStack Query:** Product lists, search results, order history, RFQ status

---

## Backend Stack Details

### Node.js + Express
- REST endpoints for public catalog, checkout, webhooks
- tRPC router for typed admin/vendor/internal APIs
- Rate limiting via Redis
- Structured logging (Winston/Pino)

### Prisma ORM
- Schema-first database modeling
- Migrations via `prisma migrate`
- JSONB fields for product specs, order line items, tender matches

---

## Data Stores

### PostgreSQL
- Primary transactional database
- Entities: users, products, orders, rfqs, tenders, vendors, pricing_tiers, coupons
- See [../database/schema.md](../database/schema.md)

### Redis
- Session store
- Cart persistence (guest + logged-in)
- API rate limiting
- Short-lived OTP codes

### Elasticsearch
- Product index with facets: brand, category, price, certifications, stock status
- Autocomplete for SKU, HSN, product name
- Synonym support for technical terms (OFC, optical fiber, etc.)

---

## External Integrations

| Service | Purpose |
|---------|---------|
| Razorpay | Primary payment processing |
| PayU | Fallback payment gateway |
| MSG91 | SMS OTP, order/RFQ notifications |
| SendGrid | Transactional email |
| Firebase | Push notifications (future mobile) |
| GSTIN API (third-party) | B2B company auto-fill validation |

---

## Security Considerations

- HTTPS everywhere; HSTS on production
- JWT with short expiry + refresh tokens
- Role-based access control (RBAC) at API and route level
- PCI-DSS: payment handled by gateway tokenization (no card storage)
- KYC document storage in private S3 buckets with signed URLs
- Input validation via Zod on all API boundaries

---

## Deployment Topology

| Environment | Frontend | Backend | Database |
|-------------|----------|---------|----------|
| Development | localhost:3000 | localhost:4000 | Local PostgreSQL |
| Staging | Vercel preview | AWS ECS staging | RDS staging |
| Production | Vercel production | AWS ECS production | RDS Multi-AZ |

---

## Monitoring & Observability (Phase 3)

- Application: Sentry for error tracking
- Infrastructure: AWS CloudWatch
- Search health: Elasticsearch cluster monitoring
- Uptime: External ping on critical paths (homepage, checkout, RFQ submit)

---

## Related Documents

- [ADR-001.md](./ADR-001.md)
- [../design-tokens.md](../design-tokens.md)
- [../database/schema.md](../database/schema.md)

# AryanMart Feature List & Prioritization

**Version:** 1.0  
**Last Updated:** June 2026

Features organized by priority (P0–P3) and delivery phase.

---

## Priority Definitions

| Priority | Label | Meaning |
|----------|-------|---------|
| P0 | Critical | MVP blockers — must ship in initial launch |
| P1 | High | Important for B2B/Govt differentiation — Phase 1 launch or fast follow |
| P2 | Medium | Enhances experience — Phase 2 |
| P3 | Future | Roadmap items — Phase 3+ |

---

## Feature Matrix

| Feature | Priority | User Segment | Phase |
|---------|----------|--------------|-------|
| Product catalog (browse, filter, search) | P0 — Critical | All | Phase 1 |
| Product detail page with full specs | P0 — Critical | All | Phase 1 |
| Cart + Checkout (B2C) | P0 — Critical | B2C | Phase 1 |
| RFQ submission and management | P0 — Critical | B2B | Phase 1 |
| User registration (B2C + B2B) | P0 — Critical | All | Phase 1 |
| B2B tiered pricing engine | P1 — High | B2B | Phase 1 |
| Admin dashboard (orders, catalog, users) | P1 — High | Internal | Phase 1 |
| Government/Tender procurement module | P1 — High | Govt / Defense | Phase 1 |
| GSTIN-based B2B invoice generation | P1 — High | B2B / Govt | Phase 1 |
| Vendor onboarding and dashboard | P1 — High | Vendors | Phase 2 |
| Rate contract management | P2 — Medium | Govt / B2B | Phase 2 |
| Wishlist and saved lists | P2 — Medium | All | Phase 2 |
| Product comparison tool | P2 — Medium | B2B / SI | Phase 2 |
| GeM portal integration hints | P3 — Future | Govt | Phase 3 |

---

## P0 Features — Detail

### Product Catalog
- L1/L2/L3 category navigation
- Elasticsearch-powered search (name, SKU, HSN, brand)
- Faceted filters: brand, price, certifications, stock
- Grid/list view toggle
- Pagination (24 per page) + optional infinite scroll

### Product Detail Page
- Image gallery with zoom
- Full spec table (JSONB-driven)
- B2C and B2B pricing display
- MOQ enforcement for B2B
- Trust badges (BIS, GeM, Make in India)
- Add to cart, Buy now, Request quote CTAs
- Pincode delivery check

### Cart + Checkout (B2C)
- Guest and logged-in checkout
- Address management
- GSTIN capture (optional B2C, required B2B)
- Razorpay payment integration
- Order confirmation + email/SMS

### RFQ Submission
- 3-step form: products → delivery/business → review
- Multi-item RFQ support
- BOQ/Excel upload option
- RFQ ID assignment + tracking page
- Sales team notification

### User Registration
- B2C: email/phone + OTP
- B2B: GSTIN validation + company auto-fill
- Role assignment on registration type

---

## P1 Features — Detail

### B2B Tiered Pricing Engine
- Quantity-based price tiers per product
- Login-gated B2B price visibility
- MOQ validation at cart
- Credit terms checkout (PO number, approval workflow)

### Admin Dashboard
- Order management and status updates
- Product/catalog CRUD
- User management (B2C, B2B, Govt)
- RFQ assignment and quote response
- Basic analytics

### Government/Tender Module
- Tender document upload
- Product matching to tender requirements
- Compliance document download (BIS, IS certs)
- Rate contract quote requests
- Govt user dashboard

### GSTIN Invoice Generation
- GST-compliant invoice PDF
- HSN-wise line items
- ITC-friendly format
- Delivery challan generation

---

## P2 Features — Detail

### Vendor Onboarding
- Document upload (GST, PAN, trade license, ISO)
- Admin approval workflow
- Vendor product listing access
- Fulfillment dashboard
- Commission settlement tracking

### Rate Contract Management
- Long-term fixed-rate agreements
- Remaining quantity tracking
- Expiry alerts
- Govt/B2B contract dashboard

### Wishlist & Saved Lists
- Save products for later
- Named lists for project-based procurement
- Share list via link (B2B)

### Product Comparison
- Compare up to 4 products side-by-side
- Spec diff highlighting
- Export comparison PDF

---

## P3 Features — Future

### GeM Portal Integration
- Deep links to GeM listings
- Order sync hints (not full API unless GeM provides)
- GeM product badge automation

---

## Business Models Supported

1. **Standard E-commerce** — Add to cart, checkout, payment, tracking
2. **B2B Wholesale** — Tiered pricing, bulk discounts, credit terms, MOQ
3. **RFQ** — Custom quote for large/complex orders
4. **Tender-Oriented Sales** — DGS&D, GeM, state tender support
5. **Rate Contract Supply** — Long-term govt fixed-rate agreements
6. **Institutional Procurement** — POs, delivery challans, GSTIN invoicing

---

## Related Documents

- [architecture/ADR-001.md](./architecture/ADR-001.md)
- [sitemap.md](./sitemap.md)
- [flows/](./flows/) — User flow diagrams

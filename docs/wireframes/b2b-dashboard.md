# B2B Account Dashboard Wireframe

**Route:** `/account/b2b`  
**Role:** B2B authenticated users only

---

## Layout

```
┌────────────┬──────────────────────────────────────────────┐
│ Account    │  B2B Dashboard Content                       │
│ Sidebar    │                                              │
│ (b2b)      │                                              │
└────────────┴──────────────────────────────────────────────┘
```

---

## Overview Cards (Top Row)

| Card | Metric |
|------|--------|
| Total Spend | Current FY amount |
| Open RFQs | Count pending |
| Pending Orders | In-progress count |
| Credit Limit Available | Remaining credit |

---

## Quick Actions Bar

- New RFQ
- Reorder Last
- Download Invoice
- Contact Relationship Manager

---

## B2B Pricing Table

- Contracted rates for approved product categories
- Search/filter by category or SKU
- Export to Excel

---

## Order Management

- PO tracking with status badges
- Delivery status timeline
- Raise dispute action per order

---

## Credit Account

- Available balance
- Payment due dates
- Transaction history table

---

## Documents Section

- Download GST invoices
- Delivery challans
- Product compliance certificates

---

## Empty States

- No orders: CTA to browse catalog with B2B pricing
- No credit account: Contact sales CTA

# Header

## Purpose
Global sticky site header — 3 rows on desktop.

## Structure
1. **Utility bar (36px, navy):** GSTIN bulk pricing message | Track Order, Govt Procurement, Vendor, City
2. **Main header (72px, white):** Logo + tagline | SearchBar | Login, RFQ cart, Cart
3. **Category bar (48px, gray):** All Categories megamenu | Quick links | Get Bulk Quote pill

## Props
| Prop | Type | Description |
|------|------|-------------|
| `cartCount` | number | Main cart badge |
| `rfqCount` | number | RFQ cart badge |
| `user` | User \| null | Auth state |

## Responsive
See [../responsive.md](../responsive.md) — collapses to 2-row (tablet) and 1-row (mobile).

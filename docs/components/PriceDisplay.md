# PriceDisplay

## Purpose
Renders MRP, sale price, B2B tiers, and GST-inclusive/exclusive pricing.

## Variants
| Variant | Usage |
|---------|-------|
| `b2c` | Standard retail pricing |
| `b2b` | Wholesale with tier table |
| `tiered` | Quantity breakpoint prices |
| `rfq-only` | "Price on Request" |
| `on-request` | Contact sales messaging |

## Props
| Prop | Type | Description |
|------|------|-------------|
| `price` | number | B2C/sale price |
| `b2bPrice` | number | Base B2B price |
| `moq` | number | Minimum order quantity |
| `gstRate` | number | GST percentage |
| `showGST` | boolean | Toggle inclusive/exclusive display |

## States
- GST shown / hidden, login-gated B2B (blur + login CTA)

## Accessibility
- Price changes announced via `aria-live="polite"` on GST toggle

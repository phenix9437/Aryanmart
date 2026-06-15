# RFQButton

## Purpose
Entry point for Request for Quotation from PDP, PLP, category pages, and sticky mobile bar.

## Variants
| Variant | Usage |
|---------|-------|
| `inline` | Within buy box / product card |
| `sticky` | Tablet bottom bar |
| `floating` | Mobile FAB |

## Props
| Prop | Type | Description |
|------|------|-------------|
| `productId` | string | Pre-fill product in RFQ |
| `prefilledQty` | number | Default quantity |
| `label` | string | Customizable button text |

## Accessibility
- Distinct from Add to Cart — clear label "Request Bulk Quote"
- FAB includes `aria-label` on mobile

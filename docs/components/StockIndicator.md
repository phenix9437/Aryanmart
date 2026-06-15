# StockIndicator

## Purpose
Visual stock availability status on PDP and product cards.

## Variants
| Variant | Display |
|---------|---------|
| `in-stock` | Green — "In Stock" |
| `low-stock` | Amber — "Only X left" |
| `out-of-stock` | Red — "Out of Stock" |
| `make-to-order` | Gray — "Made to Order — X days lead" |

## Props
| Prop | Type | Description |
|------|------|-------------|
| `qty` | number | Available quantity |
| `threshold` | number | Low stock threshold |
| `leadTime` | string | Lead time for MTO |

## Accessibility
- Status not conveyed by color alone — includes text label

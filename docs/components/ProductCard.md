# ProductCard

## Purpose
Displays product summary in PLP grids, carousels, and related product sections.

## Variants
| Variant | Usage |
|---------|-------|
| `standard` | Default grid card |
| `compact` | Dense lists, compare tray |
| `featured` | Homepage deals — larger, accent border |
| `list-view` | Horizontal layout with expanded info |
| `skeleton` | Loading placeholder |

## Props
| Prop | Type | Description |
|------|------|-------------|
| `product` | Product | Product data object |
| `showB2BPrice` | boolean | Show B2B tier pricing |
| `showMOQ` | boolean | Display MOQ hint |
| `showGovtBadge` | boolean | GeM/defense badges |
| `onAddToCart` | function | Cart handler |
| `onRFQ` | function | RFQ handler |

## States
- Default, hover (shadow-md), selected (compare mode), out-of-stock overlay

## Accessibility
- Entire card link wraps to PDP with descriptive `aria-label`
- Action buttons stop propagation
- Price announced with GST context when toggle active

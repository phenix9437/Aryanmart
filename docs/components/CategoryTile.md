# CategoryTile

## Purpose
Category navigation tile for homepage grid and megamenu sections.

## Variants
| Variant | Usage |
|---------|-------|
| `icon` | SVG icon + label |
| `image` | Category photo background |
| `text-only` | Minimal text link |

## Props
| Prop | Type | Description |
|------|------|-------------|
| `category` | Category | Name, slug, icon, product count |
| `showProductCount` | boolean | e.g. "2,400+ Products" |
| `isActive` | boolean | Current category highlight |

## States
- Default, hover (arrow animation), active, featured (2-col span, govt-green bg)

## Accessibility
- Link with category name as accessible name
- Product count as supplementary text, not sole link target

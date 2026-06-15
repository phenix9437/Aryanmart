# Breadcrumb

## Purpose
Navigation trail for category and product pages with SEO structured data.

## Variants
| Variant | Usage |
|---------|-------|
| `standard` | Home > Category > Product |
| `category-rich` | Full L1 > L2 > L3 path |

## Props
| Prop | Type | Description |
|------|------|-------------|
| `items` | `{ label: string; href: string }[]` | Trail segments |

## SEO
- Includes `BreadcrumbList` schema.org JSON-LD

## Accessibility
- `<nav aria-label="Breadcrumb">`
- Current page marked `aria-current="page"`

# SpecTable

## Purpose
Technical specification display on PDP and comparison views.

## Variants
| Variant | Usage |
|---------|-------|
| `horizontal` | Key-value rows |
| `vertical` | Spec name column + value column |
| `compact` | Condensed for cards |

## Props
| Prop | Type | Description |
|------|------|-------------|
| `specs` | `{ key: string; value: string }[]` | Spec entries |
| `downloadablePdf` | string | Optional PDF URL |

## Accessibility
- Semantic `<table>` with `<th>` scope
- Mono font for numeric/spec values (`font-mono`)

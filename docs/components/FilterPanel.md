# FilterPanel

## Purpose
Faceted product filtering on PLP — brand, price, specs, certifications.

## Variants
| Variant | Usage |
|---------|-------|
| `sidebar` | Desktop fixed 240px sticky |
| `drawer` | Mobile bottom sheet / modal |
| `top-bar` | Tablet collapsible section |

## Props
| Prop | Type | Description |
|------|------|-------------|
| `facets` | Facet[] | Available filter groups |
| `activeFilters` | FilterState | Current selections |
| `onFilterChange` | function | Filter update handler |
| `collapsible` | boolean | Accordion sections |

## Sections
- Brand (checkbox + search)
- Price range (dual slider)
- Category-specific facets (voltage, cable size, connector type)
- Certifications (BIS, ISI, ISO, GeM)
- In Stock Only (toggle)
- Make in India (toggle)

## Accessibility
- Accordion sections use proper ARIA expanded states
- Active filter chips removable via keyboard

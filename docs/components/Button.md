# Button

## Purpose
Primary interactive element for actions across shop, checkout, RFQ, and dashboards.

## Variants
| Variant | Usage |
|---------|-------|
| `primary` | Main CTAs — Add to Cart, Submit RFQ |
| `secondary` | Secondary actions — Buy Now |
| `ghost` | Tertiary — View All, Cancel |
| `danger` | Destructive — Remove, Cancel Order |
| `govt-green` | Government procurement CTAs |
| `icon-only` | Icon buttons — wishlist, close |
| `loading` | Async submit states |

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `primary` | Visual variant |
| `size` | `sm` \| `md` \| `lg` | `md` | Button size |
| `leftIcon` | ReactNode | — | Icon before label |
| `rightIcon` | ReactNode | — | Icon after label |
| `fullWidth` | boolean | false | 100% width |
| `isLoading` | boolean | false | Shows spinner, disables click |
| `disabled` | boolean | false | Disabled state |

## States
- Default, hover, active, focus-visible, disabled, loading

## Accessibility
- Minimum touch target 44×44px on mobile
- `aria-busy` when loading
- Focus ring visible (`ring-2 ring-accent`)
- Disabled buttons use `aria-disabled`

## Design Tokens
- Primary: `bg-accent`, hover `bg-accent-light`
- Secondary: `border border-primary text-primary`
- Govt: `bg-govt`

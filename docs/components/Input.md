# Input

## Purpose
Standard text input for forms — checkout, RFQ, account settings.

## Variants
| Variant | Usage |
|---------|-------|
| `default` | Standard field |
| `error` | Validation failed |
| `disabled` | Read-only |

## Props
| Prop | Type | Description |
|------|------|-------------|
| `label` | string | Field label |
| `error` | string | Error message |
| `hint` | string | Helper text |
| `required` | boolean | Required indicator |

## Accessibility
- Label associated via `htmlFor`
- Error linked via `aria-describedby`

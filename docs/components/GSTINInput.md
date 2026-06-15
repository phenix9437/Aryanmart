# GSTINInput

## Purpose
GSTIN capture with inline validation and company auto-fill for B2B checkout and RFQ.

## Variants
| Variant | Usage |
|---------|-------|
| `inline-validate` | Real-time validation as user types |
| `form-field` | Standard form field with label |

## Props
| Prop | Type | Description |
|------|------|-------------|
| `value` | string | GSTIN value |
| `onChange` | function | Change handler |
| `onValidate` | function | Validation callback |
| `showCompanyAutoFill` | boolean | Auto-fill company name + address |

## States
- Empty, validating, valid (green check), invalid (error message)

## Accessibility
- Format hint: "15-character GSTIN"
- Validation errors announced to screen readers

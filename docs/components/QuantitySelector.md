# QuantitySelector

## Purpose
Quantity input with increment/decrement and MOQ enforcement.

## Variants
| Variant | Usage |
|---------|-------|
| `standard` | B2C cart/PDP |
| `bulk` | B2B with MOQ step and hints |

## Props
| Prop | Type | Description |
|------|------|-------------|
| `min` | number | Minimum quantity |
| `max` | number | Maximum available |
| `step` | number | MOQ step size |
| `value` | number | Current quantity |
| `onChange` | function | Change handler |
| `showMOQHint` | boolean | Show MOQ helper text |

## States
- Valid, below MOQ (error), at max stock

## Accessibility
- Input labeled "Quantity"
- Error message linked via `aria-describedby`

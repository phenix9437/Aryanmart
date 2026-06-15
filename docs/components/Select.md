# Select

## Purpose
Dropdown selection — sort order, state, category filter, payment method.

## Props
| Prop | Type | Description |
|------|------|-------------|
| `options` | `{ value: string; label: string }[]` | Options list |
| `value` | string | Selected value |
| `onChange` | function | Change handler |
| `placeholder` | string | Empty state label |

## Usage on PLP
Sort: Relevance | Price Low-High | Price High-Low | Newest | Top Rated | MOQ Low-High

## Accessibility
- Built on shadcn Select with full keyboard support

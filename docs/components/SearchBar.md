# SearchBar

## Purpose
Omnisearch with category pre-filter for header.

## Props
| Prop | Type | Description |
|------|------|-------------|
| `placeholder` | string | Default: "Search by product, brand, SKU, or HSN code..." |
| `categoryFilter` | string | Pre-selected category slug |
| `onSearch` | function | Submit handler |
| `suggestions` | Suggestion[] | Autocomplete results |

## Layout
- Max width 480px in main header
- Category dropdown left of input
- Orange Search button right

## Accessibility
- Combobox pattern with `aria-autocomplete="list"`
- Keyboard navigation for suggestions

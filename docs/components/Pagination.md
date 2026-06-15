# Pagination

## Purpose
PLP and search results pagination — 24 items per page.

## Props
| Prop | Type | Description |
|------|------|-------------|
| `page` | number | Current page |
| `totalPages` | number | Total pages |
| `onPageChange` | function | Page change handler |
| `infiniteScroll` | boolean | Optional infinite scroll mode |

## Display
"Showing 1–24 of 1,247 results" + page controls

## Accessibility
- Current page marked `aria-current="page"`
- Prev/Next buttons with descriptive labels

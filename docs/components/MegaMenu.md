# MegaMenu

## Purpose
"All Categories" dropdown with full L1 → L2 → L3 taxonomy.

## Props
| Prop | Type | Description |
|------|------|-------------|
| `categories` | CategoryTree | Full IA tree |
| `isOpen` | boolean | Open state |
| `onClose` | function | Close handler |

## Layout
- Multi-column flyout aligned to category bar
- L1 columns with L2/L3 nested links
- Featured Govt & Defense tile highlighted

## Accessibility
- Opens on click (not hover-only on touch devices)
- Escape closes; focus returns to trigger

# Modal

## Purpose
Overlay dialogs — city selector, login prompt, confirm actions, image zoom.

## Props
| Prop | Type | Description |
|------|------|-------------|
| `open` | boolean | Visibility |
| `onClose` | function | Close handler |
| `title` | string | Dialog title |
| `size` | `sm` \| `md` \| `lg` | Width variant |

## Accessibility
- Focus trap inside modal
- Escape key closes
- `role="dialog"` + `aria-modal="true"`

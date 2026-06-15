# NotificationToast

## Purpose
Transient feedback for cart actions, RFQ submissions, errors, and tender alerts.

## Variants
| Variant | Usage |
|---------|-------|
| `success` | Item added, order placed |
| `error` | Payment failed, validation error |
| `warning` | Low stock, session expiring |
| `rfq-received` | RFQ confirmation |
| `tender-alert` | Tender deadline reminder |

## Props
| Prop | Type | Description |
|------|------|-------------|
| `message` | string | Toast content |
| `duration` | number | Auto-dismiss ms (default 4000) |
| `action` | `{ label: string; onClick: fn }` | Optional CTA |

## Accessibility
- `role="status"` for success; `role="alert"` for errors
- Pause on hover; dismiss button keyboard accessible

# TrustBadge

## Purpose
Certification and trust signals on product cards and PDP.

## Variants
| Variant | Label Example |
|---------|---------------|
| `gem-listed` | GeM Listed |
| `bis-certified` | BIS Certified |
| `iso` | ISO 9001 |
| `make-in-india` | Make in India |
| `defence-approved` | Defence Approved |

## Props
| Prop | Type | Description |
|------|------|-------------|
| `certType` | string | Badge variant key |
| `label` | string | Override display text |
| `size` | `sm` \| `md` | Badge size |

## Design
- Small pill badges with icon + text
- Govt badges use `bg-govt` token

## Accessibility
- Badge text readable; not icon-only

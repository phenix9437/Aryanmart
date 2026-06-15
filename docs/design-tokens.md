# AryanMart Design Tokens

**Design Language:** Institutional Precision  
**Version:** 1.0  
**Last Updated:** June 2026

Communicates: reliability, domain expertise, government readiness, and modern efficiency.

---

## Color Tokens

| Token | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Primary | `#0F2D6B` | `--color-primary` | Nav, headers, CTAs, brand |
| Primary Dark | `#091E4A` | `--color-primary-dark` | Hover states, footer bg |
| Accent | `#E85D04` | `--color-accent` | Buttons, badges, highlights |
| Accent Light | `#FF8C42` | `--color-accent-light` | Hover on accent, alerts |
| Govt | `#2D6A4F` | `--color-govt` | Govt/Defense badges, tags |
| Surface | `#F4F6FA` | `--color-surface` | Page background |
| Card | `#FFFFFF` | `--color-card` | Product cards, modals |
| Border | `#DDE3EE` | `--color-border` | Card borders, dividers |
| Text Primary | `#1A1D2E` | `--color-text-primary` | Body copy, headings |
| Text Muted | `#6B7A99` | `--color-text-muted` | Secondary text, labels |
| Success | `#16A34A` | `--color-success` | Stock in-hand, confirmed |
| Warning | `#D97706` | `--color-warning` | Low stock, pending status |
| Error | `#DC2626` | `--color-error` | Out of stock, error states |

---

## Typography Tokens

### Font Families

| Token | Value | Usage |
|-------|-------|-------|
| Display | `'Inter', sans-serif` | Headings, hero text, navigation |
| Body | `'Inter', sans-serif` | Body copy, product descriptions, UI |
| Mono | `'JetBrains Mono', monospace` | SKU codes, specs, GST/HSN numbers |

### Font Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-display-2xl` | 48px | 52px | bold | Hero headlines |
| `text-display-xl` | 36px | 44px | bold | Section heroes, page titles |
| `text-display-lg` | 28px | 36px | semibold | Category titles |
| `text-heading-xl` | 22px | 32px | semibold | Product names on PDP |
| `text-heading-lg` | 18px | 26px | semibold | Card headings, section heads |
| `text-body-lg` | 16px | 24px | regular | Primary body text |
| `text-body-md` | 14px | 22px | regular | Secondary body, specs |
| `text-body-sm` | 12px | 18px | regular | Labels, tags, meta info |
| `text-mono-md` | 13px | 20px | mono | SKU, HSN, GST rate display |

---

## Spacing Tokens (4px base grid)

| Token | Value |
|-------|-------|
| `spacing-1` | 4px |
| `spacing-2` | 8px |
| `spacing-3` | 12px |
| `spacing-4` | 16px |
| `spacing-6` | 24px |
| `spacing-8` | 32px |
| `spacing-12` | 48px |
| `spacing-16` | 64px |
| `spacing-20` | 80px |
| `spacing-24` | 96px |

---

## Layout Tokens

| Token | Value |
|-------|-------|
| Container sm | 640px |
| Container md | 768px |
| Container lg | 1024px |
| Container xl | 1280px |
| Container 2xl | 1440px |
| Page content max-width | 1360px |
| Page horizontal padding (desktop) | 24px |
| Grid columns | 12 |
| Grid gutter (desktop) | 24px |
| Grid gutter (tablet) | 16px |
| Grid gutter (mobile) | 12px |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4px | Compact elements |
| `radius-md` | 8px | Standard cards, buttons |
| `radius-lg` | 12px | Featured cards, modals |

---

## Elevation (Shadows)

| Token | Usage |
|-------|-------|
| `shadow-sm` | Product cards |
| `shadow-md` | Dropdowns, popovers |
| `shadow-lg` | Modals, drawers |

---

## Component-Specific Tokens

| Element | Token Reference |
|---------|-----------------|
| Header utility bar height | 36px |
| Main header height | 72px |
| Category megamenu bar height | 48px |
| Hero banner height (desktop) | 480px |
| Hero banner height (mobile) | 260px |
| PLP sidebar width | 240px |
| PLP right rail width | 200px |

---

## Tailwind Mapping

See `tailwind.config.js` at project root for full Tailwind extension mapping.

---

## Related Documents

- [components/](./components/) — Component specifications
- [wireframes/](./wireframes/) — Page wireframe specs
- [responsive.md](./responsive.md) — Breakpoint behavior

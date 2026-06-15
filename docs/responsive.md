# Responsive Behavior Specification

**Version:** 1.0  
**Last Updated:** June 2026

Breakpoints align with Tailwind defaults:
- **Mobile:** `< 768px`
- **Tablet:** `768px – 1279px`
- **Desktop:** `1280px+`

Page content max-width: 1360px with 24px horizontal padding on desktop.

---

## UI Element Matrix

| UI Element | Desktop (1280px+) | Tablet (768–1279px) | Mobile (<768px) |
|------------|---------------------|---------------------|-----------------|
| Header | 3-row full header | 2-row, search collapses | 1-row: logo + search icon + cart |
| Category nav | Horizontal megamenu bar | Hamburger drawer | Bottom tab nav (5 icons) |
| PLP Grid | 4-column grid | 3-column grid | 2-column grid |
| Filters | Left sidebar, sticky | Collapsible top section | Bottom drawer / modal |
| PDP Layout | 2-col (image + buy box) | 2-col (smaller image) | Stacked: image → buy box |
| RFQ Button | Visible in buy box | Sticky bottom bar | Floating action button |
| Footer | 4-column layout | 2-column layout | Accordion-style sections |
| B2B Dashboard | Sidebar + content area | Collapsible sidebar | Tab navigation |

---

## Header Responsive Detail

### Desktop
- Full 3-row header as specified in [homepage wireframe](./wireframes/homepage.md)

### Tablet
- Row 1 utility bar condensed (hide city selector in menu)
- Row 2: logo | collapsible search icon → expands overlay | cart icons
- Row 3: hamburger replaces megamenu bar

### Mobile
- Single row: Logo (left) | Search icon | Cart badge
- Utility links in hamburger menu
- Category nav moves to **bottom tab bar**: Home | Categories | RFQ | Cart | Account

---

## PLP Responsive Detail

### Desktop
- 240px sticky filter sidebar
- Optional 200px right rail
- 4-column product grid

### Tablet
- Filters in collapsible panel above grid
- 3-column grid
- Right rail hidden

### Mobile
- Filter button opens bottom drawer (FilterPanel `drawer` variant)
- 2-column grid (1-column optional for list view)
- Sort in toolbar dropdown only

---

## PDP Responsive Detail

### Desktop
- 55/45 split above fold
- Tabs horizontal below fold

### Tablet
- 50/50 split, smaller gallery
- Sticky bottom bar: Add to Cart + Request Quote

### Mobile
- Full-width image carousel (swipe)
- Buy box stacked below
- Tabs scroll horizontally if needed
- RFQ as floating action button (bottom-right)

---

## RFQ Form Responsive

- Desktop: centered max-width 720px, steps side-by-side indicator
- Mobile: full-width single column, sticky Submit on step 3

---

## Account Dashboards Responsive

### Desktop
- Fixed left sidebar (240px), content scrolls

### Tablet
- Sidebar collapses to icon rail; expand on hover/click

### Mobile
- Horizontal tab bar replaces sidebar
- Overview cards stack 2×2 then 1-column

---

## Homepage Section Responsive

| Section | Mobile Behavior |
|---------|-----------------|
| Hero | 260px height, single slide visible, swipe |
| Category grid | 2 columns |
| Featured products | Horizontal scroll |
| Procurement CTAs | Stack 3 cards vertically |
| Brand carousel | Continuous scroll, smaller logos |
| Trust grid | 2×3 then 1-column |
| Blog | Horizontal scroll or stack |

---

## Touch & Accessibility

- Minimum touch target: 44×44px on mobile
- Bottom tab nav safe-area inset for notched devices
- Drawer filters: swipe-down to dismiss
- Focus management on modal/drawer open

---

## Related Documents

- [design-tokens.md](./design-tokens.md)
- [wireframes/homepage.md](./wireframes/homepage.md)
- [components/Header.md](./components/Header.md)
- [components/FilterPanel.md](./components/FilterPanel.md)

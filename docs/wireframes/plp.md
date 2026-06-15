# Product Listing Page (PLP) Wireframe

**Route:** `/category/[slug]` (also L2/L3 variants)

---

## Header Area

- Category title (H1, text-display-lg)
- Breadcrumb trail (category-rich variant)
- Product count: "1,247 products found"
- Category description (max 2 lines, collapsible) for SEO

---

## Layout — Desktop

```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb | Title | Count                                  │
├──────────┬──────────────────────────────────────┬───────────┤
│ FILTER   │ TOOLBAR (sort, view, compare)        │ RIGHT     │
│ SIDEBAR  ├──────────────────────────────────────┤ RAIL      │
│ 240px    │ PRODUCT GRID (4 columns)             │ 200px     │
│ sticky   │                                      │ sticky    │
│          │ PAGINATION                           │           │
└──────────┴──────────────────────────────────────┴───────────┘
```

---

## Left Sidebar (240px, sticky, desktop only)

Filter accordions:
- Brand (checkbox + search within brands)
- Price Range (dual-handle slider + inputs)
- Category-specific facets (voltage, cable size, connector type)
- Certifications (BIS, ISI, ISO, GeM Listed)
- In Stock Only (toggle)
- Make in India (toggle)

Active filters as removable chips + "Clear All Filters" link

---

## Top Toolbar

- **Left:** "Showing 1–24 of 1,247 results"
- **Center:** Sort dropdown — Relevance | Price Low-High | Price High-Low | Newest | Top Rated | MOQ Low-High
- **Right:** View toggle (Grid 4-col | Grid 3-col | List) + "Compare Selected (0)"

---

## Product Grid

- 4 col desktop / 3 tablet / 2 mobile / 1 optional narrow
- 24 per page; infinite scroll toggle optional
- **Empty state:** Illustration + "Request this product via RFQ" CTA

---

## Right Rail (200px, optional)

- "Get Bulk Quote for this Category" sticky widget
- Featured brand spotlight

---

## Mobile Adaptations

- Filters in bottom drawer
- Toolbar stacks vertically
- Right rail hidden or below grid

See [../responsive.md](../responsive.md).

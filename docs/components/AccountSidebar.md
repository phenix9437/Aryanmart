# AccountSidebar

## Purpose
Account area navigation for B2C, B2B, vendor, govt, and admin dashboards.

## Variants
| Variant | Menu Items |
|---------|------------|
| `b2c` | Orders, RFQs, Wishlist, Profile |
| `b2b` | B2B Dashboard, Orders, RFQs, Credit, Documents |
| `vendor` | Products, Inventory, Orders, Settlements |
| `govt` | Tenders, Rate Contracts, GeM Orders, Compliance |
| `admin` | Full admin nav tree |

## Props
| Prop | Type | Description |
|------|------|-------------|
| `user` | User | Current user + role |
| `activeRoute` | string | Highlight active link |
| `collapsed` | boolean | Icon-only collapsed mode |

## Responsive
- Desktop: fixed sidebar
- Tablet: collapsible
- Mobile: tab navigation (see responsive.md)

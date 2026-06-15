# Tabs

## Purpose
PDP tabbed content — Specifications, Description, Downloads, Reviews, Q&A.

## Props
| Prop | Type | Description |
|------|------|-------------|
| `tabs` | `{ id: string; label: string; content: ReactNode }[]` | Tab definitions |
| `defaultTab` | string | Initial active tab |

## Accessibility
- Tablist with `role="tablist"`, panels with `role="tabpanel"`
- Arrow keys navigate tabs

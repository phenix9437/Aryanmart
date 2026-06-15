# AryanMart Ecommerce Platform

Enterprise-grade B2B+B2C procurement portal for telecom, networking, electrical, CCTV, IT hardware, and government supplies.

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project Structure

```
app/                 Next.js 14 App Router pages
components/          UI, layout, shop, home sections
lib/data/            Mock catalog data
lib/store/           Zustand cart store
docs/                Phase 1 & 2 architecture/design specs
tailwind.config.js   AryanMart design tokens
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/products` | All products |
| `/category/[slug]` | Category PLP |
| `/product/[slug]` | Product detail |
| `/search?q=` | Search |
| `/cart` | Shopping cart |
| `/checkout` | Checkout flow |
| `/rfq` | Request for quotation |
| `/tender` | Government tender portal |
| `/account/*` | User dashboards |

## Stack

Next.js 14 · Tailwind CSS · Zustand · TypeScript

See `docs/architecture/` for full technical architecture.

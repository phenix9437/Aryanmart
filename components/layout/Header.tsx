'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Search, ShoppingCart, FileText, User, Menu, Phone, MapPin,
} from 'lucide-react';
import { categories } from '@/lib/data/catalog';
import { useCartStore } from '@/lib/store/cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const quickLinks = [
  { label: 'Telecom', slug: 'telecom' },
  { label: 'Networking', slug: 'networking' },
  { label: 'Electrical', slug: 'electrical' },
  { label: 'CCTV', slug: 'cctv' },
  { label: 'IT Hardware', slug: 'it-hardware' },
  { label: 'Govt Supplies', slug: 'govt-defense' },
];

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useCartStore((s) => s.totalItems());

  return (
    <header className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="hidden bg-primary text-primary-foreground md:block">
        <div className="container-content flex h-header-utility items-center justify-between text-body-sm">
          <span className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" />
            GSTIN-based bulk pricing available | Call us: 1800-XXX-XXXX
          </span>
          <div className="flex items-center gap-4">
            <Link href="/account/orders" className="hover:underline">Track Order</Link>
            <Link href="/tender" className="hover:underline">Government Procurement</Link>
            <Link href="/vendor/register" className="hover:underline">Become a Vendor</Link>
            <button type="button" className="flex items-center gap-1 hover:underline">
              <MapPin className="h-3.5 w-3.5" /> Delhi NCR
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-border bg-card shadow-sm">
        <div className="container-content flex h-header-main items-center gap-4">
          <Link href="/" className="flex shrink-0 flex-col">
            <span className="text-xl font-bold tracking-tight text-primary">ARYANMART</span>
            <span className="hidden text-body-sm text-text-muted sm:block">Trusted Procurement Partner</span>
          </Link>

          <form action="/search" className="mx-auto hidden max-w-[480px] flex-1 items-center gap-0 md:flex">
            <select
              name="category"
              className="h-10 rounded-l-md border border-r-0 border-border bg-surface px-2 text-body-sm text-text-primary"
              defaultValue=""
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <Input
              name="q"
              placeholder="Search by product, brand, SKU, or HSN code..."
              className="rounded-none border-x-0"
            />
            <Button type="submit" className="rounded-l-none">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </form>

          <button
            type="button"
            className="ml-auto md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
          >
            <Search className="h-6 w-6 text-primary" />
          </button>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/account" className="hidden items-center gap-1 text-body-sm text-text-primary hover:text-primary sm:flex">
              <User className="h-5 w-5" />
              Login
            </Link>
            <Link href="/rfq" className="relative text-text-primary hover:text-primary" aria-label="RFQ">
              <FileText className="h-6 w-6" />
            </Link>
            <Link href="/cart" className="relative text-text-primary hover:text-primary" aria-label="Cart">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-body-sm font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {searchOpen && (
          <form action="/search" className="container-content flex gap-2 pb-3 md:hidden">
            <Input name="q" placeholder="Search products..." className="flex-1" />
            <Button type="submit" size="sm">Go</Button>
          </form>
        )}
      </div>

      {/* Category bar */}
      <div className="hidden border-b border-border bg-surface lg:block">
        <div className="container-content flex h-header-category items-center justify-between">
          <button type="button" className="flex items-center gap-2 text-body-md font-semibold text-text-primary">
            <Menu className="h-5 w-5" />
            All Categories
          </button>
          <nav className="flex items-center gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.slug}
                href={`/category/${link.slug}`}
                className="text-body-md text-text-primary hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/rfq">
            <Button size="sm">Get Bulk Quote</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

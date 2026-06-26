'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  Search, ShoppingCart, FileText, User, Menu, Phone, MapPin, X, LogOut, ChevronDown,
} from 'lucide-react';
import { categories } from '@/lib/data/catalog';
import { useCartStore } from '@/lib/store/cart';
import { useAuth } from '@/lib/hooks/useAuth';
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
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const cartCount = useCartStore((s) => s.totalItems());
  const { user, isLoading, logout } = useAuth();

  // Close "All Categories" dropdown when clicking outside it
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(e.target as Node)
      ) {
        setCategoriesOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    if (categoriesOpen || userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [categoriesOpen, userMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setCategoriesOpen(false);
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  async function handleLogout() {
    setUserMenuOpen(false);
    await logout();
  }

  // Figure out the best display name available on the user object
  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : user?.companyName || user?.email?.split('@')[0] || 'Account';

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
              className="h-10 w-[150px] shrink-0 truncate rounded-l-md border border-r-0 border-border bg-surface px-2 text-body-sm text-text-primary"
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
            {/* Auth-aware account area */}
            {isLoading ? (
              <div className="hidden h-5 w-16 animate-pulse rounded bg-surface sm:block" />
            ) : user ? (
              <div ref={userMenuRef} className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  className="flex items-center gap-1 text-body-sm text-text-primary hover:text-primary"
                >
                  <User className="h-5 w-5" />
                  <span className="max-w-[120px] truncate">{displayName}</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full z-50 mt-1 w-[200px] rounded-md border border-border bg-card py-2 shadow-lg"
                    role="menu"
                  >
                    <div className="border-b border-border px-4 py-2">
                      <p className="truncate text-body-sm font-medium text-text-primary">{displayName}</p>
                      <p className="truncate text-body-sm text-text-muted">{user.email}</p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-body-md text-text-primary hover:bg-surface hover:text-accent"
                      role="menuitem"
                    >
                      My Account
                    </Link>
                    {(user.role === 'B2B' || user.role === 'GOVT') && (
                      <Link
                        href="/b2b"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-body-md text-text-primary hover:bg-surface hover:text-accent"
                        role="menuitem"
                      >
                        B2B Dashboard
                      </Link>
                    )}
                    {(user.role === 'ADMIN' || user.role === 'SALES') && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-body-md text-text-primary hover:bg-surface hover:text-accent"
                        role="menuitem"
                      >
                        Admin Panel
                      </Link>
                    )}
                    {user.role === 'VENDOR' && (
                      <Link
                        href="/vendor"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-body-md text-text-primary hover:bg-surface hover:text-accent"
                        role="menuitem"
                      >
                        Vendor Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-body-md text-text-primary hover:bg-surface hover:text-accent"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden items-center gap-1 text-body-sm text-text-primary hover:text-primary sm:flex"
              >
                <User className="h-5 w-5" />
                Login
              </Link>
            )}

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
      <div className="relative hidden border-b border-border bg-surface lg:block">
        <div className="container-content flex h-header-category items-center justify-between">
          <div ref={categoriesRef} className="relative">
            <button
              type="button"
              onClick={() => setCategoriesOpen((open) => !open)}
              aria-expanded={categoriesOpen}
              aria-haspopup="true"
              className="flex items-center gap-2 text-body-md font-semibold text-text-primary hover:text-primary"
            >
              {categoriesOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              All Categories
            </button>

            {categoriesOpen && (
              <div
                className="absolute left-0 top-full z-50 mt-1 w-[280px] rounded-md border border-border bg-card py-2 shadow-lg"
                role="menu"
              >
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    onClick={() => setCategoriesOpen(false)}
                    className="block px-4 py-2 text-body-md text-text-primary hover:bg-surface hover:text-accent"
                    role="menuitem"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

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

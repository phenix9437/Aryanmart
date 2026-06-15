'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Copy, ShoppingCart, Zap } from 'lucide-react';
import type { Product } from '@/lib/data/catalog';
import { products } from '@/lib/data/catalog';
import { formatCurrency, cn } from '@/lib/utils';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { TrustBadge } from '@/components/shop/TrustBadge';
import { useCartStore } from '@/lib/store/cart';

export function ProductDetail({ product }: { product: Product }) {
  const [qty, setQty] = useState(product.moq);
  const [showGst, setShowGst] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  const displayPrice = showGst
    ? Math.round(product.price * (1 + product.gstRate / 100))
    : product.price;

  return (
    <div className="container-content py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: product.name },
        ]}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface">
            <Image src={product.image} alt={product.name} fill className="object-cover" priority sizes="50vw" />
            <span className="absolute bottom-3 right-3 rounded bg-primary/80 px-2 py-1 text-body-sm text-white">
              AryanMart Authorized
            </span>
          </div>
        </div>

        <div>
          <p className="text-body-sm font-semibold uppercase text-text-muted">{product.brand} — Authorized Dealer</p>
          <h1 className="mt-2 text-heading-xl text-text-primary md:text-display-lg">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-mono-md text-text-muted">
            <span>SKU: {product.sku}</span>
            <button type="button" className="flex items-center gap-1 hover:text-primary" aria-label="Copy SKU">
              <Copy className="h-3.5 w-3.5" />
            </button>
            <span>HSN: {product.hsnCode}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.certifications.map((c) => (
              <TrustBadge key={c} cert={c} size="md" />
            ))}
          </div>

          <div className="mt-6 rounded-md border border-border bg-surface p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-body-md text-text-muted line-through">{formatCurrency(product.mrp)}</span>
              <span className="text-display-lg font-bold text-primary">{formatCurrency(displayPrice)}</span>
              {showGst && <span className="text-body-sm text-text-muted">incl. GST @{product.gstRate}%</span>}
            </div>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setShowGst(true)}
                className={cn('rounded px-2 py-1 text-body-sm', showGst ? 'bg-primary text-white' : 'text-text-muted')}
              >
                With GST
              </button>
              <button
                type="button"
                onClick={() => setShowGst(false)}
                className={cn('rounded px-2 py-1 text-body-sm', !showGst ? 'bg-primary text-white' : 'text-text-muted')}
              >
                Without GST
              </button>
            </div>
            <p className="mt-3 text-body-md text-text-muted">
              B2B: 10+ {formatCurrency(product.b2bPrice)} | 50+ {formatCurrency(product.b2bPrice - 40)} | 100+ {formatCurrency(product.b2bPrice - 80)}
            </p>
            <span className="mt-2 inline-block rounded bg-accent/10 px-2 py-1 text-body-sm font-semibold text-accent">
              Save {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
            </span>
          </div>

          <div className="mt-4">
            <span className={cn(
              'inline-block rounded px-3 py-1 text-body-sm font-semibold',
              product.stock > 10 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
            )}>
              {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
            </span>
            <p className="mt-2 text-body-sm text-text-muted">Ships within 2 business days from Delhi warehouse</p>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <label htmlFor="qty" className="text-body-md font-medium">Qty (MOQ {product.moq})</label>
            <input
              id="qty"
              type="number"
              min={product.moq}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="h-10 w-20 rounded-md border border-border px-2"
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" onClick={() => addItem(product, qty)}>
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            <Link href="/checkout" className="flex-1">
              <Button size="lg" variant="secondary" className="w-full">
                <Zap className="h-5 w-5" />
                Buy Now
              </Button>
            </Link>
          </div>
          <Link href="/rfq" className="mt-3 block">
            <Button variant="outline" className="w-full">Request Bulk Quote</Button>
          </Link>

          <p className="mt-6 text-body-sm text-text-muted">
            Free shipping above ₹5,000 · Secure packaging · Easy returns 7 days · GST invoice
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-heading-xl font-semibold">Specifications</h2>
        <table className="mt-4 w-full max-w-2xl border border-border text-body-md">
          <tbody>
            {product.specs.map((spec) => (
              <tr key={spec.key} className="border-b border-border">
                <th className="bg-surface px-4 py-3 text-left font-medium text-text-muted">{spec.key}</th>
                <td className="px-4 py-3 font-mono">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-6 text-body-lg text-text-muted">{product.description}</p>
      </div>

      <section className="mt-12">
        <h2 className="text-heading-xl font-semibold">Similar Products</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="rounded-md border border-border p-4 hover:shadow-md">
              <p className="text-body-md font-semibold line-clamp-2">{p.name}</p>
              <p className="mt-1 text-heading-lg text-primary">{formatCurrency(p.price)}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

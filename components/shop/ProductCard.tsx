'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, FileText } from 'lucide-react';
import type { Product } from '@/lib/data/catalog';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TrustBadge } from '@/components/shop/TrustBadge';
import { useCartStore } from '@/lib/store/cart';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <article className="group flex flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-surface">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width:768px) 50vw, 20vw"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-body-sm font-semibold uppercase tracking-wide text-text-muted">{product.brand}</p>
        <Link href={`/product/${product.slug}`} className="line-clamp-2 text-heading-lg text-text-primary hover:text-primary">
          {product.name}
        </Link>
        <p className="font-mono text-mono-md text-text-muted">HSN: {product.hsnCode}</p>
        <div className="flex flex-wrap gap-1">
          {product.certifications.slice(0, 2).map((c) => (
            <TrustBadge key={c} cert={c} />
          ))}
        </div>
        <div className="mt-auto space-y-1 pt-2">
          <p className="text-body-sm text-text-muted line-through">{formatCurrency(product.mrp)}</p>
          <p className="text-heading-lg font-bold text-primary">{formatCurrency(product.price)}</p>
          <p className="text-body-sm text-text-muted">B2B from {formatCurrency(product.b2bPrice)}</p>
        </div>
        <div className="mt-3 flex gap-2">
          <Button size="sm" className="flex-1" onClick={() => addItem(product)}>
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
          <Link href="/rfq" className="flex-1">
            <Button size="sm" variant="outline" className="w-full">
              <FileText className="h-4 w-4" />
              Quote
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}

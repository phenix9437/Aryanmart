'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { formatCurrency } from '@/lib/utils';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, totalGst, grandTotal } =
    useCartStore();

  return (
    <div className="container-content py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart' }]} />
      <h1 className="mt-4 text-display-xl text-text-primary">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="mt-12 rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-body-lg text-text-muted">Your cart is empty.</p>
          <Link href="/products" className="mt-4 inline-block">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Line items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 rounded-md border border-border bg-card p-4"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-surface">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-heading-lg font-semibold hover:text-primary"
                  >
                    {item.name}
                  </Link>
                  <p className="font-mono text-mono-md text-text-muted">{item.sku}</p>
                  <p className="text-body-sm text-text-muted">GST: {item.gstRate}%</p>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="h-8 w-8 rounded border border-border disabled:opacity-40"
                        disabled={item.quantity <= item.moq}
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        className="h-8 w-8 rounded border border-border"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                      {item.moq > 1 && (
                        <span className="text-body-sm text-text-muted">
                          MOQ: {item.moq}
                        </span>
                      )}
                    </div>
                    <p className="text-heading-lg font-bold">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="text-text-muted hover:text-error"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}

            <Button variant="ghost" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>

          {/* Order summary */}
          <div className="h-fit rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-heading-xl font-semibold">Order Summary</h2>
            <dl className="mt-4 space-y-2 text-body-md">
              <div className="flex justify-between">
                <dt className="text-text-muted">Subtotal (excl. GST)</dt>
                <dd>{formatCurrency(subtotal())}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-muted">GST</dt>
                <dd>{formatCurrency(totalGst())}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-heading-lg font-bold">
                <dt>Total</dt>
                <dd className="text-primary">{formatCurrency(grandTotal())}</dd>
              </div>
            </dl>

            <Link href="/checkout" className="mt-6 block">
              <Button size="lg" className="w-full">
                Proceed to Checkout
              </Button>
            </Link>
            <Link href="/rfq" className="mt-3 block">
              <Button variant="outline" className="w-full">
                Request Bulk Quote Instead
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

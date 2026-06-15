'use client';

import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CheckoutPage() {
  return (
    <div className="container-content max-w-3xl py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="mt-4 text-display-xl text-text-primary">Checkout</h1>

      <form className="mt-8 space-y-6">
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-heading-xl font-semibold">Shipping Address</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input placeholder="Full name" required />
            <Input placeholder="Phone" required />
            <Input placeholder="Address line 1" className="sm:col-span-2" required />
            <Input placeholder="City" required />
            <Input placeholder="Pincode" required />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-heading-xl font-semibold">GSTIN (Optional for B2C)</h2>
          <Input placeholder="15-character GSTIN" className="mt-4" maxLength={15} />
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-heading-xl font-semibold">Payment</h2>
          <p className="mt-2 text-body-md text-text-muted">Razorpay integration — UPI, Cards, NetBanking</p>
          <Button type="button" size="lg" className="mt-4 w-full sm:w-auto">
            Pay Securely
          </Button>
        </section>
      </form>

      <Link href="/checkout/success" className="mt-4 block text-body-sm text-text-muted hover:text-accent">
        (Demo) Skip to confirmation →
      </Link>
    </div>
  );
}

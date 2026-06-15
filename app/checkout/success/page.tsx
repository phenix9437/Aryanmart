import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CheckoutSuccessPage() {
  return (
    <div className="container-content max-w-lg py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success text-2xl">
        ✓
      </div>
      <h1 className="mt-6 text-display-xl text-primary">Order Confirmed</h1>
      <p className="mt-3 text-body-lg text-text-muted">
        Thank you for your order. A confirmation email has been sent.
      </p>
      <p className="mt-2 font-mono text-body-md">Order ID: AM-{Date.now().toString().slice(-8)}</p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/account/orders">
          <Button>Track Order</Button>
        </Link>
        <Link href="/products">
          <Button variant="secondary">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}

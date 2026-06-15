import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export const metadata = { title: 'My Account' };

export default function AccountPage() {
  return (
    <div className="container-content py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Account' }]} />
      <h1 className="mt-4 text-display-xl text-text-primary">My Account</h1>
      <nav className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Orders', href: '/account/orders' },
          { label: 'My RFQs', href: '/account/rfqs' },
          { label: 'B2B Dashboard', href: '/account/b2b' },
          { label: 'My Tenders', href: '/account/tenders' },
          { label: 'Wishlist', href: '/account/wishlist' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md border border-border bg-card p-6 text-heading-lg font-semibold hover:border-primary hover:shadow-md"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

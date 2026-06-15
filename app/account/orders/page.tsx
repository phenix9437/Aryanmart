import { Breadcrumb } from '@/components/ui/breadcrumb';

export const metadata = { title: 'Order History' };

export default function OrdersPage() {
  return (
    <div className="container-content py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Account', href: '/account' }, { label: 'Orders' }]} />
      <h1 className="mt-4 text-display-xl text-text-primary">Order History</h1>
      <p className="mt-4 text-body-md text-text-muted">No orders yet. Place your first order from the catalog.</p>
    </div>
  );
}

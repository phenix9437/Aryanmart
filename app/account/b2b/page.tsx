import { Breadcrumb } from '@/components/ui/breadcrumb';

export const metadata = { title: 'B2B Dashboard' };

export default function B2BDashboardPage() {
  return (
    <div className="container-content py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Account', href: '/account' }, { label: 'B2B Dashboard' }]} />
      <h1 className="mt-4 text-display-xl text-text-primary">B2B Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {['Total Spend (FY)', 'Open RFQs', 'Pending Orders', 'Credit Available'].map((label) => (
          <div key={label} className="rounded-md border border-border bg-card p-6">
            <p className="text-body-sm text-text-muted">{label}</p>
            <p className="mt-2 text-display-lg font-bold text-primary">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}

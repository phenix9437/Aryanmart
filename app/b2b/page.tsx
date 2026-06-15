import { CreditCard, FileText, ShoppingCart } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';

export default function B2BDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display-lg text-text-primary">B2B Dashboard</h1>
        <p className="mt-2 text-body-md text-text-muted">
          Track orders, RFQs, and account activity in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Open Orders" value={6} icon={ShoppingCart} />
        <StatCard label="Active RFQs" value={2} icon={FileText} trend={{ value: 8, isPositive: true }} />
        <StatCard label="Credit Available" value="₹4.2L" icon={CreditCard} />
      </div>
    </div>
  );
}

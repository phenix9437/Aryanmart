import { Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';

export default function VendorDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display-lg text-text-primary">Vendor Dashboard</h1>
        <p className="mt-2 text-body-md text-text-muted">
          Monitor product performance and incoming orders.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Listed Products" value={24} icon={Package} />
        <StatCard label="Orders This Month" value={18} icon={ShoppingCart} trend={{ value: 14, isPositive: true }} />
        <StatCard label="Revenue (MTD)" value="₹8.6L" icon={TrendingUp} />
      </div>
    </div>
  );
}

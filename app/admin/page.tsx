import { Package, ShoppingCart, Users } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display-lg text-text-primary">Admin Dashboard</h1>
        <p className="mt-2 text-body-md text-text-muted">
          Overview of platform activity and pending actions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total Orders" value={47} icon={ShoppingCart} trend={{ value: 12, isPositive: true }} />
        <StatCard label="Active Products" value={128} icon={Package} />
        <StatCard label="Pending Vendors" value={3} icon={Users} trend={{ value: 5, isPositive: false }} />
      </div>
    </div>
  );
}

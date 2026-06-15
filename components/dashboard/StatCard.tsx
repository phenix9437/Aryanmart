import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: { value: number; isPositive: boolean };
}

export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="relative rounded-lg border border-border bg-card p-5 shadow-sm">
      {Icon && (
        <Icon className="absolute right-4 top-4 h-5 w-5 text-primary/40" />
      )}
      <p className="text-display-lg text-text-primary">{value}</p>
      <p className="mt-1 text-body-sm text-text-muted">{label}</p>
      {trend && (
        <p
          className={cn(
            'mt-3 flex items-center gap-1 text-body-sm font-medium',
            trend.isPositive ? 'text-success' : 'text-error'
          )}
        >
          {trend.isPositive ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          {trend.isPositive ? '+' : '-'}
          {Math.abs(trend.value)}% this month
        </p>
      )}
    </div>
  );
}

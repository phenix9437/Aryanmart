import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
}

const SUCCESS_STATUSES = new Set([
  'DELIVERED',
  'ACCEPTED',
  'APPROVED',
  'IN_STOCK',
  'WON',
  'PAID',
  'CONFIRMED',
  'VERIFIED',
]);

const WARNING_STATUSES = new Set([
  'PENDING',
  'SUBMITTED',
  'LOW_STOCK',
  'UNDER_REVIEW',
  'NEGOTIATING',
  'PROCESSING',
  'COD_PENDING',
]);

const DANGER_STATUSES = new Set([
  'CANCELLED',
  'REJECTED',
  'OUT_OF_STOCK',
  'SUSPENDED',
  'LOST',
  'FAILED',
  'EXPIRED',
  'RETURNED',
]);

function humanizeStatus(status: string) {
  return status
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getStatusClasses(status: string) {
  if (SUCCESS_STATUSES.has(status)) {
    return 'bg-success/10 text-success';
  }
  if (WARNING_STATUSES.has(status)) {
    return 'bg-warning/10 text-warning';
  }
  if (DANGER_STATUSES.has(status)) {
    return 'bg-error/10 text-error';
  }
  return 'bg-primary/10 text-primary';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-body-sm font-medium',
        getStatusClasses(status)
      )}
    >
      {humanizeStatus(status)}
    </span>
  );
}

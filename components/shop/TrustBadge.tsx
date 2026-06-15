import type { Certification } from '@/lib/data/catalog';
import { Badge } from '@/components/ui/badge';

const labels: Record<Certification, string> = {
  bis: 'BIS Certified',
  gem: 'GeM Listed',
  'make-in-india': 'Make in India',
  iso: 'ISO 9001',
  defence: 'Defence Approved',
};

export function TrustBadge({ cert, size = 'sm' }: { cert: Certification; size?: 'sm' | 'md' }) {
  const variant = cert === 'gem' || cert === 'defence' ? 'govt' : cert === 'bis' ? 'success' : 'default';
  return (
    <Badge variant={variant} className={size === 'md' ? 'text-body-md' : undefined}>
      {labels[cert]}
    </Badge>
  );
}

import { cn } from '@/lib/utils';

export function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'accent' | 'govt' | 'success' | 'warning';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-body-sm font-medium',
        variant === 'default' && 'bg-surface text-text-muted',
        variant === 'accent' && 'bg-accent/10 text-accent',
        variant === 'govt' && 'bg-govt/10 text-govt',
        variant === 'success' && 'bg-success/10 text-success',
        variant === 'warning' && 'bg-warning/10 text-warning',
        className
      )}
      {...props}
    />
  );
}

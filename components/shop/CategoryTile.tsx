import Link from 'next/link';
import {
  Radio, Network, Zap, Camera, Server, Factory, Shield, Cable, ArrowRight,
} from 'lucide-react';
import type { Category } from '@/lib/data/catalog';
import { cn } from '@/lib/utils';

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  radio: Radio,
  network: Network,
  zap: Zap,
  camera: Camera,
  server: Server,
  factory: Factory,
  shield: Shield,
  cable: Cable,
};

export function CategoryTile({ category }: { category: Category }) {
  const Icon = icons[category.icon] ?? Cable;

  if (category.featured) {
    return (
      <Link
        href={`/category/${category.slug}`}
        className="group relative col-span-2 flex min-h-[160px] flex-col justify-between overflow-hidden rounded-lg bg-govt p-6 text-govt-foreground md:min-h-[180px]"
      >
        <div>
          <Shield className="mb-3 h-8 w-8" />
          <h3 className="text-display-lg text-white">{category.name}</h3>
          <p className="mt-1 text-body-md opacity-90">{category.productCount.toLocaleString()}+ Products</p>
        </div>
        <span className="inline-flex items-center gap-1 text-body-md font-semibold">
          Explore GeM Products <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={`/category/${category.slug}`}
      className="group flex flex-col rounded-md border border-border bg-card p-5 shadow-sm transition-all hover:border-primary hover:shadow-md"
    >
      <Icon className="mb-3 h-7 w-7 text-primary" />
      <h3 className="text-heading-lg text-text-primary">{category.name}</h3>
      <p className="mt-1 text-body-sm text-text-muted">{category.productCount.toLocaleString()}+ Products</p>
      <ArrowRight className={cn('mt-4 h-4 w-4 text-accent transition-transform group-hover:translate-x-1')} />
    </Link>
  );
}

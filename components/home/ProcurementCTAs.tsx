import Link from 'next/link';
import { FileText, Shield, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const cards = [
  {
    icon: FileText,
    title: 'Need a Custom Quote?',
    description: 'Describe your requirement, get a quote in 2 hours',
    cta: 'Request Quote',
    href: '/rfq',
  },
  {
    icon: Shield,
    title: 'Government & Tender Procurement',
    description: 'GeM-listed products, rate contracts, compliance docs',
    cta: 'Explore',
    href: '/tender',
  },
  {
    icon: Package,
    title: 'Bulk & Wholesale Orders',
    description: 'MOQ pricing, credit terms, dedicated relationship manager',
    cta: 'Contact Sales',
    href: '/rfq',
  },
];

export function ProcurementCTAs() {
  return (
    <section className="bg-primary py-12">
      <div className="container-content grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.title} className="rounded-lg border border-white/10 bg-white/5 p-6 text-primary-foreground">
            <card.icon className="h-8 w-8 text-accent-light" />
            <h3 className="mt-4 text-heading-xl font-semibold">{card.title}</h3>
            <p className="mt-2 text-body-md opacity-80">{card.description}</p>
            <Link href={card.href} className="mt-4 inline-block">
              <Button>{card.cta}</Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

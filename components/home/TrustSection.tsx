import { ShieldCheck, Truck, Receipt, Landmark, UserCheck, Headphones } from 'lucide-react';

const items = [
  { icon: ShieldCheck, title: 'Genuine Products', desc: 'Authorized dealer, anti-counterfeit assurance' },
  { icon: Truck, title: 'Pan India Delivery', desc: '28 states, 72-hour express, door-to-site delivery' },
  { icon: Receipt, title: 'GST Compliant Invoicing', desc: 'GSTIN-tagged bills, ITC-friendly' },
  { icon: Landmark, title: 'GeM & Tender Expertise', desc: 'Govt procurement support team' },
  { icon: UserCheck, title: 'Dedicated Relationship Manager', desc: 'For B2B accounts above INR 5L/year' },
  { icon: Headphones, title: 'Technical Support', desc: 'Pre-sales consultation, spec-matching assistance' },
];

export function TrustSection() {
  return (
    <section className="container-content py-12">
      <h2 className="text-display-lg text-text-primary">Why AryanMart</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="rounded-md border border-border bg-card p-6 shadow-sm">
            <item.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-3 text-heading-lg font-semibold">{item.title}</h3>
            <p className="mt-1 text-body-md text-text-muted">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

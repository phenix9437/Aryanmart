import { brands } from '@/lib/data/catalog';

export function BrandCarousel() {
  return (
    <section className="container-content py-12">
      <h2 className="text-center text-display-lg text-text-primary">
        Authorized Dealer & Distributor for 500+ Brands
      </h2>
      <div className="mt-8 overflow-hidden">
        <div className="flex animate-marquee gap-12 whitespace-nowrap">
          {[...brands, ...brands].map((brand, i) => (
            <span key={`${brand}-${i}`} className="text-heading-lg font-semibold text-text-muted">
              {brand}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-6 text-center text-body-sm text-text-muted">
        Authorized dealership certificates available on request
      </p>
    </section>
  );
}

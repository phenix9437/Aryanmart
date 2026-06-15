import Link from 'next/link';
import { HeroBanner } from '@/components/home/HeroBanner';
import { CategoryTile } from '@/components/shop/CategoryTile';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProcurementCTAs } from '@/components/home/ProcurementCTAs';
import { BrandCarousel } from '@/components/home/BrandCarousel';
import { TrustSection } from '@/components/home/TrustSection';
import { categories, products } from '@/lib/data/catalog';

export default function HomePage() {
  return (
    <>
      <HeroBanner />

      <section className="container-content py-12">
        <h2 className="text-display-lg text-text-primary">Shop by Category</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryTile key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="container-content py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-display-lg text-text-primary">Top Products This Week</h2>
          <Link href="/products" className="text-body-md font-semibold text-accent hover:underline">
            View All
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <ProcurementCTAs />
      <BrandCarousel />
      <TrustSection />

      <section className="container-content py-12">
        <h2 className="text-display-lg text-text-primary">Resources & Guides</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            'OFC vs Copper Cabling: Which to Choose for your Enterprise',
            'GeM Registration Process for Govt Procurement',
            'IS 1554 Compliance Guide for HT Cables',
          ].map((title) => (
            <article key={title} className="rounded-md border border-border bg-card p-6 shadow-sm">
              <h3 className="text-heading-lg font-semibold hover:text-primary">
                <Link href="/blog">{title}</Link>
              </h3>
              <p className="mt-2 text-body-md text-text-muted">Read guide →</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

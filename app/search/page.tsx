import { products } from '@/lib/data/catalog';
import { ProductCard } from '@/components/shop/ProductCard';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const query = (searchParams.q ?? '').toLowerCase();
  const category = searchParams.category;

  let results = products;
  if (category) {
    results = results.filter((p) => p.categorySlug === category);
  }
  if (query) {
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.hsnCode.includes(query) ||
        p.brand.toLowerCase().includes(query)
    );
  }

  return (
    <div className="container-content py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />
      <h1 className="mt-4 text-display-xl text-text-primary">
        {query ? `Results for "${searchParams.q}"` : 'Search Products'}
      </h1>
      <p className="mt-2 text-body-md text-text-muted">{results.length} products found</p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

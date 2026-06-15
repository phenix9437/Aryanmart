import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/shop/ProductCard';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { getCategoryBySlug, getProductsByCategory } from '@/lib/data/catalog';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  return { title: category?.name ?? 'Category' };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const categoryProducts = getProductsByCategory(params.slug);

  return (
    <div className="container-content py-8">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: category.name },
        ]}
      />
      <h1 className="mt-4 text-display-xl text-text-primary">{category.name}</h1>
      <p className="mt-2 text-body-md text-text-muted">
        {categoryProducts.length || category.productCount} products found
      </p>
      {categoryProducts.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <p className="text-body-lg text-text-muted">Catalog loading for this category.</p>
          <a href="/rfq" className="mt-4 inline-block text-accent hover:underline">
            Request this product via RFQ →
          </a>
        </div>
      )}
    </div>
  );
}

import { ProductCard } from '@/components/shop/ProductCard';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { products } from '@/lib/data/catalog';

export const metadata = { title: 'All Products' };

export default function ProductsPage() {
  return (
    <div className="container-content py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'All Products' }]} />
      <h1 className="mt-4 text-display-xl text-text-primary">All Products</h1>
      <p className="mt-2 text-body-md text-text-muted">{products.length} products found</p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

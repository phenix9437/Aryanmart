import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/data/catalog';
import { ProductDetail } from '@/components/shop/ProductDetail';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  return { title: product?.name ?? 'Product' };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Government Tender Portal' };

export default function TenderPage() {
  return (
    <div className="container-content py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Tender Portal' }]} />
      <div className="mt-8 rounded-lg bg-govt p-8 text-govt-foreground md:p-12">
        <Shield className="h-12 w-12" />
        <h1 className="mt-4 text-display-xl">Government & Defense Procurement</h1>
        <p className="mt-3 max-w-2xl text-body-lg opacity-90">
          GeM-listed products, rate contracts, compliance documentation, and dedicated govt sales support.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/account/tenders">
            <Button>Govt Login</Button>
          </Link>
          <Link href="/category/govt-defense">
            <Button variant="secondary" className="border-white text-white hover:bg-white hover:text-govt">
              Browse GeM Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

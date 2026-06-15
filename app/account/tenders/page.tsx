import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'My Tenders' };

export default function TendersAccountPage() {
  return (
    <div className="container-content py-8">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Account', href: '/account' }, { label: 'Tenders' }]} />
      <h1 className="mt-4 text-display-xl text-text-primary">Government Procurement Dashboard</h1>
      <p className="mt-2 text-body-md text-text-muted">Upload tender documents and match AryanMart products.</p>
      <Link href="/tender" className="mt-6 inline-block">
        <Button variant="govt">Open Tender Portal</Button>
      </Link>
    </div>
  );
}

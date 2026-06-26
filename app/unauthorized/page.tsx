import Link from 'next/link';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Access Denied' };

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <ShieldX className="mx-auto h-12 w-12 text-error" />
        <h1 className="mt-4 text-display-lg text-text-primary">Access Denied</h1>
        <p className="mt-3 text-body-md text-text-muted">
          You don&apos;t have permission to view this page. If you believe this
          is an error, contact support.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
          <Link href="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

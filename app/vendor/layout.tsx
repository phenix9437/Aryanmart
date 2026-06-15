'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart } from 'lucide-react';
import { DashboardShell, type NavItem } from '@/components/dashboard/DashboardShell';
import { useAuth } from '@/lib/hooks/useAuth';

function VendorStatusMessage({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-md">
        <h1 className="text-heading-xl text-text-primary">{title}</h1>
        <p className="mt-3 text-body-md text-text-muted">{message}</p>
      </div>
    </div>
  );
}

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const navItems = useMemo<NavItem[]>(
    () => [
      { label: 'Dashboard', href: '/vendor', icon: LayoutDashboard },
      { label: 'My Products', href: '/vendor/products', icon: Package },
      { label: 'Orders', href: '/vendor/orders', icon: ShoppingCart },
    ],
    []
  );

  useEffect(() => {
    if (isLoading) return;

    if (!user || user.role !== 'VENDOR') {
      router.replace('/login?redirect=/vendor');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user || user.role !== 'VENDOR') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const approvalStatus = user.vendor?.approvalStatus;

  if (approvalStatus === 'PENDING') {
    return (
      <VendorStatusMessage
        title="Application Under Review"
        message="Your vendor application is under review. We will notify you once it has been approved."
      />
    );
  }

  if (approvalStatus === 'SUSPENDED') {
    return (
      <VendorStatusMessage
        title="Account Suspended"
        message="Your vendor account has been suspended. Contact support for assistance."
      />
    );
  }

  if (approvalStatus !== 'APPROVED') {
    return (
      <VendorStatusMessage
        title="Vendor Access Unavailable"
        message="Your vendor profile is not yet active. Please contact support if you believe this is an error."
      />
    );
  }

  return (
    <DashboardShell navItems={navItems} title="Vendor Panel">
      {children}
    </DashboardShell>
  );
}

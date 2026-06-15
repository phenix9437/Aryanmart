'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  LayoutDashboard,
  ShoppingCart,
  User,
  Award,
} from 'lucide-react';
import { DashboardShell, type NavItem } from '@/components/dashboard/DashboardShell';
import { useAuth } from '@/lib/hooks/useAuth';

export default function B2BLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const navItems = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [
      { label: 'Dashboard', href: '/b2b', icon: LayoutDashboard },
      { label: 'My Orders', href: '/b2b/orders', icon: ShoppingCart },
      { label: 'My RFQs', href: '/b2b/rfqs', icon: FileText },
    ];

    if (user?.role === 'GOVT') {
      items.push({ label: 'My Tenders', href: '/b2b/tenders', icon: Award });
    }

    items.push({ label: 'Account', href: '/b2b/account', icon: User });

    return items;
  }, [user?.role]);

  useEffect(() => {
    if (isLoading) return;

    if (!user || (user.role !== 'B2B' && user.role !== 'GOVT')) {
      router.replace('/login?redirect=/b2b');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || (user.role !== 'B2B' && user.role !== 'GOVT')) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <DashboardShell navItems={navItems} title="B2B Dashboard">
      {children}
    </DashboardShell>
  );
}

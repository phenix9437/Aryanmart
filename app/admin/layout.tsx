'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Award,
  FileText,
  FolderTree,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  Users,
} from 'lucide-react';
import { DashboardShell, type NavItem } from '@/components/dashboard/DashboardShell';
import { useAuth } from '@/lib/hooks/useAuth';

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'RFQs', href: '/admin/rfqs', icon: FileText },
  { label: 'Tenders', href: '/admin/tenders', icon: Award },
  { label: 'Vendors', href: '/admin/vendors', icon: Users },
  { label: 'Brands', href: '/admin/brands', icon: Tag },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SALES')) {
      router.replace('/login?redirect=/admin');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || (user.role !== 'ADMIN' && user.role !== 'SALES')) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <DashboardShell navItems={adminNavItems} title="Admin Panel">
      {children}
    </DashboardShell>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface DashboardShellProps {
  navItems: NavItem[];
  title: string;
  children: React.ReactNode;
}

function LoadingSkeleton() {
  return (
    <div className="flex min-h-screen bg-surface">
      <div className="hidden w-60 shrink-0 bg-primary md:block" />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-border" />
        <div className="h-32 animate-pulse rounded-lg bg-border" />
        <div className="h-32 animate-pulse rounded-lg bg-border" />
      </div>
    </div>
  );
}

function SidebarContent({
  navItems,
  title,
  pathname,
  userName,
  userRole,
  onLogout,
  onNavigate,
}: {
  navItems: NavItem[];
  title: string;
  pathname: string;
  userName: string;
  userRole: string;
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-primary-foreground"
          onClick={onNavigate}
        >
          ARYANMART
        </Link>
        <p className="mt-1 text-body-sm text-primary-foreground/70">{title}</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-body-md transition-colors',
                active
                  ? 'bg-accent text-accent-foreground'
                  : 'text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground'
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <p className="truncate text-body-sm font-medium text-primary-foreground">
          {userName}
        </p>
        <p className="text-body-sm text-primary-foreground/60">{userRole}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full border-white/20 bg-transparent text-primary-foreground hover:bg-white/10"
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

export function DashboardShell({
  navItems,
  title,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const userName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.email ||
    'User';
  const userRole = user?.role ?? '';

  const activeNav = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
  );
  const pageTitle = activeNav?.label ?? title;

  return (
    <div className="min-h-screen bg-surface">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-primary/40 md:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-60 bg-primary transition-transform md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex items-center justify-end p-2 md:hidden">
          <button
            type="button"
            className="rounded-md p-2 text-primary-foreground"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent
          navItems={navItems}
          title={title}
          pathname={pathname}
          userName={userName}
          userRole={userRole}
          onLogout={logout}
          onNavigate={() => setMobileOpen(false)}
        />
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-30 border-b border-border bg-card shadow-sm">
          <div className="flex h-16 items-center gap-4 px-4 md:px-8">
            <button
              type="button"
              className="rounded-md p-2 text-primary md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-body-sm text-text-muted">{title}</p>
              <h1 className="text-heading-lg text-text-primary">{pageTitle}</h1>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

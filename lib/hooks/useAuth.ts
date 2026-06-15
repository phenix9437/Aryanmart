'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

export type AuthUser = {
  id: string;
  email: string | null;
  role: string;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  gstin?: string | null;
  kycStatus?: string;
  creditLimit?: number;
  creditUsed?: number;
  vendor?: {
    approvalStatus: string;
    companyName: string;
  };
};

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function resolveClientToken(): string | null {
  return getCookie('auth_token') || localStorage.getItem('auth_token');
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const clientToken = resolveClientToken();
        const response = await apiClient<{ success: boolean; user: AuthUser }>(
          '/auth/me',
          clientToken ? { token: clientToken } : { useCredentials: true }
        );

        if (!cancelled) {
          setUser(response.user);
          setToken(clientToken);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setUser(null);
          setToken(null);
          setError(err instanceof Error ? err.message : 'Failed to load user');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient('/auth/logout', {
        method: 'POST',
        token: token ?? undefined,
        useCredentials: true,
      });
    } catch {
      // Still clear local state even if the request fails.
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setToken(null);
      router.push('/login');
    }
  }, [router, token]);

  return { user, token, isLoading, error, logout };
}

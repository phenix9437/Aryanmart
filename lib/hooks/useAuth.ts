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

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const response = await apiClient<{ success: boolean; user: AuthUser }>(
          '/auth/me',
          { useCredentials: true }
        );

        if (!cancelled) {
          setUser(response.user);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setUser(null);
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
        useCredentials: true,
      });
    } catch {
      // Clear local state even if request fails
    } finally {
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  return { user, isLoading, error, logout };
}

"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useAuthTransition } from '@/lib/transition-context';
import { FullScreenLoader } from '@/components/FullScreenLoader';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { active, end } = useAuthTransition();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!loading && active) {
      end();
    }
  }, [loading, active, end]);

  if (loading) {
    return (
      <FullScreenLoader
        title="Loading your workspace…"
        subtitle="Verifying your session."
      />
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

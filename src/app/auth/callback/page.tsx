"use client";

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useAuth } from '@/lib/auth-context';
import { isRetryableError } from '@/lib/api';
import { useAuthTransition } from '@/lib/transition-context';
import { prefetchDashboard } from '@/lib/prefetchDashboard';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { exchangeOAuthCode } = useAuth();
  const { start, setPhase, fail, end } = useAuthTransition();
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const lastRun = useRef(-1);

  const oauthError = searchParams.get('error');
  const code = searchParams.get('code');

  useEffect(() => {
    if (!code || oauthError) return;
    if (lastRun.current === attempt) return;
    lastRun.current = attempt;

    start('authenticating');
    exchangeOAuthCode(code)
      .then(async () => {
        setPhase('loading-profile');
        await prefetchDashboard(queryClient);
        setPhase('redirecting');
        router.push('/dashboard');
      })
      .catch((err) => {
        const message =
          (err as Error).message || 'We could not complete the sign in. Please try again.';
        if (isRetryableError(err)) {
          fail(message, () => setAttempt((n) => n + 1));
        } else {
          end();
          setError(message);
        }
      });
  }, [attempt, code, oauthError, exchangeOAuthCode, start, setPhase, end, fail, router, queryClient]);

  const displayError =
    error ||
    (oauthError
      ? 'We could not complete the sign in. Please try again.'
      : !code
        ? 'Missing authorization code. Please try signing in again.'
        : '');

  if (displayError) {
    return (
      <div className="text-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg mb-6">
          {displayError}
        </div>
        <Link
          href="/login"
          className="text-primary hover:text-primary-hover transition-colors font-medium text-sm"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm text-dark-500">Signing you in...</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <AuthLayout title="Signing In" subtitle="Please wait">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        }
      >
        <CallbackContent />
      </Suspense>
    </AuthLayout>
  );
}

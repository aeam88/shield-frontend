"use client";

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useAuth } from '@/lib/auth-context';

function CallbackContent() {
  const searchParams = useSearchParams();
  const { exchangeOAuthCode } = useAuth();
  const [error, setError] = useState('');
  const processed = useRef(false);

  const oauthError = searchParams.get('error');
  const code = searchParams.get('code');

  useEffect(() => {
    if (processed.current || !code || oauthError) return;
    processed.current = true;

    exchangeOAuthCode(code).catch((err) => {
      setError(
        (err as Error).message || 'We could not complete the sign in. Please try again.',
      );
    });
  }, [code, oauthError, exchangeOAuthCode]);

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

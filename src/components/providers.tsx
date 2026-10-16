"use client";

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MotionConfig } from 'framer-motion';
import { AuthProvider } from '@/lib/auth-context';
import { AuthTransitionProvider } from '@/lib/transition-context';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthTransitionProvider>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
          <LoadingScreen />
          <Toaster richColors position="top-right" />
        </AuthTransitionProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { FullScreenLoader } from '@/components/FullScreenLoader';
import { useAuthTransition, type TransitionPhase } from '@/lib/transition-context';

const APPEAR_DELAY_MS = 400;

const COPY: Record<
  Exclude<TransitionPhase, 'error'>,
  { title: string; subtitle: string }
> = {
  authenticating: {
    title: 'Signing you in…',
    subtitle: 'Verifying your credentials.',
  },
  waking: {
    title: 'Waking up the server…',
    subtitle:
      'The first sign in after a while can take up to a minute. Thanks for your patience.',
  },
  'loading-profile': {
    title: 'Loading your dashboard…',
    subtitle: 'Getting your workspace ready.',
  },
  redirecting: {
    title: 'Almost there…',
    subtitle: 'Taking you to your dashboard.',
  },
};

const TIPS = [
  'Cold starts happen when the server has been idle.',
  'You can create scoped API keys with custom rate limits.',
  'Analytics refresh automatically as traffic comes in.',
];

export function LoadingScreen() {
  const { active, phase, detail, startedAt, retry, end } = useAuthTransition();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [active]);

  const elapsedMs = active ? Math.max(0, now - startedAt) : 0;
  const visible = active && elapsedMs >= APPEAR_DELAY_MS;
  const seconds = Math.floor(elapsedMs / 1000);
  const tip = TIPS[Math.floor(elapsedMs / 5000) % TIPS.length];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {phase === 'error' ? (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-950"
              role="alertdialog"
              aria-live="assertive"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-950 to-dark-950" />
              <div className="absolute inset-0 bg-red-500/5" />

              <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-6 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>

                <h1 className="text-xl font-semibold tracking-tight text-white">
                  We couldn&apos;t reach the server
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {detail || 'Something went wrong. Please try again.'}
                </p>

                <div className="mt-8 flex w-full flex-col gap-3">
                  <button
                    type="button"
                    onClick={retry}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-dark-950 transition-colors hover:bg-primary-hover"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={end}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-dark-700 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-dark-900 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <FullScreenLoader
              title={COPY[phase].title}
              subtitle={COPY[phase].subtitle}
              seconds={seconds}
              tip={phase === 'waking' ? tip : undefined}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

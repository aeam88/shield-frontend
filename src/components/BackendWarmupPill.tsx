"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, RefreshCw, ServerCrash } from 'lucide-react';
import { useBackendWarmup } from '@/lib/useBackendWarmup';

const GRACE_MS = 1200;

export function BackendWarmupPill() {
  const { status, elapsedMs, warmUp } = useBackendWarmup();

  const isWarming = status === 'warming' && elapsedMs >= GRACE_MS;
  const isError = status === 'error';
  const visible = isWarming || isError;
  const seconds = Math.max(1, Math.round(elapsedMs / 1000));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-2.5 rounded-full border border-dark-700 bg-dark-800/90 backdrop-blur px-4 py-2 shadow-lg">
            {isError ? (
              <>
                <ServerCrash className="w-4 h-4 text-red-400" />
                <span className="text-sm text-white/80">
                  Could not reach the server.
                </span>
                <button
                  type="button"
                  onClick={() => warmUp(true)}
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </>
            ) : (
              <>
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="text-sm text-white/80">
                  Waking up the server…{' '}
                  <span className="tabular-nums text-dark-500">{seconds}s</span>
                </span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

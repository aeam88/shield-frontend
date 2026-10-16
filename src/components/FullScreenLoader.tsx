"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Shield } from 'lucide-react';

interface FullScreenLoaderProps {
  title: string;
  subtitle?: string;
  seconds?: number;
  tip?: string;
}

export function FullScreenLoader({
  title,
  subtitle,
  seconds,
  tip,
}: FullScreenLoaderProps) {
  const showMeta = typeof seconds === 'number' || Boolean(tip);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-dark-950"
      role="status"
      aria-live="polite"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-950 to-dark-950" />
      <div className="absolute inset-0 bg-primary/5" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-6 text-center">
        <div className="relative mb-8 flex h-20 w-20 items-center justify-center">
          <motion.span
            className="absolute inset-0 rounded-2xl border border-primary/40"
            animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Shield className="h-8 w-8 text-dark-950" />
          </div>
          <Loader2 className="absolute -bottom-1 -right-1 h-5 w-5 animate-spin text-primary" />
        </div>

        <h1 className="text-xl font-semibold tracking-tight text-white">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-white/50">{subtitle}</p>
        )}

        <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-dark-800">
          <motion.div
            className="h-full w-1/3 rounded-full bg-primary"
            animate={{ x: ['-100%', '300%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {showMeta && (
          <div className="mt-4 flex h-5 items-center gap-2 text-xs text-dark-500">
            {typeof seconds === 'number' && (
              <span className="tabular-nums">{seconds}s</span>
            )}
            {typeof seconds === 'number' && tip && <span className="text-dark-600">•</span>}
            {tip && <span>{tip}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

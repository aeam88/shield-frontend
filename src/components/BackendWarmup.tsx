"use client";

import { useBackendWarmup } from '@/lib/useBackendWarmup';

export function BackendWarmup() {
  useBackendWarmup();
  return null;
}

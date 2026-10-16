"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const WARMUP_ENDPOINT = '/';
const WAKE_TIMEOUT_MS = 90_000;
const COLD_THRESHOLD_MS = 3_000;
const RETRY_DELAY_MS = 1_500;
const MAX_RETRIES = 2;
const TICK_MS = 500;
const READY_TTL_MS = 4 * 60 * 1000;

export type BackendStatus = 'idle' | 'warming' | 'ready' | 'error';

export interface BackendWarmupState {
  status: BackendStatus;
  isColdStart: boolean;
  elapsedMs: number;
  attempt: number;
  error: string | null;
}

const initialState: BackendWarmupState = {
  status: 'idle',
  isColdStart: false,
  elapsedMs: 0,
  attempt: 0,
  error: null,
};

let state: BackendWarmupState = initialState;
let inFlight: Promise<void> | null = null;
let readyAt = 0;
const listeners = new Set<(snapshot: BackendWarmupState) => void>();

function setState(patch: Partial<BackendWarmupState>) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener(state));
}

function subscribe(listener: (snapshot: BackendWarmupState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

async function ping(): Promise<number> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WAKE_TIMEOUT_MS);
  const startedAt = Date.now();

  try {
    await fetch(`${API_BASE_URL}${WARMUP_ENDPOINT}`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
    return Date.now() - startedAt;
  } finally {
    clearTimeout(timeout);
  }
}

export function warmUpBackend(force = false): Promise<void> {
  if (inFlight) return inFlight;
  if (state.status === 'ready' && !force && Date.now() - readyAt < READY_TTL_MS) {
    return Promise.resolve();
  }

  inFlight = (async () => {
    const startedAt = Date.now();
    setState({ status: 'warming', error: null, isColdStart: false, attempt: 0 });

    const tick = setInterval(() => {
      setState({ elapsedMs: Date.now() - startedAt });
    }, TICK_MS);

    let attempt = 0;
    try {
      while (true) {
        attempt += 1;
        setState({ attempt, elapsedMs: Date.now() - startedAt });

        try {
          const duration = await ping();
          readyAt = Date.now();
          setState({
            status: 'ready',
            isColdStart: duration >= COLD_THRESHOLD_MS,
            elapsedMs: Date.now() - startedAt,
            error: null,
          });
          return;
        } catch (err) {
          const aborted = err instanceof DOMException && err.name === 'AbortError';
          if (aborted || attempt > MAX_RETRIES) {
            setState({
              status: 'error',
              elapsedMs: Date.now() - startedAt,
              error: aborted
                ? 'The server took too long to wake up.'
                : 'Could not reach the server.',
            });
            return;
          }
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        }
      }
    } finally {
      clearInterval(tick);
      inFlight = null;
    }
  })();

  return inFlight;
}

export function getBackendWarmupState(): BackendWarmupState {
  return state;
}

export function useBackendWarmup(options: { autoStart?: boolean } = {}) {
  const { autoStart = true } = options;
  const [snapshot, setSnapshot] = useState<BackendWarmupState>(state);
  const autoStarted = useRef(false);

  useEffect(() => subscribe(setSnapshot), []);

  useEffect(() => {
    if (!autoStart || autoStarted.current) return;
    autoStarted.current = true;
    warmUpBackend();
  }, [autoStart]);

  const warmUp = useCallback((force = true) => warmUpBackend(force), []);

  return {
    ...snapshot,
    isWarming: snapshot.status === 'warming',
    isReady: snapshot.status === 'ready',
    isError: snapshot.status === 'error',
    warmUp,
  };
}

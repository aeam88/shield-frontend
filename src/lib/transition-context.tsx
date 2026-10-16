"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type TransitionPhase =
  | 'authenticating'
  | 'waking'
  | 'loading-profile'
  | 'redirecting'
  | 'error';

const ESCALATE_MS = 3000;

interface TransitionState {
  active: boolean;
  phase: TransitionPhase;
  startedAt: number;
  detail: string | null;
}

interface TransitionContextValue extends TransitionState {
  start: (phase?: TransitionPhase, detail?: string | null) => void;
  setPhase: (phase: TransitionPhase, detail?: string | null) => void;
  fail: (message: string, retry?: () => void) => void;
  retry: () => void;
  end: () => void;
}

const AuthTransitionContext = createContext<TransitionContextValue | undefined>(
  undefined,
);

export function AuthTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<TransitionState>({
    active: false,
    phase: 'authenticating',
    startedAt: 0,
    detail: null,
  });
  const escalateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryRef = useRef<(() => void) | null>(null);

  const clearEscalate = useCallback(() => {
    if (escalateTimer.current) {
      clearTimeout(escalateTimer.current);
      escalateTimer.current = null;
    }
  }, []);

  const start = useCallback(
    (phase: TransitionPhase = 'authenticating', detail: string | null = null) => {
      clearEscalate();
      retryRef.current = null;
      setState({ active: true, phase, startedAt: Date.now(), detail });

      if (phase === 'authenticating') {
        escalateTimer.current = setTimeout(() => {
          setState((current) =>
            current.active && current.phase === 'authenticating'
              ? { ...current, phase: 'waking' }
              : current,
          );
        }, ESCALATE_MS);
      }
    },
    [clearEscalate],
  );

  const setPhase = useCallback(
    (phase: TransitionPhase, detail: string | null = null) => {
      clearEscalate();
      setState((current) => (current.active ? { ...current, phase, detail } : current));
    },
    [clearEscalate],
  );

  const fail = useCallback(
    (message: string, retryFn?: () => void) => {
      clearEscalate();
      retryRef.current = retryFn ?? null;
      setState((current) => ({
        ...current,
        active: true,
        phase: 'error',
        detail: message,
      }));
    },
    [clearEscalate],
  );

  const retry = useCallback(() => {
    const fn = retryRef.current;
    retryRef.current = null;
    if (fn) fn();
  }, []);

  const end = useCallback(() => {
    clearEscalate();
    retryRef.current = null;
    setState((current) => ({ ...current, active: false, detail: null }));
  }, [clearEscalate]);

  useEffect(() => clearEscalate, [clearEscalate]);

  useEffect(() => {
    if (!state.active) return;
    const onPopState = () => end();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [state.active, end]);

  const value = useMemo(
    () => ({ ...state, start, setPhase, fail, retry, end }),
    [state, start, setPhase, fail, retry, end],
  );

  return (
    <AuthTransitionContext.Provider value={value}>
      {children}
    </AuthTransitionContext.Provider>
  );
}

export function useAuthTransition() {
  const context = useContext(AuthTransitionContext);
  if (context === undefined) {
    throw new Error('useAuthTransition must be used within an AuthTransitionProvider');
  }
  return context;
}

import type { QueryClient } from '@tanstack/react-query';
import { api } from './api';

const PREFETCH_TIMEOUT_MS = 8000;

export async function prefetchDashboard(queryClient: QueryClient): Promise<void> {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const guard = new Promise<void>((resolve) => {
    timeout = setTimeout(resolve, PREFETCH_TIMEOUT_MS);
  });

  try {
    await Promise.race([
      Promise.all([
        queryClient.prefetchQuery({
          queryKey: ['api-keys'],
          queryFn: () => api.get('/api-keys'),
        }),
        queryClient.prefetchQuery({
          queryKey: ['analytics', 'summary'],
          queryFn: () => api.get('/analytics/summary'),
        }),
      ]),
      guard,
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

interface RateLimitInfo {
  limit: number | null;
  remaining: number | null;
  retryAfter: number | null;
}

export function useRateLimit() {
  const { data } = useQuery<RateLimitInfo>({
    queryKey: ['rate-limit'],
    queryFn: () => api.get<RateLimitInfo>('/rate-limit'),
    refetchInterval: 30000,
  });

  return {
    limit: data?.limit ?? null,
    remaining: data?.remaining ?? null,
    retryAfter: data?.retryAfter ?? null,
  };
}

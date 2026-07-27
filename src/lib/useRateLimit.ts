"use client";

import { useQuery } from '@tanstack/react-query';
import { getAccessToken } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface RateLimitInfo {
  limit: number | null;
  remaining: number | null;
  reset: number | null;
}

export function useRateLimit() {
  const { data } = useQuery<RateLimitInfo>({
    queryKey: ['rate-limit'],
    queryFn: async () => {
      const token = getAccessToken();
      if (!token) return { limit: null, remaining: null, reset: null };

      const response = await fetch(`${API_BASE_URL}/api-keys`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const limit = response.headers.get('X-RateLimit-Limit');
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const reset = response.headers.get('X-RateLimit-Reset');

      return {
        limit: limit ? parseInt(limit) : null,
        remaining: remaining ? parseInt(remaining) : null,
        reset: reset ? parseInt(reset) : null,
      };
    },
    refetchInterval: 30000,
  });

  return {
    limit: data?.limit ?? null,
    remaining: data?.remaining ?? null,
    reset: data?.reset ?? null,
  };
}

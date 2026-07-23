"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from '@/components/StatsCard';
import { UsageChart } from '@/components/UsageChart';
import {
  Zap,
  ShieldAlert,
  Key,
  Activity,
  ArrowUpRight,
  Plus,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { toast } from 'sonner';

interface StatusBreakdown {
  status: number;
  count: number;
}

interface TopEndpoint {
  endpoint: string;
  count: number;
}

interface UsageLog {
  createdAt: string;
  status: number;
}

interface DashboardStats {
  statusBreakdown: StatusBreakdown[];
  topEndpoints: TopEndpoint[];
  usageHistory: UsageLog[];
}

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: stats, error: statsError, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['analytics', 'summary'],
    queryFn: () => api.get<DashboardStats>('/analytics/summary'),
    refetchInterval: 30000,
  });

  const { data: keys, error: keysError, isLoading: keysLoading } = useQuery<unknown[]>({
    queryKey: ['api-keys'],
    queryFn: () => api.get<unknown[]>('/api-keys'),
  });

  const isLoading = statsLoading || keysLoading;

  if (statsError || keysError) {
    toast.error('Failed to synchronize dashboard data');
  }

  if (isLoading && !stats) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const totalRequests = stats?.statusBreakdown.reduce((acc, curr) => acc + curr.count, 0) || 0;
  const blockedRequests = stats?.statusBreakdown.find(s => s.status === 429)?.count || 0;
  const activeKeysCount = keys?.length || 0;

  const processedChartData = stats?.usageHistory ? processUsageHistory(stats.usageHistory) : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
          <p className="text-dark-500 mt-1">Real-time performance metrics across all API keys.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-dark-950 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          New API Key
        </button>
      </div>

      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Requests"
          value={totalRequests.toLocaleString()}
          icon={Zap}
          description="Global consumption"
        />
        <StatsCard
          label="Blocked (429)"
          value={blockedRequests.toLocaleString()}
          icon={ShieldAlert}
          description="Rate limit triggers"
        />
        <StatsCard
          label="Active Keys"
          value={activeKeysCount}
          icon={Key}
          description="Total provisioned keys"
        />
        <StatsCard
          label="Success Rate"
          value={totalRequests > 0 ? `${Math.round(((totalRequests - blockedRequests) / totalRequests) * 100)}%` : '100%'}
          icon={Activity}
          description="Service availability"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-card p-8 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Usage Analytics</h2>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span className="text-dark-500">Total</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-dark-500">Blocked</span>
              </div>
            </div>
          </div>
          <UsageChart data={processedChartData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-8 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-6">Top Endpoints</h2>
          <div className="space-y-6">
            {stats?.topEndpoints && stats.topEndpoints.length > 0 ? (
              stats.topEndpoints.map((endpoint) => {
                const percentage = totalRequests > 0 ? Math.round((endpoint.count / totalRequests) * 100) : 0;
                return (
                  <div key={endpoint.endpoint} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-mono text-dark-400 truncate max-w-[150px]">{endpoint.endpoint}</span>
                      <span className="text-dark-500">{endpoint.count.toLocaleString()} reqs</span>
                    </div>
                    <div className="h-1.5 w-full bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-dark-500 py-4 text-center">No endpoint data available yet.</p>
            )}
          </div>
          <Link
            href="/dashboard/analytics"
            className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors group"
          >
            View all analytics
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function processUsageHistory(history: UsageLog[]) {
  const groups: Record<string, { name: string, total: number, blocked: number }> = {};

  history.forEach(log => {
    const date = new Date(log.createdAt);
    const hour = date.getHours().toString().padStart(2, '0') + ':00';

    if (!groups[hour]) {
      groups[hour] = { name: hour, total: 0, blocked: 0 };
    }

    groups[hour].total += 1;
    if (log.status === 429) {
      groups[hour].blocked += 1;
    }
  });

  return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
}

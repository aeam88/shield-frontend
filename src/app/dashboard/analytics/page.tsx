"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { UsageChart } from '@/components/UsageChart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion } from 'framer-motion';
import { Calendar, Filter, Download, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

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

const fetcher = <T,>(url: string) => api.get<T>(url);

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['analytics', 'summary'],
    queryFn: () => fetcher<DashboardStats>('/analytics/summary'),
    refetchInterval: 60000,
  });

  if (isLoading && !stats) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const totalRequests = stats?.statusBreakdown.reduce((acc, curr) => acc + curr.count, 0) || 0;
  
  const pieData = stats?.statusBreakdown.map(s => ({
    name: s.status === 200 ? 'Success (2xx)' : s.status === 429 ? 'Rate Limited (429)' : `Status ${s.status}`,
    value: s.count,
    color: s.status === 200 ? '#6366f1' : s.status === 429 ? '#ef4444' : '#f59e0b'
  })) || [];

  const processedChartData = stats?.usageHistory ? processUsageHistory(stats.usageHistory) : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics Insights</h1>
          <p className="text-slate-400 mt-1">Deep dive into your API traffic and consumption patterns.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all text-sm">
            <Calendar className="w-4 h-4" />
            Last 7 Days
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 text-sm font-medium">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card p-8 rounded-3xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Traffic Volume</h2>
            <div className="flex gap-2">
              <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-lg border border-indigo-500/20">Real-time</span>
            </div>
          </div>
          <UsageChart data={processedChartData} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 rounded-3xl"
        >
          <h2 className="text-xl font-bold text-white mb-8">Request Distribution</h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#1e293b',
                    borderRadius: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-400">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-white">
                  {totalRequests > 0 ? Math.round((item.value / totalRequests) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 rounded-3xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white">Endpoints Usage</h2>
          <button className="text-slate-500 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.topEndpoints || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis 
                dataKey="endpoint" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#1e293b',
                  borderRadius: '12px'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#6366f1" 
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

function processUsageHistory(history: UsageLog[]) {
  const groups: Record<string, { name: string, total: number, blocked: number }> = {};
  
  history.forEach(log => {
    const date = new Date(log.createdAt);
    const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    if (!groups[label]) {
      groups[label] = { name: label, total: 0, blocked: 0 };
    }
    
    groups[label].total += 1;
    if (log.status === 429) {
      groups[label].blocked += 1;
    }
  });

  return Object.values(groups);
}

"use client";

import React, { useState } from 'react';
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
import { Calendar, Download, Loader2 } from 'lucide-react';
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

export default function AnalyticsPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const buildUrl = (base: string) => {
    const params = new URLSearchParams();
    if (dateFrom) params.set('from', dateFrom);
    if (dateTo) params.set('to', dateTo);
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['analytics', 'summary', dateFrom, dateTo],
    queryFn: () => api.get<DashboardStats>(buildUrl('/analytics/summary')),
    refetchInterval: 60000,
  });

  if (isLoading && !stats) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const totalRequests = stats?.statusBreakdown.reduce((acc, curr) => acc + curr.count, 0) || 0;
  
  const pieData = stats?.statusBreakdown.map(s => ({
    name: s.status === 200 ? 'Success (2xx)' : s.status === 429 ? 'Rate Limited (429)' : `Status ${s.status}`,
    value: s.count,
    color: s.status === 200 ? '#a3e635' : s.status === 429 ? '#ef4444' : '#f59e0b'
  })) || [];

  const processedChartData = stats?.usageHistory ? processUsageHistory(stats.usageHistory) : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics Insights</h1>
          <p className="text-dark-500 mt-1">Deep dive into your API traffic and consumption patterns.</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-dark-900 border border-dark-700 rounded-lg pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <span className="text-dark-500 text-sm">to</span>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-dark-900 border border-dark-700 rounded-lg pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="text-dark-500 hover:text-white px-2 py-2 text-sm transition-colors"
            >
              Clear
            </button>
          )}
          <button className="bg-primary hover:bg-primary-hover text-dark-950 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card p-8 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Traffic Volume</h2>
            <div className="flex gap-2">
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg border border-primary/20">Real-time</span>
            </div>
          </div>
          <UsageChart data={processedChartData} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 rounded-2xl"
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
                    backgroundColor: '#0a0a0a', 
                    borderColor: '#222222',
                    borderRadius: '8px'
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
                  <span className="text-sm text-dark-500">{item.name}</span>
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
        className="glass-card p-8 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white">Endpoints Usage</h2>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.topEndpoints || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222222" />
              <XAxis 
                dataKey="endpoint" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#333333', fontSize: 10 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#333333', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0a0a0a', 
                  borderColor: '#222222',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#a3e635" 
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

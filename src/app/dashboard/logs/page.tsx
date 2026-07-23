"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatDate } from '@/lib/utils';
import { api } from '@/lib/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface LogEntry {
  id: string;
  createdAt: string;
  endpoint: string;
  status: number;
  ip: string;
  apiKey: {
    name: string;
    prefix: string;
  };
}

const fetcher = <T,>(url: string) => api.get<T>(url);

export default function LogsPage() {
  const [search, setSearch] = useState('');

  const { data: logs, isLoading } = useQuery<LogEntry[]>({
    queryKey: ['analytics', 'logs'],
    queryFn: () => fetcher<LogEntry[]>('/analytics/logs?limit=50'),
    refetchInterval: 10000,
  });

  const filteredLogs = logs?.filter(log =>
    log.endpoint?.toLowerCase().includes(search.toLowerCase()) ||
    log.apiKey?.name.toLowerCase().includes(search.toLowerCase()) ||
    log.status.toString().includes(search)
  ) || [];

  const handleExport = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Shield Activity Logs', 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Total records: ${filteredLogs.length}`, 14, 35);

    const tableColumn = ["Timestamp", "Endpoint", "Status", "API Key", "IP Address"];
    const tableRows = filteredLogs.map(log => [
      formatDate(log.createdAt),
      log.endpoint || '/',
      log.status.toString(),
      log.apiKey.name,
      log.ip || '0.0.0.0'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      headStyles: { fillColor: [163, 230, 53], textColor: [5, 5, 5] },
      styles: { fontSize: 8, cellPadding: 2 },
      alternateRowStyles: { fillColor: [15, 15, 15] },
    });

    doc.save(`shield-logs-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Activity Logs</h1>
          <p className="text-dark-500 mt-1">Real-time stream of requests passing through the Shield gateway.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            disabled={filteredLogs.length === 0}
            className="bg-dark-900 border border-dark-700 text-dark-400 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-dark-800 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-dark-700 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="text"
              placeholder="Search logs by path, status or key..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button className="bg-dark-900 border border-dark-700 text-dark-400 px-3 py-2 rounded-lg flex items-center gap-2 hover:text-white transition-all text-sm">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <div className="bg-dark-900 border border-dark-700 text-primary px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Real-time
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-900/50 border-b border-dark-700">
                <th className="px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">Endpoint</th>
                <th className="px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">API Key</th>
                <th className="px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-6 h-16 bg-dark-900/10" />
                  </tr>
                ))
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-dark-500">
                    No activity logs recorded yet.
                  </td>
                </tr>
              ) : filteredLogs.map((log, index) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="hover:bg-dark-900/30 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm text-dark-500 whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-dark-400">{log.endpoint || '/'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                      log.status >= 200 && log.status < 300 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    )}>
                      {log.status >= 200 && log.status < 300 ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {log.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-white font-medium">{log.apiKey.name}</span>
                      <span className="text-[10px] text-dark-500 font-mono">{log.apiKey.prefix}...</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-500">
                    {log.ip || '0.0.0.0'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-dark-500 hover:text-white p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredLogs.length > 0 && (
          <div className="p-6 border-t border-dark-700 flex items-center justify-between">
            <p className="text-sm text-dark-500">Showing {filteredLogs.length} of recent requests</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-dark-900 border border-dark-700 rounded-lg text-sm text-dark-400 hover:text-white transition-all">Older</button>
              <button className="px-3 py-1 bg-dark-900 border border-dark-700 rounded-lg text-sm text-dark-400 hover:text-white transition-all">Newer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

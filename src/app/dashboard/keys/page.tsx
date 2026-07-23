"use client";

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Trash2,
  Copy,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldX,
  Loader2,
  Pencil
} from 'lucide-react';
import { api } from '@/lib/api';
import { cn, formatDate } from '@/lib/utils';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { EditApiKeyModal } from '@/components/EditApiKeyModal';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  limit: number;
  window: number;
  isActive: boolean;
  createdAt: string;
}

export default function ApiKeysPage() {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const queryClient = useQueryClient();

  const { data: keys, isLoading } = useQuery<ApiKey[]>({
    queryKey: ['api-keys'],
    queryFn: () => api.get<ApiKey[]>('/api-keys'),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api-keys/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      toast.success('API Key revoked successfully');
    },
    onError: () => {
      toast.error('Failed to revoke API key');
    }
  });

  const handleCopy = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    toast.success('Key prefix copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = (id: string) => {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      revokeMutation.mutate(id);
    }
  };

  const filteredKeys = keys?.filter(k =>
    k.name.toLowerCase().includes(search.toLowerCase()) ||
    k.prefix.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">API Keys</h1>
          <p className="text-dark-500 mt-1">Manage access credentials for your services.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover text-dark-950 px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-medium"
        >
          <Plus className="w-4 h-4" />
          Generate New Key
        </button>
      </div>

      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { }}
      />

      <EditApiKeyModal
        key={editingKey?.id}
        isOpen={!!editingKey}
        onClose={() => setEditingKey(null)}
        apiKey={editingKey}
      />

      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-dark-700 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="text"
              placeholder="Search by name or prefix..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-dark-500 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-900/50">
                <th className="px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">Key Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">Limits</th>
                <th className="px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-xs font-semibold text-dark-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8 h-20 bg-dark-900/20" />
                  </tr>
                ))
              ) : filteredKeys.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-dark-500">
                    No API keys found.
                  </td>
                </tr>
              ) : filteredKeys.map((key) => (
                <tr key={key.id} className="hover:bg-dark-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{key.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {key.prefix}••••••••
                        </code>
                        <button
                          onClick={() => handleCopy(key.id, `${key.prefix}••••••••`)}
                          className="text-dark-500 hover:text-white transition-colors"
                        >
                          {copiedId === key.id ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-dark-400">
                      <Clock className="w-3.5 h-3.5 text-dark-500" />
                      <span>{key.limit} req / {key.window}s</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                      key.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    )}>
                      {key.isActive ? (
                        <ShieldCheck className="w-3 h-3" />
                      ) : (
                        <ShieldX className="w-3 h-3" />
                      )}
                      {key.isActive ? 'Active' : 'Revoked'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-500">
                    {formatDate(key.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => setEditingKey(key)}
                        className="text-dark-500 hover:text-primary p-2 rounded-lg hover:bg-primary/10 transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRevoke(key.id)}
                        disabled={revokeMutation.isPending}
                        className="text-dark-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-all disabled:opacity-50"
                      >
                        {revokeMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

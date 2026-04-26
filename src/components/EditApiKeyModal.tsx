"use client";

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  X, 
  Save, 
  Loader2, 
  AlertCircle,
  Settings2
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface EditApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: {
    id: string;
    name: string;
    limit: number;
    window: number;
  } | null;
}

export function EditApiKeyModal({ isOpen, onClose, apiKey }: EditApiKeyModalProps) {
  const [name, setName] = useState(apiKey?.name || '');
  const [limit, setLimit] = useState(apiKey?.limit || 100);
  const [windowSec, setWindowSec] = useState(apiKey?.window || 60);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { name: string; limit: number; windowSec: number }) => 
      api.patch(`/api-keys/${apiKey?.id}`, data),
    onSuccess: () => {
      toast.success('API Key updated successfully');
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      onClose();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update API key');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, limit, windowSec });
  };

  if (!isOpen || !apiKey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg glass-card rounded-3xl overflow-hidden shadow-2xl border-white/10"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-indigo-400" />
            Edit API Key Limits
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Key Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Request Limit</label>
              <input
                type="number"
                required
                min="1"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Window (seconds)</label>
              <input
                type="number"
                required
                min="1"
                value={windowSec}
                onChange={(e) => setWindowSec(parseInt(e.target.value))}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {mutation.isError && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-4 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {(mutation.error as Error).message}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-all border border-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

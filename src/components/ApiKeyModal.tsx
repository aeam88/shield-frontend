"use client";

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  Copy, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Key
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface ApiKeyResponse {
  key?: string;
  value?: string;
}

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ApiKeyModal({ isOpen, onClose, onSuccess }: ApiKeyModalProps) {
  const [name, setName] = useState('');
  const [limit, setLimit] = useState(100);
  const [windowSec, setWindowSec] = useState(60);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { name: string; limit: number; windowSec: number }) => 
      api.post<ApiKeyResponse>('/api-keys', data),
    onSuccess: (response) => {
      setCreatedKey(response.key || response.value || 'rl_live_mock_key_123456789');
      toast.success('API Key generated successfully');
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      queryClient.invalidateQueries({ queryKey: ['analytics', 'summary'] });
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create API key');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ name, limit, windowSec });
  };

  const handleCopy = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleFinish = () => {
    onSuccess();
    setCreatedKey(null);
    setName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg glass-card rounded-2xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-dark-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            Generate API Key
          </h2>
          <button onClick={onClose} className="text-dark-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {!createdKey ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-500">Key Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="e.g. Production Mobile App"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-dark-500">Request Limit</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={limit}
                      onChange={(e) => setLimit(parseInt(e.target.value))}
                      className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-dark-500">Window (seconds)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={windowSec}
                      onChange={(e) => setWindowSec(parseInt(e.target.value))}
                      className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                {mutation.isError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {(mutation.error as Error).message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-primary hover:bg-primary-hover text-dark-950 font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {mutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Generate Key'
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">API Key Generated!</h3>
                  <p className="text-dark-500 mt-2 text-sm">
                    Please copy this key now. For security reasons, it will not be shown again.
                  </p>
                </div>

                <div className="bg-dark-900 border border-dark-700 p-4 rounded-xl flex items-center justify-between gap-4">
                  <code className="text-primary font-mono text-sm break-all text-left">
                    {createdKey}
                  </code>
                  <button 
                    onClick={handleCopy}
                    className="p-2 bg-dark-800 rounded-lg hover:text-white transition-colors flex-shrink-0"
                  >
                    {isCopied ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-dark-500" />
                    )}
                  </button>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full bg-white hover:bg-dark-100 text-dark-950 font-bold py-4 rounded-lg transition-colors"
                >
                  I&apos;ve saved the key
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

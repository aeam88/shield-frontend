"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export function StatsCard({ label, value, description, icon: Icon, trend, className }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass-card p-6 rounded-2xl", className)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
            trend.isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
          )}>
            {trend.isUp ? '+' : '-'}{trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-dark-500 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
        {description && (
          <p className="text-xs text-dark-500 mt-2">{description}</p>
        )}
      </div>
    </motion.div>
  );
}

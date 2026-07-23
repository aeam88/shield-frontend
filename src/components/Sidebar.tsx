"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Key, 
  BarChart3, 
  Settings, 
  LogOut, 
  Shield,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useRateLimit } from '@/lib/useRateLimit';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'API Keys', icon: Key, href: '/dashboard/keys' },
  { label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
  { label: 'Activity Logs', icon: History, href: '/dashboard/logs' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { limit, remaining, retryAfter } = useRateLimit();

  const rateLimitPercentage = limit && remaining !== null
    ? Math.round((remaining / limit) * 100)
    : null;

  return (
    <aside className="w-64 border-r border-dark-800 bg-dark-950/50 backdrop-blur-xl flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Shield className="w-4 h-4 text-dark-950" />
        </div>
        <span className="font-bold text-lg tracking-tight">Shield</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-dark-500 hover:bg-dark-900 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4",
                isActive ? "text-primary" : "text-dark-500"
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        {rateLimitPercentage !== null && (
          <>
            <div className="border-t border-dark-700 my-3" />
            <div className="px-1 py-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-dark-500">Rate Limit</span>
                <span className="text-xs font-mono text-dark-400">{remaining}/{limit}</span>
              </div>
              <div className="h-1.5 w-full bg-dark-700 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    rateLimitPercentage > 50 ? "bg-primary" :
                    rateLimitPercentage > 20 ? "bg-yellow-500" : "bg-red-500"
                  )}
                  style={{ width: `${rateLimitPercentage}%` }}
                />
              </div>
              {retryAfter && (
                <p className="text-[10px] text-yellow-500 mt-1">
                  Retry in {retryAfter}s
                </p>
              )}
            </div>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-dark-800">
        <div className="bg-dark-900/50 rounded-xl p-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-dark-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-dark-500 hover:bg-dark-900 hover:text-white transition-colors text-sm"
          >
            <Settings className="w-4 h-4" />
            <span className="font-medium">Settings</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

"use client";

import React from 'react';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  brandTitle?: string;
  brandSubtitle?: string;
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  brandTitle = "Secure Your APIs",
  brandSubtitle = "Protect your microservices with intelligent rate limiting and real-time analytics."
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-dark-950">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-950" />
        <div className="absolute inset-0 bg-primary/5" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-dark-950" />
            </div>
            <span className="text-xl font-bold tracking-tight">Shield</span>
          </div>

          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-3">
              {brandTitle}
            </h2>
            <p className="text-white/50 text-lg max-w-md leading-relaxed">
              {brandSubtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

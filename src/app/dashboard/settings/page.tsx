"use client";

import React from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard,
  Save
} from 'lucide-react';
import { motion } from 'framer-motion';

const settingsSections = [
  { id: 'profile', label: 'Profile Settings', icon: User, description: 'Manage your public profile and email address.' },
  { id: 'security', label: 'Security & Auth', icon: Shield, description: 'Update your password and 2FA settings.' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Configure how you receive alerts and reports.' },
  { id: 'network', label: 'Network & Proxy', icon: Globe, description: 'Setup custom domains and proxy rules.' },
  { id: 'billing', label: 'Billing & Plan', icon: CreditCard, description: 'Manage your subscription and invoices.' },
];

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-slate-400 mt-1">Configure your account and dashboard preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-2">
          {settingsSections.map((section) => (
            <button 
              key={section.id}
              className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-slate-900 group border border-transparent hover:border-slate-800 text-left"
            >
              <div className="p-2 bg-slate-900 rounded-xl group-hover:bg-indigo-600/10 transition-colors">
                <section.icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{section.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{section.description}</p>
              </div>
            </button>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-card p-8 rounded-3xl"
        >
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">General Profile</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="John Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="john@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Organization Name</label>
              <input 
                type="text" 
                defaultValue="Shield Infrastructure"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-end">
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 font-medium">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

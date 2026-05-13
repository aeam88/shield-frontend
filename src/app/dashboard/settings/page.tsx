"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard,
  Save,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

interface Profile {
  id: string;
  email: string;
  name: string;
  organization?: string;
  avatar_url?: string;
  created_at?: string;
}

const settingsSections = [
  { id: 'profile', label: 'Profile Settings', icon: User, description: 'Manage your public profile and email address.' },
  { id: 'security', label: 'Security & Auth', icon: Shield, description: 'Update your password and 2FA settings.' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Configure how you receive alerts and reports.' },
  { id: 'network', label: 'Network & Proxy', icon: Globe, description: 'Setup custom domains and proxy rules.' },
  { id: 'billing', label: 'Billing & Plan', icon: CreditCard, description: 'Manage your subscription and invoices.' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.get<Profile>('/auth/profile');
      setProfile(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        organization: data.organization || '',
      });
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.patch('/auth/profile', {
        name: formData.name,
        organization: formData.organization,
      });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

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
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-slate-900 group border border-transparent hover:border-slate-800 text-left ${
                activeSection === section.id ? 'bg-slate-900 border-slate-800' : ''
              }`}
            >
              <div className="p-2 bg-slate-900 rounded-xl group-hover:bg-indigo-600/10 transition-colors">
                <section.icon className={`w-5 h-5 transition-colors ${
                  activeSection === section.id ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400'
                }`} />
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-white">General Profile</h2>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-sm p-3 rounded-xl">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  disabled
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Organization Name</label>
              <input 
                type="text" 
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-end">
              <button 
                type="submit"
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
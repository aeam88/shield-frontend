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
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-dark-500 mt-1 text-sm sm:text-base">Configure your account and dashboard preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="space-y-2">
          {settingsSections.map((section) => (
            <button 
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left ${
                activeSection === section.id 
                  ? 'bg-dark-900 border border-dark-700' 
                  : 'hover:bg-dark-900/50 border border-transparent'
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${
                activeSection === section.id ? 'bg-primary/10' : 'bg-dark-900'
              }`}>
                <section.icon className={`w-5 h-5 transition-colors ${
                  activeSection === section.id ? 'text-primary' : 'text-dark-500'
                }`} />
              </div>
              <div>
                <p className="text-sm font-medium">{section.label}</p>
                <p className="text-xs text-dark-500">{section.description}</p>
              </div>
            </button>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-card p-6 rounded-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-bold">General Profile</h2>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-dark-500 mb-1.5 block">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-dark-500 mb-1.5 block">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  disabled
                  className="w-full bg-dark-900/50 border border-dark-700 rounded-lg px-4 py-2.5 text-sm text-dark-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-dark-500 mb-1.5 block">Organization Name</label>
              <input 
                type="text" 
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="pt-4 border-t border-dark-700 flex justify-end">
              <button 
                type="submit"
                disabled={saving}
                className="bg-primary hover:bg-primary-hover text-dark-950 px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm disabled:opacity-50"
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

"use client";

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard,
  Save,
  Loader2,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { profileSchema, passwordSchema, type ProfileInput, type PasswordInput } from '@/lib/validations';

interface Profile {
  id: string;
  email: string;
  name: string;
  organization?: string;
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
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Profile
  const [profileForm, setProfileForm] = useState<ProfileInput>({ name: '', organization: '' });
  const [profileEmail, setProfileEmail] = useState('');
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // Security
  const [securityForm, setSecurityForm] = useState<PasswordInput>({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [securityErrors, setSecurityErrors] = useState<Record<string, string>>({});

  // Notifications
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    usageReports: true,
    securityAlerts: true,
    marketingEmails: false,
  });

  // Network
  const [networkForm, setNetworkForm] = useState({ customDomain: '', proxyUrl: '' });

  // Billing
  const [billing, setBilling] = useState({ 
    plan: 'free', 
    status: 'active', 
    paymentMethod: null as { last4: string; brand: string } | null 
  });

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      try {
        const profileData = await api.get<{ name: string; email: string; organization: string }>('/auth/profile');
        setProfileForm({ name: profileData.name || '', organization: profileData.organization || '' });
        setProfileEmail(profileData.email || '');
      } catch {}

      try {
        const notifData = await api.get<typeof notifications>('/user/notifications');
        setNotifications(notifData);
      } catch {}

      try {
        const networkData = await api.get<typeof networkForm>('/user/network');
        setNetworkForm(networkData);
      } catch {}

      try {
        const billingData = await api.get<typeof billing>('/user/billing');
        setBilling(billingData);
      } catch {}
    } catch {
      setToast({ type: 'error', message: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = profileSchema.safeParse(profileForm);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setProfileErrors(fieldErrors);
      return;
    }
    setProfileErrors({});
    setIsSaving(true);
    try {
      await api.patch('/auth/profile', { name: profileForm.name, organization: profileForm.organization });
      setToast({ type: 'success', message: 'Profile updated successfully' });
    } catch {
      setToast({ type: 'error', message: 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = passwordSchema.safeParse(securityForm);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setSecurityErrors(fieldErrors);
      return;
    }
    setSecurityErrors({});
    setIsSaving(true);
    try {
      await api.patch('/auth/password', {
        currentPassword: securityForm.currentPassword,
        newPassword: securityForm.newPassword,
      });
      setToast({ type: 'success', message: 'Password updated successfully' });
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      setToast({ type: 'error', message: 'Failed to update password' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.patch('/user/notifications', notifications);
      setToast({ type: 'success', message: 'Notification preferences saved' });
    } catch {
      setToast({ type: 'error', message: 'Failed to save preferences' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNetworkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.patch('/user/network', networkForm);
      setToast({ type: 'success', message: 'Network settings saved' });
    } catch {
      setToast({ type: 'error', message: 'Failed to save network settings' });
    } finally {
      setIsSaving(false);
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
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium ${
          toast.type === 'success' 
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {toast.message}
        </div>
      )}

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
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 glass-card p-6 rounded-2xl"
        >
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <h2 className="text-lg font-bold">General Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-dark-500 mb-1.5 block">Full Name</label>
                  <input 
                    type="text" 
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className={`w-full bg-dark-900 border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                      profileErrors.name ? 'border-red-500 focus:border-red-500' : 'border-dark-700 focus:border-primary/50'
                    }`}
                  />
                  {profileErrors.name && <p className="text-xs text-red-400 mt-1">{profileErrors.name}</p>}
                </div>
                <div>
                  <label className="text-sm text-dark-500 mb-1.5 block">Email Address</label>
                  <input 
                    type="email" 
                    value={profileEmail}
                    disabled
                    className="w-full bg-dark-900/50 border border-dark-700 rounded-lg px-4 py-2.5 text-sm text-dark-500 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-dark-500 mb-1.5 block">Organization Name</label>
                <input 
                  type="text" 
                  value={profileForm.organization || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, organization: e.target.value })}
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="pt-4 border-t border-dark-700 flex justify-end">
                <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-hover text-dark-950 px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <form onSubmit={handleSecuritySubmit} className="space-y-6">
              <h2 className="text-lg font-bold">Security & Auth</h2>
              <div>
                <label className="text-sm text-dark-500 mb-1.5 block">Current Password</label>
                <input 
                  type="password" 
                  value={securityForm.currentPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className={`w-full bg-dark-900 border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                    securityErrors.currentPassword ? 'border-red-500 focus:border-red-500' : 'border-dark-700 focus:border-primary/50'
                  }`}
                />
                {securityErrors.currentPassword && <p className="text-xs text-red-400 mt-1">{securityErrors.currentPassword}</p>}
              </div>
              <div>
                <label className="text-sm text-dark-500 mb-1.5 block">New Password</label>
                <input 
                  type="password" 
                  value={securityForm.newPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className={`w-full bg-dark-900 border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                    securityErrors.newPassword ? 'border-red-500 focus:border-red-500' : 'border-dark-700 focus:border-primary/50'
                  }`}
                />
                {securityErrors.newPassword && <p className="text-xs text-red-400 mt-1">{securityErrors.newPassword}</p>}
              </div>
              <div>
                <label className="text-sm text-dark-500 mb-1.5 block">Confirm New Password</label>
                <input 
                  type="password" 
                  value={securityForm.confirmPassword}
                  onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className={`w-full bg-dark-900 border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors ${
                    securityErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-dark-700 focus:border-primary/50'
                  }`}
                />
                {securityErrors.confirmPassword && <p className="text-xs text-red-400 mt-1">{securityErrors.confirmPassword}</p>}
              </div>
              <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-dark-500">Add an extra layer of security to your account</p>
                  </div>
                  <button type="button" className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>
              <div className="pt-4 border-t border-dark-700 flex justify-end">
                <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-hover text-dark-950 px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <form onSubmit={handleNotificationsSubmit} className="space-y-6">
              <h2 className="text-lg font-bold">Notifications</h2>
              <div className="space-y-4">
                {[
                  { key: 'emailAlerts' as const, label: 'Email Alerts', desc: 'Receive alerts about rate limit triggers via email' },
                  { key: 'usageReports' as const, label: 'Usage Reports', desc: 'Receive weekly usage summary reports' },
                  { key: 'securityAlerts' as const, label: 'Security Alerts', desc: 'Get notified about suspicious activity' },
                  { key: 'marketingEmails' as const, label: 'Marketing Emails', desc: 'Receive product updates and newsletters' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-dark-900/50 rounded-xl border border-dark-700">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-dark-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={notifications[item.key]}
                        onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-dark-700 flex justify-end">
                <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-hover text-dark-950 px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </form>
          )}

          {/* Network Section */}
          {activeSection === 'network' && (
            <form onSubmit={handleNetworkSubmit} className="space-y-6">
              <h2 className="text-lg font-bold">Network & Proxy</h2>
              <div>
                <label className="text-sm text-dark-500 mb-1.5 block">Custom Domain</label>
                <input 
                  type="text" 
                  value={networkForm.customDomain}
                  onChange={(e) => setNetworkForm({ ...networkForm, customDomain: e.target.value })}
                  placeholder="api.yourdomain.com"
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
                <p className="text-xs text-dark-500 mt-1">Point your domain to our servers via CNAME record</p>
              </div>
              <div>
                <label className="text-sm text-dark-500 mb-1.5 block">Proxy URL</label>
                <input 
                  type="text" 
                  value={networkForm.proxyUrl}
                  onChange={(e) => setNetworkForm({ ...networkForm, proxyUrl: e.target.value })}
                  placeholder="https://proxy.example.com"
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
                <p className="text-xs text-dark-500 mt-1">Route API traffic through a custom proxy</p>
              </div>
              <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-dark-500" />
                  <p className="text-sm text-dark-500">Network settings require DNS propagation which may take up to 24 hours.</p>
                </div>
              </div>
              <div className="pt-4 border-t border-dark-700 flex justify-end">
                <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-hover text-dark-950 px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          )}

          {/* Billing Section */}
          {activeSection === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">Billing & Plan</h2>
              <div className="p-6 bg-dark-900/50 rounded-xl border border-dark-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium">Current Plan</p>
                    <p className="text-2xl font-bold text-primary mt-1 capitalize">{billing.plan}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    billing.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-dark-700 text-dark-500'
                  }`}>
                    {billing.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-dark-500">
                  {billing.plan === 'free' && (
                    <>
                      <p>100 requests per minute</p>
                      <p>1 API key</p>
                      <p>7 days log retention</p>
                    </>
                  )}
                  {billing.plan === 'pro' && (
                    <>
                      <p>10,000 requests per minute</p>
                      <p>Unlimited API keys</p>
                      <p>90 days log retention</p>
                    </>
                  )}
                </div>
              </div>

              {billing.plan === 'free' && (
                <div className="p-6 bg-dark-900/50 rounded-xl border border-dark-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium">Pro Plan</p>
                      <p className="text-2xl font-bold mt-1">$29<span className="text-sm font-normal text-dark-500">/month</span></p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-dark-950 rounded-lg transition-colors">
                      Upgrade
                    </button>
                  </div>
                  <div className="space-y-2 text-sm text-dark-500">
                    <p>10,000 requests per minute</p>
                    <p>Unlimited API keys</p>
                    <p>90 days log retention</p>
                    <p>Priority support</p>
                  </div>
                </div>
              )}

              <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-xs text-dark-500">
                      {billing.paymentMethod 
                        ? `${billing.paymentMethod.brand} ending in ${billing.paymentMethod.last4}`
                        : 'No payment method on file'
                      }
                    </p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                    {billing.paymentMethod ? 'Update' : 'Add Payment'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

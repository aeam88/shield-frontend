"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Loader2, Mail, Lock, User } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SocialButtons } from '@/components/auth/SocialButtons';
import { registerSchema, type RegisterInput } from '@/lib/validations';

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterInput>({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const validate = () => {
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setError('');
    try {
      await register(form.name, form.email, form.password);
    } catch (err) {
      setError((err as Error).message || 'Error creating account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign Up" subtitle="Create account">
      <div className="text-center mb-8">
        <div className="inline-flex bg-dark-900 rounded-lg p-1 mb-6">
          <Link
            href="/register"
            className="px-5 py-2 text-sm font-medium bg-dark-700 text-white rounded-md"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-medium text-dark-500 hover:text-white rounded-md transition-colors"
          >
            Log In
          </Link>
        </div>

        <h1 className="text-2xl font-bold tracking-tight">Create An Account</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Enter Your Name"
              className={`w-full bg-dark-900 border rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-dark-500 focus:outline-none transition-colors ${
                errors.name ? 'border-red-500 focus:border-red-500' : 'border-dark-700 focus:border-primary/50'
              }`}
            />
          </div>
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
        </div>

        <div>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Enter Your Email"
              className={`w-full bg-dark-900 border rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-dark-500 focus:outline-none transition-colors ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-dark-700 focus:border-primary/50'
              }`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>

        <div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              className={`w-full bg-dark-900 border rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-dark-500 focus:outline-none transition-colors ${
                errors.password ? 'border-red-500 focus:border-red-500' : 'border-dark-700 focus:border-primary/50'
              }`}
            />
          </div>
          {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-hover text-dark-950 font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            'Create an Account'
          )}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-dark-700" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-dark-950 text-dark-500">Or</span>
        </div>
      </div>

      <SocialButtons />

      <p className="text-center text-sm text-dark-500 mt-8">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:text-primary-hover transition-colors font-medium">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

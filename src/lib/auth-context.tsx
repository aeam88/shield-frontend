"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, setTokens, clearTokens, getAccessToken } from './api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          const userData = await api.get<User>('/auth/profile');
          setUser(userData);
        } catch {
          clearTokens();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post<{ access_token: string; refresh_token: string; user: User }>(
      '/auth/login',
      { email, password }
    );
    setTokens(response.access_token, response.refresh_token);
    setUser(response.user);
    router.push('/dashboard');
  };

  const register = async (name: string, email: string, password: string) => {
    await api.post('/auth/register', { name, email, password });
    await login(email, password);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {
      // Continue with local logout even if backend fails
    }
    clearTokens();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import api from '../api/client';

// ─── Types ───────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'superadmin';
  kycStatus: 'none' | 'pending' | 'verified' | 'rejected';
  biometricEnabled: boolean;
  createdAt: string;
  referralCode?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  verifyEmail: (code: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  enableBiometric: () => Promise<boolean>;
}

export interface SignupData {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  referralCode?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,
  });

  // Restore session on mount — validate token with backend
  useEffect(() => {
    const token = localStorage.getItem('iv_token');

    if (!token) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    api.setToken(token);
    api.getMe()
      .then(data => {
        localStorage.setItem('iv_user', JSON.stringify(data.user));
        setState({ user: data.user, isAuthenticated: true, isLoading: false, token });
      })
      .catch(() => {
        localStorage.removeItem('iv_user');
        localStorage.removeItem('iv_token');
        api.setToken(null);
        setState({ user: null, isAuthenticated: false, isLoading: false, token: null });
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await api.login(email, password);
      localStorage.setItem('iv_user', JSON.stringify(data.user));
      setState({ user: data.user, isAuthenticated: true, isLoading: false, token: data.token });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    try {
      const res = await api.signup(data);
      localStorage.setItem('iv_user', JSON.stringify(res.user));
      setState({ user: res.user, isAuthenticated: true, isLoading: false, token: res.token });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed' };
    }
  }, []);

  const logout = useCallback(() => {
    api.logout().catch(() => {});
    localStorage.removeItem('iv_user');
    localStorage.removeItem('iv_token');
    setState({ user: null, isAuthenticated: false, isLoading: false, token: null });
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    api.updateMe(updates).then(res => {
      localStorage.setItem('iv_user', JSON.stringify(res.user));
      setState(prev => ({ ...prev, user: res.user }));
    }).catch(() => {});
  }, []);

  const verifyEmail = useCallback(async (code: string) => {
    try {
      await api.verifyEmail(code);
      const res = await api.getMe();
      localStorage.setItem('iv_user', JSON.stringify(res.user));
      setState(prev => ({ ...prev, user: res.user }));
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await api.forgotPassword(email);
      return true;
    } catch {
      return false;
    }
  }, []);

  const enableBiometric = useCallback(async () => {
    try {
      await api.updateMe({ biometricEnabled: true });
      setState(prev => {
        if (!prev.user) return prev;
        const user = { ...prev.user, biometricEnabled: true };
        localStorage.setItem('iv_user', JSON.stringify(user));
        return { ...prev, user };
      });
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, updateUser, verifyEmail, resetPassword, enableBiometric }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

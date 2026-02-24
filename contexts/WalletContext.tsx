// ═══════════════════════════════════════════════════════════════════
//  Wallet Context — Manages wallet state via backend API
// ═══════════════════════════════════════════════════════════════════
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

// ─── Types ───────────────────────────────────────────────────────
interface Wallet {
  id: string;
  provider: string;
  address: string;
  network: string;
  connected: boolean;
  createdAt: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  txHash?: string;
  description?: string;
  metadata?: any;
  createdAt: string;
}

interface Investment {
  id: string;
  projectId: string;
  projectName: string;
  projectImg?: string;
  planName: string;
  amount: number;
  apy: number;
  term: string;
  payoutFrequency: string;
  riskLevel: string;
  status: string;
  monthlyYield: number;
  totalEarned: number;
  startDate: string;
  maturityDate: string;
  transactionId: string;
  createdAt: string;
}

interface WalletState {
  wallet: Wallet | null;
  balance: number;
  transactions: Transaction[];
  investments: Investment[];
  isLoading: boolean;
  totalPortfolioValue: number;
  monthlyYield: number;
}

interface WalletContextType extends WalletState {
  connectWallet: (provider: string, address?: string, network?: string) => Promise<boolean>;
  disconnectWallet: () => Promise<void>;
  deposit: (amount: number, method: string, currency?: string, txHash?: string) => Promise<{ success: boolean; txId?: string; error?: string }>;
  withdraw: (amount: number, address: string) => Promise<{ success: boolean; txId?: string; error?: string }>;
  invest: (data: {
    projectId: string; projectName?: string; projectImg?: string; planName: string;
    amount: number; apy: number; term: string; payoutFrequency?: string; riskLevel?: string;
  }) => Promise<{ success: boolean; investmentId?: string; transactionId?: string; error?: string }>;
  refreshBalance: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  refreshInvestments: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────
export function WalletProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  const [state, setState] = useState<WalletState>({
    wallet: null,
    balance: 0,
    transactions: [],
    investments: [],
    isLoading: true,
    totalPortfolioValue: 0,
    monthlyYield: 0,
  });

  // Load wallet data when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setState({ wallet: null, balance: 0, transactions: [], investments: [], isLoading: false, totalPortfolioValue: 0, monthlyYield: 0 });
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const [walletRes, txRes, invRes] = await Promise.allSettled([
          api.getWallet(),
          api.getTransactions({ limit: 50 }),
          api.getInvestments(),
        ]);

        if (cancelled) return;

        const bal = walletRes.status === 'fulfilled' ? walletRes.value.balance : 0;
        const invs = invRes.status === 'fulfilled' ? invRes.value.investments : [];
        const activeInvs = invs.filter((i: any) => i.status === 'active');
        const totalInvested = activeInvs.reduce((s: number, i: any) => s + i.amount, 0);
        const mYield = activeInvs.reduce((s: number, i: any) => s + (i.monthlyYield || 0), 0);
        const totalEarned = invs.reduce((s: number, i: any) => s + (i.totalEarned || 0), 0);

        setState({
          wallet: walletRes.status === 'fulfilled' ? walletRes.value.wallet : null,
          balance: bal,
          transactions: txRes.status === 'fulfilled' ? txRes.value.transactions : [],
          investments: invs,
          isLoading: false,
          totalPortfolioValue: bal + totalInvested + totalEarned,
          monthlyYield: mYield,
        });
      } catch {
        if (!cancelled) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  const connectWallet = useCallback(async (provider: string, address?: string, network?: string) => {
    try {
      const res = await api.connectWallet(provider, address, network);
      setState(prev => ({ ...prev, wallet: res.wallet, balance: res.balance }));
      return true;
    } catch {
      return false;
    }
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      await api.disconnectWallet();
      setState(prev => ({ ...prev, wallet: null }));
    } catch {}
  }, []);

  const deposit = useCallback(async (amount: number, method: string, currency?: string, txHash?: string) => {
    try {
      const res = await api.deposit(amount, method, currency, txHash);
      setState(prev => ({
        ...prev,
        balance: res.balance,
        transactions: [res.transaction, ...prev.transactions],
      }));
      return { success: true, txId: res.txId };
    } catch (err: any) {
      return { success: false, error: err.message || 'Deposit failed' };
    }
  }, []);

  const withdraw = useCallback(async (amount: number, address: string) => {
    try {
      const res = await api.withdraw(amount, address);
      setState(prev => ({
        ...prev,
        balance: res.balance,
        transactions: [res.transaction, ...prev.transactions],
      }));
      return { success: true, txId: res.txId };
    } catch (err: any) {
      return { success: false, error: err.message || 'Withdrawal failed' };
    }
  }, []);

  const invest = useCallback(async (data: any) => {
    try {
      const res = await api.invest(data);
      setState(prev => ({
        ...prev,
        balance: res.balance,
        investments: [res.investment, ...prev.investments],
      }));
      return { success: true, investmentId: res.investmentId, transactionId: res.transactionId };
    } catch (err: any) {
      return { success: false, error: err.message || 'Investment failed' };
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    try {
      const res = await api.getBalance();
      setState(prev => ({ ...prev, balance: res.balance }));
    } catch {}
  }, []);

  const refreshTransactions = useCallback(async () => {
    try {
      const res = await api.getTransactions({ limit: 50 });
      setState(prev => ({ ...prev, transactions: res.transactions }));
    } catch {}
  }, []);

  const refreshInvestments = useCallback(async () => {
    try {
      const res = await api.getInvestments();
      setState(prev => ({ ...prev, investments: res.investments }));
    } catch {}
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.allSettled([refreshBalance(), refreshTransactions(), refreshInvestments()]);
  }, [refreshBalance, refreshTransactions, refreshInvestments]);

  return (
    <WalletContext.Provider value={{
      ...state, connectWallet, disconnectWallet, deposit, withdraw, invest,
      refreshBalance, refreshTransactions, refreshInvestments, refreshAll,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextType {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}

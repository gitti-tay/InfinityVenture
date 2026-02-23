// ═══════════════════════════════════════════════════════════════════
//  API Client — Centralized HTTP client for backend (MVP Complete)
// ═══════════════════════════════════════════════════════════════════

const API_BASE = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) localStorage.setItem('iv_token', token);
    else localStorage.removeItem('iv_token');
  }

  getToken(): string | null {
    if (!this.token) this.token = localStorage.getItem('iv_token');
    return this.token;
  }

  async request<T = any>(method: string, path: string, body?: any, options?: { noAuth?: boolean; timeout?: number }): Promise<T> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token && !options?.noAuth) headers['Authorization'] = `Bearer ${token}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options?.timeout || 30000);

    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method, headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      const data = await res.json();

      // Auto-logout on 401 (expired token)
      if (res.status === 401 && !options?.noAuth) {
        this.setToken(null);
        localStorage.removeItem('iv_user');
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }

      if (!res.ok) throw new ApiError(data.error || 'Request failed', res.status, data);
      return data;
    } catch (err: any) {
      if (err.name === 'AbortError') throw new ApiError('Request timed out', 408);
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // ── Auth ──────────────────────────────────────────────
  async signup(data: { fullName: string; email: string; password: string; phone?: string; referralCode?: string }) {
    const res = await this.request<{ success: boolean; token: string; user: any; verificationCode: string; message: string }>('POST', '/auth/signup', data, { noAuth: true });
    this.setToken(res.token);
    return res;
  }

  async login(email: string, password: string) {
    const res = await this.request<{ success: boolean; token: string; user: any; message: string }>('POST', '/auth/login', { email, password }, { noAuth: true });
    this.setToken(res.token);
    return res;
  }

  async logout() {
    try { await this.request('POST', '/auth/logout'); } finally {
      this.setToken(null);
      localStorage.removeItem('iv_user');
    }
  }

  async getMe() { return this.request<{ success: boolean; user: any }>('GET', '/auth/me'); }
  async updateMe(data: any) { return this.request<{ success: boolean; user: any }>('PUT', '/auth/me', data); }
  async verifyEmail(code: string) { return this.request<{ success: boolean }>('POST', '/auth/verify-email', { code }); }
  async forgotPassword(email: string) { return this.request<{ success: boolean }>('POST', '/auth/forgot-password', { email }, { noAuth: true }); }
  async changePassword(currentPassword: string, newPassword: string) { return this.request<{ success: boolean }>('POST', '/auth/change-password', { currentPassword, newPassword }); }
  async kycStart() { return this.request<{ success: boolean }>('POST', '/auth/kyc/start'); }
  async kycApprove() { return this.request<{ success: boolean }>('POST', '/auth/kyc/approve'); }

  // ── Wallet ────────────────────────────────────────────
  async getWallet() { return this.request<{ success: boolean; wallet: any; balance: number }>('GET', '/wallet'); }
  async connectWallet(provider: string, address?: string, network?: string) { return this.request<{ success: boolean; wallet: any; balance: number }>('POST', '/wallet/connect', { provider, address, network }); }
  async disconnectWallet() { return this.request<{ success: boolean }>('POST', '/wallet/disconnect'); }
  async getBalance() { return this.request<{ success: boolean; balance: number }>('GET', '/wallet/balance'); }

  // ── Transactions ──────────────────────────────────────
  async getTransactions(params?: { type?: string; status?: string; limit?: number; offset?: number }) {
    const qs = new URLSearchParams();
    if (params?.type) qs.set('type', params.type);
    if (params?.status) qs.set('status', params.status);
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.offset) qs.set('offset', String(params.offset));
    const query = qs.toString() ? `?${qs}` : '';
    return this.request<{ success: boolean; transactions: any[]; total: number }>('GET', `/transactions${query}`);
  }

  async deposit(amount: number, method: string, currency?: string, txHash?: string) {
    return this.request<{ success: boolean; transaction: any; balance: number; txId: string; adminWalletAddress?: string; status: string }>(
      'POST', '/transactions/deposit', { amount, method, currency, txHash }
    );
  }

  async withdraw(amount: number, address: string) {
    return this.request<{ success: boolean; transaction: any; balance: number; txId: string; fee: number; netAmount: number; status: string }>(
      'POST', '/transactions/withdraw', { amount, address }
    );
  }

  async getDepositAddresses() {
    return this.request<{ success: boolean; wallets: any[] }>('GET', '/transactions/deposit-addresses');
  }

  // ── Investments ───────────────────────────────────────
  async getInvestments(status?: string) {
    const qs = status ? `?status=${status}` : '';
    return this.request<{ success: boolean; investments: any[] }>('GET', `/investments${qs}`);
  }

  async getPortfolio() { return this.request<{ success: boolean; portfolio: any }>('GET', '/investments/portfolio'); }

  async invest(data: { projectId: string; projectName?: string; projectImg?: string; planName: string; amount: number; apy: number; term: string; payoutFrequency?: string; riskLevel?: string }) {
    return this.request<{ success: boolean; investment: any; transactionId: string; investmentId: string; balance: number }>('POST', '/investments', data);
  }

  async getInvestment(id: string) { return this.request<{ success: boolean; investment: any }>('GET', `/investments/${id}`); }

  // ── Projects ──────────────────────────────────────────
  async getProjects(params?: { category?: string; sort?: string }) {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.sort) qs.set('sort', params.sort);
    const query = qs.toString() ? `?${qs}` : '';
    return this.request<{ success: boolean; projects: any[]; total: number }>('GET', `/projects${query}`, undefined, { noAuth: true });
  }

  async getProject(id: string) { return this.request<{ success: boolean; project: any }>('GET', `/projects/${id}`, undefined, { noAuth: true }); }

  // ── Notifications ─────────────────────────────────────
  async getNotifications(unread?: boolean) {
    const qs = unread ? '?unread=true' : '';
    return this.request<{ success: boolean; notifications: any[]; unreadCount: number }>('GET', `/notifications${qs}`);
  }

  async markNotificationRead(id: string) { return this.request('PUT', `/notifications/${id}/read`); }
  async markAllNotificationsRead() { return this.request('PUT', '/notifications/read-all'); }
  async clearNotifications() { return this.request('DELETE', '/notifications/clear'); }

  // ══════════════════════════════════════════════════════
  //  ADMIN API
  // ══════════════════════════════════════════════════════

  // Dashboard
  async adminDashboard() { return this.request<{ success: boolean; dashboard: any }>('GET', '/admin/dashboard'); }

  // Users
  async adminGetUsers(params?: { search?: string; role?: string; kyc_status?: string; suspended?: string; limit?: number; offset?: number }) {
    const qs = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    return this.request<{ success: boolean; users: any[]; total: number }>('GET', `/admin/users?${qs}`);
  }

  async adminGetUser(userId: string) { return this.request<{ success: boolean; user: any; transactions: any[]; investments: any[]; kycDocuments: any[] }>('GET', `/admin/users/${userId}`); }
  async adminSuspendUser(userId: string, reason?: string) { return this.request('POST', `/admin/users/${userId}/suspend`, { reason }); }
  async adminUnsuspendUser(userId: string) { return this.request('POST', `/admin/users/${userId}/unsuspend`); }
  async adminAdjustBalance(userId: string, amount: number, type: 'credit' | 'debit', reason: string) { return this.request('POST', `/admin/users/${userId}/adjust-balance`, { amount, type, reason }); }

  // KYC
  async adminGetPendingKYC() { return this.request<{ success: boolean; users: any[] }>('GET', '/admin/kyc/pending'); }
  async adminApproveKYC(userId: string) { return this.request('POST', `/admin/kyc/${userId}/approve`); }
  async adminRejectKYC(userId: string, reason?: string) { return this.request('POST', `/admin/kyc/${userId}/reject`, { reason }); }

  // Transaction approval
  async adminGetPendingTransactions(type?: string) {
    const qs = type ? `?type=${type}` : '';
    return this.request<{ success: boolean; transactions: any[] }>('GET', `/admin/transactions/pending${qs}`);
  }

  async adminApproveTransaction(txId: string, note?: string) { return this.request('POST', `/admin/transactions/${txId}/approve`, { note }); }
  async adminRejectTransaction(txId: string, note?: string) { return this.request('POST', `/admin/transactions/${txId}/reject`, { note }); }

  // Admin wallets
  async adminGetWallets() { return this.request<{ success: boolean; wallets: any[] }>('GET', '/admin/wallets'); }
  async adminCreateWallet(data: { label: string; address: string; network: string; currency: string; walletType?: string }) { return this.request('POST', '/admin/wallets', data); }
  async adminUpdateWallet(walletId: string, data: any) { return this.request('PUT', `/admin/wallets/${walletId}`, data); }
  async adminDeleteWallet(walletId: string) { return this.request('DELETE', `/admin/wallets/${walletId}`); }

  // Settings
  async adminGetSettings() { return this.request<{ success: boolean; settings: any }>('GET', '/admin/settings'); }
  async adminUpdateSettings(settings: Record<string, string>) { return this.request('PUT', '/admin/settings', { settings }); }

  // Audit logs
  async adminGetAuditLogs(params?: { action?: string; user_id?: string; limit?: number; offset?: number }) {
    const qs = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)); });
    return this.request<{ success: boolean; logs: any[] }>('GET', `/admin/audit-logs?${qs}`);
  }

  // Reports
  async adminGetReport(from?: string, to?: string) {
    const qs = new URLSearchParams();
    if (from) qs.set('from', from);
    if (to) qs.set('to', to);
    return this.request<{ success: boolean; report: any }>('GET', `/admin/reports/summary?${qs}`);
  }

  // Create admin
  async adminCreateAdmin(data: { email: string; password: string; fullName: string; role?: string }) {
    return this.request('POST', '/admin/create-admin', data);
  }

  // ── Legal & Compliance ────────────────────────────────
  async getLegalStatus() { return this.request<any>('GET', '/legal/status'); }
  async acceptLegal(type: string, version: string) { return this.request<any>('POST', '/legal/accept', { documentType: type, version }); }
  async acceptAllLegal() { return this.request<any>('POST', '/legal/accept-all'); }
  async getLegalDocument(type: string) { return this.request<any>('GET', `/legal/documents/${type}`); }
  async signInvestmentAgreement(data: { investmentId: string; projectName: string; amount: number; riskAcknowledged: boolean }) {
    return this.request<any>('POST', '/legal/investment-agreement', data);
  }
  async getLegalHistory() { return this.request<any>('GET', '/legal/history'); }

  // ── Withdrawal Addresses ──────────────────────────────
  async getWithdrawalAddresses() { return this.request<any>('GET', '/compliance/withdrawal-addresses'); }
  async addWithdrawalAddress(data: { label: string; address: string; network: string; currency: string }) {
    return this.request<any>('POST', '/compliance/withdrawal-addresses', data);
  }
  async deleteWithdrawalAddress(id: string) { return this.request<any>('DELETE', `/compliance/withdrawal-addresses/${id}`); }

  // ── Password Reset ────────────────────────────────────
  async requestPasswordReset(email: string) { return this.request<any>('POST', '/compliance/password-reset/request', { email }, { noAuth: true }); }
  async confirmPasswordReset(token: string, newPassword: string) { return this.request<any>('POST', '/compliance/password-reset/confirm', { token, newPassword }, { noAuth: true }); }
}

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const api = new ApiClient();
export default api;

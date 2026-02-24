// ═══════════════════════════════════════════════════════════════════
//  Admin API Client — Extends base client for admin endpoints
// ═══════════════════════════════════════════════════════════════════
import { api, ApiError } from './client';

class AdminApiClient {
  // ── Generic HTTP methods (for flexibility) ────────────────
  async get(path: string) {
    return api.request<any>('GET', path);
  }
  async post(path: string, data?: any) {
    return api.request<any>('POST', path, data);
  }
  async put(path: string, data?: any) {
    return api.request<any>('PUT', path, data);
  }
  async delete(path: string) {
    return api.request<any>('DELETE', path);
  }

  // ── Dashboard ─────────────────────────────────────────────
  async getDashboard() {
    return api.request<any>('GET', '/admin/dashboard');
  }

  // ── Users ─────────────────────────────────────────────────
  async getUsers(params?: { search?: string; role?: string; kyc_status?: string; suspended?: string; limit?: number; offset?: number }) {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.role) qs.set('role', params.role);
    if (params?.kyc_status) qs.set('kyc_status', params.kyc_status);
    if (params?.suspended) qs.set('suspended', params.suspended);
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.offset) qs.set('offset', String(params.offset));
    const q = qs.toString() ? `?${qs}` : '';
    return api.request<any>('GET', `/admin/users${q}`);
  }

  async getUser(userId: string) {
    return api.request<any>('GET', `/admin/users/${userId}`);
  }

  async suspendUser(userId: string, reason: string) {
    return api.request<any>('POST', `/admin/users/${userId}/suspend`, { reason });
  }

  async unsuspendUser(userId: string) {
    return api.request<any>('POST', `/admin/users/${userId}/unsuspend`);
  }

  async adjustBalance(userId: string, amount: number, type: 'credit' | 'debit', reason: string) {
    return api.request<any>('POST', `/admin/users/${userId}/adjust-balance`, { amount, type, reason });
  }

  // ── KYC ───────────────────────────────────────────────────
  async getPendingKYC() {
    return api.request<any>('GET', '/admin/kyc/pending');
  }

  async approveKYC(userId: string) {
    return api.request<any>('POST', `/admin/kyc/${userId}/approve`);
  }

  async rejectKYC(userId: string, reason: string) {
    return api.request<any>('POST', `/admin/kyc/${userId}/reject`, { reason });
  }

  // ── Transactions ──────────────────────────────────────────
  async getPendingTransactions(type?: string) {
    const q = type ? `?type=${type}` : '';
    return api.request<any>('GET', `/admin/transactions/pending${q}`);
  }

  async approveTransaction(txId: string, note?: string) {
    return api.request<any>('POST', `/admin/transactions/${txId}/approve`, { note });
  }

  async rejectTransaction(txId: string, note?: string) {
    return api.request<any>('POST', `/admin/transactions/${txId}/reject`, { note });
  }

  // ── Admin Wallets ─────────────────────────────────────────
  async getAdminWallets() {
    return api.request<any>('GET', '/admin/wallets');
  }

  async createAdminWallet(data: { label: string; address: string; network: string; currency: string; walletType?: string }) {
    return api.request<any>('POST', '/admin/wallets', data);
  }

  async updateAdminWallet(walletId: string, data: any) {
    return api.request<any>('PUT', `/admin/wallets/${walletId}`, data);
  }

  async deleteAdminWallet(walletId: string) {
    return api.request<any>('DELETE', `/admin/wallets/${walletId}`);
  }

  // ── Settings ──────────────────────────────────────────────
  async getSettings() {
    return api.request<any>('GET', '/admin/settings');
  }

  async updateSettings(settings: Record<string, string>) {
    return api.request<any>('PUT', '/admin/settings', { settings });
  }

  // ── Audit Logs ────────────────────────────────────────────
  async getAuditLogs(params?: { action?: string; user_id?: string; limit?: number; offset?: number }) {
    const qs = new URLSearchParams();
    if (params?.action) qs.set('action', params.action);
    if (params?.user_id) qs.set('user_id', params.user_id);
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.offset) qs.set('offset', String(params.offset));
    const q = qs.toString() ? `?${qs}` : '';
    return api.request<any>('GET', `/admin/audit-logs${q}`);
  }

  // ── Reports ───────────────────────────────────────────────
  async getReport(from?: string, to?: string) {
    const qs = new URLSearchParams();
    if (from) qs.set('from', from);
    if (to) qs.set('to', to);
    const q = qs.toString() ? `?${qs}` : '';
    return api.request<any>('GET', `/admin/reports/summary${q}`);
  }

  // ── Admin Management ──────────────────────────────────────
  async createAdmin(data: { email: string; password: string; fullName: string; role?: string }) {
    return api.request<any>('POST', '/admin/create-admin', data);
  }

  // ── Projects ──────────────────────────────────────────────
  async getProjects() {
    return api.request<any>('GET', '/admin/projects');
  }

  // ── Support ───────────────────────────────────────────────
  async getSupportTickets() {
    return api.request<any>('GET', '/admin/support/tickets');
  }

  // ── Yield Payouts ─────────────────────────────────────────
  async triggerYieldPayouts() {
    return api.request<any>('POST', '/admin/yield-payouts/trigger');
  }

  async getYieldPayouts() {
    return api.request<any>('GET', '/admin/yield-payouts');
  }

  // ── Compliance ────────────────────────────────────────────
  async getComplianceFlags(status?: string) {
    return api.request<any>('GET', `/compliance/admin/flags${status ? `?status=${status}` : ''}`);
  }

  async updateComplianceFlag(id: string, status: string, note?: string) {
    return api.request<any>('PUT', `/compliance/admin/flags/${id}`, { status, resolutionNote: note });
  }

  async runAMLScan() {
    return api.request<any>('POST', '/compliance/admin/aml-scan');
  }

  async getUserRiskProfile(userId: string) {
    return api.request<any>('GET', `/compliance/admin/user-risk/${userId}`);
  }

  // ── Project-Wallet Mappings ───────────────────────────────
  async getProjectWalletMappings() {
    return api.request<any>('GET', '/compliance/admin/project-wallets');
  }

  async createProjectWalletMapping(data: { projectId: string; adminWalletId: string; allocationPercent?: number }) {
    return api.request<any>('POST', '/compliance/admin/project-wallets', data);
  }

  async deleteProjectWalletMapping(id: string) {
    return api.request<any>('DELETE', `/compliance/admin/project-wallets/${id}`);
  }
}

export const adminApi = new AdminApiClient();
export const adminClient = adminApi; // alias for flexibility
export default adminApi;

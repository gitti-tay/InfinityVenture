import { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from './admin-layout';
import adminApi from '../../api/adminClient';

export function AdminUsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ role: '', kyc_status: '', suspended: '' });
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [adjustModal, setAdjustModal] = useState<{ userId: string; name: string } | null>(null);
  const [adjustForm, setAdjustForm] = useState({ amount: '', type: 'credit' as 'credit' | 'debit', reason: '' });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ search, ...filter, limit: 100 });
      setUsers(res.users || []);
      setTotal(res.total || 0);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [search, filter]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleSuspend = async (userId: string, name: string) => {
    const reason = prompt(`Reason for suspending ${name}:`);
    if (!reason) return;
    await adminApi.suspendUser(userId, reason);
    loadUsers();
  };

  const handleUnsuspend = async (userId: string) => {
    if (!confirm('Unsuspend this user?')) return;
    await adminApi.unsuspendUser(userId);
    loadUsers();
  };

  const handleAdjustBalance = async () => {
    if (!adjustModal || !adjustForm.amount || !adjustForm.reason) return;
    await adminApi.adjustBalance(adjustModal.userId, parseFloat(adjustForm.amount), adjustForm.type, adjustForm.reason);
    setAdjustModal(null);
    setAdjustForm({ amount: '', type: 'credit', reason: '' });
    loadUsers();
  };

  const viewUser = async (userId: string) => {
    const res = await adminApi.getUser(userId);
    setSelectedUser(res);
  };

  return (
    <AdminLayout>
      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by email, name, phone..."
          className="flex-1 min-w-[200px] px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <select value={filter.kyc_status} onChange={e => setFilter(f => ({ ...f, kyc_status: e.target.value }))}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white">
          <option value="">All KYC</option>
          <option value="none">None</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={filter.suspended} onChange={e => setFilter(f => ({ ...f, suspended: e.target.value }))}
          className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white">
          <option value="">All Status</option>
          <option value="false">Active</option>
          <option value="true">Suspended</option>
        </select>
      </div>

      <p className="text-slate-500 text-xs mb-3">{total} users found</p>

      {/* Users Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 border-b border-slate-800 text-xs uppercase">
              <th className="text-left py-3 px-4">User</th>
              <th className="text-left py-3 px-2">KYC</th>
              <th className="text-right py-3 px-2">Balance</th>
              <th className="text-right py-3 px-2">Deposited</th>
              <th className="text-center py-3 px-2">Investments</th>
              <th className="text-left py-3 px-2">Joined</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-slate-500">Loading...</td></tr>
            ) : users.map(u => (
              <tr key={u.id} className={`border-b border-slate-800/50 ${u.isSuspended ? 'opacity-50' : ''}`}>
                <td className="py-3 px-4">
                  <p className="text-white font-medium text-xs">{u.fullName}</p>
                  <p className="text-slate-500 text-xs">{u.email}</p>
                </td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    u.kycStatus === 'verified' ? 'bg-emerald-600/20 text-emerald-400' :
                    u.kycStatus === 'pending' ? 'bg-amber-600/20 text-amber-400' :
                    u.kycStatus === 'rejected' ? 'bg-red-600/20 text-red-400' :
                    'bg-slate-600/20 text-slate-400'
                  }`}>{u.kycStatus}</span>
                </td>
                <td className="py-3 px-2 text-right font-mono text-slate-300">${(u.walletBalance || 0).toLocaleString()}</td>
                <td className="py-3 px-2 text-right font-mono text-slate-300">${(u.totalDeposited || 0).toLocaleString()}</td>
                <td className="py-3 px-2 text-center text-slate-300">{u.activeInvestments || 0}</td>
                <td className="py-3 px-2 text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => viewUser(u.id)} className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs hover:bg-blue-600/30">View</button>
                    <button onClick={() => setAdjustModal({ userId: u.id, name: u.fullName })} className="px-2 py-1 bg-emerald-600/20 text-emerald-400 rounded text-xs hover:bg-emerald-600/30">$</button>
                    {u.isSuspended ? (
                      <button onClick={() => handleUnsuspend(u.id)} className="px-2 py-1 bg-amber-600/20 text-amber-400 rounded text-xs">Unsuspend</button>
                    ) : (
                      <button onClick={() => handleSuspend(u.id, u.fullName)} className="px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs">Suspend</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold">User Detail</h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white text-xl">&times;</button>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ['Name', selectedUser.user?.fullName],
                ['Email', selectedUser.user?.email],
                ['Phone', selectedUser.user?.phone || '—'],
                ['Role', selectedUser.user?.role],
                ['KYC', selectedUser.user?.kycStatus],
                ['Balance', `$${(selectedUser.user?.walletBalance || 0).toLocaleString()}`],
                ['Wallet', selectedUser.user?.walletAddress || '—'],
                ['Joined', new Date(selectedUser.user?.createdAt).toLocaleString()],
                ['Last Login', selectedUser.user?.lastLoginAt ? new Date(selectedUser.user.lastLoginAt).toLocaleString() : '—'],
              ].map(([k, v]) => (
                <div key={k as string} className="flex justify-between">
                  <span className="text-slate-500">{k}</span>
                  <span className="text-white font-mono text-xs max-w-[200px] truncate">{v as string}</span>
                </div>
              ))}
            </div>
            <h4 className="text-white font-semibold mt-4 mb-2">Recent Transactions ({selectedUser.transactions?.length || 0})</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {(selectedUser.transactions || []).slice(0, 10).map((tx: any) => (
                <div key={tx.id} className="flex justify-between text-xs py-1 border-b border-slate-800/50">
                  <span className={tx.type === 'deposit' ? 'text-emerald-400' : tx.type === 'withdraw' ? 'text-red-400' : 'text-blue-400'}>{tx.type}</span>
                  <span className="text-white font-mono">${tx.amount?.toLocaleString()}</span>
                  <span className={tx.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}>{tx.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Balance Adjust Modal */}
      {adjustModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setAdjustModal(null)}>
          <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold mb-4">Adjust Balance — {adjustModal.name}</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <button onClick={() => setAdjustForm(f => ({ ...f, type: 'credit' }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium ${adjustForm.type === 'credit' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>+ Credit</button>
                <button onClick={() => setAdjustForm(f => ({ ...f, type: 'debit' }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium ${adjustForm.type === 'debit' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'}`}>− Debit</button>
              </div>
              <input type="number" placeholder="Amount" value={adjustForm.amount} onChange={e => setAdjustForm(f => ({ ...f, amount: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm" />
              <input placeholder="Reason" value={adjustForm.reason} onChange={e => setAdjustForm(f => ({ ...f, reason: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm" />
              <button onClick={handleAdjustBalance} disabled={!adjustForm.amount || !adjustForm.reason}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  Admin Dashboard — Complete Admin Panel
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import api from '../api/client';

// ─── Tab Components ──────────────────────────────────────────────
function OverviewTab({ dashboard }: { dashboard: any }) {
  if (!dashboard) return <div className="p-6 text-center text-slate-400">Loading...</div>;
  const { users, finance } = dashboard;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.total, color: 'bg-blue-500' },
          { label: 'New Today', value: users.newToday, color: 'bg-green-500' },
          { label: 'Pending KYC', value: users.pendingKYC, color: 'bg-amber-500' },
          { label: 'Suspended', value: users.suspended, color: 'bg-red-500' },
          { label: 'Total Deposits', value: `$${(finance.totalDeposits || 0).toLocaleString()}`, color: 'bg-emerald-500' },
          { label: 'Total Withdrawals', value: `$${(finance.totalWithdrawals || 0).toLocaleString()}`, color: 'bg-orange-500' },
          { label: 'Total Invested', value: `$${(finance.totalInvested || 0).toLocaleString()}`, color: 'bg-indigo-500' },
          { label: 'Net Inflow', value: `$${(finance.netInflow || 0).toLocaleString()}`, color: 'bg-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <div className={`w-2 h-2 rounded-full ${stat.color} mb-2`} />
            <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pending Actions */}
      {(finance.pendingDeposits?.count > 0 || finance.pendingWithdrawals?.count > 0) && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-2">⚠️ Pending Actions</h3>
          {finance.pendingDeposits?.count > 0 && (
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {finance.pendingDeposits.count} deposit(s) pending — ${finance.pendingDeposits.amount.toLocaleString()}
            </p>
          )}
          {finance.pendingWithdrawals?.count > 0 && (
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {finance.pendingWithdrawals.count} withdrawal(s) pending — ${finance.pendingWithdrawals.amount.toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Fees Earned */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
        <p className="text-sm text-emerald-700 dark:text-emerald-300">
          Total Fees Earned: <span className="font-bold">${(finance.totalFees || 0).toLocaleString()}</span>
        </p>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-3">Recent Transactions</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {(dashboard.recentTransactions || []).slice(0, 15).map((tx: any) => (
            <div key={tx.id} className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm">
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mr-2 ${
                  tx.type === 'deposit' ? 'bg-green-100 text-green-700' :
                  tx.type === 'withdraw' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>{tx.type}</span>
                <span className="text-slate-600 dark:text-slate-400">{tx.userEmail}</span>
              </div>
              <div className="text-right">
                <span className="font-bold">${tx.amount?.toLocaleString()}</span>
                <span className={`ml-2 text-xs ${tx.status === 'completed' ? 'text-green-600' : tx.status === 'pending' || tx.status === 'requires_approval' ? 'text-amber-600' : 'text-red-600'}`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotification();

  const loadUsers = useCallback(async (s?: string) => {
    setLoading(true);
    try {
      const res = await api.adminGetUsers({ search: s || search, limit: 100 });
      setUsers(res.users);
    } catch { error('Failed to load users'); }
    setLoading(false);
  }, [search]);

  useEffect(() => { loadUsers(); }, []);

  const handleSuspend = async (userId: string) => {
    if (!confirm('Suspend this user?')) return;
    try { await api.adminSuspendUser(userId, 'Admin action'); success('User suspended'); loadUsers(); } catch { error('Failed'); }
  };

  const handleUnsuspend = async (userId: string) => {
    try { await api.adminUnsuspendUser(userId); success('User unsuspended'); loadUsers(); } catch { error('Failed'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input type="text" placeholder="Search by email or name..." value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm"
          onKeyDown={e => e.key === 'Enter' && loadUsers(search)} />
        <button onClick={() => loadUsers(search)} className="px-4 py-2 bg-[#1132d4] text-white rounded-lg text-sm font-medium">Search</button>
      </div>

      {loading ? <p className="text-center text-slate-400 py-8">Loading...</p> : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {users.map(u => (
            <div key={u.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{u.fullName}</p>
                  <p className="text-xs text-slate-500">{u.email} · {u.role}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${u.kycStatus === 'verified' ? 'bg-green-100 text-green-700' : u.kycStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>KYC: {u.kycStatus}</span>
                    {u.isSuspended && <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">SUSPENDED</span>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">${(u.walletBalance || 0).toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{u.activeInvestments} investments</p>
                  <div className="flex gap-1 mt-2">
                    {u.role === 'user' && !u.isSuspended && (
                      <button onClick={() => handleSuspend(u.id)} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Suspend</button>
                    )}
                    {u.isSuspended && (
                      <button onClick={() => handleUnsuspend(u.id)} className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Unsuspend</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TransactionsTab() {
  const [txs, setTxs] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotification();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const type = filter === 'deposits' ? 'deposit' : filter === 'withdrawals' ? 'withdraw' : undefined;
      const res = await api.adminGetPendingTransactions(type);
      setTxs(res.transactions);
    } catch { error('Failed to load'); }
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const approve = async (txId: string) => {
    try { await api.adminApproveTransaction(txId); success('Approved'); load(); } catch (e: any) { error(e.message); }
  };
  const reject = async (txId: string) => {
    const note = prompt('Rejection reason (optional):');
    try { await api.adminRejectTransaction(txId, note || undefined); success('Rejected'); load(); } catch (e: any) { error(e.message); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['all', 'deposits', 'withdrawals'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === f ? 'bg-[#1132d4] text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <p className="text-center text-slate-400 py-8">Loading...</p> :
        txs.length === 0 ? <p className="text-center text-slate-400 py-8">No pending transactions</p> : (
        <div className="space-y-2">
          {txs.map(tx => (
            <div key={tx.id} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mr-2 ${tx.type === 'deposit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{tx.type.toUpperCase()}</span>
                  <span className="text-sm font-bold">${tx.amount?.toLocaleString()}</span>
                  {tx.fee > 0 && <span className="text-xs text-slate-500 ml-1">(fee: ${tx.fee})</span>}
                  <p className="text-xs text-slate-500 mt-1">{tx.userEmail} · {tx.method}</p>
                  {tx.txHash && <p className="text-xs text-blue-500 mt-0.5 truncate max-w-xs">TxHash: {tx.txHash}</p>}
                  <p className="text-xs text-slate-400 mt-0.5">KYC: {tx.userKycStatus}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approve(tx.id)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold">✓ Approve</button>
                  <button onClick={() => reject(tx.id)} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold">✗ Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WalletsTab() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: '', address: '', network: 'TRC20', currency: 'USDT', walletType: 'deposit' });
  const { success, error } = useNotification();

  const load = async () => {
    try { const res = await api.adminGetWallets(); setWallets(res.wallets); } catch { error('Failed to load wallets'); }
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.label || !form.address) { error('Fill all fields'); return; }
    try { await api.adminCreateWallet(form); success('Wallet created'); setShowForm(false); setForm({ label: '', address: '', network: 'TRC20', currency: 'USDT', walletType: 'deposit' }); load(); }
    catch (e: any) { error(e.message); }
  };

  const toggle = async (id: string, isActive: boolean) => {
    try { await api.adminUpdateWallet(id, { isActive: !isActive }); load(); } catch { error('Failed'); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this wallet?')) return;
    try { await api.adminDeleteWallet(id); success('Deleted'); load(); } catch { error('Failed'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900 dark:text-white">Admin Wallets (Fund Receiving)</h3>
        <button onClick={() => setShowForm(!showForm)} className="px-3 py-1.5 bg-[#1132d4] text-white rounded-lg text-sm font-medium">+ Add Wallet</button>
      </div>

      {showForm && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3 border border-slate-200 dark:border-slate-700">
          <input placeholder="Label (e.g., USDT Deposit Wallet)" value={form.label} onChange={e => setForm({...form, label: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm" />
          <input placeholder="Wallet Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-mono" />
          <div className="grid grid-cols-3 gap-2">
            <select value={form.network} onChange={e => setForm({...form, network: e.target.value})} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm">
              <option>TRC20</option><option>ERC20</option><option>BEP20</option><option>Ethereum</option><option>Bitcoin</option><option>Solana</option>
            </select>
            <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm">
              <option>USDT</option><option>USDC</option><option>ETH</option><option>BTC</option><option>SOL</option>
            </select>
            <select value={form.walletType} onChange={e => setForm({...form, walletType: e.target.value})} className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm">
              <option value="deposit">Deposit</option><option value="treasury">Treasury</option><option value="fee">Fee</option>
            </select>
          </div>
          <button onClick={create} className="w-full py-2 bg-[#1132d4] text-white rounded-lg text-sm font-bold">Create Wallet</button>
        </div>
      )}

      <div className="space-y-2">
        {wallets.map(w => (
          <div key={w.id} className={`rounded-lg p-4 border ${w.is_active ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700' : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 opacity-60'}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{w.label}</p>
                <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mt-1 break-all">{w.address}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">{w.network}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">{w.currency}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">{w.wallet_type}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Total Received: ${(w.total_received || 0).toLocaleString()}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => toggle(w.id, w.is_active)} className={`text-xs px-2 py-1 rounded ${w.is_active ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                  {w.is_active ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => remove(w.id)} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotification();

  useEffect(() => {
    api.adminGetSettings().then(res => { setSettings(res.settings); setLoading(false); }).catch(() => { error('Failed to load settings'); setLoading(false); });
  }, []);

  const save = async () => {
    try { await api.adminUpdateSettings(edits); success('Settings saved'); setEdits({}); } catch (e: any) { error(e.message); }
  };

  if (loading) return <p className="text-center text-slate-400 py-8">Loading...</p>;

  const groups: Record<string, string[]> = {
    'Deposit & Withdrawal': ['deposit_min', 'deposit_max', 'withdraw_min', 'withdraw_max', 'withdraw_daily_limit'],
    'Fees': ['deposit_fee_percent', 'withdraw_fee_percent', 'withdraw_fee_flat'],
    'Approval': ['auto_approve_deposits', 'auto_approve_withdrawals', 'require_kyc_for_invest', 'require_kyc_for_withdraw'],
    'Security': ['max_login_attempts', 'lockout_duration_minutes', 'maintenance_mode', 'signup_enabled'],
    'General': ['platform_name', 'support_email'],
  };

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([group, keys]) => (
        <div key={group}>
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">{group}</h3>
          <div className="space-y-2">
            {keys.map(key => {
              const s = settings[key];
              if (!s) return null;
              const currentValue = edits[key] !== undefined ? edits[key] : s.value;
              const isBool = s.value === 'true' || s.value === 'false';

              return (
                <div key={key} className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{key.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-slate-500">{s.description}</p>
                  </div>
                  {isBool ? (
                    <button onClick={() => setEdits({ ...edits, [key]: currentValue === 'true' ? 'false' : 'true' })}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${currentValue === 'true' ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-700'}`}>
                      {currentValue === 'true' ? 'ON' : 'OFF'}
                    </button>
                  ) : (
                    <input value={currentValue} onChange={e => setEdits({ ...edits, [key]: e.target.value })}
                      className="w-32 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-right" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {Object.keys(edits).length > 0 && (
        <button onClick={save} className="w-full py-3 bg-[#1132d4] text-white rounded-xl font-bold">Save Changes ({Object.keys(edits).length})</button>
      )}
    </div>
  );
}

// ─── Main Admin Dashboard ────────────────────────────────────────
export function AdminDashboardScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { error: showError } = useNotification();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    if (!user || !['admin', 'superadmin'].includes(user.role)) {
      navigate('/home');
      return;
    }
    api.adminDashboard().then(res => setDashboard(res.dashboard)).catch(err => showError(err.message));
  }, [user]);

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'users', label: '👥 Users' },
    { id: 'transactions', label: '💰 Approvals' },
    { id: 'wallets', label: '🏦 Wallets' },
    { id: 'settings', label: '⚙️ Settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-[#0a1628] text-white px-4 py-4 sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-5xl mx-auto">
          <div>
            <h1 className="text-lg font-bold">Admin Dashboard</h1>
            <p className="text-xs text-slate-400">{user?.email} · {user?.role}</p>
          </div>
          <button onClick={() => navigate('/home')} className="text-xs px-3 py-1.5 bg-white/10 rounded-lg">← Back to App</button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-[72px] z-40 overflow-x-auto">
        <div className="flex max-w-5xl mx-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-[#1132d4] text-[#1132d4]'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-4 pb-20">
        {activeTab === 'overview' && <OverviewTab dashboard={dashboard} />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'transactions' && <TransactionsTab />}
        {activeTab === 'wallets' && <WalletsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}

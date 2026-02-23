import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AdminLayout } from './admin-layout';
import adminApi from '../../api/adminClient';

export function AdminDashboardScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    adminApi.getDashboard().then(res => { setData(res.dashboard); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div></AdminLayout>;

  const d = data;
  const stats = [
    { label: 'Total Users', value: d?.users?.total || 0, color: 'blue', onClick: () => navigate('/admin/users') },
    { label: 'Pending KYC', value: d?.users?.pendingKYC || 0, color: 'amber', onClick: () => navigate('/admin/kyc') },
    { label: 'Total Deposits', value: `$${(d?.finance?.totalDeposits || 0).toLocaleString()}`, color: 'emerald' },
    { label: 'Total Invested', value: `$${(d?.finance?.totalInvested || 0).toLocaleString()}`, color: 'purple' },
    { label: 'Pending Deposits', value: d?.finance?.pendingDeposits?.count || 0, color: 'orange', onClick: () => navigate('/admin/transactions') },
    { label: 'Pending Withdrawals', value: d?.finance?.pendingWithdrawals?.count || 0, color: 'red', onClick: () => navigate('/admin/transactions') },
    { label: 'Total Fees Earned', value: `$${(d?.finance?.totalFees || 0).toLocaleString()}`, color: 'teal' },
    { label: 'Net Inflow', value: `$${(d?.finance?.netInflow || 0).toLocaleString()}`, color: 'indigo' },
  ];

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
    amber: 'bg-amber-600/20 text-amber-400 border-amber-600/30',
    emerald: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30',
    purple: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
    orange: 'bg-orange-600/20 text-orange-400 border-orange-600/30',
    red: 'bg-red-600/20 text-red-400 border-red-600/30',
    teal: 'bg-teal-600/20 text-teal-400 border-teal-600/30',
    indigo: 'bg-indigo-600/20 text-indigo-400 border-indigo-600/30',
  };

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => (
          <div
            key={i}
            onClick={s.onClick}
            className={`p-4 rounded-xl border ${colorMap[s.color]} ${s.onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
          >
            <p className="text-xs opacity-70 mb-1">{s.label}</p>
            <p className="text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <h3 className="text-white font-semibold mb-4">⏳ Pending Approvals</h3>
          {(!d?.finance?.pendingDeposits?.count && !d?.finance?.pendingWithdrawals?.count) ? (
            <p className="text-slate-500 text-sm">No pending approvals</p>
          ) : (
            <div className="space-y-3">
              {d?.finance?.pendingDeposits?.count > 0 && (
                <button onClick={() => navigate('/admin/transactions')} className="w-full flex justify-between items-center p-3 bg-orange-600/10 border border-orange-600/20 rounded-lg text-sm">
                  <span className="text-orange-400">📥 {d.finance.pendingDeposits.count} Deposit(s)</span>
                  <span className="text-orange-300 font-bold">${d.finance.pendingDeposits.amount.toLocaleString()}</span>
                </button>
              )}
              {d?.finance?.pendingWithdrawals?.count > 0 && (
                <button onClick={() => navigate('/admin/transactions')} className="w-full flex justify-between items-center p-3 bg-red-600/10 border border-red-600/20 rounded-lg text-sm">
                  <span className="text-red-400">📤 {d.finance.pendingWithdrawals.count} Withdrawal(s)</span>
                  <span className="text-red-300 font-bold">${d.finance.pendingWithdrawals.amount.toLocaleString()}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* User Overview */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <h3 className="text-white font-semibold mb-4">👥 Users</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-400">New Today</span><span className="text-white font-medium">{d?.users?.newToday || 0}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">New This Week</span><span className="text-white font-medium">{d?.users?.newWeek || 0}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">KYC Verified</span><span className="text-emerald-400 font-medium">{d?.users?.verified || 0}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Suspended</span><span className="text-red-400 font-medium">{d?.users?.suspended || 0}</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Active Investments</span><span className="text-blue-400 font-medium">{d?.finance?.activeInvestments || 0}</span></div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 mt-6">
        <h3 className="text-white font-semibold mb-4">📜 Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800">
                <th className="text-left py-2 px-2">User</th>
                <th className="text-left py-2 px-2">Type</th>
                <th className="text-right py-2 px-2">Amount</th>
                <th className="text-left py-2 px-2">Status</th>
                <th className="text-left py-2 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {(d?.recentTransactions || []).slice(0, 10).map((tx: any) => (
                <tr key={tx.id} className="border-b border-slate-800/50 text-slate-300">
                  <td className="py-2 px-2 truncate max-w-[120px]">{tx.userEmail}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      tx.type === 'deposit' ? 'bg-emerald-600/20 text-emerald-400' :
                      tx.type === 'withdraw' ? 'bg-red-600/20 text-red-400' :
                      'bg-blue-600/20 text-blue-400'
                    }`}>{tx.type}</span>
                  </td>
                  <td className="py-2 px-2 text-right font-mono">${tx.amount?.toLocaleString()}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      tx.status === 'completed' ? 'bg-emerald-600/20 text-emerald-400' :
                      tx.status === 'requires_approval' ? 'bg-amber-600/20 text-amber-400' :
                      tx.status === 'cancelled' ? 'bg-red-600/20 text-red-400' :
                      'bg-slate-600/20 text-slate-400'
                    }`}>{tx.status}</span>
                  </td>
                  <td className="py-2 px-2 text-slate-500 text-xs">{new Date(tx.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!d?.recentTransactions?.length) && <p className="text-center text-slate-500 py-4">No transactions yet</p>}
        </div>
      </div>
    </AdminLayout>
  );
}

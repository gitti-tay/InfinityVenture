import { useState, useEffect } from 'react';
import { AdminLayout } from './admin-layout';
import adminApi from '../../api/adminClient';

export function AdminTransactionsScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getPendingTransactions(filter || undefined);
      setTransactions(res.transactions || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const handleApprove = async (txId: string) => {
    if (!confirm('Approve this transaction?')) return;
    setActionLoading(txId);
    try {
      await adminApi.approveTransaction(txId);
      await load();
    } catch (e: any) { alert(e.message); }
    setActionLoading(null);
  };

  const handleReject = async (txId: string) => {
    const note = prompt('Reason for rejection:');
    if (note === null) return;
    setActionLoading(txId);
    try {
      await adminApi.rejectTransaction(txId, note);
      await load();
    } catch (e: any) { alert(e.message); }
    setActionLoading(null);
  };

  return (
    <AdminLayout>
      <div className="flex gap-3 mb-4">
        {['', 'deposit', 'withdraw'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
            {f === '' ? 'All' : f === 'deposit' ? '📥 Deposits' : '📤 Withdrawals'}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl mb-2">✅</p>
            <p className="text-slate-400">No pending transactions</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {transactions.map(tx => (
              <div key={tx.id} className="p-4 flex flex-col lg:flex-row lg:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${tx.type === 'deposit' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-red-600/20 text-red-400'}`}>
                      {tx.type === 'deposit' ? '📥 DEPOSIT' : '📤 WITHDRAWAL'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${tx.userKycStatus === 'verified' ? 'bg-emerald-600/10 text-emerald-500' : 'bg-amber-600/10 text-amber-500'}`}>
                      KYC: {tx.userKycStatus}
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium">{tx.userName} <span className="text-slate-500">({tx.userEmail})</span></p>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-400">
                    <span>Method: <strong className="text-slate-300">{tx.method}</strong></span>
                    {tx.txHash && <span>TX: <strong className="text-slate-300 font-mono">{tx.txHash.slice(0, 16)}...</strong></span>}
                    {tx.toAddress && <span>To: <strong className="text-slate-300 font-mono">{tx.toAddress.slice(0, 20)}...</strong></span>}
                    <span>Date: {new Date(tx.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right mr-2">
                    <p className="text-white font-bold text-lg">${tx.amount?.toLocaleString()}</p>
                    {tx.fee > 0 && <p className="text-slate-500 text-xs">Fee: ${tx.fee?.toLocaleString()}</p>}
                  </div>
                  <button
                    onClick={() => handleApprove(tx.id)}
                    disabled={actionLoading === tx.id}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {actionLoading === tx.id ? '...' : '✓ Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(tx.id)}
                    disabled={actionLoading === tx.id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

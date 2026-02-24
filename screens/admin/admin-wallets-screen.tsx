import { useState, useEffect } from 'react';
import { AdminLayout } from './admin-layout';
import adminApi from '../../api/adminClient';

export function AdminWalletsScreen() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ label: '', address: '', network: 'TRC20', currency: 'USDT', walletType: 'deposit' });
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAdminWallets();
      setWallets(res.wallets || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.label || !form.address) return;
    await adminApi.createAdminWallet(form);
    setForm({ label: '', address: '', network: 'TRC20', currency: 'USDT', walletType: 'deposit' });
    setShowCreate(false);
    load();
  };

  const handleUpdate = async (id: string) => {
    await adminApi.updateAdminWallet(id, editForm);
    setEditId(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this wallet? This cannot be undone.')) return;
    await adminApi.deleteAdminWallet(id);
    load();
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    await adminApi.updateAdminWallet(id, { isActive: !isActive });
    load();
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-slate-400 text-sm">Manage company wallets that receive user deposits and investments</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          + Add Wallet
        </button>
      </div>

      {/* Wallets List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : wallets.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-2xl mb-2">🏦</p>
            <p className="text-slate-400">No admin wallets configured</p>
            <button onClick={() => setShowCreate(true)} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Add First Wallet</button>
          </div>
        ) : wallets.map(w => (
          <div key={w.id} className={`bg-slate-900 rounded-xl border ${w.is_active ? 'border-slate-800' : 'border-red-800/50 opacity-60'} p-4`}>
            {editId === w.id ? (
              <div className="space-y-2">
                <input value={editForm.label} onChange={e => setEditForm((f: any) => ({ ...f, label: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm" placeholder="Label" />
                <input value={editForm.address} onChange={e => setEditForm((f: any) => ({ ...f, address: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-mono" placeholder="Address" />
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(w.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs">Save</button>
                  <button onClick={() => setEditId(null)} className="px-3 py-1.5 bg-slate-700 text-white rounded text-xs">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-medium text-sm">{w.label}</p>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      w.wallet_type === 'deposit' ? 'bg-emerald-600/20 text-emerald-400' :
                      w.wallet_type === 'treasury' ? 'bg-purple-600/20 text-purple-400' :
                      w.wallet_type === 'fee' ? 'bg-amber-600/20 text-amber-400' :
                      'bg-blue-600/20 text-blue-400'
                    }`}>{w.wallet_type}</span>
                    <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300">{w.currency}</span>
                    <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300">{w.network}</span>
                  </div>
                  <p className="text-slate-400 text-xs font-mono truncate">{w.address}</p>
                  <p className="text-slate-500 text-xs mt-1">Total Received: <span className="text-emerald-400 font-medium">${(w.total_received || 0).toLocaleString()}</span></p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleToggle(w.id, !!w.is_active)}
                    className={`px-3 py-1.5 rounded text-xs ${w.is_active ? 'bg-emerald-600/20 text-emerald-400' : 'bg-red-600/20 text-red-400'}`}>
                    {w.is_active ? '● Active' : '○ Inactive'}
                  </button>
                  <button onClick={() => { setEditId(w.id); setEditForm({ label: w.label, address: w.address }); }}
                    className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded text-xs">Edit</button>
                  <button onClick={() => handleDelete(w.id)} className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded text-xs">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-bold mb-4">Add Admin Wallet</h3>
            <div className="space-y-3">
              <input placeholder="Label (e.g. USDT Deposit Wallet)" value={form.label}
                onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm" />
              <input placeholder="Wallet Address" value={form.address}
                onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm font-mono" />
              <div className="grid grid-cols-3 gap-2">
                <select value={form.network} onChange={e => setForm(f => ({ ...f, network: e.target.value }))}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm">
                  <option>TRC20</option><option>ERC20</option><option>BEP20</option><option>Ethereum</option><option>Bitcoin</option><option>Solana</option>
                </select>
                <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm">
                  <option>USDT</option><option>USDC</option><option>ETH</option><option>BTC</option><option>SOL</option>
                </select>
                <select value={form.walletType} onChange={e => setForm(f => ({ ...f, walletType: e.target.value }))}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm">
                  <option value="deposit">Deposit</option><option value="treasury">Treasury</option><option value="fee">Fee</option><option value="withdrawal">Withdrawal</option>
                </select>
              </div>
              <button onClick={handleCreate} disabled={!form.label || !form.address}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700">
                Create Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

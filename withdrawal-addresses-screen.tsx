import { useState, useEffect, useCallback } from 'react';
import { PageWrapper } from '@/app/components/page-wrapper';
import { useNavigate } from 'react-router';
import api from '@/app/api/client';

export function WithdrawalAddressesScreen() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ label: '', address: '', network: 'ethereum', currency: 'USDT' });

  const loadAddresses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getWithdrawalAddresses();
      setAddresses(res.addresses || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAddresses(); }, [loadAddresses]);

  const addAddress = async () => {
    setError('');
    if (!form.label.trim()) { setError('Please enter a label'); return; }
    if (!form.address.trim()) { setError('Please enter a wallet address'); return; }
    setSaving(true);
    try {
      await api.addWithdrawalAddress(form);
      setShowAdd(false);
      setForm({ label: '', address: '', network: 'ethereum', currency: 'USDT' });
      loadAddresses();
    } catch (e: any) {
      setError(e.message || 'Failed to add address');
    } finally { setSaving(false); }
  };

  const deleteAddress = async (id: string, label: string) => {
    if (!confirm(`Remove "${label}" from your whitelist?`)) return;
    try {
      await api.deleteWithdrawalAddress(id);
      loadAddresses();
    } catch (e: any) {
      alert(e.message || 'Failed to delete');
    }
  };

  const networkOptions = [
    { value: 'ethereum', label: 'Ethereum (ERC-20)' },
    { value: 'bsc', label: 'BNB Smart Chain (BEP-20)' },
    { value: 'tron', label: 'Tron (TRC-20)' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'arbitrum', label: 'Arbitrum' },
    { value: 'bitcoin', label: 'Bitcoin' },
  ];

  const currencyOptions = ['USDT', 'USDC', 'BTC', 'ETH', 'BNB'];

  return (
    <PageWrapper title="Withdrawal Addresses">
      <div className="min-h-screen bg-gray-50 dark:bg-[#101322]">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b px-5 py-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-lg font-bold flex-1">Withdrawal Addresses</h1>
          <button onClick={() => setShowAdd(true)}
            className="px-3 py-1.5 bg-[#1132d4] text-white rounded-lg text-sm font-medium">
            + Add
          </button>
        </header>

        <div className="p-5 max-w-lg mx-auto">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-lg">🔒</span>
              <div className="text-xs text-blue-800">
                <strong>Address Whitelisting</strong>
                <p className="mt-0.5">For your security, withdrawals can only be sent to pre-approved addresses.
                Add your trusted wallet addresses below.</p>
              </div>
            </div>
          </div>

          {/* Add Form */}
          {showAdd && (
            <div className="bg-white rounded-xl border shadow-sm p-5 mb-5">
              <h3 className="font-semibold text-sm mb-3">Add New Address</h3>
              {error && <div className="text-red-600 text-xs bg-red-50 p-2 rounded mb-3">{error}</div>}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Label</label>
                  <input type="text" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })}
                    placeholder="e.g. My Binance Wallet"
                    className="w-full px-3 py-2.5 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Network</label>
                  <select value={form.network} onChange={e => setForm({ ...form, network: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white">
                    {networkOptions.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Currency</label>
                  <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}
                    className="w-full px-3 py-2.5 border rounded-lg text-sm bg-white">
                    {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Wallet Address</label>
                  <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="0x... or T... or bc1..."
                    className="w-full px-3 py-2.5 border rounded-lg text-sm font-mono" />
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={addAddress} disabled={saving}
                    className="flex-1 py-2.5 bg-[#1132d4] text-white rounded-lg text-sm font-medium disabled:opacity-50">
                    {saving ? 'Saving...' : 'Add Address'}
                  </button>
                  <button onClick={() => { setShowAdd(false); setError(''); }}
                    className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm">Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* Address List */}
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-2">📭</div>
              <div className="text-gray-500 font-medium">No addresses yet</div>
              <div className="text-gray-400 text-sm mt-1">Add a withdrawal address to get started.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map(addr => (
                <div key={addr.id} className="bg-white rounded-xl border shadow-sm p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm">{addr.label}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded">{addr.network}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{addr.currency}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${addr.is_verified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                          {addr.is_verified ? '✓ Verified' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => deleteAddress(addr.id, addr.label)}
                      className="text-red-400 hover:text-red-600 p-1">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono text-gray-600 break-all">
                    {addr.address}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Added {new Date(addr.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import { useAuth } from '@/app/contexts/AuthContext';
import { useWallet } from '@/app/contexts/WalletContext';

const API_BASE = window.location.origin + '/api';

export function WalletScreen() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { wallet } = useWallet();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'activity'>('overview');

  useEffect(() => {
    if (!token) { setLoading(false); return; }

    Promise.all([
      fetch(API_BASE + '/wallet/balance', { headers: { Authorization: 'Bearer ' + token } })
        .then(r => r.ok ? r.json() : { balance: 0 }),
      fetch(API_BASE + '/transactions', { headers: { Authorization: 'Bearer ' + token } })
        .then(r => r.ok ? r.json() : { transactions: [] }),
    ])
      .then(([balData, txData]) => {
        setBalance(balData.balance || 0);
        setTransactions(txData.transactions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageWrapper>
    );
  }

  const recentTx = transactions.slice(0, 10);

  return (
    <PageWrapper>
      <div className="space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-icons text-3xl text-blue-600">account_balance_wallet</span>
            <div>
              <h1 className="text-2xl font-bold">Wallet</h1>
              <p className="text-sm text-gray-500">Manage your digital assets</p>
            </div>
          </div>
          <button onClick={() => navigate('/qr-scanner')} className="p-2 text-gray-500">
            <span className="material-icons">qr_code_scanner</span>
          </button>
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full w-fit">
          <span className="material-icons text-green-600 text-sm">verified_user</span>
          <span className="text-xs font-semibold text-green-700">Bank-Level Security</span>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-6 text-white">
          <p className="text-xs font-medium tracking-wider opacity-80">Total Balance</p>
          <h2 className="text-4xl font-bold mt-1">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <button onClick={() => navigate('/deposit')}
              className="flex flex-col items-center gap-1.5 py-3 bg-white/15 rounded-xl hover:bg-white/25 transition">
              <span className="material-icons text-xl">add_circle</span>
              <span className="text-xs font-medium">Deposit</span>
            </button>
            <button onClick={() => navigate('/withdraw')}
              className="flex flex-col items-center gap-1.5 py-3 bg-white/15 rounded-xl hover:bg-white/25 transition">
              <span className="material-icons text-xl">arrow_circle_up</span>
              <span className="text-xs font-medium">Withdraw</span>
            </button>
            <button onClick={() => navigate('/invest')}
              className="flex flex-col items-center gap-1.5 py-3 bg-white/15 rounded-xl hover:bg-white/25 transition">
              <span className="material-icons text-xl">swap_horiz</span>
              <span className="text-xs font-medium">Invest</span>
            </button>
          </div>
        </div>

        {/* Wallet Connection Status */}
        {!wallet ? (
          <button onClick={() => navigate('/connect-wallet')}
            className="w-full flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="material-icons text-amber-600">link_off</span>
              <div>
                <p className="font-semibold text-amber-900 text-sm">No Wallet Connected</p>
                <p className="text-xs text-amber-700">Connect a wallet to deposit crypto</p>
              </div>
            </div>
            <span className="material-icons text-amber-400">chevron_right</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
            <span className="material-icons text-green-600">check_circle</span>
            <div>
              <p className="font-semibold text-green-900 text-sm">Wallet Connected</p>
              <p className="text-xs text-green-700 font-mono">{wallet.address?.substring(0, 8)}...{wallet.address?.slice(-6)}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setTab('overview')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${tab === 'overview' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}
          >Overview</button>
          <button
            onClick={() => setTab('activity')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${tab === 'activity' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}
          >Activity</button>
        </div>

        {tab === 'overview' ? (
          <div className="space-y-4">
            {/* Balance Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Balance Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Available Balance</span>
                  <span className="font-bold">${balance.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Pending Deposits</span>
                  <span className="font-medium text-amber-600">
                    ${transactions.filter(t => t.type === 'deposit' && t.status === 'pending').reduce((s: number, t: any) => s + (t.amount || 0), 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Pending Withdrawals</span>
                  <span className="font-medium text-orange-600">
                    ${transactions.filter(t => t.type === 'withdraw' && t.status === 'pending').reduce((s: number, t: any) => s + (t.amount || 0), 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                  </span>
                </div>
              </div>
            </div>

            {/* Manage */}
            <div className="space-y-2">
              <button onClick={() => navigate('/withdrawal-addresses')}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-gray-400">bookmark</span>
                  <span className="text-sm font-medium">Withdrawal Addresses</span>
                </div>
                <span className="material-icons text-gray-300">chevron_right</span>
              </button>
              <button onClick={() => navigate('/transaction-history')}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="material-icons text-gray-400">history</span>
                  <span className="text-sm font-medium">Transaction History</span>
                </div>
                <span className="material-icons text-gray-300">chevron_right</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
            {recentTx.length > 0 ? (
              <div className="space-y-2">
                {recentTx.map((tx: any) => (
                  <div key={tx.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'deposit' ? 'bg-green-100' :
                      tx.type === 'withdraw' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      <span className={`material-icons text-lg ${
                        tx.type === 'deposit' ? 'text-green-600' :
                        tx.type === 'withdraw' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {tx.type === 'deposit' ? 'arrow_downward' : tx.type === 'withdraw' ? 'arrow_upward' : 'swap_horiz'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize">{tx.type}</p>
                      <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${tx.type === 'deposit' ? 'text-green-600' : tx.type === 'withdraw' ? 'text-red-600' : ''}`}>
                        {tx.type === 'deposit' ? '+' : '-'}${tx.amount?.toLocaleString()}
                      </p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                        tx.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <span className="material-icons text-5xl text-gray-300 mb-3">receipt_long</span>
                <p className="text-gray-500 font-medium">No transactions yet</p>
                <p className="text-gray-400 text-sm mt-1">Make your first deposit to get started</p>
                <button onClick={() => navigate('/deposit')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">
                  Deposit Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

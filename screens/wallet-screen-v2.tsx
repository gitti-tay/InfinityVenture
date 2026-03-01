import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { PageWrapper } from '@/app/components/page-wrapper';
import { useAuth } from '@/app/contexts/AuthContext';
import { useWallet } from '@/app/contexts/WalletContext';

const API_BASE = window.location.origin + '/api';

/* ── Types ──────────────────────────────────────────────────────── */
interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'investment';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

/* ── Sub-components (each < 30 lines) ───────────────────────────── */

function WalletHeader({ onScan }: { onScan: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="material-icons text-3xl text-blue-600 dark:text-blue-400">
          account_balance_wallet
        </span>
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Wallet</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your digital assets
          </p>
        </div>
      </div>
      <button onClick={onScan} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
        <span className="material-icons">qr_code_scanner</span>
      </button>
    </div>
  );
}

function SecurityBadge() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full w-fit">
      <span className="material-icons text-green-600 dark:text-green-400 text-sm">verified_user</span>
      <span className="text-xs font-semibold text-green-700 dark:text-green-300">Bank-Level Security</span>
    </div>
  );
}

function BalanceCard({
  balance,
  navigate,
}: {
  balance: number;
  navigate: (path: string) => void;
}) {
  const formatted = balance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const actions = [
    { label: 'Deposit', icon: 'add_circle', path: '/deposit' },
    { label: 'Withdraw', icon: 'arrow_circle_up', path: '/withdraw' },
    { label: 'Invest', icon: 'swap_horiz', path: '/invest' },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-xl">
      <p className="text-xs font-medium tracking-wider opacity-80">Total Balance</p>
      <h2 className="text-4xl font-bold mt-1">${formatted}</h2>
      <div className="grid grid-cols-3 gap-3 mt-6">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.path)}
            className="flex flex-col items-center gap-1.5 py-3 bg-white/15 rounded-xl hover:bg-white/25 transition"
          >
            <span className="material-icons text-xl">{a.icon}</span>
            <span className="text-xs font-medium">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function WalletConnectionCard({
  wallet,
  navigate,
}: {
  wallet: any;
  navigate: (path: string) => void;
}) {
  if (!wallet) {
    return (
      <button
        onClick={() => navigate('/connect-wallet')}
        className="w-full flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl"
      >
        <div className="flex items-center gap-3">
          <span className="material-icons text-amber-600 dark:text-amber-400">link_off</span>
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">No Wallet Connected</p>
            <p className="text-xs text-amber-700 dark:text-amber-400">Connect a wallet to deposit crypto</p>
          </div>
        </div>
        <span className="material-icons text-amber-400">chevron_right</span>
      </button>
    );
  }

  const addr = wallet.address || '';
  return (
    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl">
      <span className="material-icons text-green-600 dark:text-green-400">check_circle</span>
      <div>
        <p className="font-semibold text-green-900 dark:text-green-200 text-sm">Wallet Connected</p>
        <p className="text-xs text-green-700 dark:text-green-400 font-mono">
          {addr.substring(0, 8)}...{addr.slice(-6)}
        </p>
      </div>
    </div>
  );
}

function TabSwitcher({
  tab,
  setTab,
}: {
  tab: 'overview' | 'activity';
  setTab: (t: 'overview' | 'activity') => void;
}) {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
      {(['overview', 'activity'] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
            tab === t
              ? 'bg-white dark:bg-gray-700 text-blue-700 dark:text-blue-400 shadow-sm'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}

function OverviewTab({
  balance,
  transactions,
  navigate,
}: {
  balance: number;
  transactions: Transaction[];
  navigate: (path: string) => void;
}) {
  const fmt = (v: number) =>
    v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const pendingDeposits = transactions
    .filter((t) => t.type === 'deposit' && t.status === 'pending')
    .reduce((s, t) => s + (t.amount || 0), 0);

  const pendingWithdrawals = transactions
    .filter((t) => t.type === 'withdraw' && t.status === 'pending')
    .reduce((s, t) => s + (t.amount || 0), 0);

  const links = [
    { label: 'Withdrawal Addresses', icon: 'bookmark', path: '/withdrawal-addresses' },
    { label: 'Transaction History', icon: 'history', path: '/transaction-history' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Balance Summary</h3>
        <div className="space-y-3">
          <SummaryRow label="Available Balance" value={`$${fmt(balance)}`} />
          <SummaryRow label="Pending Deposits" value={`$${fmt(pendingDeposits)}`} valueClass="text-amber-600 dark:text-amber-400" />
          <SummaryRow label="Pending Withdrawals" value={`$${fmt(pendingWithdrawals)}`} valueClass="text-orange-600 dark:text-orange-400" />
        </div>
      </div>
      <div className="space-y-2">
        {links.map((l) => (
          <button
            key={l.path}
            onClick={() => navigate(l.path)}
            className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-750 transition"
          >
            <div className="flex items-center gap-3">
              <span className="material-icons text-gray-400 dark:text-gray-500">{l.icon}</span>
              <span className="text-sm font-medium dark:text-white">{l.label}</span>
            </div>
            <span className="material-icons text-gray-300 dark:text-gray-600">chevron_right</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueClass = 'font-bold dark:text-white',
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

function ActivityTab({
  transactions,
  navigate,
}: {
  transactions: Transaction[];
  navigate: (path: string) => void;
}) {
  const recentTx = transactions.slice(0, 10);

  if (recentTx.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl">
        <span className="material-icons text-5xl text-gray-300 dark:text-gray-600 mb-3">receipt_long</span>
        <p className="text-gray-500 dark:text-gray-400 font-medium">No transactions yet</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Make your first deposit to get started</p>
        <button
          onClick={() => navigate('/deposit')}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
        >
          Deposit Now
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Recent Activity</h3>
      <div className="space-y-2">
        {recentTx.map((tx) => (
          <TransactionRow key={tx.id} tx={tx} />
        ))}
      </div>
    </div>
  );
}

function TransactionRow({ tx }: { tx: Transaction }) {
  const colorMap = {
    deposit: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', icon: 'arrow_downward', sign: '+' },
    withdraw: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', icon: 'arrow_upward', sign: '-' },
    investment: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', icon: 'swap_horiz', sign: '-' },
  };

  const c = colorMap[tx.type] || colorMap.investment;
  const statusClass =
    tx.status === 'completed'
      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      : tx.status === 'pending'
        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';

  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${c.bg}`}>
        <span className={`material-icons text-lg ${c.text}`}>{c.icon}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium capitalize dark:text-white">{tx.type}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(tx.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${c.text}`}>
          {c.sign}${tx.amount?.toLocaleString()}
        </p>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusClass}`}>{tx.status}</span>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */

export function WalletScreen() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { wallet } = useWallet();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [tab, setTab] = useState<'overview' | 'activity'>('overview');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const headers = { Authorization: 'Bearer ' + token };

    Promise.all([
      fetch(API_BASE + '/wallet/balance', { headers }).then((r) =>
        r.ok ? r.json() : { balance: 0 },
      ),
      fetch(API_BASE + '/transactions', { headers }).then((r) =>
        r.ok ? r.json() : { transactions: [] },
      ),
    ])
      .then(([balData, txData]) => {
        setBalance(balData.balance || 0);
        setTransactions(txData.transactions || []);
        setFetchError(null);
      })
      .catch((err) => {
        console.error('[Wallet] fetch error:', err);
        setFetchError('Unable to load wallet data. Please try again.');
      })
      .finally(() => setLoading(false));
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

  return (
    <PageWrapper>
      <div className="space-y-6 pb-24">
        <WalletHeader onScan={() => navigate('/qr-scanner')} />
        <SecurityBadge />

        {fetchError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <span className="material-icons text-red-500 text-sm">error_outline</span>
            <p className="text-sm text-red-700 dark:text-red-400 flex-1">{fetchError}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs font-semibold text-red-600 dark:text-red-400 underline"
            >
              Retry
            </button>
          </div>
        )}

        <BalanceCard balance={balance} navigate={navigate} />
        <WalletConnectionCard wallet={wallet} navigate={navigate} />
        <TabSwitcher tab={tab} setTab={setTab} />

        {tab === 'overview' ? (
          <OverviewTab balance={balance} transactions={transactions} navigate={navigate} />
        ) : (
          <ActivityTab transactions={transactions} navigate={navigate} />
        )}
      </div>
    </PageWrapper>
  );
}

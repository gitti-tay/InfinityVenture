import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'processing' | 'failed';
  date: string;
  network?: string;
  txHash?: string;
  walletAddress?: string;
  fee?: number;
}

export function TransactionHistoryScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdraw'>('all');
  
  const transactions: Transaction[] = [
    {
      id: 'tx1',
      type: 'deposit',
      amount: 5000,
      currency: 'USDT',
      status: 'completed',
      date: '2026-02-04T14:30:00',
      network: 'Ethereum (ERC20)',
      txHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
      fee: 2.5
    },
    {
      id: 'tx2',
      type: 'withdraw',
      amount: 2500,
      currency: 'USDC',
      status: 'completed',
      date: '2026-02-03T10:15:00',
      network: 'Polygon',
      txHash: '0x3c2c2eb7b11a91385fade1c0d57a7af66ab4ead79f9fade1c0d57a7af66ab4ea',
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      fee: 0.5
    },
    {
      id: 'tx3',
      type: 'deposit',
      amount: 10000,
      currency: 'USDT',
      status: 'processing',
      date: '2026-02-05T09:20:00',
      network: 'Ethereum (ERC20)',
      txHash: '0x9fade1c0d57a7af66ab4ead7c2c2eb7b11a91385fade1c0d57a7af66ab4ead79f',
      fee: 3.0
    },
    {
      id: 'tx4',
      type: 'withdraw',
      amount: 1500,
      currency: 'USDT',
      status: 'pending',
      date: '2026-02-05T16:45:00',
      network: 'BSC (BEP20)',
      walletAddress: '0x8Bc9e7595f0bEb742d35Cc6634C0532925a3b844',
      fee: 0.2
    },
    {
      id: 'tx5',
      type: 'deposit',
      amount: 7500,
      currency: 'USDC',
      status: 'completed',
      date: '2026-02-01T11:30:00',
      network: 'Polygon',
      txHash: '0xeb7b11a91385fade1c0d57a7af66ab4ead79f9fade1c0d57a7af66ab4ead7c2c2',
      fee: 0.8
    },
    {
      id: 'tx6',
      type: 'withdraw',
      amount: 3000,
      currency: 'USDT',
      status: 'failed',
      date: '2026-01-30T15:20:00',
      network: 'Ethereum (ERC20)',
      walletAddress: '0x5f0bEb742d35Cc6634C0532925a3b8448Bc9e759',
      fee: 2.5
    },
  ];
  
  const filteredTransactions = transactions.filter(tx => 
    filter === 'all' ? true : tx.type === filter
  );
  
  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      case 'processing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    }
  };
  
  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'check_circle';
      case 'processing': return 'sync';
      case 'pending': return 'schedule';
      case 'failed': return 'error';
    }
  };
  
  const stats = {
    totalDeposits: transactions.filter(t => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    totalWithdrawals: transactions.filter(t => t.type === 'withdraw' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    pendingTransactions: transactions.filter(t => t.status === 'pending' || t.status === 'processing').length
  };
  
  return (
    <PageWrapper hideNav>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#101322]/90 backdrop-blur-xl px-5 py-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => navigate('/wallet')} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Transaction History</h1>
            <p className="text-xs text-slate-500">All deposits & withdrawals</p>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </header>
        
        {/* Stats Cards */}
        <div className="px-5 pt-6 pb-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white">
              <span className="material-symbols-outlined text-2xl mb-2 opacity-80">arrow_downward</span>
              <p className="text-xs opacity-80 mb-1">Deposits</p>
              <p className="text-lg font-bold">${stats.totalDeposits.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
              <span className="material-symbols-outlined text-2xl mb-2 opacity-80">arrow_upward</span>
              <p className="text-xs opacity-80 mb-1">Withdrawals</p>
              <p className="text-lg font-bold">${stats.totalWithdrawals.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white">
              <span className="material-symbols-outlined text-2xl mb-2 opacity-80">pending</span>
              <p className="text-xs opacity-80 mb-1">Pending</p>
              <p className="text-lg font-bold">{stats.pendingTransactions}</p>
            </div>
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="px-5 pb-4">
          <div className="flex gap-2 bg-slate-100 dark:bg-gray-800 p-1 rounded-xl">
            {[
              { id: 'all', label: 'All', icon: 'list' },
              { id: 'deposit', label: 'Deposits', icon: 'arrow_downward' },
              { id: 'withdraw', label: 'Withdrawals', icon: 'arrow_upward' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-sm transition-all ${
                  filter === tab.id
                    ? 'bg-white dark:bg-gray-700 text-[#1132d4] shadow-sm'
                    : 'text-slate-500 dark:text-gray-400'
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Transaction List */}
        <main className="flex-1 px-5 pb-6 overflow-y-auto">
          <div className="space-y-3">
            {filteredTransactions.map(tx => (
              <div 
                key={tx.id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Main Info */}
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      tx.type === 'deposit' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' 
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                    }`}>
                      <span className="material-symbols-outlined">
                        {tx.type === 'deposit' ? 'arrow_downward' : 'arrow_upward'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold capitalize">{tx.type}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {new Date(tx.date).toLocaleString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        tx.type === 'deposit' ? 'text-emerald-600' : 'text-blue-600'
                      }`}>
                        {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">{tx.currency}</p>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Network</span>
                      <span className="font-medium">{tx.network}</span>
                    </div>
                    {tx.fee && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Fee</span>
                        <span className="font-medium">${tx.fee}</span>
                      </div>
                    )}
                    {tx.walletAddress && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Address</span>
                        <span className="font-mono font-medium truncate ml-2 max-w-[140px]">
                          {tx.walletAddress}
                        </span>
                      </div>
                    )}
                    {tx.txHash && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Tx Hash</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-medium truncate max-w-[100px]">
                            {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
                          </span>
                          <button className="text-[#1132d4] hover:underline">
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Status Bar */}
                {tx.status !== 'completed' && tx.status !== 'failed' && (
                  <div className={`px-4 py-2 text-xs font-medium flex items-center gap-2 ${
                    tx.status === 'processing' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                  }`}>
                    <span className="material-symbols-outlined text-sm animate-spin">
                      {tx.status === 'processing' ? 'sync' : 'schedule'}
                    </span>
                    {tx.status === 'processing' 
                      ? 'Transaction is being processed...' 
                      : 'Waiting for confirmation...'}
                  </div>
                )}
                
                {tx.status === 'failed' && (
                  <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">error</span>
                      Transaction failed
                    </div>
                    <button className="text-[#1132d4] dark:text-blue-400 font-bold">Retry</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-4xl text-slate-400">receipt_long</span>
              </div>
              <h3 className="font-bold text-lg mb-2">No Transactions</h3>
              <p className="text-sm text-slate-500 mb-6">You haven't made any {filter} transactions yet</p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => navigate('/deposit')}
                  className="bg-[#1132d4] text-white px-6 py-3 rounded-xl font-bold"
                >
                  Make a Deposit
                </button>
                <button 
                  onClick={() => navigate('/withdraw')}
                  className="bg-slate-100 dark:bg-gray-800 px-6 py-3 rounded-xl font-bold"
                >
                  Withdraw
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </PageWrapper>
  );
}

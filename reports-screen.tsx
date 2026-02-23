import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

export function ReportsScreen() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const periods = [
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'Year' }
  ];
  
  const transactions = [
    { id: 1, type: 'deposit', amount: 5000, date: '2026-02-01', status: 'completed', method: 'USDT' },
    { id: 2, type: 'yield', amount: 124.50, date: '2026-01-28', status: 'completed', project: 'SCN' },
    { id: 3, type: 'investment', amount: -2500, date: '2026-01-25', status: 'completed', project: 'PTF' },
    { id: 4, type: 'yield', amount: 89.20, date: '2026-01-20', status: 'completed', project: 'MDD' },
    { id: 5, type: 'withdraw', amount: -1000, date: '2026-01-15', status: 'completed', method: 'Bank' },
    { id: 6, type: 'deposit', amount: 10000, date: '2026-01-10', status: 'completed', method: 'Card' },
    { id: 7, type: 'investment', amount: -5000, date: '2026-01-05', status: 'completed', project: 'SCN' }
  ];
  
  const stats = {
    totalDeposits: 15000,
    totalWithdrawals: 1000,
    totalYields: 213.70,
    totalInvestments: 7500,
    netProfit: 6713.70
  };
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit': return 'add_circle';
      case 'withdraw': return 'arrow_circle_up';
      case 'yield': return 'payments';
      case 'investment': return 'trending_up';
      default: return 'swap_horiz';
    }
  };
  
  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-emerald-500';
      case 'withdraw': return 'text-red-500';
      case 'yield': return 'text-blue-500';
      case 'investment': return 'text-purple-500';
      default: return 'text-slate-500';
    }
  };
  
  return (
    <PageWrapper hideNav className="bg-background">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#101322]/80 backdrop-blur-md px-5 py-4 flex items-center gap-4 border-b border-gray-200 dark:border-gray-800">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold flex-1">Reports & Analytics</h1>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="material-symbols-outlined">download</span>
        </button>
      </header>
      
      <main className="px-5 py-6 space-y-6 overflow-y-auto pb-24">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {periods.map(period => (
            <button
              key={period.id}
              onClick={() => setSelectedPeriod(period.id)}
              className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${
                selectedPeriod === period.id
                  ? 'bg-[#1132d4] text-white'
                  : 'bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-gray-700'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
        
        <div className="bg-gradient-to-br from-[#1132d4] to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <p className="text-white/80 text-sm font-medium mb-2">Net Performance</p>
          <h2 className="text-4xl font-bold mb-6">+${stats.netProfit.toLocaleString()}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/60 text-xs uppercase mb-1">Total Invested</p>
              <p className="text-lg font-bold">${stats.totalInvestments.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase mb-1">Total Yields</p>
              <p className="text-lg font-bold text-emerald-300">+${stats.totalYields.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600 text-sm">add_circle</span>
              </div>
              <p className="text-xs text-slate-500 font-bold uppercase">Deposits</p>
            </div>
            <p className="text-xl font-bold">${stats.totalDeposits.toLocaleString()}</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600 text-sm">arrow_circle_up</span>
              </div>
              <p className="text-xs text-slate-500 font-bold uppercase">Withdrawals</p>
            </div>
            <p className="text-xl font-bold">${stats.totalWithdrawals.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Transaction History</h3>
            <button className="text-xs text-[#1132d4] font-bold uppercase">Export</button>
          </div>
          
          <div className="space-y-2">
            {transactions.map(tx => (
              <div 
                key={tx.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  tx.type === 'deposit' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                  tx.type === 'withdraw' ? 'bg-red-100 dark:bg-red-900/30' :
                  tx.type === 'yield' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  'bg-purple-100 dark:bg-purple-900/30'
                }`}>
                  <span className={`material-symbols-outlined ${getTransactionColor(tx.type)}`}>
                    {getTransactionIcon(tx.type)}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm capitalize">{tx.type}</p>
                    {tx.project && (
                      <span className="text-[10px] bg-slate-100 dark:bg-gray-700 px-2 py-0.5 rounded font-bold">
                        {tx.project}
                      </span>
                    )}
                    {tx.method && (
                      <span className="text-[10px] bg-slate-100 dark:bg-gray-700 px-2 py-0.5 rounded font-bold">
                        {tx.method}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className={`font-bold ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                  </p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    tx.status === 'completed' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  } font-bold uppercase`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-slate-100 dark:border-gray-700">
          <h4 className="font-bold mb-4">Download Reports</h4>
          <div className="space-y-2">
            {['Monthly Statement', 'Tax Report 2025', 'Investment Summary', 'Yield History'].map((report, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#1132d4]">description</span>
                  <span className="font-bold text-sm">{report}</span>
                </div>
                <span className="material-symbols-outlined text-slate-400">download</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
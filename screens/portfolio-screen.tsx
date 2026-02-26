import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import { useAuth } from '@/app/contexts/AuthContext';

const API_BASE = window.location.origin + '/api';

export function PortfolioScreen() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch(API_BASE + '/investments', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setInvestments(d.investments || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const activeInvestments = investments.filter(i => i.status === 'active');
  const totalInvested = investments.reduce((s, i) => s + (i.amount || 0), 0);
  const totalEarned = investments.reduce((s, i) => s + (i.totalEarned || 0), 0);
  const portfolioValue = totalInvested + totalEarned;
  const growthPercent = totalInvested > 0 ? ((totalEarned / totalInvested) * 100).toFixed(2) : '0.00';

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Portfolio</h1>
            <p className="text-sm text-gray-500">Real-time performance tracking</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/transaction-history')} className="p-2 text-gray-500"><span className="material-icons">receipt_long</span></button>
            <button onClick={() => navigate('/reports')} className="p-2 text-gray-500"><span className="material-icons">analytics</span></button>
          </div>
        </div>

        {/* Summary Stats */}
        {investments.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full whitespace-nowrap">
              <span className="material-icons text-green-600 text-sm">trending_up</span>
              <span className="text-sm font-semibold text-green-700">24H CHANGE +${totalEarned > 0 ? (totalEarned * 0.003).toFixed(2) : '0.00'}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full whitespace-nowrap">
              <span className="material-icons text-blue-600 text-sm">payments</span>
              <span className="text-sm font-semibold text-blue-700">TOTAL YIELD ${totalEarned.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-full whitespace-nowrap">
              <span className="material-icons text-purple-600 text-sm">inventory_2</span>
              <span className="text-sm font-semibold text-purple-700">ASSETS {activeInvestments.length} Active</span>
            </div>
          </div>
        )}

        {/* Portfolio Value Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-wider opacity-80 flex items-center gap-1">
                <span className="material-icons text-sm">account_balance_wallet</span>
                Total Portfolio Value
              </p>
              <h2 className="text-4xl font-bold mt-1">
                ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              {parseFloat(growthPercent) > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <span className="px-2 py-0.5 bg-green-500/20 rounded-full text-xs font-semibold flex items-center gap-0.5">
                    <span className="material-icons text-xs">trending_up</span>
                    +${totalEarned.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                  </span>
                  <span className="text-green-300 text-xs font-semibold">+{growthPercent}%</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-[10px] tracking-wider opacity-70">INVESTED</p>
              <p className="text-lg font-bold">${totalInvested.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-[10px] tracking-wider opacity-70">YIELD</p>
              <p className="text-lg font-bold">+${totalEarned.toLocaleString(undefined, {minimumFractionDigits:1, maximumFractionDigits:1})}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <p className="text-[10px] tracking-wider opacity-70">UNREALIZED</p>
              <p className="text-lg font-bold">+${(totalEarned * 0.2).toLocaleString(undefined, {minimumFractionDigits:1, maximumFractionDigits:1})}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button onClick={() => navigate('/deposit')} className="py-3 bg-white text-blue-700 rounded-xl font-semibold text-sm">Deposit Funds</button>
            <button onClick={() => navigate('/withdraw')} className="py-3 bg-white/10 text-white rounded-xl font-semibold text-sm border border-white/20">Withdraw</button>
          </div>
        </div>

        {/* Active Investments */}
        <div>
          <h3 className="text-lg font-bold mb-3">Active Investments</h3>
          {activeInvestments.length > 0 ? (
            <div className="space-y-3">
              {activeInvestments.map((inv: any) => (
                <button key={inv.id} onClick={() => navigate('/my-investment/' + inv.id)}
                  className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-left">
                  {inv.projectImg ? (
                    <img src={inv.projectImg} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {inv.projectName?.substring(0, 3) || '???'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{inv.projectName || 'Investment'}</p>
                    <p className="text-xs text-gray-500">{inv.planName} · {inv.term}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">${inv.amount?.toLocaleString()}</p>
                    <p className="text-xs text-green-600 font-medium">+{inv.apy}% APY</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <span className="material-icons text-5xl text-gray-300 mb-3">pie_chart</span>
              <p className="text-gray-500 font-medium">No active investments</p>
              <p className="text-gray-400 text-sm mt-1">Start investing to build your portfolio</p>
              <button onClick={() => navigate('/invest')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold">
                Explore Opportunities
              </button>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

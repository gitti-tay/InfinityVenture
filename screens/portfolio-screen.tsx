import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

export function PortfolioScreen() {
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState('1M');
  const [showAllAssets, setShowAllAssets] = useState(false);
  
  const timeframes = ['1W', '1M', '3M', '6M', '1Y', 'ALL'];
  
  const portfolioStats = {
    totalValue: 42590.50,
    invested: 35000,
    totalGains: 7590.50,
    gainsPercent: 21.69,
    yieldEarned: 1245.80,
    unrealizedGains: 6344.70,
    dayChange: 345.20,
    dayChangePercent: 0.82
  };
  
  const holdings = [
    {
      id: 'scn',
      name: 'Suburban Care Network',
      shortName: 'SCN',
      category: 'Healthcare',
      invested: 15000,
      currentValue: 18420,
      shares: 150,
      sharePrice: 122.80,
      apy: 12.5,
      yieldEarned: 625.50,
      performance: 22.8,
      nextPayout: '2026-02-15',
      status: 'active',
      riskLevel: 'Medium',
      location: 'Sukhumvit, Bangkok',
      icon: 'medical_services',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'ptf',
      name: 'Prime Timber Forestry',
      shortName: 'PTF',
      category: 'Agriculture',
      invested: 12000,
      currentValue: 14280,
      shares: 120,
      sharePrice: 119.00,
      apy: 14.2,
      yieldEarned: 428.30,
      performance: 19.0,
      nextPayout: '2026-02-20',
      status: 'active',
      riskLevel: 'Low',
      location: 'Doi Saket, Chiang Mai',
      icon: 'agriculture',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'mdd',
      name: 'Metropolitan District Development',
      shortName: 'MDD',
      category: 'Real Estate',
      invested: 8000,
      currentValue: 9890,
      shares: 80,
      sharePrice: 123.63,
      apy: 11.8,
      yieldEarned: 192.00,
      performance: 23.63,
      nextPayout: '2026-02-10',
      status: 'active',
      riskLevel: 'Medium',
      location: 'Asoke, Bangkok',
      icon: 'apartment',
      color: 'from-violet-500 to-violet-600'
    }
  ];
  
  const upcomingPayouts = [
    { date: '2026-02-10', project: 'MDD', amount: 64.80, days: 5 },
    { date: '2026-02-15', project: 'SCN', amount: 125.50, days: 10 },
    { date: '2026-02-20', project: 'PTF', amount: 89.20, days: 15 }
  ];
  
  const performanceData = [
    { month: 'Sep', value: 35000, change: 0 },
    { month: 'Oct', value: 36200, change: 3.4 },
    { month: 'Nov', value: 37800, change: 4.4 },
    { month: 'Dec', value: 39100, change: 3.4 },
    { month: 'Jan', value: 41200, change: 5.4 },
    { month: 'Feb', value: 42590, change: 3.4 }
  ];
  
  const topAssets = holdings.slice(0, showAllAssets ? holdings.length : 3);
  
  return (
    <PageWrapper>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b14]">
        {/* Header */}
        <header className="px-5 pt-4 pb-3 bg-white/80 dark:bg-[#101322]/80 sticky top-0 z-10 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">Portfolio</h1>
              <p className="text-xs text-slate-500">Real-time performance tracking</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/transaction-history')}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">receipt_long</span>
              </button>
              <button 
                onClick={() => navigate('/reports')}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">analytics</span>
              </button>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-gray-800 px-3 py-2 rounded-xl min-w-fit">
              <span className="material-symbols-outlined text-emerald-600 text-base">trending_up</span>
              <div>
                <p className="text-[10px] text-slate-500 uppercase">24h Change</p>
                <p className="text-sm font-bold text-emerald-600">+${portfolioStats.dayChange.toFixed(2)} ({portfolioStats.dayChangePercent}%)</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-gray-800 px-3 py-2 rounded-xl min-w-fit">
              <span className="material-symbols-outlined text-blue-600 text-base">payments</span>
              <div>
                <p className="text-[10px] text-slate-500 uppercase">Total Yield</p>
                <p className="text-sm font-bold">${portfolioStats.yieldEarned.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-gray-800 px-3 py-2 rounded-xl min-w-fit">
              <span className="material-symbols-outlined text-violet-600 text-base">inventory_2</span>
              <div>
                <p className="text-[10px] text-slate-500 uppercase">Assets</p>
                <p className="text-sm font-bold">{holdings.length} Active</p>
              </div>
            </div>
          </div>
        </header>
        
        <main className="px-5 py-4 space-y-4 overflow-y-auto pb-24">
          {/* Total Value Card - Premium Design */}
          <div className="relative bg-gradient-to-br from-[#1132d4] via-blue-600 to-violet-600 rounded-3xl p-6 text-white shadow-2xl shadow-blue-500/20 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-white/80">account_balance_wallet</span>
                    <p className="text-white/80 text-sm font-medium">Total Portfolio Value</p>
                  </div>
                  <h2 className="text-5xl font-bold mb-2">${portfolioStats.totalValue.toLocaleString()}</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                      <span className="material-symbols-outlined text-sm">trending_up</span>
                      <span className="text-sm font-bold">+${portfolioStats.totalGains.toLocaleString()}</span>
                    </div>
                    <span className="text-emerald-300 font-bold">+{portfolioStats.gainsPercent}%</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <span className="material-symbols-outlined text-3xl">show_chart</span>
                  </div>
                </div>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                  <p className="text-white/60 text-[10px] uppercase mb-1 tracking-wide">Invested</p>
                  <p className="text-lg font-bold">${portfolioStats.invested.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                  <p className="text-white/60 text-[10px] uppercase mb-1 tracking-wide">Yield</p>
                  <p className="text-lg font-bold text-emerald-300">+${portfolioStats.yieldEarned.toLocaleString()}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                  <p className="text-white/60 text-[10px] uppercase mb-1 tracking-wide">Unrealized</p>
                  <p className="text-lg font-bold">+${portfolioStats.unrealizedGains.toLocaleString()}</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate('/deposit')} 
                  className="flex-1 bg-white text-[#1132d4] py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all"
                >
                  Deposit Funds
                </button>
                <button 
                  onClick={() => navigate('/withdraw')} 
                  className="flex-1 bg-white/20 border border-white/30 backdrop-blur-sm py-3.5 rounded-xl font-bold hover:bg-white/30 active:scale-95 transition-all"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
          
          {/* Performance Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 overflow-hidden">
            <div className="p-5 pb-0">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h3 className="font-bold text-lg">Performance</h3>
                  <p className="text-xs text-slate-500">Portfolio growth over time</p>
                </div>
                <div className="flex gap-1 bg-slate-100 dark:bg-gray-700 p-1 rounded-lg">
                  {timeframes.map(tf => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all ${ 
                        timeframe === tf
                          ? 'bg-[#1132d4] text-white shadow-sm'
                          : 'text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Chart */}
              <div className="h-52 flex items-end justify-between gap-1.5 px-2">
                {performanceData.map((data, i) => {
                  const maxValue = Math.max(...performanceData.map(d => d.value));
                  const height = (data.value / maxValue) * 100;
                  const isPositive = data.change >= 0;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3">
                      <div className="w-full relative group">
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl">
                            <p className="mb-1">${data.value.toLocaleString()}</p>
                            {data.change !== 0 && (
                              <p className={isPositive ? 'text-emerald-400' : 'text-red-400'}>
                                {isPositive ? '+' : ''}{data.change}%
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Bar */}
                        <div 
                          className="w-full bg-slate-100 dark:bg-gray-700 rounded-t-xl relative overflow-hidden transition-all duration-300 hover:scale-105" 
                          style={{ height: `${height}%` }}
                        >
                          <div className={`absolute bottom-0 w-full bg-gradient-to-t ${
                            isPositive ? 'from-emerald-500 to-emerald-400' : 'from-blue-500 to-blue-400'
                          } rounded-t-xl`} style={{ height: '100%' }}></div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold">{data.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="px-5 py-4 bg-slate-50 dark:bg-gray-900/50 border-t border-slate-200 dark:border-gray-700 mt-5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-600 dark:text-gray-400">Positive Growth</span>
                </div>
                <span className="font-bold">Average: +4.0% monthly</span>
              </div>
            </div>
          </div>
          
          {/* Upcoming Payouts */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined">payments</span>
              <h3 className="font-bold text-lg">Upcoming Payouts</h3>
            </div>
            
            <div className="space-y-2">
              {upcomingPayouts.map((payout, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">{payout.project} Dividend</p>
                      <p className="text-xs text-white/70">in {payout.days} days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">+${payout.amount}</p>
                    <p className="text-xs text-white/70">
                      {new Date(payout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* My Assets */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-lg">My Assets</h3>
                <p className="text-xs text-slate-500">{holdings.length} active investments</p>
              </div>
              <button
                onClick={() => setShowAllAssets(!showAllAssets)}
                className="text-[#1132d4] text-sm font-bold flex items-center gap-1"
              >
                {showAllAssets ? 'Show Less' : 'View All'}
                <span className="material-symbols-outlined text-base">
                  {showAllAssets ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            </div>
            
            <div className="space-y-3">
              {topAssets.map(asset => (
                <div 
                  key={asset.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => navigate(`/my-investment/${asset.id}`)}
                >
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${asset.color} p-4 text-white`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                          <span className="material-symbols-outlined text-2xl">{asset.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-base mb-0.5">{asset.shortName}</h4>
                          <p className="text-xs text-white/80">{asset.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-white/80 mb-0.5">Current Value</p>
                        <p className="font-bold text-xl">${asset.currentValue.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                        <span className="material-symbols-outlined text-xs">trending_up</span>
                        <span className="text-xs font-bold">+{asset.performance}%</span>
                      </div>
                      <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        <span className="text-xs font-medium">{asset.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="p-4">
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase mb-1">Invested</p>
                        <p className="text-sm font-bold">${asset.invested.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase mb-1">Shares</p>
                        <p className="text-sm font-bold">{asset.shares}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase mb-1">APY</p>
                        <p className="text-sm font-bold text-emerald-600">{asset.apy}%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase mb-1">Yield</p>
                        <p className="text-sm font-bold text-blue-600">+${asset.yieldEarned}</p>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-500">Return Progress</span>
                        <span className="font-bold text-emerald-600">+${(asset.currentValue - asset.invested).toFixed(2)}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${asset.color} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(asset.performance, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          asset.riskLevel === 'Low' ? 'bg-emerald-500' : 
                          asset.riskLevel === 'Medium' ? 'bg-amber-500' : 'bg-red-500'
                        }`}></span>
                        <span className="text-xs text-slate-500">{asset.riskLevel} Risk</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        Next: {new Date(asset.nextPayout).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <button className="text-[#1132d4] group-hover:translate-x-1 transition-transform">
                        <span className="material-symbols-outlined text-xl">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Portfolio Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#1132d4]">lightbulb</span>
              <h3 className="font-bold text-lg">Portfolio Insights</h3>
            </div>
            
            <div className="space-y-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-blue-600 shrink-0">trending_up</span>
                  <div className="text-sm">
                    <p className="font-bold text-blue-900 dark:text-blue-200 mb-1">Strong Performance</p>
                    <p className="text-blue-700 dark:text-blue-300 text-xs">
                      Your portfolio is outperforming the market average by 8.2% this quarter.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-emerald-600 shrink-0">diversity_3</span>
                  <div className="text-sm">
                    <p className="font-bold text-emerald-900 dark:text-emerald-200 mb-1">Well Diversified</p>
                    <p className="text-emerald-700 dark:text-emerald-300 text-xs">
                      Your assets are spread across 3 sectors, maintaining balanced risk exposure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

export function MyInvestmentDetailScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock investment data - in real app, fetch based on id
  const investmentData: any = {
    scn: {
      id: 'scn',
      name: 'Suburban Care Network',
      shortName: 'SCN',
      category: 'Healthcare',
      location: 'Sukhumvit, Bangkok',
      description: 'Premium medical facility network providing world-class healthcare services in central Bangkok.',
      invested: 15000,
      currentValue: 18420,
      shares: 150,
      sharePrice: 122.80,
      originalSharePrice: 100.00,
      apy: 12.5,
      totalYield: 625.50,
      performance: 22.8,
      investmentDate: '2025-09-15',
      nextPayout: '2026-02-15',
      nextPayoutAmount: 125.50,
      status: 'active',
      riskLevel: 'Medium',
      icon: 'medical_services',
      color: 'from-blue-500 to-blue-600',
      unrealizedGain: 3420,
      totalReturn: 4045.50,
      documents: 12,
      paymentFrequency: 'Monthly',
      maturityDate: '2028-09-15',
      occupancyRate: 94.5,
      assetValue: 12500000,
      yourOwnership: 0.12
    },
    ptf: {
      id: 'ptf',
      name: 'Prime Timber Forestry',
      shortName: 'PTF',
      category: 'Agriculture',
      location: 'Doi Saket, Chiang Mai',
      description: 'Sustainable timber plantation with certified organic practices in northern Thailand.',
      invested: 12000,
      currentValue: 14280,
      shares: 120,
      sharePrice: 119.00,
      originalSharePrice: 100.00,
      apy: 14.2,
      totalYield: 428.30,
      performance: 19.0,
      investmentDate: '2025-10-01',
      nextPayout: '2026-02-20',
      nextPayoutAmount: 89.20,
      status: 'active',
      riskLevel: 'Low',
      icon: 'agriculture',
      color: 'from-emerald-500 to-emerald-600',
      unrealizedGain: 2280,
      totalReturn: 2708.30,
      documents: 10,
      paymentFrequency: 'Monthly',
      maturityDate: '2028-10-01',
      occupancyRate: 88.2,
      assetValue: 18500000,
      yourOwnership: 0.04
    },
    mdd: {
      id: 'mdd',
      name: 'Metropolitan District Development',
      shortName: 'MDD',
      category: 'Real Estate',
      location: 'Asoke, Bangkok',
      description: 'Premium commercial real estate in Bangkok central business district.',
      invested: 8000,
      currentValue: 9890,
      shares: 80,
      sharePrice: 123.63,
      originalSharePrice: 100.00,
      apy: 11.8,
      totalYield: 192.00,
      performance: 23.63,
      investmentDate: '2025-11-10',
      nextPayout: '2026-02-10',
      nextPayoutAmount: 64.80,
      status: 'active',
      riskLevel: 'Medium',
      icon: 'apartment',
      color: 'from-violet-500 to-violet-600',
      unrealizedGain: 1890,
      totalReturn: 2082.00,
      documents: 15,
      paymentFrequency: 'Monthly',
      maturityDate: '2028-11-10',
      occupancyRate: 96.8,
      assetValue: 24800000,
      yourOwnership: 0.032
    }
  };
  
  const investment = investmentData[id || 'scn'] || investmentData.scn;
  
  const payoutHistory = [
    { date: '2026-01-15', amount: 125.50, status: 'completed', type: 'Dividend' },
    { date: '2025-12-15', amount: 125.50, status: 'completed', type: 'Dividend' },
    { date: '2025-11-15', amount: 125.50, status: 'completed', type: 'Dividend' },
    { date: '2025-10-15', amount: 124.00, status: 'completed', type: 'Dividend' },
    { date: '2025-09-15', amount: 124.50, status: 'completed', type: 'Dividend' }
  ];
  
  const performanceData = [
    { month: 'Sep', value: 15000, gain: 0 },
    { month: 'Oct', value: 15420, gain: 2.8 },
    { month: 'Nov', value: 16100, gain: 4.4 },
    { month: 'Dec', value: 16890, gain: 4.9 },
    { month: 'Jan', value: 17680, gain: 4.7 },
    { month: 'Feb', value: 18420, gain: 4.2 }
  ];
  
  const daysHeld = Math.floor((new Date().getTime() - new Date(investment.investmentDate).getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <PageWrapper hideNav>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b14]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#101322]/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
          <div className="px-5 py-4 flex items-center gap-4">
            <button 
              onClick={() => navigate('/portfolio')} 
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold">Investment Details</h1>
              <p className="text-xs text-slate-500">{investment.shortName}</p>
            </div>
            <button 
              onClick={() => navigate(`/project/${investment.id}`)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="material-symbols-outlined">info</span>
            </button>
          </div>
        </header>
        
        <main className="overflow-y-auto pb-24">
          {/* Hero Card */}
          <div className="px-5 pt-6">
            <div className={`relative bg-gradient-to-br ${investment.color} rounded-3xl p-6 text-white shadow-2xl overflow-hidden`}>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
              
              <div className="relative">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shrink-0">
                    <span className="material-symbols-outlined text-3xl">{investment.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-1">{investment.shortName}</h2>
                    <p className="text-white/80 text-sm mb-2">{investment.category}</p>
                    <div className="flex items-center gap-1.5 text-white/80 text-xs">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {investment.location}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    investment.riskLevel === 'Low' ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30' : 
                    investment.riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-100 border border-amber-400/30' : 
                    'bg-red-500/20 text-red-100 border border-red-400/30'
                  }`}>
                    {investment.riskLevel} Risk
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="text-white/70 text-sm mb-1">Current Value</p>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-5xl font-bold">${investment.currentValue.toLocaleString()}</h3>
                    <div className="flex items-center gap-1.5 bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-400/30">
                      <span className="material-symbols-outlined text-sm">trending_up</span>
                      <span className="font-bold">+{investment.performance}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <p className="text-white/60 text-[10px] uppercase mb-1">Invested</p>
                    <p className="font-bold">${investment.invested.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <p className="text-white/60 text-[10px] uppercase mb-1">Total Gain</p>
                    <p className="font-bold text-emerald-300">+${investment.totalReturn.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <p className="text-white/60 text-[10px] uppercase mb-1">APY</p>
                    <p className="font-bold">{investment.apy}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="px-5 py-6">
            <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm">
              {[
                { id: 'overview', label: 'Overview', icon: 'dashboard' },
                { id: 'performance', label: 'Performance', icon: 'show_chart' },
                { id: 'payouts', label: 'Payouts', icon: 'payments' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#1132d4] text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="px-5 space-y-4">
              {/* Key Metrics */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1132d4]">analytics</span>
                  Key Metrics
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 uppercase mb-1">Shares Owned</p>
                    <p className="text-2xl font-bold">{investment.shares}</p>
                    <p className="text-xs text-slate-500 mt-1">${investment.sharePrice} per share</p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 uppercase mb-1">Total Yield</p>
                    <p className="text-2xl font-bold text-emerald-600">+${investment.totalYield}</p>
                    <p className="text-xs text-slate-500 mt-1">{investment.paymentFrequency}</p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 uppercase mb-1">Unrealized Gain</p>
                    <p className="text-2xl font-bold text-blue-600">+${investment.unrealizedGain.toLocaleString()}</p>
                    <p className="text-xs text-slate-500 mt-1">+{((investment.unrealizedGain / investment.invested) * 100).toFixed(2)}%</p>
                  </div>
                  
                  <div className="bg-slate-50 dark:bg-gray-900/50 rounded-xl p-4">
                    <p className="text-xs text-slate-500 uppercase mb-1">Days Held</p>
                    <p className="text-2xl font-bold">{daysHeld}</p>
                    <p className="text-xs text-slate-500 mt-1">Since {new Date(investment.investmentDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              {/* Next Payout */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined">schedule</span>
                  <h3 className="font-bold">Next Payout</h3>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white/80 text-xs mb-1">Expected Amount</p>
                      <p className="text-3xl font-bold">+${investment.nextPayoutAmount}</p>
                    </div>
                    <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl">payments</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Payment Date</span>
                    <span className="font-bold">{new Date(investment.nextPayout).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              
              {/* Asset Details */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1132d4]">apartment</span>
                  Asset Details
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-gray-700">
                    <span className="text-slate-500 text-sm">Total Asset Value</span>
                    <span className="font-bold">${investment.assetValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-gray-700">
                    <span className="text-slate-500 text-sm">Your Ownership</span>
                    <span className="font-bold">{investment.yourOwnership}%</span>
                  </div>
                  {investment.occupancyRate && (
                    <div className="flex justify-between py-2 border-b border-slate-100 dark:border-gray-700">
                      <span className="text-slate-500 text-sm">Occupancy Rate</span>
                      <span className="font-bold text-emerald-600">{investment.occupancyRate}%</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-gray-700">
                    <span className="text-slate-500 text-sm">Investment Date</span>
                    <span className="font-bold">{new Date(investment.investmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500 text-sm">Maturity Date</span>
                    <span className="font-bold">{new Date(investment.maturityDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate(`/project/${investment.id}`)}
                  className="bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3 hover:border-[#1132d4] transition-all"
                >
                  <span className="material-symbols-outlined text-[#1132d4] text-2xl">info</span>
                  <div className="text-left">
                    <p className="font-bold text-sm">View Project</p>
                    <p className="text-xs text-slate-500">Full details</p>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate(`/project/${investment.id}/documents`)}
                  className="bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3 hover:border-[#1132d4] transition-all"
                >
                  <span className="material-symbols-outlined text-[#1132d4] text-2xl">description</span>
                  <div className="text-left">
                    <p className="font-bold text-sm">Documents</p>
                    <p className="text-xs text-slate-500">{investment.documents} files</p>
                  </div>
                </button>
              </div>
            </div>
          )}
          
          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="px-5 space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-5">Investment Growth</h3>
                
                {/* Chart */}
                <div className="h-64 flex items-end justify-between gap-2 mb-6">
                  {performanceData.map((data, i) => {
                    const maxValue = Math.max(...performanceData.map(d => d.value));
                    const height = (data.value / maxValue) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-3">
                        <div className="w-full relative group">
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl">
                              <p className="mb-1">${data.value.toLocaleString()}</p>
                              {data.gain > 0 && <p className="text-emerald-400">+{data.gain}%</p>}
                            </div>
                          </div>
                          
                          <div 
                            className={`w-full bg-gradient-to-t ${investment.color} rounded-t-xl transition-all duration-300 hover:scale-105`}
                            style={{ height: `${height}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-bold">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-slate-50 dark:bg-gray-900/50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Total Return</p>
                    <p className="text-lg font-bold text-emerald-600">+{investment.performance}%</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-gray-900/50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Avg Monthly</p>
                    <p className="text-lg font-bold">+{(investment.performance / 6).toFixed(1)}%</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 dark:bg-gray-900/50 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">Best Month</p>
                    <p className="text-lg font-bold">+4.9%</p>
                  </div>
                </div>
              </div>
              
              {/* Share Price */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4">Share Price Movement</h3>
                
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Current Price</p>
                    <p className="text-3xl font-bold">${investment.sharePrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">Purchase Price</p>
                    <p className="text-xl font-bold text-slate-400">${investment.originalSharePrice}</p>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-gray-900/50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-gray-400">Price Change</span>
                    <span className="text-lg font-bold text-emerald-600">+${(investment.sharePrice - investment.originalSharePrice).toFixed(2)} (+{((investment.sharePrice - investment.originalSharePrice) / investment.originalSharePrice * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${investment.color} rounded-full`}
                      style={{ width: '85%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Payouts Tab */}
          {activeTab === 'payouts' && (
            <div className="px-5 space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-4">Payout History</h3>
                
                <div className="space-y-3">
                  {payoutHistory.map((payout, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-900/50 rounded-xl border border-slate-100 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                          <span className="material-symbols-outlined text-emerald-600 text-sm">payments</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm">{payout.type} Payment</p>
                          <p className="text-xs text-slate-500">{new Date(payout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">+${payout.amount}</p>
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                          {payout.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 dark:text-gray-400">Total Received</span>
                    <span className="text-2xl font-bold text-emerald-600">+${investment.totalYield}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-gray-400">Number of Payments</span>
                    <span className="font-bold">{payoutHistory.length} payments</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </PageWrapper>
  );
}
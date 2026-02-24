import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import { PROJECTS } from '@/app/data/projects';
import { useAuth } from '@/app/contexts/AuthContext';
import { useWallet } from '@/app/contexts/WalletContext';

export function HomeScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance, totalPortfolioValue, monthlyYield, investments, wallet } = useWallet();
  
  const totalInvested = investments.filter(i => i.status === 'active').reduce((s, i) => s + i.amount, 0);
  const growthPercent = totalInvested > 0 ? ((monthlyYield / totalInvested) * 100).toFixed(1) : '0.0';
  
  const displayValue = totalPortfolioValue > 0
    ? `$${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  return (
    <PageWrapper>
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#101322]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1132d4] rounded-lg flex items-center justify-center text-white font-bold">I</div>
          <span className="font-bold text-lg">Infinity<span className="text-[#1132d4]">Ventures</span></span>
        </div>
        <div className="flex items-center gap-3">
          {user?.role && ['admin', 'superadmin'].includes(user.role) && (
            <button onClick={() => navigate('/admin')} className="px-2 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold">
              Admin
            </button>
          )}
          <button 
            onClick={() => navigate('/notifications')} 
            className="relative p-1 text-slate-500"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button onClick={() => navigate('/settings')} className="w-8 h-8 rounded-full bg-[#1132d4] flex items-center justify-center text-white font-bold text-sm">
            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </button>
        </div>
      </header>
      
      <main className="px-5 py-6 space-y-8 overflow-y-auto pb-24">
        {/* Wallet Connection Alert */}
        {!wallet && (
          <button
            onClick={() => navigate('/connect-wallet')}
            className="w-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-3 text-left"
          >
            <span className="material-symbols-outlined text-amber-600 text-2xl">link</span>
            <div className="flex-1">
              <p className="font-bold text-sm text-amber-900 dark:text-amber-100">Connect Your Wallet</p>
              <p className="text-xs text-amber-700 dark:text-amber-400">Connect a wallet to start investing</p>
            </div>
            <span className="material-symbols-outlined text-amber-400">chevron_right</span>
          </button>
        )}
        
        {/* Portfolio Card */}
        <section className="bg-[#1132d4] rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <p className="text-white/80 text-xs font-medium uppercase tracking-widest mb-1">Portfolio Value</p>
            <h1 className="text-3xl font-bold mb-4">
              {displayValue} <span className="text-sm font-normal text-white/60">USDT</span>
            </h1>
            <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
              <div>
                <p className="text-white/60 text-[10px] uppercase">Monthly Yield</p>
                <p className="font-bold text-lg">+${monthlyYield.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-[10px] uppercase">Growth</p>
                <p className="font-bold text-lg text-emerald-300 flex items-center justify-end gap-1">
                  <span className="material-symbols-outlined text-sm">trending_up</span> {growthPercent}%
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-3 gap-3">
          {[
            { label: 'Deposit', path: '/deposit', icon: 'add', color: 'bg-[#1132d4]/10 text-[#1132d4]' },
            { label: 'Withdraw', path: '/withdraw', icon: 'currency_exchange', color: 'bg-blue-100 text-blue-600' },
            { label: 'Reports', path: '/reports', icon: 'analytics', color: 'bg-emerald-100 text-emerald-600' }
          ].map(action => (
            <button 
              key={action.label} 
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm active:scale-95 transition-transform"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${action.color}`}>
                <span className="material-symbols-outlined">{action.icon}</span>
              </div>
              <span className="text-[10px] font-bold uppercase">{action.label}</span>
            </button>
          ))}
        </section>

        {/* Available Balance Banner */}
        {balance > 0 && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Available Balance</p>
              <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <button
              onClick={() => navigate('/invest')}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
            >
              Invest Now
            </button>
          </div>
        )}

        {/* Opportunities */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-bold">Opportunities</h2>
            <button 
              onClick={() => navigate('/invest')} 
              className="text-[#1132d4] text-xs font-bold uppercase"
            >
              View All
            </button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto -mx-5 px-5 pb-4">
            {PROJECTS.map(p => (
              <div 
                key={p.id} 
                className="min-w-[280px] bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border border-gray-100 dark:border-gray-700 flex flex-col"
              >
                <div 
                  onClick={() => navigate(`/project/${p.id}`)}
                  className="cursor-pointer"
                >
                  <div className="h-32 rounded-xl overflow-hidden mb-3 relative">
                    <img className="w-full h-full object-cover" src={p.img} alt={p.name} />
                    <div className="absolute top-2 left-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold text-[#1132d4] uppercase">
                      {p.risk}
                    </div>
                  </div>
                  <h3 className="font-bold text-base mb-1 truncate">{p.name}</h3>
                  <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span> {p.region}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-slate-50 dark:bg-gray-700 p-2 rounded-lg">
                      <p className="text-[10px] text-slate-500 uppercase">APY</p>
                      <p className="font-bold text-emerald-600">{p.apy}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-gray-700 p-2 rounded-lg">
                      <p className="text-[10px] text-slate-500 uppercase">Term</p>
                      <p className="font-bold text-[#1132d4]">{p.term}</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="w-full bg-slate-100 dark:bg-gray-700 h-1.5 rounded-full mb-1">
                      <div className="bg-[#1132d4] h-1.5 rounded-full" style={{width: `${p.progress}%`}}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-3">
                      <span>{p.progress}% Funded</span>
                      <span>{p.investors} Investors</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate('/invest-amount', { state: { project: p } })}
                  className="w-full bg-[#1132d4] text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors active:scale-95 flex items-center justify-center gap-2"
                >
                  Invest Now
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Active Investments Summary */}
        {investments.length > 0 && (
          <section>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-lg font-bold">Active Investments</h2>
              <button onClick={() => navigate('/portfolio')} className="text-[#1132d4] text-xs font-bold uppercase">
                View All
              </button>
            </div>
            {investments.slice(0, 3).map(inv => (
              <button
                key={inv.id}
                onClick={() => navigate(`/my-investment/${inv.id}`)}
                className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 border border-gray-100 dark:border-gray-700 flex items-center gap-3 text-left"
              >
                <img src={inv.projectImg} alt={inv.projectName} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{inv.projectName}</p>
                  <p className="text-xs text-slate-500">${inv.amount.toLocaleString()} · {inv.apy}% APY</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">+${inv.monthlyYield.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-400">/ month</p>
                </div>
              </button>
            ))}
          </section>
        )}

        <div className="bg-gray-900 rounded-2xl p-4 flex items-center justify-between text-white shadow-lg">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-400">verified_user</span>
            <div>
              <p className="text-sm font-bold">SEC Regulated Platform</p>
              <p className="text-[10px] text-slate-400">Compliant & Secure Assets</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-500">chevron_right</span>
        </div>
      </main>
    </PageWrapper>
  );
}

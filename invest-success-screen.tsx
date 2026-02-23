import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { PageWrapper } from '../components/page-wrapper';

interface LocationState {
  project: any;
  plan: any;
  amount: number;
  returns: {
    monthly: number;
    total: number;
    principal: number;
  };
  transactionId: string;
}

export function InvestSuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  useEffect(() => {
    if (!state?.project || !state?.transactionId) {
      navigate('/home');
    }
  }, [state, navigate]);
  
  if (!state?.project || !state?.transactionId) {
    return null;
  }
  
  const { project, plan, amount, returns, transactionId } = state;
  const today = new Date();
  const maturityDate = new Date(today);
  maturityDate.setMonth(maturityDate.getMonth() + parseInt(plan.term));
  
  return (
    <PageWrapper hideNav>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b14] flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center px-5 py-12">
          {/* Success Animation */}
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/50 animate-bounce">
              <span className="material-symbols-outlined text-white text-5xl">check_circle</span>
            </div>
            <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20"></div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2 text-center">Investment Successful!</h1>
          <p className="text-slate-500 text-center mb-8">
            Your investment has been confirmed and is now active
          </p>
          
          {/* Investment Details Card */}
          <div className="w-full bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-gray-700 mb-6 shadow-xl">
            <div className="bg-gradient-to-br from-[#1132d4] to-blue-600 p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={project.img} 
                  alt={project.name}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-white/30"
                />
                <div>
                  <h3 className="font-bold text-lg">{project.name}</h3>
                  <p className="text-white/80 text-sm">{project.symbol}</p>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-white/70 text-sm mb-1">Investment Amount</p>
                <p className="text-4xl font-bold">${amount.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Monthly Income</p>
                  <p className="text-xl font-bold text-emerald-600">${returns.monthly.toFixed(2)}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <p className="text-xs text-blue-700 dark:text-blue-400 mb-1">Total Return</p>
                  <p className="text-xl font-bold text-blue-600">${returns.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
              
              <div className="border-t border-slate-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-gray-400">Plan</span>
                  <span className="font-bold">{plan.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-gray-400">APY</span>
                  <span className="font-bold text-[#1132d4]">{plan.apy}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-gray-400">Term</span>
                  <span className="font-bold">{plan.term}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-gray-400">Maturity Date</span>
                  <span className="font-bold">
                    {maturityDate.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-gray-900 rounded-xl p-4 border border-slate-200 dark:border-gray-700">
                <p className="text-xs text-slate-500 mb-1">Transaction ID</p>
                <p className="font-mono font-bold text-sm">{transactionId}</p>
              </div>
            </div>
          </div>
          
          {/* Next Steps */}
          <div className="w-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-[#1132d4] text-2xl">lightbulb</span>
              <h3 className="font-bold">What's Next?</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-lg">check</span>
                <span>Your first dividend payment will arrive on the next payout cycle</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-lg">check</span>
                <span>Track your investment performance in the Portfolio section</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-lg">check</span>
                <span>Receive monthly updates on your investment project</span>
              </li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="w-full space-y-3">
            <button
              onClick={() => navigate('/portfolio')}
              className="w-full bg-gradient-to-r from-[#1132d4] to-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              View My Portfolio
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            
            <button
              onClick={() => navigate('/home')}
              className="w-full bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-gray-700 font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-slate-50 dark:hover:bg-gray-700 active:scale-95"
            >
              Explore More Opportunities
            </button>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}

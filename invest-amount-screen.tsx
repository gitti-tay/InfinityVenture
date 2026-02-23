import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { PageWrapper } from '../components/page-wrapper';
import { Project } from '../data/projects';

interface InvestmentPlan {
  id: string;
  name: string;
  term: string;
  apy: number;
  minInvestment: number;
  lockPeriod: string;
  payoutFrequency: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  badge?: string;
}

export function InvestAmountScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const project = location.state?.project as Project | undefined;
  
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [amount, setAmount] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  useEffect(() => {
    if (!project) {
      console.log('No project found, redirecting to home');
      navigate('/home');
    }
  }, [project, navigate]);
  
  if (!project) {
    return null;
  }
  
  // Investment plans based on project
  const getPlans = (): InvestmentPlan[] => {
    if (project.id === 'scn') {
      return [
        {
          id: 'flexible',
          name: 'Flexible Plan',
          term: '6 Months',
          apy: 14.8,
          minInvestment: 500,
          lockPeriod: '6 months',
          payoutFrequency: 'Quarterly',
          riskLevel: 'Low'
        },
        {
          id: 'standard',
          name: 'Standard Plan',
          term: '12 Months',
          apy: 18.2,
          minInvestment: 750,
          lockPeriod: '12 months',
          payoutFrequency: 'Monthly',
          riskLevel: 'Medium',
          badge: 'Popular'
        },
        {
          id: 'premium',
          name: 'Premium Plan',
          term: '18 Months',
          apy: 21.5,
          minInvestment: 2000,
          lockPeriod: '18 months',
          payoutFrequency: 'Monthly',
          riskLevel: 'Medium',
          badge: 'Best Value'
        }
      ];
    } else if (project.id === 'ptf') {
      return [
        {
          id: 'standard',
          name: 'Standard Plan',
          term: '12 Months',
          apy: 14.8,
          minInvestment: 500,
          lockPeriod: '12 months',
          payoutFrequency: 'Quarterly',
          riskLevel: 'Low',
          badge: 'Popular'
        },
        {
          id: 'premium',
          name: 'Premium Plan',
          term: '24 Months',
          apy: 17.2,
          minInvestment: 1500,
          lockPeriod: '24 months',
          payoutFrequency: 'Quarterly',
          riskLevel: 'Low',
          badge: 'Best Value'
        }
      ];
    } else {
      return [
        {
          id: 'standard',
          name: 'Standard Plan',
          term: '12 Months',
          apy: 16.5,
          minInvestment: 1000,
          lockPeriod: '12 months',
          payoutFrequency: 'Monthly',
          riskLevel: 'Medium',
          badge: 'Popular'
        },
        {
          id: 'premium',
          name: 'Premium Plan',
          term: '18 Months',
          apy: 19.8,
          minInvestment: 2500,
          lockPeriod: '18 months',
          payoutFrequency: 'Monthly',
          riskLevel: 'Medium',
          badge: 'Best Value'
        }
      ];
    }
  };
  
  const plans = getPlans();
  
  const calculateReturns = () => {
    if (!selectedPlan || !amount || parseFloat(amount) < selectedPlan.minInvestment) {
      return { monthly: 0, total: 0, principal: 0 };
    }
    
    const principal = parseFloat(amount);
    const months = parseInt(selectedPlan.term);
    const totalReturn = principal * (selectedPlan.apy / 100) * (months / 12);
    const monthlyReturn = totalReturn / months;
    
    return {
      monthly: monthlyReturn,
      total: principal + totalReturn,
      principal: principal
    };
  };
  
  const returns = calculateReturns();
  const isValidAmount = selectedPlan && amount && parseFloat(amount) >= selectedPlan.minInvestment;
  const canProceed = isValidAmount && agreedToTerms;
  
  const handleContinue = () => {
    if (!canProceed || !selectedPlan) return;
    
    navigate('/invest-review', {
      state: {
        project,
        plan: selectedPlan,
        amount: parseFloat(amount),
        returns
      }
    });
  };
  
  const getRiskColor = (risk: string) => {
    if (risk === 'Low') return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
    if (risk === 'Medium') return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
  };
  
  const getRiskDotColor = (risk: string) => {
    if (risk === 'Low') return 'bg-emerald-500';
    if (risk === 'Medium') return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  return (
    <PageWrapper hideNav>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b14]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#101322]/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-5 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-bold text-lg">Invest in {project.symbol}</h1>
            <div className="w-10"></div>
          </div>
        </header>
        
        <main className="px-5 py-6 space-y-6 pb-32">
          {/* Project Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-slate-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <img 
                src={project.img} 
                alt={project.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h2 className="font-bold text-lg mb-1">{project.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full font-bold">
                    {project.symbol}
                  </span>
                  <span className="text-xs text-slate-500">{project.location}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Investment Plans */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Select Investment Plan</h3>
            
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                  selectedPlan?.id === plan.id
                    ? 'border-[#1132d4] bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20'
                    : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg">{plan.name}</h4>
                      {plan.badge && (
                        <span className="text-[10px] font-bold px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500">{plan.term} • {plan.payoutFrequency} Payouts</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#1132d4]">{plan.apy}%</div>
                    <div className="text-xs text-slate-500">APY</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Min. Investment</p>
                    <p className="font-bold">${plan.minInvestment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Risk Level</p>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${getRiskColor(plan.riskLevel)}`}>
                      <span className={`w-2 h-2 rounded-full ${getRiskDotColor(plan.riskLevel)}`}></span>
                      <span className="text-xs font-bold">
                        {plan.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>
                
                {selectedPlan?.id === plan.id && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-[#1132d4]">
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      <span className="font-bold">Selected</span>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {/* Amount Input */}
          {selectedPlan && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="font-bold text-lg">Enter Investment Amount</h3>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-200 dark:border-gray-700">
                <label className="block text-sm font-bold mb-3">Investment Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">$</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min={selectedPlan.minInvestment}
                    className="w-full pl-10 pr-4 py-4 text-2xl font-bold bg-slate-50 dark:bg-gray-900 rounded-xl border-2 border-slate-200 dark:border-gray-700 focus:border-[#1132d4] outline-none"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Minimum: ${selectedPlan.minInvestment.toLocaleString()}
                </p>
                
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {[
                    selectedPlan.minInvestment,
                    selectedPlan.minInvestment * 2,
                    selectedPlan.minInvestment * 5,
                    selectedPlan.minInvestment * 10
                  ].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount.toString())}
                      className="py-2 px-3 bg-slate-100 dark:bg-gray-700 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      ${quickAmount >= 1000 ? `${quickAmount / 1000}k` : quickAmount}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Returns Projection */}
          {isValidAmount && (
            <div className="bg-gradient-to-br from-[#1132d4] to-blue-600 rounded-2xl p-6 text-white animate-fadeIn">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-2xl">trending_up</span>
                <h3 className="font-bold text-lg">Projected Returns</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-white/70 text-xs mb-1">Monthly Income</p>
                  <p className="text-2xl font-bold">${returns.monthly.toFixed(2)}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-white/70 text-xs mb-1">Total Return</p>
                  <p className="text-2xl font-bold">${returns.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/70">Your Investment</span>
                  <span className="font-bold">${returns.principal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/70">Interest Earned</span>
                  <span className="font-bold text-emerald-300">${(returns.total - returns.principal).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/20">
                  <span className="text-sm font-bold">Total Value</span>
                  <span className="text-xl font-bold">${returns.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Terms Checkbox */}
          {isValidAmount && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-200 dark:border-gray-700 animate-fadeIn">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-2 border-slate-300 dark:border-gray-600 text-[#1132d4] focus:ring-2 focus:ring-[#1132d4]/20"
                />
                <div className="flex-1">
                  <p className="text-sm">
                    I acknowledge that I have read and agree to the{' '}
                    <button className="text-[#1132d4] font-bold underline">
                      Investment Terms & Conditions
                    </button>
                    {' '}and understand the risks involved in this investment.
                  </p>
                </div>
              </label>
            </div>
          )}
        </main>
        
        {/* Fixed Bottom CTA */}
        {selectedPlan && (
          <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-slate-200 dark:border-gray-700 px-5 py-4 max-w-md mx-auto">
            <button
              onClick={handleContinue}
              disabled={!canProceed}
              className="w-full bg-gradient-to-r from-[#1132d4] to-blue-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              Continue to Review
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

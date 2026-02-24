import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { PageWrapper } from '../components/page-wrapper';
import { useWallet } from '../contexts/WalletContext';
import { useNotification } from '../contexts/NotificationContext';

interface LocationState {
  project: any;
  plan: any;
  amount: number;
  returns: {
    monthly: number;
    total: number;
    principal: number;
  };
}

export function InvestReviewScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const { balance, invest, wallet } = useWallet();
  const { error: showError } = useNotification();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  
  useEffect(() => {
    if (!state?.project || !state?.plan || !state?.amount) {
      navigate('/home');
    }
  }, [state, navigate]);
  
  if (!state?.project || !state?.plan || !state?.amount) {
    return null;
  }
  
  const { project, plan, amount, returns } = state;
  
  const hasEnoughBalance = balance >= amount;
  
  const handleConfirmInvestment = async () => {
    if (!hasEnoughBalance) {
      showError('Insufficient Balance', `You need $${(amount - balance).toFixed(2)} more. Please deposit first.`);
      return;
    }
    
    setIsProcessing(true);
    
    const result = await invest({
      projectId: project.id,
      projectName: project.name,
      projectImg: project.img || project.image,
      planName: plan.name,
      amount,
      apy: plan.apy,
      term: plan.term,
      payoutFrequency: plan.payoutFrequency,
      riskLevel: plan.riskLevel,
    });
    
    if (result.success) {
      navigate('/invest-success', {
        state: {
          project,
          plan,
          amount,
          returns,
          transactionId: result.transactionId,
          investmentId: result.investmentId,
        }
      });
    } else {
      setIsProcessing(false);
      showError('Investment Failed', result.error || 'Please try again');
    }
  };
  
  return (
    <PageWrapper hideNav>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b14]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#101322]/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-5 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              disabled={isProcessing}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-bold text-lg">Review Investment</h1>
            <div className="w-10"></div>
          </div>
        </header>
        
        <main className="px-5 py-6 space-y-6 pb-32">
          {/* Security Badge */}
          <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
            <span className="material-symbols-outlined text-emerald-600 text-2xl">verified_user</span>
            <div className="flex-1">
              <p className="font-bold text-sm text-emerald-900 dark:text-emerald-100">Secure Investment</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">Your transaction is protected by bank-level encryption</p>
            </div>
          </div>
          
          {/* Project Info */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={project.img || project.image} 
                alt={project.name}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-bold">{project.name}</h3>
                <p className="text-xs text-slate-500">{plan.name} · {plan.term}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase">Investment Amount</p>
                <p className="font-bold text-lg">${amount.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase">APY</p>
                <p className="font-bold text-lg text-emerald-600">{plan.apy}%</p>
              </div>
              <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase">Monthly Return</p>
                <p className="font-bold text-emerald-600">${returns.monthly.toFixed(2)}</p>
              </div>
              <div className="bg-slate-50 dark:bg-gray-700 p-3 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase">Total Return</p>
                <p className="font-bold text-emerald-600">${returns.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          {/* Payment Method */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold mb-3">Payment Method</h3>
            
            <button
              onClick={() => setPaymentMethod('wallet')}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                paymentMethod === 'wallet' 
                  ? 'border-[#1132d4] bg-[#1132d4]/5' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#1132d4]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#1132d4]">account_balance_wallet</span>
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-sm">Wallet Balance</p>
                <p className="text-xs text-slate-500">
                  Available: ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
              {paymentMethod === 'wallet' && (
                <span className="material-symbols-outlined text-[#1132d4]">check_circle</span>
              )}
            </button>
            
            {/* Insufficient Balance Warning */}
            {!hasEnoughBalance && (
              <div className="mt-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500">warning</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-800 dark:text-red-200">Insufficient Balance</p>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    You need ${(amount - balance).toFixed(2)} more to complete this investment
                  </p>
                </div>
              </div>
            )}
            
            {!hasEnoughBalance && (
              <button
                onClick={() => navigate('/deposit')}
                className="w-full mt-3 py-3 rounded-xl border-2 border-[#1132d4] text-[#1132d4] font-bold text-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Deposit Funds
              </button>
            )}
          </div>
          
          {/* Wallet Info */}
          {wallet && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold mb-3">Connected Wallet</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-xl">🦊</div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{wallet.provider}</p>
                  <p className="text-xs text-slate-500 font-mono">{wallet.shortAddress}</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          )}
          
          {/* Terms */}
          <div className="text-center space-y-2">
            <p className="text-xs text-slate-400">
              By confirming, you agree to the investment terms and conditions.
              Your funds will be locked for the specified term period.
            </p>
          </div>
        </main>
        
        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#101322]/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 p-5 pb-safe">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleConfirmInvestment}
              disabled={isProcessing || !hasEnoughBalance}
              className="w-full bg-gradient-to-r from-[#1132d4] to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#1132d4]/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Confirm Investment — ${amount.toLocaleString()}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

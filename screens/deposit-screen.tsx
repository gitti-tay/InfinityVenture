import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import { useWallet } from '@/app/contexts/WalletContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { useNotification } from '@/app/contexts/NotificationContext';
import api from '@/app/api/client';

interface PaymentMethod {
  id: string; name: string; icon: string; color: string; fee: string;
  processingTime: string; minAmount: number; maxAmount: number;
  type: 'crypto' | 'bank'; requiresKyc: boolean; requiresWallet: boolean;
}

interface WalletStatus {
  kycStatus: string; kycVerified: boolean; walletConnected: boolean;
  wallet: { provider: string; address: string; network: string } | null;
}

export function DepositScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance, deposit, wallet } = useWallet();
  const { success: showSuccess, error: showError } = useNotification();

  const [step, setStep] = useState<'method' | 'amount' | 'details' | 'confirm'>('method');
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [status, setStatus] = useState<WalletStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try { const res = await api.request('GET', '/wallet/status'); if (!cancelled) setStatus(res); } catch {}
      if (!cancelled) setStatusLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const kycVerified = status?.kycVerified || false;
  const walletConnected = status?.walletConnected || false;
  const methods: PaymentMethod[] = [
    { id: 'usdt', name: 'USDT (TRC20)', icon: 'currency_bitcoin', color: 'bg-gradient-to-br from-emerald-500 to-emerald-600', fee: '~$1 network fee', processingTime: '10-30 minutes', minAmount: 50, maxAmount: 100000, type: 'crypto', requiresKyc: false, requiresWallet: true },
    { id: 'usdc', name: 'USDC (ERC20)', icon: 'toll', color: 'bg-gradient-to-br from-cyan-500 to-cyan-600', fee: '~$5-15 network fee', processingTime: '10-30 minutes', minAmount: 50, maxAmount: 100000, type: 'crypto', requiresKyc: false, requiresWallet: true },
    { id: 'bank', name: 'Bank Transfer', icon: 'account_balance', color: 'bg-gradient-to-br from-blue-500 to-blue-600', fee: 'No fee', processingTime: '1-3 business days', minAmount: 100, maxAmount: 50000, type: 'bank', requiresKyc: true, requiresWallet: false },
  ];

  const quickAmounts = [100, 500, 1000, 5000];

  const isMethodAvailable = (m: PaymentMethod): boolean => {
    if (m.requiresKyc && !kycVerified) return false;
    if (m.requiresWallet && !walletConnected) return false;
    return true;
  };

  const getMethodReason = (m: PaymentMethod): string | null => {
    if (m.requiresWallet && !walletConnected) return 'Wallet connection required';
    if (m.requiresKyc && !kycVerified) return status?.kycStatus === 'pending' ? 'KYC verification pending' : 'KYC verification required';
    return null;
  };

  const handleMethodSelect = (m: PaymentMethod) => { if (!isMethodAvailable(m)) return; setSelectedMethod(m); setStep('amount'); };

  const handleAmountNext = () => {
    const val = parseFloat(amount);
    if (!selectedMethod || !val || val < selectedMethod.minAmount) { showError('Invalid Amount', 'Minimum deposit is $' + selectedMethod?.minAmount); return; }
    if (val > selectedMethod.maxAmount) { showError('Exceeds Limit', 'Maximum deposit is $' + selectedMethod?.maxAmount.toLocaleString()); return; }
    setStep(selectedMethod.type === 'crypto' ? 'details' : 'confirm');
  };

  const handleDeposit = async () => {
    setIsProcessing(true);
    const val = parseFloat(amount);
    const result = await deposit(val, selectedMethod!.name, selectedMethod!.id.toUpperCase(), txHash || undefined);
    if (result.success) {
      showSuccess('Deposit Submitted', '$' + val.toLocaleString() + ' deposit is being processed');
      navigate('/deposit-success', { state: { amount: val, method: selectedMethod!.name, txId: result.txId } });
    } else { setIsProcessing(false); showError('Deposit Failed', result.error || 'Please try again'); }
  };

  const renderStep = () => {
    switch (step) {
      case 'method':
        return (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 mb-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Balance</p>
              <p className="text-2xl font-bold">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>

            {!statusLoading && !walletConnected && !kycVerified && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">Setup Required</p>
                <p className="text-[11px] text-amber-600 dark:text-amber-500 leading-relaxed">Connect a wallet for crypto deposits, or complete KYC for bank transfers.</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => navigate('/connect-wallet')} className="flex-1 bg-amber-600 text-white text-xs font-bold py-2 rounded-lg">Connect Wallet</button>
                  <button onClick={() => navigate('/kyc-start')} className="flex-1 border border-amber-400 text-amber-700 dark:text-amber-400 text-xs font-bold py-2 rounded-lg">Start KYC</button>
                </div>
              </div>
            )}

            {!statusLoading && walletConnected && !kycVerified && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-sm">info</span>
                  <p className="text-xs text-blue-700 dark:text-blue-400"><button onClick={() => navigate('/kyc-start')} className="underline font-bold">Complete KYC</button> to unlock bank transfers.</p>
                </div>
              </div>
            )}

            {!statusLoading && !walletConnected && kycVerified && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-sm">info</span>
                  <p className="text-xs text-blue-700 dark:text-blue-400"><button onClick={() => navigate('/connect-wallet')} className="underline font-bold">Connect a wallet</button> to deposit USDT/USDC.</p>
                </div>
              </div>
            )}

            <h3 className="font-bold text-sm text-slate-600 dark:text-gray-300">Select Deposit Method</h3>

            {methods.map(method => {
              const available = isMethodAvailable(method);
              const reason = getMethodReason(method);
              return (
                <button key={method.id} onClick={() => handleMethodSelect(method)} disabled={!available}
                  className={`w-full rounded-xl p-4 border flex items-center gap-4 transition-all text-left ${available ? "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 active:scale-[0.98]" : "bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-50 cursor-not-allowed"}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${available ? method.color : "bg-gray-200 dark:bg-gray-700"}`}>
                    <span className={`material-symbols-outlined ${available ? "text-white" : "text-gray-400"}`}>{method.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${!available ? "text-gray-400" : ""}`}>{method.name}</p>
                    {available ? (
                      <p className="text-xs text-slate-500">{method.fee} · {method.processingTime}</p>
                    ) : (
                      <p className="text-xs text-red-400 font-medium">{reason}</p>
                    )}
                  </div>
                  {available ? (
                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                  ) : (
                    <span className="material-symbols-outlined text-gray-300 dark:text-gray-600">lock</span>
                  )}
                </button>
              );
            })}
          </div>
        );

      case 'amount':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-2">Deposit via {selectedMethod?.name}</p>
              <div className="relative inline-block">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-bold text-slate-300">$</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" autoFocus
                  className="text-5xl font-bold text-center w-full bg-transparent outline-none pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </div>
              <p className="text-xs text-slate-400 mt-2">Min: ${selectedMethod?.minAmount} · Max: ${selectedMethod?.maxAmount.toLocaleString()}</p>
            </div>
            <div className="flex gap-2 justify-center">
              {quickAmounts.map(qa => (
                <button key={qa} onClick={() => setAmount(qa.toString())}
                  className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${amount === qa.toString() ? "bg-[#1132d4] text-white border-[#1132d4]" : "border-gray-200 dark:border-gray-700 text-slate-600 dark:text-gray-300"}`}>
                  ${qa.toLocaleString()}
                </button>
              ))}
            </div>
            <button onClick={handleAmountNext} disabled={!amount || parseFloat(amount) < (selectedMethod?.minAmount || 0)}
              className="w-full bg-[#1132d4] text-white font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
              Continue <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        );

      case 'details':
        if (selectedMethod?.type === 'crypto') {
          const depositAddr = status?.wallet?.address || '';
          return (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 text-center">
                <p className="text-sm text-slate-500 mb-3">Send exactly <span className="font-bold text-foreground">${amount}</span> worth of {selectedMethod.id.toUpperCase()} to the platform deposit address.</p>
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-3">
                  <p className="text-[10px] text-amber-600 font-bold">Platform deposit address will be configured by admin.</p>
                </div>
                {depositAddr && <p className="text-xs text-slate-400 mt-2">Your wallet: {depositAddr.substring(0, 8)}...{depositAddr.substring(depositAddr.length - 6)}</p>}
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <p className="text-xs text-amber-700 dark:text-amber-400"><span className="font-bold">Important:</span> Only send {selectedMethod.id.toUpperCase()} on the {selectedMethod.id === 'usdt' ? 'TRC20' : 'ERC20'} network.</p>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-600 dark:text-gray-300 mb-1.5 block">Transaction Hash</label>
                <input type="text" value={txHash} onChange={e => setTxHash(e.target.value)} placeholder="0x..."
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#1132d4] text-sm font-mono" />
              </div>
              <button onClick={() => setStep('confirm')} className="w-full bg-[#1132d4] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                I've Sent the Payment <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          );
        }
        return null;

      case 'confirm':
        const fee = selectedMethod?.type === 'crypto' ? 1 : 0;
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold mb-4">Deposit Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Method</span><span className="font-bold">{selectedMethod?.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Amount</span><span className="font-bold">${parseFloat(amount).toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Fee</span><span className="font-bold">${fee.toFixed(2)}</span></div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg text-[#1132d4]">${parseFloat(amount).toLocaleString()}</span>
                </div>
              </div>
            </div>
            {status?.wallet && (
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-gray-700 p-4 rounded-xl">
                <span className="material-symbols-outlined text-[#1132d4]">account_balance_wallet</span>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">From Wallet</p>
                  <p className="font-mono text-sm font-bold">{status.wallet.address.substring(0, 6)}...{status.wallet.address.substring(status.wallet.address.length - 4)}</p>
                </div>
              </div>
            )}
            <button onClick={handleDeposit} disabled={isProcessing}
              className="w-full bg-gradient-to-r from-[#1132d4] to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#1132d4]/30 disabled:opacity-50 flex items-center justify-center gap-2">
              {isProcessing ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</>) : (<><span className="material-symbols-outlined text-sm">lock</span>Confirm Deposit</>)}
            </button>
          </div>
        );
    }
  };

  return (
    <PageWrapper hideNav>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b14]">
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#101322]/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-5 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => step === 'method' ? navigate(-1) : setStep(step === 'confirm' ? (selectedMethod?.type === 'crypto' ? 'details' : 'amount') : step === 'details' ? 'amount' : 'method')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-bold text-lg">Deposit</h1>
            <div className="w-10" />
          </div>
          <div className="flex gap-1 mt-3">
            {['method', 'amount', 'details', 'confirm'].map((s, i) => {
              const currentIdx = ['method', 'amount', 'details', 'confirm'].indexOf(step);
              return <div key={s} className={`h-1 flex-1 rounded-full ${i <= currentIdx ? "bg-[#1132d4]" : "bg-gray-200 dark:bg-gray-700"}`} />;
            })}
          </div>
        </header>
        <main className="px-5 py-6">{renderStep()}</main>
      </div>
    </PageWrapper>
  );
}

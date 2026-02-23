import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import { useWallet } from '@/app/contexts/WalletContext';
import { useNotification } from '@/app/contexts/NotificationContext';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  color: string;
  fee: string;
  processingTime: string;
  minAmount: number;
  maxAmount: number;
  type: 'crypto' | 'bank' | 'card';
}

export function DepositScreen() {
  const navigate = useNavigate();
  const { balance, deposit, wallet } = useWallet();
  const { success: showSuccess, error: showError } = useNotification();
  
  const [step, setStep] = useState<'method' | 'amount' | 'details' | 'confirm'>('method');
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Crypto details
  const [depositAddress] = useState('TYDzsYUEpvnYmQk4zGP9xWZmJyTKHsVj8N');
  const [txHash, setTxHash] = useState('');
  
  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardName, setCardName] = useState('');
  
  const methods: PaymentMethod[] = [
    {
      id: 'usdt',
      name: 'USDT (TRC20)',
      icon: 'currency_bitcoin',
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      fee: '~$1 network fee',
      processingTime: '10-30 minutes',
      minAmount: 50,
      maxAmount: 100000,
      type: 'crypto'
    },
    {
      id: 'usdc',
      name: 'USDC (ERC20)',
      icon: 'toll',
      color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      fee: '~$5-15 network fee',
      processingTime: '10-30 minutes',
      minAmount: 50,
      maxAmount: 100000,
      type: 'crypto'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: 'account_balance',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      fee: 'No fee',
      processingTime: '1-3 business days',
      minAmount: 100,
      maxAmount: 50000,
      type: 'bank'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'credit_card',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      fee: '2.5% fee',
      processingTime: 'Instant',
      minAmount: 50,
      maxAmount: 10000,
      type: 'card'
    }
  ];
  
  const quickAmounts = [100, 500, 1000, 5000];
  
  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStep('amount');
  };
  
  const handleAmountNext = () => {
    const val = parseFloat(amount);
    if (!selectedMethod || !val || val < selectedMethod.minAmount) {
      showError('Invalid Amount', `Minimum deposit is $${selectedMethod?.minAmount}`);
      return;
    }
    if (val > selectedMethod.maxAmount) {
      showError('Exceeds Limit', `Maximum deposit is $${selectedMethod?.maxAmount.toLocaleString()}`);
      return;
    }
    setStep(selectedMethod.type === 'crypto' ? 'details' : selectedMethod.type === 'card' ? 'details' : 'confirm');
  };
  
  const handleDeposit = async () => {
    setIsProcessing(true);
    const val = parseFloat(amount);
    
    const result = await deposit(val, selectedMethod!.name, { txHash });
    
    if (result.success) {
      showSuccess('Deposit Successful', `$${val.toLocaleString()} has been added to your wallet`);
      navigate('/deposit-success', {
        state: {
          amount: val,
          method: selectedMethod!.name,
          txId: result.txId,
        }
      });
    } else {
      setIsProcessing(false);
      showError('Deposit Failed', result.error);
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 'method':
        return (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 mb-6">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Balance</p>
              <p className="text-2xl font-bold">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            
            <h3 className="font-bold text-sm text-slate-600 dark:text-gray-300">Select Payment Method</h3>
            
            {methods.map(method => (
              <button
                key={method.id}
                onClick={() => handleMethodSelect(method)}
                className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center gap-4 active:scale-[0.98] transition-transform text-left"
              >
                <div className={`w-12 h-12 rounded-xl ${method.color} flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-white">{method.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{method.name}</p>
                  <p className="text-xs text-slate-500">{method.fee} · {method.processingTime}</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
              </button>
            ))}
          </div>
        );
        
      case 'amount':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-2">Deposit via {selectedMethod?.name}</p>
              <div className="relative inline-block">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-bold text-slate-300">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0"
                  className="text-5xl font-bold text-center w-full bg-transparent outline-none pl-8 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  autoFocus
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Min: ${selectedMethod?.minAmount} · Max: ${selectedMethod?.maxAmount.toLocaleString()}
              </p>
            </div>
            
            <div className="flex gap-2 justify-center">
              {quickAmounts.map(qa => (
                <button
                  key={qa}
                  onClick={() => setAmount(qa.toString())}
                  className={`px-4 py-2 rounded-full border text-sm font-bold transition-all ${
                    amount === qa.toString()
                      ? 'bg-[#1132d4] text-white border-[#1132d4]'
                      : 'border-gray-200 dark:border-gray-700 text-slate-600 dark:text-gray-300'
                  }`}
                >
                  ${qa.toLocaleString()}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleAmountNext}
              disabled={!amount || parseFloat(amount) < (selectedMethod?.minAmount || 0)}
              className="w-full bg-[#1132d4] text-white font-bold py-4 rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Continue
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        );
        
      case 'details':
        if (selectedMethod?.type === 'crypto') {
          return (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 text-center">
                <p className="text-sm text-slate-500 mb-3">Send exactly <span className="font-bold text-foreground">${amount}</span> {selectedMethod.id.toUpperCase()} to:</p>
                
                <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-xl mb-4 break-all">
                  <p className="font-mono text-sm font-bold">{depositAddress}</p>
                </div>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(depositAddress);
                    showSuccess('Copied!', 'Address copied to clipboard');
                  }}
                  className="inline-flex items-center gap-2 text-[#1132d4] font-bold text-sm"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  Copy Address
                </button>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  <span className="font-bold">Important:</span> Only send {selectedMethod.id.toUpperCase()} on the {selectedMethod.id === 'usdt' ? 'TRC20' : 'ERC20'} network. 
                  Sending other tokens may result in permanent loss.
                </p>
              </div>
              
              <div>
                <label className="text-sm font-bold text-slate-600 dark:text-gray-300 mb-1.5 block">
                  Transaction Hash (Optional)
                </label>
                <input
                  type="text"
                  value={txHash}
                  onChange={e => setTxHash(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#1132d4] text-sm font-mono"
                />
              </div>
              
              <button
                onClick={() => setStep('confirm')}
                className="w-full bg-[#1132d4] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
              >
                I've Sent the Payment
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          );
        }
        
        // Card payment details
        return (
          <div className="space-y-4">
            <h3 className="font-bold mb-2">Card Details</h3>
            <div>
              <label className="text-sm font-bold text-slate-600 mb-1.5 block">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#1132d4] text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-bold text-slate-600 mb-1.5 block">Expiry</label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={e => setCardExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#1132d4] text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-600 mb-1.5 block">CVV</label>
                <input
                  type="password"
                  value={cardCVV}
                  onChange={e => setCardCVV(e.target.value.substring(0, 4))}
                  placeholder="***"
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#1132d4] text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-600 mb-1.5 block">Cardholder Name</label>
              <input
                type="text"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                placeholder="Name on card"
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-[#1132d4] text-sm"
              />
            </div>
            <button
              onClick={() => setStep('confirm')}
              className="w-full bg-[#1132d4] text-white font-bold py-4 rounded-xl mt-4"
            >
              Continue
            </button>
          </div>
        );
        
      case 'confirm':
        const fee = selectedMethod?.type === 'card' ? parseFloat(amount) * 0.025 : selectedMethod?.type === 'crypto' ? 1 : 0;
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold mb-4">Deposit Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Method</span>
                  <span className="font-bold">{selectedMethod?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Amount</span>
                  <span className="font-bold">${parseFloat(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Fee</span>
                  <span className="font-bold">${fee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-lg text-[#1132d4]">${(parseFloat(amount)).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {wallet && (
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-gray-700 p-4 rounded-xl">
                <span className="material-symbols-outlined text-[#1132d4]">account_balance_wallet</span>
                <div className="flex-1">
                  <p className="text-xs text-slate-500">Receiving Wallet</p>
                  <p className="font-mono text-sm font-bold">{wallet.shortAddress}</p>
                </div>
              </div>
            )}
            
            <button
              onClick={handleDeposit}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-[#1132d4] to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#1132d4]/30 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Deposit...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Confirm Deposit
                </>
              )}
            </button>
          </div>
        );
    }
  };
  
  return (
    <PageWrapper hideNav>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0b14]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#101322]/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-5 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => step === 'method' ? navigate(-1) : setStep(step === 'confirm' ? (selectedMethod?.type === 'crypto' || selectedMethod?.type === 'card' ? 'details' : 'amount') : step === 'details' ? 'amount' : 'method')}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-bold text-lg">Deposit</h1>
            <div className="w-10"></div>
          </div>
          
          {/* Progress */}
          <div className="flex gap-1 mt-3">
            {['method', 'amount', 'details', 'confirm'].map((s, i) => {
              const steps = ['method', 'amount', 'details', 'confirm'];
              const currentIdx = steps.indexOf(step);
              return (
                <div key={s} className={`h-1 flex-1 rounded-full ${i <= currentIdx ? 'bg-[#1132d4]' : 'bg-gray-200 dark:bg-gray-700'}`} />
              );
            })}
          </div>
        </header>
        
        <main className="px-5 py-6">
          {renderStep()}
        </main>
      </div>
    </PageWrapper>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

interface WithdrawalMethod {
  id: string;
  name: string;
  icon: string;
  color: string;
  fee: string;
  feeAmount: number;
  processingTime: string;
  minAmount: number;
  maxAmount: number;
  type: 'crypto' | 'bank';
}

export function WithdrawScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'method' | 'amount' | 'details' | 'verify' | 'confirm'>('method');
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod | null>(null);
  const [balance] = useState(24590.50);
  const [dailyLimit] = useState(50000);
  
  // Crypto details
  const [walletAddress, setWalletAddress] = useState('');
  
  // Bank details
  const [selectedBank, setSelectedBank] = useState('');
  
  // 2FA Verification
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  
  const methods: WithdrawalMethod[] = [
    {
      id: 'bank',
      name: 'Bank Transfer (ACH)',
      icon: 'account_balance',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      fee: '$25 flat fee',
      feeAmount: 25,
      processingTime: '1-3 business days',
      minAmount: 100,
      maxAmount: 50000,
      type: 'bank'
    },
    {
      id: 'usdt',
      name: 'USDT (TRC20)',
      icon: 'currency_bitcoin',
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      fee: '$1 network fee',
      feeAmount: 1,
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
      fee: '$10 network fee',
      feeAmount: 10,
      processingTime: '10-30 minutes',
      minAmount: 50,
      maxAmount: 100000,
      type: 'crypto'
    }
  ];
  
  const quickAmounts = ['500', '1000', '2500', '5000', 'Max'];
  
  const handleMethodSelect = (method: WithdrawalMethod) => {
    setSelectedMethod(method);
    setStep('amount');
  };
  
  const handleQuickAmount = (amt: string) => {
    if (amt === 'Max') {
      setAmount(balance.toString());
    } else {
      setAmount(amt);
    }
  };
  
  const handleAmountContinue = () => {
    const amountNum = parseFloat(amount);
    if (!selectedMethod) return;
    
    if (amountNum < selectedMethod.minAmount) {
      alert(`Minimum withdrawal is $${selectedMethod.minAmount}`);
      return;
    }
    
    if (amountNum > selectedMethod.maxAmount) {
      alert(`Maximum withdrawal is $${selectedMethod.maxAmount.toLocaleString()}`);
      return;
    }
    
    if (amountNum > balance) {
      alert('Insufficient balance');
      return;
    }
    
    setStep('details');
  };
  
  const handleDetailsContinue = () => {
    if (selectedMethod?.type === 'crypto') {
      if (!walletAddress) {
        alert('Please enter wallet address');
        return;
      }
      if (walletAddress.length < 20) {
        alert('Please enter a valid wallet address');
        return;
      }
    } else if (selectedMethod?.type === 'bank') {
      if (!selectedBank) {
        alert('Please select a bank account');
        return;
      }
    }
    
    setStep('verify');
  };
  
  const handleVerificationComplete = () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      alert('Please enter the 6-digit verification code');
      return;
    }
    
    setStep('confirm');
  };
  
  const handleConfirm = () => {
    navigate('/withdraw-success', {
      state: {
        amount: parseFloat(amount),
        method: selectedMethod?.name,
        processingTime: selectedMethod?.processingTime,
        fee: selectedMethod?.feeAmount
      }
    });
  };
  
  const handleVerificationInput = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`verify-${index + 1}`);
      nextInput?.focus();
    }
  };
  
  const getFinalAmount = () => {
    const amountNum = parseFloat(amount) || 0;
    const fee = selectedMethod?.feeAmount || 0;
    return amountNum - fee;
  };
  
  const goBack = () => {
    if (step === 'method') {
      navigate(-1);
    } else if (step === 'amount') {
      setStep('method');
    } else if (step === 'details') {
      setStep('amount');
    } else if (step === 'verify') {
      setStep('details');
    } else if (step === 'confirm') {
      setStep('verify');
    }
  };
  
  return (
    <PageWrapper hideNav>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#101322]/90 backdrop-blur-xl px-5 py-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={goBack}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Withdraw Funds</h1>
            <p className="text-xs text-slate-500">
              {step === 'method' && 'Choose withdrawal method'}
              {step === 'amount' && 'Enter amount'}
              {step === 'details' && 'Withdrawal details'}
              {step === 'verify' && 'Verify identity'}
              {step === 'confirm' && 'Confirm withdrawal'}
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-red-600 text-sm">lock</span>
            <span className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase">Secure</span>
          </div>
        </header>
        
        {/* Progress Bar */}
        <div className="bg-white dark:bg-[#101322] px-5 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            {['method', 'amount', 'details', 'verify', 'confirm'].map((s, i) => (
              <div key={s} className="flex-1">
                <div className={`h-1 rounded-full ${
                  step === s || (i < ['method', 'amount', 'details', 'verify', 'confirm'].indexOf(step))
                    ? 'bg-red-500'
                    : 'bg-slate-200 dark:bg-gray-700'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <main className="flex-1 px-5 py-6 space-y-6 overflow-y-auto pb-32">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-white/80">account_balance_wallet</span>
                <p className="text-white/80 text-sm font-medium">Available Balance</p>
              </div>
              <h2 className="text-3xl font-bold mb-4">${balance.toLocaleString()}</h2>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/20 text-sm">
                <span className="text-white/60">Daily Limit Remaining</span>
                <span className="font-bold">${dailyLimit.toLocaleString()}</span>
              </div>
              
              {step !== 'method' && selectedMethod && (
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm mt-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${selectedMethod.color} flex items-center justify-center`}>
                      <span className="material-symbols-outlined text-white text-sm">{selectedMethod.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-bold">{selectedMethod.name}</p>
                      <p className="text-white/70 text-xs">{selectedMethod.processingTime}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Step 1: Method Selection */}
          {step === 'method' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Select Withdrawal Method</h3>
              <div className="space-y-3">
                {methods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method)}
                    className="w-full bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 border-slate-200 dark:border-gray-700 hover:border-red-500 transition-all active:scale-[0.98] text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl ${method.color} flex items-center justify-center shrink-0 shadow-lg`}>
                        <span className="material-symbols-outlined text-white text-2xl">{method.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold mb-1">{method.name}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          <span className="text-slate-500">Fee: {method.fee}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">{method.processingTime}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          ${method.minAmount} - ${method.maxAmount.toLocaleString()} limit
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Step 2: Amount */}
          {step === 'amount' && selectedMethod && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-4">Enter Withdrawal Amount</h3>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-100 dark:border-gray-700">
                  <label className="text-slate-500 text-sm font-medium mb-4 block">
                    How much would you like to withdraw?
                  </label>
                  <div className="relative mb-6">
                    <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-5xl font-bold text-slate-300 dark:text-gray-600">$</span>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        setAmount(value);
                      }}
                      className="w-full text-center text-5xl font-bold bg-transparent border-none focus:ring-0 outline-none pl-12"
                      placeholder="0"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {quickAmounts.map(amt => (
                      <button
                        key={amt}
                        onClick={() => handleQuickAmount(amt)}
                        className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-gray-700 hover:bg-red-500 hover:text-white font-bold text-sm transition-all active:scale-95"
                      >
                        {amt === 'Max' ? amt : `$${amt}`}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                    <span>Limits</span>
                    <span className="font-bold">${selectedMethod.minAmount} - ${selectedMethod.maxAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {parseFloat(amount) > 0 && (
                <div className="bg-slate-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-slate-100 dark:border-gray-700">
                  <h4 className="font-bold mb-3 text-sm">Withdrawal Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Withdrawal Amount</span>
                      <span className="font-bold">${parseFloat(amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transaction Fee</span>
                      <span className="font-bold text-red-600">-${selectedMethod.feeAmount.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-200 dark:border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-bold">You'll Receive</span>
                        <span className="font-bold text-lg text-emerald-600">${getFinalAmount().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-amber-600 text-sm">warning</span>
                  <div className="text-xs text-amber-900 dark:text-amber-200">
                    <p className="font-bold mb-1">Important</p>
                    <ul className="space-y-0.5">
                      <li>• Withdrawals are irreversible</li>
                      <li>• Double-check all details before confirming</li>
                      <li>• Processing time: {selectedMethod.processingTime}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Details */}
          {step === 'details' && selectedMethod && (
            <div className="space-y-6">
              <h3 className="font-bold text-lg">Withdrawal Details</h3>
              
              {selectedMethod.type === 'crypto' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold mb-2 block">Wallet Address</label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder={`Enter ${selectedMethod.name.split(' ')[0]} wallet address`}
                      className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-red-500 outline-none transition-colors font-mono text-sm"
                    />
                  </div>
                  
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-red-600 text-sm">error</span>
                      <div className="text-xs text-red-900 dark:text-red-200">
                        <p className="font-bold mb-1">Critical Warning</p>
                        <ul className="space-y-0.5">
                          <li>• Only withdraw to {selectedMethod.name.split(' ')[0]} addresses</li>
                          <li>• Sending to wrong network will result in permanent loss</li>
                          <li>• We cannot recover funds sent to incorrect addresses</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedMethod.type === 'bank' && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold mb-3 block">Select Bank Account</label>
                    <div className="space-y-2">
                      {[
                        { id: 'chase', name: 'Chase Bank', last4: '4521', routing: '021000021' },
                        { id: 'bofa', name: 'Bank of America', last4: '8932', routing: '026009593' }
                      ].map(bank => (
                        <button
                          key={bank.id}
                          onClick={() => setSelectedBank(bank.id)}
                          className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                            selectedBank === bank.id
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                              : 'border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <span className="material-symbols-outlined text-blue-600">account_balance</span>
                            </div>
                            <div className="text-left">
                              <p className="font-bold">{bank.name}</p>
                              <p className="text-xs text-slate-500">••••{bank.last4} • Routing: {bank.routing}</p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedBank === bank.id ? 'border-red-500' : 'border-slate-300'
                          }`}>
                            {selectedBank === bank.id && (
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Step 4: 2FA Verification */}
          {step === 'verify' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Security Verification</h3>
                <p className="text-slate-500 text-sm">
                  Enter the 6-digit code sent to your registered email
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-slate-200 dark:border-gray-700">
                <div className="flex justify-center gap-2 mb-6">
                  {verificationCode.map((digit, index) => (
                    <input
                      key={index}
                      id={`verify-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleVerificationInput(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && index > 0) {
                          const prevInput = document.getElementById(`verify-${index - 1}`);
                          prevInput?.focus();
                        }
                      }}
                      className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-200 dark:border-gray-700 focus:border-red-500 outline-none transition-colors"
                    />
                  ))}
                </div>
                
                <button className="w-full text-center text-sm text-[#1132d4] font-bold hover:underline">
                  Resend Code
                </button>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-blue-600 text-sm">info</span>
                  <p className="text-xs text-blue-900 dark:text-blue-200">
                    This additional security step helps protect your account from unauthorized withdrawals.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 5: Confirmation */}
          {step === 'confirm' && selectedMethod && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-4">Review & Confirm</h3>
                
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 overflow-hidden">
                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Withdrawal Amount</p>
                      <p className="text-3xl font-bold text-red-600">${parseFloat(amount).toFixed(2)}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-gray-700">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Method</p>
                        <p className="font-bold text-sm">{selectedMethod.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Processing Time</p>
                        <p className="font-bold text-sm">{selectedMethod.processingTime}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Transaction Fee</p>
                        <p className="font-bold text-sm text-red-600">${selectedMethod.feeAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">You'll Receive</p>
                        <p className="font-bold text-sm text-emerald-600">${getFinalAmount().toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {selectedMethod.type === 'crypto' && walletAddress && (
                      <div className="pt-4 border-t border-slate-100 dark:border-gray-700">
                        <p className="text-xs text-slate-500 mb-1">Wallet Address</p>
                        <p className="font-mono text-xs break-all">{walletAddress}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-5 border-t border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-amber-600">warning</span>
                      <div className="flex-1 text-sm">
                        <p className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                          Final Warning
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300">
                          This withdrawal cannot be reversed. Please verify all details are correct.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        
        {/* Bottom CTA */}
        <div className="sticky bottom-0 p-5 bg-gradient-to-t from-white via-white to-transparent dark:from-[#101322] dark:via-[#101322] dark:to-transparent border-t border-gray-100 dark:border-gray-800">
          {step === 'amount' && (
            <button
              onClick={handleAmountContinue}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full h-14 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold text-base shadow-lg shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              Continue
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          )}
          
          {step === 'details' && (
            <button
              onClick={handleDetailsContinue}
              className="w-full h-14 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold text-base shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              Continue to Verification
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          )}
          
          {step === 'verify' && (
            <button
              onClick={handleVerificationComplete}
              className="w-full h-14 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold text-base shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              Verify & Continue
              <span className="material-symbols-outlined">verified_user</span>
            </button>
          )}
          
          {step === 'confirm' && (
            <button
              onClick={handleConfirm}
              className="w-full h-14 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold text-base shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">arrow_circle_up</span>
              Confirm Withdrawal ${parseFloat(amount).toFixed(2)}
            </button>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
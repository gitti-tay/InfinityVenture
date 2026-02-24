import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'crypto';
  name: string;
  details: string;
  icon: string;
  default: boolean;
  verified: boolean;
  last4?: string;
  expiry?: string;
  network?: string;
  address?: string;
}

export function PaymentMethodsScreen() {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      details: 'Expires 12/25',
      icon: 'credit_card',
      default: true,
      verified: true,
      last4: '4242',
      expiry: '12/25'
    },
    {
      id: '2',
      type: 'bank',
      name: 'Chase Bank',
      details: 'Account ****6789',
      icon: 'account_balance',
      default: false,
      verified: true,
      last4: '6789'
    },
    {
      id: '3',
      type: 'crypto',
      name: 'MetaMask Wallet',
      details: '0x1234...abcd',
      icon: 'account_balance_wallet',
      default: false,
      verified: true,
      address: '0x1234567890abcdef1234567890abcdef12345678'
    }
  ]);
  
  const [showAddMenu, setShowAddMenu] = useState(false);
  
  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(m => ({
        ...m,
        default: m.id === id
      }))
    );
  };
  
  const handleRemove = (id: string) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(methods => methods.filter(m => m.id !== id));
    }
  };
  
  const handleAddMethod = (type: 'card' | 'bank' | 'crypto') => {
    setShowAddMenu(false);
    if (type === 'card') {
      navigate('/add-card');
    } else if (type === 'bank') {
      navigate('/add-bank');
    } else if (type === 'crypto') {
      navigate('/connect-wallet');
    }
  };
  
  return (
    <PageWrapper hideNav>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#101322]/90 backdrop-blur-xl px-5 py-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Payment Methods</h1>
            <p className="text-xs text-slate-500">Manage your payment options</p>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-emerald-600 text-sm">verified_user</span>
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">Secure</span>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 px-5 py-6 space-y-6 overflow-y-auto pb-24">
          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-[#1132d4] shrink-0">info</span>
              <div className="text-sm text-blue-900 dark:text-blue-200">
                <p className="font-bold mb-1">Secure Payment Processing</p>
                <p className="text-xs">All payment information is encrypted and securely stored. We never store your full card details.</p>
              </div>
            </div>
          </div>
          
          {/* Payment Methods List */}
          <div>
            <h3 className="font-bold text-lg mb-4">Your Payment Methods</h3>
            <div className="space-y-3">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-slate-100 dark:border-gray-700 p-5 relative overflow-hidden"
                >
                  {method.default && (
                    <div className="absolute top-3 right-3 bg-[#1132d4] text-white text-[10px] font-bold px-2 py-1 rounded-full">
                      DEFAULT
                    </div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                      method.type === 'card' ? 'bg-purple-50 dark:bg-purple-900/20' :
                      method.type === 'bank' ? 'bg-blue-50 dark:bg-blue-900/20' :
                      'bg-orange-50 dark:bg-orange-900/20'
                    }`}>
                      <span className={`material-symbols-outlined text-2xl ${
                        method.type === 'card' ? 'text-purple-600' :
                        method.type === 'bank' ? 'text-blue-600' :
                        'text-orange-600'
                      }`}>
                        {method.icon}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold">{method.name}</h4>
                        {method.verified && (
                          <span className="material-symbols-outlined text-emerald-500 text-sm">
                            verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mb-3">{method.details}</p>
                      
                      <div className="flex gap-2">
                        {!method.default && (
                          <button
                            onClick={() => handleSetDefault(method.id)}
                            className="text-xs font-bold text-[#1132d4] hover:underline"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => handleRemove(method.id)}
                          className="text-xs font-bold text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Security Features */}
          <div className="bg-slate-50 dark:bg-gray-800/50 rounded-2xl border border-slate-100 dark:border-gray-700 p-5">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#1132d4]">security</span>
              Security Features
            </h4>
            <div className="space-y-3">
              {[
                { icon: 'encrypted', text: 'PCI DSS Level 1 Compliant' },
                { icon: 'shield_lock', text: '256-bit SSL Encryption' },
                { icon: 'verified_user', text: '3D Secure Authentication' },
                { icon: 'lock', text: 'Tokenized Payment Storage' }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600 text-sm">
                    {feature.icon}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-gray-300">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
        
        {/* Add Payment Method Button */}
        <div className="sticky bottom-0 p-5 bg-gradient-to-t from-white via-white to-transparent dark:from-[#101322] dark:via-[#101322] dark:to-transparent">
          <button
            onClick={() => setShowAddMenu(true)}
            className="w-full h-14 bg-gradient-to-r from-[#1132d4] to-blue-600 text-white rounded-xl font-bold text-base shadow-lg shadow-[#1132d4]/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">add</span>
            Add Payment Method
          </button>
        </div>
      </div>
      
      {/* Add Method Modal */}
      {showAddMenu && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end"
          onClick={() => setShowAddMenu(false)}
        >
          <div 
            className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-t-3xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6"></div>
            <h3 className="font-bold text-xl mb-6">Add Payment Method</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => handleAddMethod('card')}
                className="w-full bg-white dark:bg-gray-700 border-2 border-slate-200 dark:border-gray-600 rounded-xl p-4 flex items-center gap-4 hover:border-[#1132d4] transition-all active:scale-95"
              >
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-purple-600 text-2xl">credit_card</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold">Credit/Debit Card</p>
                  <p className="text-xs text-slate-500">Visa, Mastercard, Amex</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
              </button>
              
              <button
                onClick={() => handleAddMethod('bank')}
                className="w-full bg-white dark:bg-gray-700 border-2 border-slate-200 dark:border-gray-600 rounded-xl p-4 flex items-center gap-4 hover:border-[#1132d4] transition-all active:scale-95"
              >
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600 text-2xl">account_balance</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold">Bank Account</p>
                  <p className="text-xs text-slate-500">ACH Direct Debit</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
              </button>
              
              <button
                onClick={() => handleAddMethod('crypto')}
                className="w-full bg-white dark:bg-gray-700 border-2 border-slate-200 dark:border-gray-600 rounded-xl p-4 flex items-center gap-4 hover:border-[#1132d4] transition-all active:scale-95"
              >
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-orange-600 text-2xl">account_balance_wallet</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold">Crypto Wallet</p>
                  <p className="text-xs text-slate-500">USDT, USDC, ETH</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowAddMenu(false)}
              className="w-full mt-6 py-3 text-slate-500 font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </PageWrapper>
  );
}
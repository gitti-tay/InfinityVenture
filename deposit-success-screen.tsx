import { useNavigate, useLocation } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

export function DepositSuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { amount, method, processingTime } = location.state || {
    amount: 0,
    method: 'Payment Method',
    processingTime: 'Instant'
  };
  
  const transactionId = `DEP${Date.now().toString().slice(-10)}`;
  
  return (
    <PageWrapper hideNav>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-5 py-12">
          {/* Success Animation */}
          <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/30 animate-scale-in">
            <span className="material-symbols-outlined text-white text-6xl">check_circle</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-2 text-center">Deposit Initiated!</h1>
          <p className="text-slate-500 text-center mb-8 max-w-sm">
            Your deposit has been successfully submitted and is being processed.
          </p>
          
          {/* Transaction Details Card */}
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl border border-slate-200 dark:border-gray-700 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#1132d4] to-blue-600 p-6 text-white">
              <p className="text-white/80 text-sm mb-2">Deposit Amount</p>
              <p className="text-4xl font-bold">${amount.toFixed(2)}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between py-3 border-b border-slate-100 dark:border-gray-700">
                <span className="text-slate-500 text-sm">Transaction ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm">{transactionId}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(transactionId);
                      alert('Transaction ID copied!');
                    }}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-gray-700 rounded"
                  >
                    <span className="material-symbols-outlined text-sm text-[#1132d4]">content_copy</span>
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between py-3 border-b border-slate-100 dark:border-gray-700">
                <span className="text-slate-500 text-sm">Payment Method</span>
                <span className="font-bold text-sm">{method}</span>
              </div>
              
              <div className="flex justify-between py-3 border-b border-slate-100 dark:border-gray-700">
                <span className="text-slate-500 text-sm">Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="font-bold text-sm text-amber-600">Processing</span>
                </div>
              </div>
              
              <div className="flex justify-between py-3">
                <span className="text-slate-500 text-sm">Expected Arrival</span>
                <span className="font-bold text-sm">{processingTime}</span>
              </div>
            </div>
          </div>
          
          {/* Info Banner */}
          <div className="w-full max-w-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-6">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-blue-600 shrink-0">info</span>
              <div className="text-sm text-blue-900 dark:text-blue-200">
                <p className="font-bold mb-2">What happens next?</p>
                <ul className="space-y-1 text-xs">
                  <li>• You'll receive a notification once the deposit is confirmed</li>
                  <li>• The funds will be reflected in your available balance</li>
                  <li>• You can track the status in your transaction history</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="w-full max-w-md space-y-3">
            <button
              onClick={() => navigate('/wallet')}
              className="w-full h-14 bg-gradient-to-r from-[#1132d4] to-blue-600 text-white rounded-xl font-bold text-base shadow-lg shadow-[#1132d4]/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              View Wallet
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            
            <button
              onClick={() => navigate('/home')}
              className="w-full h-14 bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-gray-700 rounded-xl font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">home</span>
              Back to Home
            </button>
          </div>
        </main>
      </div>
      
      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </PageWrapper>
  );
}
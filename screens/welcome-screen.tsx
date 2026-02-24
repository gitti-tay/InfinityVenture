import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

export function WelcomeScreen() {
  const navigate = useNavigate();
  
  return (
    <PageWrapper hideNav className="justify-between overflow-hidden relative">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-[#1132d4]/10 to-transparent"></div>
        <div className="absolute top-[10%] right-[-10%] w-[300px] h-[300px] bg-[#1132d4]/5 rounded-full blur-3xl"></div>
      </div>
      
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-6">
        <div className="w-64 h-64 relative mb-12 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1132d4]/10 to-blue-500/10 rounded-full blur-2xl"></div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700">
            <span className="material-symbols-outlined text-7xl text-[#1132d4]">account_balance_wallet</span>
          </div>
        </div>
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1132d4]/10 text-[#1132d4] text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1132d4]"></span>
            Trusted by 50,000+ Investors
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight leading-tight">
            Institutional-Grade <br/> Assets for <span className="text-[#1132d4]">Everyone</span>
          </h1>
          
          <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
            Access fractional ownership in premium real estate and high-yield private credit opportunities.
          </p>
        </div>
      </main>
      
      <div className="z-20 w-full px-6 pb-12">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/signup')} 
            className="w-full bg-[#1132d4] hover:bg-[#0d26a3] text-white font-semibold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]"
          >
            Get Started
          </button>
          <button 
            onClick={() => navigate('/login')} 
            className="w-full bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-slate-900 dark:text-white font-medium py-4 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}
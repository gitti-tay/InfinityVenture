import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

export function NotificationsScreen() {
  const navigate = useNavigate();
  
  return (
    <PageWrapper hideNav className="bg-white dark:bg-[#101322]">
      <header className="px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Notifications</h1>
        <button className="text-sm font-bold text-[#1132d4]">Mark all</button>
      </header>
      
      <main className="px-5 py-6 space-y-4 overflow-y-auto pb-24">
        <div className="bg-[#1132d4]/5 dark:bg-[#1132d4]/10 p-4 rounded-2xl border border-[#1132d4]/20 flex gap-4">
          <div className="size-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <span className="material-symbols-outlined">bolt</span>
          </div>
          <div>
            <h3 className="text-sm font-bold">New Opportunity</h3>
            <p className="text-xs text-slate-500 mt-1">
              Solar Farm Launch is now open for funding. Target APY 14.5% with guaranteed payouts.
            </p>
            <span className="text-[10px] text-slate-400 mt-2 block">2 hours ago</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-slate-100 dark:border-gray-700 flex gap-4">
          <div className="size-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <span className="material-symbols-outlined">payments</span>
          </div>
          <div>
            <h3 className="text-sm font-bold">Yield Payout</h3>
            <p className="text-xs text-slate-500 mt-1">
              Distribution of +$124.50 USDT from SCN Stem Cell project has been credited.
            </p>
            <span className="text-[10px] text-slate-400 mt-2 block">5 hours ago</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-slate-100 dark:border-gray-700 flex gap-4">
          <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <span className="material-symbols-outlined">info</span>
          </div>
          <div>
            <h3 className="text-sm font-bold">KYC Verification Complete</h3>
            <p className="text-xs text-slate-500 mt-1">
              Your identity verification has been approved. You can now invest up to $50,000 daily.
            </p>
            <span className="text-[10px] text-slate-400 mt-2 block">1 day ago</span>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
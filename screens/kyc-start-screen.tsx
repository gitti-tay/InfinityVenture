import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

export function KYCStartScreen() {
  const navigate = useNavigate();
  
  const steps = [
    { icon: 'person', title: '1. Personal Information', desc: 'Basic details like name and address' },
    { icon: 'id_card', title: '2. ID Document Upload', desc: 'Scan your passport or license' },
    { icon: 'face', title: '3. Face Verification', desc: 'Selfie to confirm identity' }
  ];
  
  return (
    <PageWrapper hideNav className="bg-background">
      <div className="flex items-center p-4 justify-between sticky top-0 bg-white/80 dark:bg-[#101322]/80 backdrop-blur-md">
        <button 
          onClick={() => navigate(-1)} 
          className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="bg-slate-200 dark:bg-gray-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
          Step 0 of 3
        </div>
      </div>
      
      <div className="px-6 py-4 text-center">
        <div className="size-24 rounded-full bg-[#1132d4]/10 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[#1132d4] text-[48px] fill-1">shield_lock</span>
        </div>
        <h1 className="text-2xl font-bold mb-3">Verify Your Identity</h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Required to secure your RWA investments and comply with regulations.
        </p>
      </div>
      
      <div className="flex-1 px-4 space-y-3">
        {steps.map((s, idx) => (
          <div 
            key={idx} 
            className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700 shadow-sm"
          >
            <div className="size-12 rounded-full bg-blue-50 dark:bg-gray-700 text-[#1132d4] flex items-center justify-center">
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{s.title}</p>
              <p className="text-xs text-slate-500">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-6 pb-12 mt-auto">
        <button 
          onClick={() => navigate('/home')} 
          className="w-full h-14 bg-[#1132d4] text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          Start Verification
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </PageWrapper>
  );
}
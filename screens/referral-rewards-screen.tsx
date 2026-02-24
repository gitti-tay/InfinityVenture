import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

export function ReferralRewardsScreen() {
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  
  const referralData = {
    code: 'ALEX2024',
    totalEarned: 450,
    pendingRewards: 150,
    totalReferrals: 9,
    activeReferrals: 6,
    tier: 'Gold',
    nextTier: 'Platinum',
    referralsToNextTier: 1
  };
  
  const referralHistory = [
    { name: 'John Smith', date: '2026-01-28', status: 'active', earned: 100, avatar: '👨' },
    { name: 'Sarah Johnson', date: '2026-01-25', status: 'active', earned: 100, avatar: '👩' },
    { name: 'Mike Davis', date: '2026-01-20', status: 'active', earned: 50, avatar: '👨‍💼' },
    { name: 'Emma Wilson', date: '2026-01-15', status: 'pending', earned: 50, avatar: '👩‍💼' },
    { name: 'David Brown', date: '2026-01-10', status: 'pending', earned: 50, avatar: '🧑' },
    { name: 'Lisa Anderson', date: '2026-01-05', status: 'pending', earned: 50, avatar: '👩‍🦰' }
  ];
  
  const tiers = [
    { name: 'Bronze', min: 0, bonus: '$50', color: 'bg-amber-700' },
    { name: 'Silver', min: 3, bonus: '$75', color: 'bg-slate-400' },
    { name: 'Gold', min: 5, bonus: '$100', color: 'bg-amber-500' },
    { name: 'Platinum', min: 10, bonus: '$150', color: 'bg-purple-500' }
  ];
  
  const copyReferralCode = () => {
    const textArea = document.createElement('textarea');
    textArea.value = referralData.code;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      textArea.remove();
      alert('Referral code copied to clipboard!');
    } catch (err) {
      textArea.remove();
      alert(`Your referral code: ${referralData.code}`);
    }
  };
  
  const shareReferral = (platform: string) => {
    const message = `Join me on InfinityVentures and get $50 bonus! Use my code: ${referralData.code}`;
    alert(`Sharing to ${platform}: ${message}`);
  };
  
  return (
    <PageWrapper>
      <header className="px-5 py-4 flex items-center gap-4 bg-white/80 dark:bg-[#101322]/80 sticky top-0 z-10 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold flex-1">Referral Rewards</h1>
        <button 
          onClick={() => navigate('/qr-scanner', { state: { type: 'referral' } })}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="material-symbols-outlined">qr_code_scanner</span>
        </button>
      </header>
      
      <main className="px-5 py-6 space-y-6 overflow-y-auto pb-24">
        {/* Earnings Card */}
        <div className="bg-gradient-to-br from-[#1132d4] to-blue-600 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-white/80">card_giftcard</span>
            <p className="text-white/80 text-sm font-medium">Total Earnings</p>
          </div>
          <h2 className="text-4xl font-bold mb-6">${referralData.totalEarned}</h2>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-white/60 text-xs uppercase mb-1">Pending</p>
              <p className="text-xl font-bold">${referralData.pendingRewards}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase mb-1">Referrals</p>
              <p className="text-xl font-bold">{referralData.totalReferrals}</p>
            </div>
          </div>
        </div>
        
        {/* Current Tier */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">Current Tier</p>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold">{referralData.tier}</h3>
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-sm">stars</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase mb-1">Bonus per Referral</p>
              <p className="text-2xl font-bold text-[#1132d4]">$100</p>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-gray-700 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-bold">Progress to {referralData.nextTier}</p>
              <span className="text-sm text-slate-500">
                {referralData.totalReferrals} / {referralData.totalReferrals + referralData.referralsToNextTier}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#1132d4] to-purple-600 rounded-full transition-all"
                style={{ width: '90%' }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {referralData.referralsToNextTier} more referral to unlock {referralData.nextTier} tier!
            </p>
          </div>
        </div>
        
        {/* Share Referral Code */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700">
          <h3 className="font-bold mb-4">Your Referral Code</h3>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <code className="flex-1 bg-white dark:bg-gray-700 px-4 py-3 rounded-lg font-mono font-bold text-xl text-center">
                {referralData.code}
              </code>
              <button 
                onClick={copyReferralCode}
                className="p-3 bg-[#1132d4] text-white rounded-lg active:scale-95 transition-transform shrink-0"
              >
                <span className="material-symbols-outlined">content_copy</span>
              </button>
            </div>
            
            <button 
              onClick={() => setShowQR(!showQR)}
              className="w-full py-2 bg-white dark:bg-gray-700 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">qr_code</span>
              {showQR ? 'Hide QR Code' : 'Show QR Code'}
            </button>
          </div>
          
          {showQR && (
            <div className="flex justify-center mb-4 animate-in">
              <div className="bg-white p-4 rounded-xl border-4 border-slate-200">
                <div className="w-48 h-48 bg-slate-100 flex items-center justify-center">
                  <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-slate-400 mb-2">qr_code</span>
                    <p className="text-xs text-slate-500 font-mono">{referralData.code}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <p className="text-sm font-bold mb-3">Share via:</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'WhatsApp', icon: '💬', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' },
                { name: 'Telegram', icon: '✈️', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
                { name: 'Twitter', icon: '🐦', color: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600' },
                { name: 'Copy', icon: '📋', color: 'bg-slate-50 dark:bg-gray-700 text-slate-600' }
              ].map(platform => (
                <button
                  key={platform.name}
                  onClick={() => platform.name === 'Copy' ? copyReferralCode() : shareReferral(platform.name)}
                  className={`p-3 rounded-xl font-bold text-xs ${platform.color} flex flex-col items-center gap-1 active:scale-95 transition-transform`}
                >
                  <span className="text-2xl">{platform.icon}</span>
                  {platform.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Tier Benefits */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700">
          <h3 className="font-bold mb-4">Reward Tiers</h3>
          
          <div className="space-y-3">
            {tiers.map((tier, i) => (
              <div 
                key={tier.name}
                className={`p-4 rounded-xl border-2 transition-all ${
                  tier.name === referralData.tier
                    ? 'border-[#1132d4] bg-[#1132d4]/5'
                    : 'border-slate-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${tier.color} rounded-full flex items-center justify-center text-white font-bold`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold">{tier.name}</p>
                      {tier.name === referralData.tier && (
                        <span className="bg-[#1132d4] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      {tier.min} referrals • {tier.bonus} per friend
                    </p>
                  </div>
                  <span className="text-lg font-bold text-[#1132d4]">{tier.bonus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Referral History */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Referral History</h3>
            <span className="text-sm text-slate-500">{referralData.totalReferrals} Total</span>
          </div>
          
          <div className="space-y-2">
            {referralHistory.map((referral, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-gray-700">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1132d4] to-blue-600 rounded-full flex items-center justify-center text-xl">
                  {referral.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{referral.name}</p>
                  <p className="text-xs text-slate-500">{referral.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600">+${referral.earned}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    referral.status === 'active' 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  }`}>
                    {referral.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* How It Works */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">info</span>
            How It Works
          </h4>
          <ol className="space-y-2 text-sm text-blue-900 dark:text-blue-200">
            <li className="flex gap-2">
              <span className="font-bold shrink-0">1.</span>
              <span>Share your referral code with friends</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold shrink-0">2.</span>
              <span>They sign up and complete KYC verification</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold shrink-0">3.</span>
              <span>After their first investment of $100+, you both earn rewards!</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold shrink-0">4.</span>
              <span>Unlock higher tiers for bigger bonuses</span>
            </li>
          </ol>
        </div>
      </main>
      
      <style>{`
        @keyframes in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in {
          animation: in 0.3s ease-out;
        }
      `}</style>
    </PageWrapper>
  );
}
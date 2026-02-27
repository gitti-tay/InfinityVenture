import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import { useAuth } from '@/app/contexts/AuthContext';

export function ReferralRewardsScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const referralCode = user?.id ? user.id.substring(0, 8).toUpperCase() : 'INVITE';

  const copyCode = () => {
    try {
      navigator.clipboard.writeText(referralCode);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = referralCode;
      ta.style.position = 'fixed';
      ta.style.left = '-999999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
  };

  return (
    <PageWrapper>
      <header className="lg:hidden px-5 py-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="material-icons">arrow_back</span>
        </button>
        <h1 className="text-xl font-bold flex-1">Referral Rewards</h1>
      </header>

      <div className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-xl font-bold">Referral Rewards</h1>
      </div>

      <main className="px-5 lg:px-6 py-6 space-y-6 pb-24 lg:pb-8">
        {/* Earnings Card */}
        <div className="bg-gradient-to-br from-[#1132d4] to-blue-600 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-icons text-white/80">card_giftcard</span>
            <p className="text-white/80 text-sm font-medium">Total Earnings</p>
          </div>
          <h2 className="text-4xl font-bold mb-6">$0.00</h2>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-white/60 text-xs uppercase mb-1">Referrals</p>
              <p className="text-xl font-bold">0</p>
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase mb-1">Pending</p>
              <p className="text-xl font-bold">$0.00</p>
            </div>
          </div>
        </div>

        {/* Your Referral Code */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700">
          <h3 className="font-bold mb-4">Your Referral Code</h3>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <code className="flex-1 bg-white dark:bg-gray-700 px-4 py-3 rounded-lg font-mono font-bold text-xl text-center">
                {referralCode}
              </code>
              <button
                onClick={copyCode}
                className="p-3 bg-[#1132d4] text-white rounded-lg active:scale-95 transition-transform shrink-0"
              >
                <span className="material-icons">content_copy</span>
              </button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
          <h4 className="font-bold mb-3 flex items-center gap-2">
            <span className="material-icons text-blue-600">info</span>
            How It Works
          </h4>
          <div className="space-y-3 text-sm text-blue-900 dark:text-blue-200">
            <p>1. Share your referral code with friends</p>
            <p>2. They sign up and complete KYC verification</p>
            <p>3. After their first investment of $100+, you both earn rewards!</p>
            <p>4. Unlock higher tiers for bigger bonuses</p>
          </div>
        </div>

        {/* Empty Referral History */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700">
          <h3 className="font-bold mb-4">Referral History</h3>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="material-icons text-4xl text-gray-300 mb-3">group_add</span>
            <p className="text-sm text-gray-500 max-w-xs">
              No referrals yet. Share your code to start earning rewards!
            </p>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}

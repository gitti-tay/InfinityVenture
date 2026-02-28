import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '../components/page-wrapper';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';
import { PROJECTS } from '../data/projects';

const API_BASE = window.location.origin + '/api';

function useApiGet<T>(path: string, token: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch(API_BASE + path, {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [path, token]);

  return { data, loading };
}

const getRiskBadgeClass = (risk: string): string => {
  if (risk.includes('Low')) return 'bg-green-100 text-green-700';
  if (risk.includes('High')) return 'bg-red-100 text-red-700';
  return 'bg-amber-100 text-amber-700';
};

const getTokenBadgeLabel = (tokenType: string): string => {
  if (tokenType === 'HYBRID') return 'HYB';
  if (tokenType === 'REVENUE_SHARE') return 'RST';
  return 'INT';
};

export function HomeScreen() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { wallet } = useWallet();

  const { data: investData } = useApiGet<any>('/investments', token);
  const { data: notifData } = useApiGet<any>('/notifications?unread=true', token);

  const investments = investData?.investments || [];
  const unreadCount = notifData?.notifications?.filter((n: any) => !n.read)?.length || 0;

  const totalInvested = investments.reduce((s: number, i: any) => s + (i.amount || 0), 0);
  const totalEarned = investments.reduce((s: number, i: any) => s + (i.totalEarned || 0), 0);
  const portfolioValue = totalInvested + totalEarned;

  const growthPercent = totalInvested > 0
    ? ((totalEarned / totalInvested) * 100).toFixed(1)
    : '0.0';

  return (
    <PageWrapper>
      <div className="space-y-6 pb-24 lg:pb-8 px-0 lg:px-4">
        {/* Header - mobile only */}
        <div className="lg:hidden flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">InfinityVentures</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/notifications')} className="relative p-2">
              <span className="material-icons text-2xl">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button onClick={() => navigate('/settings')} className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
              {user?.fullName?.charAt(0) || 'U'}
            </button>
          </div>
        </div>

        {/* Connect Wallet Banner */}
        {!wallet && (
          <button onClick={() => navigate('/connect-wallet')} className="w-full flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-left">
            <span className="material-icons text-amber-600">link</span>
            <div>
              <p className="font-semibold text-amber-900">Connect Your Wallet</p>
              <p className="text-xs text-amber-700">Connect a wallet to start investing</p>
            </div>
            <span className="material-icons text-amber-400 ml-auto">chevron_right</span>
          </button>
        )}

        {/* Portfolio Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white">
          <p className="text-xs font-medium tracking-wider opacity-80 mb-1">PORTFOLIO VALUE</p>
          <h2 className="text-4xl font-bold">
            ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <span className="text-xs opacity-70 ml-1">USDT</span>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-xs opacity-70">MONTHLY YIELD</p>
              <p className="text-lg font-semibold">
                +${totalEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-70">GROWTH</p>
              <p className="text-lg font-semibold flex items-center gap-1">
                <span className="material-icons text-sm">
                  {parseFloat(growthPercent) >= 0 ? 'trending_up' : 'trending_down'}
                </span>
                {growthPercent}%
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => navigate('/deposit')} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="material-icons text-2xl text-blue-600">add</span>
            <span className="text-xs font-medium text-gray-600">DEPOSIT</span>
          </button>
          <button onClick={() => navigate('/withdraw')} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="material-icons text-2xl text-blue-600">currency_exchange</span>
            <span className="text-xs font-medium text-gray-600">WITHDRAW</span>
          </button>
          <button onClick={() => navigate('/reports')} className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <span className="material-icons text-2xl text-blue-600">analytics</span>
            <span className="text-xs font-medium text-gray-600">REPORTS</span>
          </button>
        </div>

        {/* Opportunities — using static RWA project data */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">Opportunities</h3>
            <button onClick={() => navigate('/invest')} className="text-sm font-semibold text-blue-600">VIEW ALL</button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:mx-0 lg:px-0">
            {PROJECTS.map(p => (
              <button
                key={p.id}
                onClick={() => navigate('/project/' + p.id)}
                className="min-w-[220px] lg:min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left flex-shrink-0"
              >
                <div className="relative">
                  <img src={p.img} alt={p.name} className="w-full h-32 object-cover" />
                  {p.tokenType && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-blue-600/90 text-white text-[9px] font-bold rounded backdrop-blur-sm">
                      {getTokenBadgeLabel(p.tokenType)}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm">{p.id.toUpperCase()} — {p.name.split(' — ').pop()}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <span className="material-icons text-xs">location_on</span>
                    {p.location}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <div>
                      <span className="text-gray-400">APY</span>
                      <p className="font-bold text-blue-600">{p.apy}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">TERM</span>
                      <p className="font-bold">{p.term}</p>
                    </div>
                  </div>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold ${getRiskBadgeClass(p.risk)}`}>
                    {p.risk.toUpperCase()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

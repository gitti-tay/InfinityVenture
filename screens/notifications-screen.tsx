import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import { useAuth } from '@/app/contexts/AuthContext';

const API_BASE = window.location.origin + '/api';

export function NotificationsScreen() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(API_BASE + '/notifications', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setNotifications(d.notifications || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  const markAllRead = () => {
    if (!token) return;
    fetch(API_BASE + '/notifications/read-all', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token }
    }).then(() => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    });
  };

  const iconMap: Record<string, { icon: string; bg: string; color: string }> = {
    investment: { icon: 'trending_up', bg: 'bg-blue-100', color: 'text-blue-600' },
    yield: { icon: 'payments', bg: 'bg-emerald-100', color: 'text-emerald-600' },
    kyc: { icon: 'verified_user', bg: 'bg-green-100', color: 'text-green-600' },
    system: { icon: 'info', bg: 'bg-slate-100', color: 'text-slate-600' },
    alert: { icon: 'warning', bg: 'bg-amber-100', color: 'text-amber-600' },
  };

  const getIcon = (type: string) => iconMap[type] || iconMap.system;

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return mins + 'm ago';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + 'h ago';
    const days = Math.floor(hrs / 24);
    return days + 'd ago';
  };

  return (
    <PageWrapper>
      <header className="lg:hidden px-5 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="material-icons">arrow_back</span>
        </button>
        <h1 className="text-lg font-bold">Notifications</h1>
        <button onClick={markAllRead} className="text-sm font-bold text-[#1132d4]">Mark all</button>
      </header>

      <div className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-xl font-bold">Notifications</h1>
        <button onClick={markAllRead} className="text-sm font-bold text-[#1132d4]">Mark all read</button>
      </div>

      <main className="px-5 lg:px-6 py-6 space-y-4 overflow-y-auto pb-24 lg:pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-icons text-5xl text-gray-300 mb-4">notifications_none</span>
            <h3 className="text-lg font-semibold text-gray-500">No Notifications</h3>
            <p className="text-sm text-gray-400 mt-1">You're all caught up! Check back later.</p>
          </div>
        ) : (
          notifications.map((n: any) => {
            const { icon, bg, color } = getIcon(n.type);
            return (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border flex gap-4 ${
                  n.read
                    ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                    : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30'
                }`}
              >
                <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${bg} ${color}`}>
                  <span className="material-icons">{icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold">{n.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">{timeAgo(n.createdAt || n.created_at)}</span>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0"></div>}
              </div>
            );
          })
        )}
      </main>
    </PageWrapper>
  );
}

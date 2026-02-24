import { useLocation, useNavigate } from 'react-router';
import { useAuth } from '@/app/contexts/AuthContext';

export function DesktopSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const mainTabs = [
    { path: '/home', icon: 'home', label: 'Home' },
    { path: '/invest', icon: 'travel_explore', label: 'Explore' },
    { path: '/portfolio', icon: 'pie_chart', label: 'Portfolio' },
    { path: '/wallet', icon: 'account_balance_wallet', label: 'Wallet' },
    { path: '/transaction-history', icon: 'receipt_long', label: 'Transactions' },
  ];

  const secondaryTabs = [
    { path: '/notifications', icon: 'notifications', label: 'Notifications' },
    { path: '/documents', icon: 'description', label: 'Documents' },
    { path: '/referral-rewards', icon: 'card_giftcard', label: 'Referrals' },
    { path: '/settings', icon: 'settings', label: 'Settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="hidden lg:flex flex-col w-[260px] min-w-[260px] h-screen sticky top-0 bg-white dark:bg-[#101322] border-r border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-gray-100 dark:border-gray-800">
        <div className="w-9 h-9 bg-[#1132d4] rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md">
          I
        </div>
        <span className="font-bold text-lg tracking-tight">
          Infinity<span className="text-[#1132d4]">Ventures</span>
        </span>
      </div>

      {/* User Info */}
      {user && (
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1132d4] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user.fullName || 'User'}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Main</p>
        {mainTabs.map(tab => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive(tab.path)
                ? 'bg-[#1132d4]/10 text-[#1132d4]'
                : 'text-slate-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive(tab.path) ? 'fill-1' : ''}`} style={{fontSize: '22px'}}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}

        <div className="pt-4" />
        <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account</p>
        {secondaryTabs.map(tab => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive(tab.path)
                ? 'bg-[#1132d4]/10 text-[#1132d4]'
                : 'text-slate-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive(tab.path) ? 'fill-1' : ''}`} style={{fontSize: '22px'}}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}

        {/* Admin Link */}
        {user?.role && ['admin', 'superadmin'].includes(user.role) && (
          <>
            <div className="pt-4" />
            <p className="px-3 py-1.5 text-[10px] font-bold text-amber-500 uppercase tracking-wider">Admin</p>
            <button
              onClick={() => navigate('/admin')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                location.pathname.startsWith('/admin')
                  ? 'bg-amber-500/10 text-amber-600'
                  : 'text-amber-600/70 hover:bg-amber-50 dark:hover:bg-amber-900/20'
              }`}
            >
              <span className="material-symbols-outlined" style={{fontSize: '22px'}}>admin_panel_settings</span>
              Admin Panel
            </button>
          </>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <span className="material-symbols-outlined" style={{fontSize: '22px'}}>logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

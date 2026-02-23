import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/transactions', label: 'Transactions', icon: '💰' },
  { path: '/admin/kyc', label: 'KYC Review', icon: '🆔' },
  { path: '/admin/wallets', label: 'Wallets', icon: '🏦' },
  { path: '/admin/project-wallets', label: 'Fund Routing', icon: '🔗' },
  { path: '/admin/projects', label: 'Projects', icon: '📁' },
  { path: '/admin/compliance', label: 'Compliance', icon: '🛡️' },
  { path: '/admin/support', label: 'Support', icon: '🎫' },
  { path: '/admin/yield', label: 'Yield Engine', icon: '💹' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  { path: '/admin/audit', label: 'Audit Logs', icon: '📋' },
];

export function AdminLayout({ children, title }: { children: ReactNode; title?: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-slate-800">
          <h1 className="text-lg font-bold text-white tracking-tight">♾ IV Admin</h1>
          <p className="text-xs text-slate-500 mt-1">Management Console</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600/20 text-blue-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.fullName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-slate-500 truncate">{(user as any)?.role || 'admin'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/home')} className="flex-1 px-3 py-1.5 text-xs bg-slate-800 text-slate-300 rounded-md hover:bg-slate-700">
              User View
            </button>
            <button onClick={logout} className="flex-1 px-3 py-1.5 text-xs bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/30">
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-sm font-semibold text-white">
            {title || NAV_ITEMS.find(i => isActive(i.path))?.label || 'Admin'}
          </h2>
        </header>

        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

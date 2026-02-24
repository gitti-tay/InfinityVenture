import { useLocation, useNavigate } from 'react-router';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const tabs = [
    { path: '/home', icon: 'home', label: 'Home' },
    { path: '/invest', icon: 'travel_explore', label: 'Invest' },
    { path: '/portfolio', icon: 'pie_chart', label: 'Portfolio' },
    { path: '/wallet', icon: 'account_balance_wallet', label: 'Wallet' },
    { path: '/settings', icon: 'person', label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#101322] border-t border-gray-200 dark:border-gray-800 pb-safe pt-2 px-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto h-14">
        {tabs.map(tab => (
          <button 
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center gap-1 transition-opacity ${
              location.pathname === tab.path 
                ? 'text-[#1132d4]' 
                : 'text-slate-400 dark:text-gray-500'
            }`}
          >
            <span 
              className={`material-symbols-outlined ${location.pathname === tab.path ? 'fill-1' : ''}`} 
              style={{fontSize: '24px'}}
            >
              {tab.icon}
            </span>
            <span className="text-[10px] font-bold">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

export function PreferencesScreen() {
  const navigate = useNavigate();
  
  // Notification Settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [investmentAlerts, setInvestmentAlerts] = useState(true);
  const [yieldPayouts, setYieldPayouts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Security Settings
  const [biometricLogin, setBiometricLogin] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  
  // Display Settings
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');
  
  const handleSave = () => {
    alert('Preferences saved successfully!');
  };
  
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      navigate('/login');
    }
  };
  
  return (
    <PageWrapper hideNav>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#101322]/90 backdrop-blur-xl px-5 py-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Preferences</h1>
            <p className="text-xs text-slate-500">Customize your experience</p>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 px-5 py-6 space-y-6 overflow-y-auto pb-24">
          {/* Notifications Section */}
          <section>
            <h3 className="font-bold text-lg mb-4">Notifications</h3>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-sm">Push Notifications</p>
                    <p className="text-xs text-slate-500">Receive app notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#1132d4]"></div>
                  </label>
                </div>
              </div>
              
              <div className="p-4 border-b border-slate-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-sm">Email Notifications</p>
                    <p className="text-xs text-slate-500">Get updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#1132d4]"></div>
                  </label>
                </div>
              </div>
              
              <div className="p-4 border-b border-slate-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-sm">Investment Alerts</p>
                    <p className="text-xs text-slate-500">New opportunities & updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={investmentAlerts}
                      onChange={(e) => setInvestmentAlerts(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#1132d4]"></div>
                  </label>
                </div>
              </div>
              
              <div className="p-4 border-b border-slate-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-sm">Yield Payouts</p>
                    <p className="text-xs text-slate-500">Monthly payout notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={yieldPayouts}
                      onChange={(e) => setYieldPayouts(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#1132d4]"></div>
                  </label>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-sm">Marketing Emails</p>
                    <p className="text-xs text-slate-500">Promotions & news</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingEmails}
                      onChange={(e) => setMarketingEmails(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#1132d4]"></div>
                  </label>
                </div>
              </div>
            </div>
          </section>
          
          {/* Security Section */}
          <section>
            <h3 className="font-bold text-lg mb-4">Security & Privacy</h3>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-sm">Biometric Login</p>
                    <p className="text-xs text-slate-500">Use Face ID / Touch ID</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={biometricLogin}
                      onChange={(e) => setBiometricLogin(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#1132d4]"></div>
                  </label>
                </div>
              </div>
              
              <div className="p-4 border-b border-slate-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-slate-500">Extra layer of security</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={twoFactorAuth}
                      onChange={(e) => setTwoFactorAuth(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#1132d4]"></div>
                  </label>
                </div>
              </div>
              
              <div className="p-4 border-b border-slate-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-sm">Auto-Lock</p>
                    <p className="text-xs text-slate-500">Lock after 5 minutes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoLock}
                      onChange={(e) => setAutoLock(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#1132d4]"></div>
                  </label>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/change-password')}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-bold text-sm">Change Password</p>
                  <p className="text-xs text-slate-500">Update your password</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
              </button>
            </div>
          </section>
          
          {/* Display Section */}
          <section>
            <h3 className="font-bold text-lg mb-4">Display & Language</h3>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 overflow-hidden">
              <button
                className="w-full p-4 border-b border-slate-100 dark:border-gray-700 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-bold text-sm">Currency</p>
                  <p className="text-xs text-slate-500">{currency}</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
              </button>
              
              <button
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-bold text-sm">Language</p>
                  <p className="text-xs text-slate-500">{language}</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
              </button>
            </div>
          </section>
          
          {/* Account Section */}
          <section>
            <h3 className="font-bold text-lg mb-4">Account</h3>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => navigate('/payment-methods')}
                className="w-full p-4 border-b border-slate-100 dark:border-gray-700 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="material-symbols-outlined text-[#1132d4]">credit_card</span>
                  <p className="font-bold text-sm">Payment Methods</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
              </button>
              
              <button
                onClick={() => navigate('/documents')}
                className="w-full p-4 border-b border-slate-100 dark:border-gray-700 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="material-symbols-outlined text-[#1132d4]">folder</span>
                  <p className="font-bold text-sm">Documents</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
              </button>
              
              <button
                onClick={() => navigate('/tax-center')}
                className="w-full p-4 border-b border-slate-100 dark:border-gray-700 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="material-symbols-outlined text-[#1132d4]">receipt_long</span>
                  <p className="font-bold text-sm">Tax Center</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="material-symbols-outlined text-red-600">logout</span>
                  <p className="font-bold text-sm text-red-600">Log Out</p>
                </div>
                <span className="material-symbols-outlined text-red-400">arrow_forward</span>
              </button>
            </div>
          </section>
          
          {/* App Info */}
          <div className="text-center text-xs text-slate-500 py-4">
            <p>InfinityVentures v2.0.1</p>
            <p className="mt-1">© 2024 InfinityVentures. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-3">
              <button className="hover:text-[#1132d4]">Privacy Policy</button>
              <button className="hover:text-[#1132d4]">Terms of Service</button>
            </div>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}
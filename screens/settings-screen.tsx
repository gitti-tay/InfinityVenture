import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import { useAuth } from '@/app/contexts/AuthContext';
import { useWallet } from '@/app/contexts/WalletContext';
import { useNotification } from '@/app/contexts/NotificationContext';

type ModalType = 'editName' | 'editEmail' | 'editPhone' | 'editAvatar' | 'changePassword' | 'addPayment' | 'editPayment' | 'removePayment' | 'revokeSession' | null;

interface PaymentMethod {
  id: number;
  type: 'bank' | 'card' | 'crypto';
  name: string;
  last4: string;
  verified: boolean;
}

interface Session {
  id: number;
  device: string;
  location: string;
  current: boolean;
}

export function SettingsScreen() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { wallet, disconnectWallet } = useWallet();
  const { success: showSuccess } = useNotification();
  const [activeSection, setActiveSection] = useState('profile');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // User profile state (synced from auth context)
  const [userName, setUserName] = useState(user?.fullName || 'User');
  const [userEmail, setUserEmail] = useState(user?.email || 'user@email.com');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [userAvatar, setUserAvatar] = useState(user?.avatar || '');
  
  // Form states
  const [editFormData, setEditFormData] = useState({ value: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [paymentForm, setPaymentForm] = useState({ type: 'bank', name: '', number: '', expiry: '', cvv: '' });
  
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    email: true,
    sms: false,
    yields: true,
    projects: true,
    portfolio: true,
    marketing: false
  });
  
  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 1, type: 'bank', name: 'Chase Bank', last4: '4521', verified: true },
    { id: 2, type: 'card', name: 'Visa', last4: '8932', verified: true },
    { id: 3, type: 'crypto', name: 'USDT Wallet', last4: 'xYz9', verified: true }
  ]);
  
  // Sessions state
  const [sessions, setSessions] = useState<Session[]>([
    { id: 1, device: 'iPhone 15 Pro', location: 'New York, US', current: true },
    { id: 2, device: 'MacBook Pro', location: 'New York, US', current: false },
    { id: 3, device: 'Chrome Browser', location: 'New York, US', current: false }
  ]);
  
  const userProfile = {
    memberId: 'INV-2024-8291',
    memberSince: 'Jan 2024',
    accountTier: 'Premium',
    kycStatus: 'verified'
  };
  
  const menuSections = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'security', label: 'Security', icon: 'shield' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'payments', label: 'Payment Methods', icon: 'payment' },
    { id: 'documents', label: 'Documents', icon: 'description' },
    { id: 'preferences', label: 'Preferences', icon: 'tune' }
  ];
  
  // Modal handlers
  const openModal = (type: ModalType, data?: any) => {
    setActiveModal(type);
    setSelectedItem(data);
    if (type === 'editName') setEditFormData({ value: userName });
    if (type === 'editEmail') setEditFormData({ value: userEmail });
    if (type === 'editPhone') setEditFormData({ value: userPhone });
    if (type === 'editPayment' && data) {
      setPaymentForm({ type: data.type, name: data.name, number: `****${data.last4}`, expiry: '', cvv: '' });
    }
  };
  
  const closeModal = () => {
    setActiveModal(null);
    setSelectedItem(null);
    setEditFormData({ value: '' });
    setPasswordForm({ current: '', new: '', confirm: '' });
    setPaymentForm({ type: 'bank', name: '', number: '', expiry: '', cvv: '' });
  };
  
  // Save handlers
  const handleSaveProfile = () => {
    if (activeModal === 'editName') setUserName(editFormData.value);
    if (activeModal === 'editEmail') setUserEmail(editFormData.value);
    if (activeModal === 'editPhone') setUserPhone(editFormData.value);
    closeModal();
  };
  
  const handleChangePassword = () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('Passwords do not match!');
      return;
    }
    if (passwordForm.new.length < 8) {
      alert('Password must be at least 8 characters!');
      return;
    }
    alert('Password changed successfully!');
    closeModal();
  };
  
  const handleAddPayment = () => {
    const newPayment: PaymentMethod = {
      id: paymentMethods.length + 1,
      type: paymentForm.type as 'bank' | 'card' | 'crypto',
      name: paymentForm.name,
      last4: paymentForm.number.slice(-4),
      verified: false
    };
    setPaymentMethods([...paymentMethods, newPayment]);
    closeModal();
  };
  
  const handleEditPayment = () => {
    setPaymentMethods(paymentMethods.map(pm => 
      pm.id === selectedItem?.id 
        ? { ...pm, name: paymentForm.name }
        : pm
    ));
    closeModal();
  };
  
  const handleRemovePayment = () => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== selectedItem?.id));
    closeModal();
  };
  
  const handleRevokeSession = () => {
    setSessions(sessions.filter(s => s.id !== selectedItem?.id));
    closeModal();
  };
  
  const handleAvatarChange = () => {
    // Simulate file upload
    const newAvatar = `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1500648767791' : '1507003211169'}-0bb1b5e7b63a?w=200&q=80`;
    setUserAvatar(newAvatar);
    closeModal();
  };
  
  const toggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings({ ...notificationSettings, [key]: !notificationSettings[key] });
  };
  
  const copyReferralCode = () => {
    // Fallback method for clipboard API
    const textArea = document.createElement('textarea');
    textArea.value = 'ALEX2024';
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      textArea.remove();
      alert('Referral code copied to clipboard!');
    } catch (err) {
      textArea.remove();
      // Show the code in an alert as final fallback
      alert('Your referral code: ALEX2024');
    }
  };
  
  const downloadDocument = (docName: string) => {
    alert(`Downloading ${docName}...`);
  };
  
  return (
    <PageWrapper>
      <header className="px-5 py-4 flex justify-between items-center bg-white/80 dark:bg-[#101322]/80 sticky top-0 z-10 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-xl font-bold">Profile & Settings</h1>
        <button 
          onClick={() => navigate('/home')}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>
      
      <main className="overflow-y-auto pb-24">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-[#1132d4] to-blue-600 px-5 py-8 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <img 
                src={userAvatar}
                alt={userName}
                className="w-20 h-20 rounded-full border-4 border-white/20"
              />
              <button 
                onClick={() => openModal('editAvatar')}
                className="absolute bottom-0 right-0 w-7 h-7 bg-white text-[#1132d4] rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{userName}</h2>
              <p className="text-white/80 text-sm mb-2">{userEmail}</p>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                  {userProfile.accountTier}
                </span>
                <span className="bg-emerald-500/80 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  KYC Verified
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-white/60 text-xs uppercase mb-1">Member ID</p>
              <p className="text-sm font-bold">{userProfile.memberId}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase mb-1">Member Since</p>
              <p className="text-sm font-bold">{userProfile.memberSince}</p>
            </div>
          </div>
        </div>
        
        {/* Menu Sections */}
        <div className="px-5 py-4 grid grid-cols-3 gap-3">
          {menuSections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                activeSection === section.id
                  ? 'bg-[#1132d4] text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">{section.icon}</span>
              <span className="text-[10px] font-bold text-center uppercase leading-tight">{section.label}</span>
            </button>
          ))}
        </div>
        
        <div className="px-5 space-y-6">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Personal Information</h3>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 divide-y divide-slate-100 dark:divide-gray-700">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">Full Name</p>
                    <p className="font-bold">{userName}</p>
                  </div>
                  <button 
                    onClick={() => openModal('editName')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-slate-400">edit</span>
                  </button>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">Email Address</p>
                    <p className="font-bold">{userEmail}</p>
                  </div>
                  <button 
                    onClick={() => openModal('editEmail')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-slate-400">edit</span>
                  </button>
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">Phone Number</p>
                    <p className="font-bold">{userPhone}</p>
                  </div>
                  <button 
                    onClick={() => openModal('editPhone')}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-slate-400">edit</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold">KYC Verification</h4>
                  <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    Verified
                  </span>
                </div>
                
                <div className="space-y-3">
                  {[
                    { label: 'Identity Verification', status: 'completed' },
                    { label: 'Address Verification', status: 'completed' },
                    { label: 'Accreditation Status', status: 'completed' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm">{item.label}</span>
                      <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700">
                <h4 className="font-bold mb-4">Referral Program</h4>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 mb-3">
                  <p className="text-xs text-slate-600 dark:text-gray-400 mb-2">Your Referral Code</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white dark:bg-gray-700 px-3 py-2 rounded-lg font-mono font-bold">
                      ALEX2024
                    </code>
                    <button 
                      onClick={copyReferralCode}
                      className="p-2 bg-[#1132d4] text-white rounded-lg active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined">content_copy</span>
                    </button>
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-gray-400">Referrals Made</span>
                  <span className="font-bold">3 Friends</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-slate-600 dark:text-gray-400">Bonus Earned</span>
                  <span className="font-bold text-emerald-600">$150</span>
                </div>
                <button
                  onClick={() => navigate('/referral-rewards')}
                  className="w-full py-3 bg-[#1132d4] text-white font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  View Rewards Details
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Security Settings</h3>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 divide-y divide-slate-100 dark:divide-gray-700">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold mb-1">Two-Factor Authentication</p>
                      <p className="text-xs text-slate-500">Add an extra layer of security</p>
                    </div>
                    <button
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        twoFactorEnabled ? 'bg-[#1132d4]' : 'bg-slate-300 dark:bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        twoFactorEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                  {twoFactorEnabled && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-sm">check_circle</span>
                      <span className="text-xs text-blue-900 dark:text-blue-200 font-medium">
                        2FA is active via SMS
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold mb-1">Biometric Login</p>
                      <p className="text-xs text-slate-500">Use fingerprint or face ID</p>
                    </div>
                    <button
                      onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        biometricsEnabled ? 'bg-[#1132d4]' : 'bg-slate-300 dark:bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        biometricsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={() => openModal('changePassword')}
                  className="p-4 flex items-center justify-between w-full hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors active:scale-[0.99]"
                >
                  <div>
                    <p className="font-bold mb-1 text-left">Change Password</p>
                    <p className="text-xs text-slate-500 text-left">Last changed 30 days ago</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </button>

                <button 
                  onClick={() => navigate('/withdrawal-addresses')}
                  className="p-4 flex items-center justify-between w-full hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors active:scale-[0.99]"
                >
                  <div>
                    <p className="font-bold mb-1 text-left">Withdrawal Addresses</p>
                    <p className="text-xs text-slate-500 text-left">Manage whitelisted addresses</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700">
                <h4 className="font-bold mb-4">Active Sessions</h4>
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-gray-700">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400">devices</span>
                        <div>
                          <p className="text-sm font-bold">{session.device}</p>
                          <p className="text-xs text-slate-500">{session.location}</p>
                        </div>
                      </div>
                      {session.current ? (
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full font-bold">
                          CURRENT
                        </span>
                      ) : (
                        <button 
                          onClick={() => openModal('revokeSession', session)}
                          className="text-xs text-red-600 font-bold hover:underline"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Notification Preferences</h3>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 divide-y divide-slate-100 dark:divide-gray-700">
                {[
                  { id: 'push', label: 'Push Notifications', desc: 'Receive alerts on your device' },
                  { id: 'email', label: 'Email Notifications', desc: 'Get updates via email' },
                  { id: 'sms', label: 'SMS Alerts', desc: 'Text message notifications' },
                  { id: 'yields', label: 'Yield Payments', desc: 'Notify when yields are received' },
                  { id: 'projects', label: 'New Projects', desc: 'Alert for new opportunities' },
                  { id: 'portfolio', label: 'Portfolio Updates', desc: 'Performance and milestones' },
                  { id: 'marketing', label: 'Marketing Updates', desc: 'News and promotions' }
                ].map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold mb-1">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleNotification(item.id as keyof typeof notificationSettings)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notificationSettings[item.id as keyof typeof notificationSettings] ? 'bg-[#1132d4]' : 'bg-slate-300 dark:bg-gray-600'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        notificationSettings[item.id as keyof typeof notificationSettings] ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Payment Methods Section */}
          {activeSection === 'payments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Payment Methods</h3>
                <button 
                  onClick={() => openModal('addPayment')}
                  className="text-sm text-[#1132d4] font-bold active:scale-95 transition-transform"
                >
                  + Add New
                </button>
              </div>
              
              {paymentMethods.map(method => (
                <div key={method.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-100 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        method.type === 'bank' ? 'bg-purple-100 dark:bg-purple-900/30' :
                        method.type === 'card' ? 'bg-orange-100 dark:bg-orange-900/30' :
                        'bg-emerald-100 dark:bg-emerald-900/30'
                      }`}>
                        <span className={`material-symbols-outlined ${
                          method.type === 'bank' ? 'text-purple-600' :
                          method.type === 'card' ? 'text-orange-600' :
                          'text-emerald-600'
                        }`}>
                          {method.type === 'bank' ? 'account_balance' : method.type === 'card' ? 'credit_card' : 'currency_bitcoin'}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold">{method.name}</p>
                        <p className="text-sm text-slate-500">•••• {method.last4}</p>
                      </div>
                    </div>
                    {method.verified && (
                      <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openModal('editPayment', method)}
                      className="flex-1 py-2 px-3 rounded-lg bg-slate-100 dark:bg-gray-700 text-sm font-bold active:scale-95 transition-transform"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => openModal('removePayment', method)}
                      className="flex-1 py-2 px-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm font-bold active:scale-95 transition-transform"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Documents Section */}
          {activeSection === 'documents' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Documents & Reports</h3>
              
              <div className="space-y-2">
                {[
                  { name: 'Investment Agreement', date: '2024-01-15', size: '2.4 MB', type: 'contract' },
                  { name: 'Tax Statement 2025', date: '2026-01-01', size: '1.2 MB', type: 'tax' },
                  { name: 'KYC Documents', date: '2024-01-10', size: '3.8 MB', type: 'kyc' },
                  { name: 'Monthly Report - Jan 2026', date: '2026-02-01', size: '0.9 MB', type: 'report' }
                ].map((doc, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-slate-100 dark:border-gray-700 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      doc.type === 'tax' ? 'bg-amber-100 dark:bg-amber-900/30' :
                      doc.type === 'contract' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      doc.type === 'kyc' ? 'bg-purple-100 dark:bg-purple-900/30' :
                      'bg-emerald-100 dark:bg-emerald-900/30'
                    }`}>
                      <span className={`material-symbols-outlined ${
                        doc.type === 'tax' ? 'text-amber-600' :
                        doc.type === 'contract' ? 'text-blue-600' :
                        doc.type === 'kyc' ? 'text-purple-600' :
                        'text-emerald-600'
                      }`}>description</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm mb-0.5">{doc.name}</p>
                      <p className="text-xs text-slate-500">{doc.date} • {doc.size}</p>
                    </div>
                    <button 
                      onClick={() => downloadDocument(doc.name)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg active:scale-95 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[#1132d4]">download</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Preferences Section */}
          {activeSection === 'preferences' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">App Preferences</h3>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 divide-y divide-slate-100 dark:divide-gray-700">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold mb-1">Dark Mode</p>
                    <p className="text-xs text-slate-500">Switch app theme</p>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      darkMode ? 'bg-[#1132d4]' : 'bg-slate-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
                
                <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50 dark:hover:bg-gray-700">
                  <div>
                    <p className="font-bold text-left">Language</p>
                    <p className="text-xs text-slate-500 text-left">English (US)</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </button>
                
                <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50 dark:hover:bg-gray-700">
                  <div>
                    <p className="font-bold text-left">Currency</p>
                    <p className="text-xs text-slate-500 text-left">USD ($)</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </button>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-slate-100 dark:border-gray-700 divide-y divide-slate-100 dark:divide-gray-700">
                <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50 dark:hover:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#1132d4]">help</span>
                    <p className="font-bold">Help & Support</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </button>
                
                <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50 dark:hover:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#1132d4]">policy</span>
                    <p className="font-bold">Terms & Privacy</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </button>
                
                <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50 dark:hover:bg-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#1132d4]">info</span>
                    <p className="font-bold">About InfinityVentures</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                </button>
              </div>
              
              <button 
                onClick={() => {
                  logout();
                  if (wallet) disconnectWallet();
                  showSuccess('Logged Out', 'You have been signed out');
                  navigate('/');
                }}
                className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 border border-red-200 dark:border-red-800 active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined">logout</span>
                Log Out
              </button>
            </div>
          )}
        </div>
      </main>
      
      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Edit Name/Email/Phone Modal */}
            {(activeModal === 'editName' || activeModal === 'editEmail' || activeModal === 'editPhone') && (
              <>
                <h3 className="text-xl font-bold mb-4">
                  Edit {activeModal === 'editName' ? 'Name' : activeModal === 'editEmail' ? 'Email' : 'Phone'}
                </h3>
                <input
                  type={activeModal === 'editEmail' ? 'email' : activeModal === 'editPhone' ? 'tel' : 'text'}
                  value={editFormData.value}
                  onChange={(e) => setEditFormData({ value: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-700 mb-4 focus:border-[#1132d4] outline-none"
                  placeholder={`Enter ${activeModal === 'editName' ? 'name' : activeModal === 'editEmail' ? 'email' : 'phone'}`}
                />
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-gray-700 font-bold">
                    Cancel
                  </button>
                  <button onClick={handleSaveProfile} className="flex-1 py-3 rounded-xl bg-[#1132d4] text-white font-bold">
                    Save
                  </button>
                </div>
              </>
            )}
            
            {/* Edit Avatar Modal */}
            {activeModal === 'editAvatar' && (
              <>
                <h3 className="text-xl font-bold mb-4">Change Profile Picture</h3>
                <div className="flex justify-center mb-6">
                  <img src={userAvatar} alt="Avatar" className="w-32 h-32 rounded-full" />
                </div>
                <p className="text-sm text-slate-500 text-center mb-6">Click save to select a new random avatar</p>
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-gray-700 font-bold">
                    Cancel
                  </button>
                  <button onClick={handleAvatarChange} className="flex-1 py-3 rounded-xl bg-[#1132d4] text-white font-bold">
                    Change Avatar
                  </button>
                </div>
              </>
            )}
            
            {/* Change Password Modal */}
            {activeModal === 'changePassword' && (
              <>
                <h3 className="text-xl font-bold mb-4">Change Password</h3>
                <div className="space-y-3 mb-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-700 focus:border-[#1132d4] outline-none"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-700 focus:border-[#1132d4] outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-700 focus:border-[#1132d4] outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-gray-700 font-bold">
                    Cancel
                  </button>
                  <button onClick={handleChangePassword} className="flex-1 py-3 rounded-xl bg-[#1132d4] text-white font-bold">
                    Update
                  </button>
                </div>
              </>
            )}
            
            {/* Add Payment Modal */}
            {activeModal === 'addPayment' && (
              <>
                <h3 className="text-xl font-bold mb-4">Add Payment Method</h3>
                <div className="space-y-3 mb-4">
                  <select
                    value={paymentForm.type}
                    onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-700 focus:border-[#1132d4] outline-none"
                  >
                    <option value="bank">Bank Account</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="crypto">Crypto Wallet</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Name (e.g., Chase Bank)"
                    value={paymentForm.name}
                    onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-700 focus:border-[#1132d4] outline-none"
                  />
                  <input
                    type="text"
                    placeholder={paymentForm.type === 'crypto' ? 'Wallet Address' : 'Account/Card Number'}
                    value={paymentForm.number}
                    onChange={(e) => setPaymentForm({ ...paymentForm, number: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-700 focus:border-[#1132d4] outline-none"
                  />
                  {paymentForm.type === 'card' && (
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={paymentForm.expiry}
                        onChange={(e) => setPaymentForm({ ...paymentForm, expiry: e.target.value })}
                        className="h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-700 focus:border-[#1132d4] outline-none"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={paymentForm.cvv}
                        onChange={(e) => setPaymentForm({ ...paymentForm, cvv: e.target.value })}
                        className="h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-700 focus:border-[#1132d4] outline-none"
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-gray-700 font-bold">
                    Cancel
                  </button>
                  <button onClick={handleAddPayment} className="flex-1 py-3 rounded-xl bg-[#1132d4] text-white font-bold">
                    Add
                  </button>
                </div>
              </>
            )}
            
            {/* Edit Payment Modal */}
            {activeModal === 'editPayment' && (
              <>
                <h3 className="text-xl font-bold mb-4">Edit Payment Method</h3>
                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={paymentForm.name}
                    onChange={(e) => setPaymentForm({ ...paymentForm, name: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-700 focus:border-[#1132d4] outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-gray-700 font-bold">
                    Cancel
                  </button>
                  <button onClick={handleEditPayment} className="flex-1 py-3 rounded-xl bg-[#1132d4] text-white font-bold">
                    Save
                  </button>
                </div>
              </>
            )}
            
            {/* Remove Payment Modal */}
            {activeModal === 'removePayment' && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-red-600 text-3xl">warning</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Remove Payment Method?</h3>
                  <p className="text-slate-600 dark:text-gray-400">Are you sure you want to remove {selectedItem?.name}? This action cannot be undone.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-gray-700 font-bold">
                    Cancel
                  </button>
                  <button onClick={handleRemovePayment} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold">
                    Remove
                  </button>
                </div>
              </>
            )}
            
            {/* Revoke Session Modal */}
            {activeModal === 'revokeSession' && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-amber-600 text-3xl">warning</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Revoke Session?</h3>
                  <p className="text-slate-600 dark:text-gray-400">Are you sure you want to revoke access from {selectedItem?.device}?</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-gray-700 font-bold">
                    Cancel
                  </button>
                  <button onClick={handleRevokeSession} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold">
                    Revoke
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
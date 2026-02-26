import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import { useAuth } from '@/app/contexts/AuthContext';
import { useWallet } from '@/app/contexts/WalletContext';
import { useNotification } from '@/app/contexts/NotificationContext';

const API_BASE = window.location.origin + '/api';

type ModalType = 'editName' | 'editEmail' | 'editPhone' | 'editAvatar' | 'changePassword' | null;

export function SettingsScreen() {
  const navigate = useNavigate();
  const { user, token, logout, updateUser } = useAuth();
  const { wallet, disconnectWallet } = useWallet();
  const { success: showSuccess } = useNotification();

  const [activeSection, setActiveSection] = useState('profile');
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // User profile state (synced from auth context)
  const [userName, setUserName] = useState(user?.fullName || 'User');
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [userPhone, setUserPhone] = useState(user?.phone || '');
  const [userAvatar, setUserAvatar] = useState(user?.avatar || '');

  // Form states
  const [editFormData, setEditFormData] = useState({ value: '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    push: true, email: true, sms: false,
    yields: true, projects: true, portfolio: true, marketing: false
  });

  // Real data states
  const [referralStats, setReferralStats] = useState({ count: 0, bonus: 0 });
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    if (!token) { setLoading(false); return; }

    // Fetch referral stats
    fetch(API_BASE + '/auth/referral-stats', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(r => r.ok ? r.json() : { count: 0, bonus: 0 })
      .then(d => setReferralStats({ count: d.count || 0, bonus: d.bonus || 0 }))
      .catch(() => {});

    setLoading(false);
  }, [token]);

  // Derive KYC status from user object (real data from API)
  const kycStatus = user?.kycStatus || 'none';
  const kycVerified = kycStatus === 'verified';
  const kycPending = kycStatus === 'pending';
  const referralCode = user?.referralCode || '';

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'N/A';

  const menuSections = [
    { id: 'profile', label: 'Profile', icon: 'person' },
    { id: 'security', label: 'Security', icon: 'shield' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'preferences', label: 'Preferences', icon: 'tune' }
  ];

  // Modal handlers
  const openModal = (type: ModalType) => {
    setActiveModal(type);
    if (type === 'editName') setEditFormData({ value: userName });
    if (type === 'editEmail') setEditFormData({ value: userEmail });
    if (type === 'editPhone') setEditFormData({ value: userPhone });
  };

  const closeModal = () => {
    setActiveModal(null);
    setEditFormData({ value: '' });
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  // Save handlers
  const handleSaveProfile = async () => {
    if (!token) return;
    try {
      const field = activeModal === 'editName' ? 'fullName' : activeModal === 'editPhone' ? 'phone' : null;
      if (!field) { closeModal(); return; }
      const body: any = {};
      body[field] = editFormData.value;
      const res = await fetch(API_BASE + '/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user && updateUser) updateUser(data.user);
        if (activeModal === 'editName') setUserName(editFormData.value);
        if (activeModal === 'editPhone') setUserPhone(editFormData.value);
        showSuccess('Updated', 'Profile updated successfully');
      }
    } catch {}
    closeModal();
  };

  const handleChangePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      alert('Passwords do not match!');
      return;
    }
    if (passwordForm.new.length < 8) {
      alert('Password must be at least 8 characters!');
      return;
    }
    try {
      const res = await fetch(API_BASE + '/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ currentPassword: passwordForm.current, newPassword: passwordForm.new })
      });
      if (res.ok) {
        showSuccess('Password Changed', 'Your password has been updated');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to change password');
      }
    } catch {
      alert('Failed to change password');
    }
    closeModal();
  };

  const copyReferralCode = () => {
    if (!referralCode) {
      alert('No referral code available');
      return;
    }
    const textArea = document.createElement('textarea');
    textArea.value = referralCode;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      textArea.remove();
      showSuccess('Copied', 'Referral code copied to clipboard!');
    } catch {
      textArea.remove();
      alert('Your referral code: ' + referralCode);
    }
  };

  const toggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings({ ...notificationSettings, [key]: !notificationSettings[key] });
  };

  return (
    <PageWrapper>
      <header className="px-5 py-4 flex justify-between items-center bg-white/80 sticky top-0 z-10 backdrop-blur-md border-b border-gray-100">
        <h1 className="text-xl font-bold">Profile & Settings</h1>
        <button onClick={() => navigate('/home')} className="p-2 rounded-full hover:bg-gray-100">
          <span className="material-icons">close</span>
        </button>
      </header>

      <main className="overflow-y-auto pb-24">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-[#1132d4] to-blue-600 px-5 py-8 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-20 h-20 rounded-full border-4 border-white/20" />
              ) : (
                <div className="w-20 h-20 rounded-full border-4 border-white/20 bg-white/20 flex items-center justify-center text-3xl font-bold">
                  {userName?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{userName}</h2>
              <p className="text-white/80 text-sm mb-2">{userEmail}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {kycVerified ? (
                  <span className="bg-emerald-500/80 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <span className="material-icons text-xs">verified</span>
                    KYC Verified
                  </span>
                ) : kycPending ? (
                  <span className="bg-amber-500/80 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <span className="material-icons text-xs">hourglass_top</span>
                    KYC Pending
                  </span>
                ) : (
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <span className="material-icons text-xs">warning</span>
                    KYC Not Started
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-white/60 text-xs uppercase mb-1">Member Since</p>
              <p className="text-sm font-bold">{memberSince}</p>
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase mb-1">Account</p>
              <p className="text-sm font-bold">{user?.role === 'admin' || user?.role === 'superadmin' ? 'Admin' : 'Standard'}</p>
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="px-5 py-4 grid grid-cols-4 gap-3">
          {menuSections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`p-3 rounded-xl flex flex-col items-center gap-2 transition-all ${
                activeSection === section.id
                  ? 'bg-[#1132d4] text-white shadow-lg'
                  : 'bg-white border border-slate-100'
              }`}
            >
              <span className="material-icons text-2xl">{section.icon}</span>
              <span className="text-[10px] font-bold text-center uppercase leading-tight">{section.label}</span>
            </button>
          ))}
        </div>

        <div className="px-5 space-y-6">

          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Personal Information</h3>
              <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">Full Name</p>
                    <p className="font-bold">{userName}</p>
                  </div>
                  <button onClick={() => openModal('editName')} className="p-2 hover:bg-slate-100 rounded-lg">
                    <span className="material-icons text-slate-400">edit</span>
                  </button>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">Email Address</p>
                    <p className="font-bold">{userEmail}</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase mb-1">Phone Number</p>
                    <p className="font-bold">{userPhone || 'Not set'}</p>
                  </div>
                  <button onClick={() => openModal('editPhone')} className="p-2 hover:bg-slate-100 rounded-lg">
                    <span className="material-icons text-slate-400">edit</span>
                  </button>
                </div>
              </div>

              {/* KYC Verification - Real status */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold">KYC Verification</h4>
                  {kycVerified ? (
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <span className="material-icons text-xs">verified</span>
                      Verified
                    </span>
                  ) : kycPending ? (
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <span className="material-icons text-xs">hourglass_top</span>
                      Pending Review
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">
                      Not Verified
                    </span>
                  )}
                </div>
                {kycVerified ? (
                  <div className="space-y-3">
                    {['Identity Verification', 'Address Verification'].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm">{item}</span>
                        <span className="material-icons text-emerald-500">check_circle</span>
                      </div>
                    ))}
                  </div>
                ) : kycPending ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                    <span className="material-icons text-amber-500 text-3xl mb-2">hourglass_top</span>
                    <p className="text-sm text-amber-800 font-medium">Your KYC documents are under review</p>
                    <p className="text-xs text-amber-600 mt-1">This usually takes 1-3 business days</p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <span className="material-icons text-blue-500 text-3xl mb-2">assignment_ind</span>
                    <p className="text-sm text-blue-800 font-medium mb-3">Complete KYC to unlock all features</p>
                    <button
                      onClick={() => navigate('/kyc-start')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
                    >
                      Start Verification
                    </button>
                  </div>
                )}
              </div>

              {/* Referral Program - Real data */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <h4 className="font-bold mb-4">Referral Program</h4>
                {referralCode ? (
                  <>
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 mb-3">
                      <p className="text-xs text-slate-600 mb-2">Your Referral Code</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-white px-3 py-2 rounded-lg font-mono font-bold text-center">
                          {referralCode}
                        </code>
                        <button onClick={copyReferralCode} className="p-2 bg-[#1132d4] text-white rounded-lg">
                          <span className="material-icons">content_copy</span>
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Referrals Made</span>
                      <span className="font-bold">{referralStats.count} {referralStats.count === 1 ? 'Friend' : 'Friends'}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-slate-600">Bonus Earned</span>
                      <span className="font-bold text-emerald-600">${referralStats.bonus.toFixed(2)}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No referral code available</p>
                )}
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Security Settings</h3>
              <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold mb-1">Two-Factor Authentication</p>
                      <p className="text-xs text-slate-500">Add an extra layer of security</p>
                    </div>
                    <button
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        twoFactorEnabled ? 'bg-[#1132d4]' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        twoFactorEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </button>
                  </div>
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
                        biometricsEnabled ? 'bg-[#1132d4]' : 'bg-slate-300'
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
                  className="p-4 flex items-center justify-between w-full hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-bold mb-1 text-left">Change Password</p>
                    <p className="text-xs text-slate-500 text-left">Update your password</p>
                  </div>
                  <span className="material-icons text-slate-400">chevron_right</span>
                </button>
                <button
                  onClick={() => navigate('/withdrawal-addresses')}
                  className="p-4 flex items-center justify-between w-full hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-bold mb-1 text-left">Withdrawal Addresses</p>
                    <p className="text-xs text-slate-500 text-left">Manage whitelisted addresses</p>
                  </div>
                  <span className="material-icons text-slate-400">chevron_right</span>
                </button>
              </div>

              {/* Wallet Connection */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100">
                <h4 className="font-bold mb-4">Wallet Connection</h4>
                {wallet ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <span className="material-icons text-green-600">check_circle</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-900">Wallet Connected</p>
                        <p className="text-xs text-green-700 font-mono">{wallet.address?.substring(0, 10)}...{wallet.address?.slice(-6)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/connect-wallet')}
                      className="w-full py-2 text-sm text-blue-600 font-semibold"
                    >
                      Manage Wallet
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="material-icons text-gray-300 text-4xl mb-2">link_off</span>
                    <p className="text-sm text-gray-500 mb-3">No wallet connected</p>
                    <button
                      onClick={() => navigate('/connect-wallet')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
                    >
                      Connect Wallet
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Notification Preferences</h3>
              <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
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
                        notificationSettings[item.id as keyof typeof notificationSettings] ? 'bg-[#1132d4]' : 'bg-slate-300'
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

          {/* Preferences Section */}
          {activeSection === 'preferences' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg">App Preferences</h3>
              <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
                <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50">
                  <div>
                    <p className="font-bold text-left">Language</p>
                    <p className="text-xs text-slate-500 text-left">English (US)</p>
                  </div>
                  <span className="material-icons text-slate-400">chevron_right</span>
                </button>
                <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50">
                  <div>
                    <p className="font-bold text-left">Currency</p>
                    <p className="text-xs text-slate-500 text-left">USD ($)</p>
                  </div>
                  <span className="material-icons text-slate-400">chevron_right</span>
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100">
                <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="material-icons text-[#1132d4]">help</span>
                    <p className="font-bold">Help & Support</p>
                  </div>
                  <span className="material-icons text-slate-400">chevron_right</span>
                </button>
                <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="material-icons text-[#1132d4]">policy</span>
                    <p className="font-bold">Terms & Privacy</p>
                  </div>
                  <span className="material-icons text-slate-400">chevron_right</span>
                </button>
                <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <span className="material-icons text-[#1132d4]">info</span>
                    <p className="font-bold">About InfinityVentures</p>
                  </div>
                  <span className="material-icons text-slate-400">chevron_right</span>
                </button>
              </div>

              <button
                onClick={() => {
                  logout();
                  if (wallet) disconnectWallet();
                  showSuccess('Logged Out', 'You have been signed out');
                  navigate('/');
                }}
                className="w-full bg-red-50 text-red-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 border border-red-200"
              >
                <span className="material-icons">logout</span>
                Log Out
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl" onClick={(e: any) => e.stopPropagation()}>
            {/* Edit Name/Email/Phone Modal */}
            {(activeModal === 'editName' || activeModal === 'editEmail' || activeModal === 'editPhone') && (
              <>
                <h3 className="text-xl font-bold mb-4">
                  Edit {activeModal === 'editName' ? 'Name' : activeModal === 'editEmail' ? 'Email' : 'Phone'}
                </h3>
                <input
                  type={activeModal === 'editEmail' ? 'email' : activeModal === 'editPhone' ? 'tel' : 'text'}
                  value={editFormData.value}
                  onChange={(e: any) => setEditFormData({ value: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-white mb-4 focus:border-[#1132d4] outline-none"
                  placeholder={`Enter ${activeModal === 'editName' ? 'name' : activeModal === 'editEmail' ? 'email' : 'phone'}`}
                />
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-slate-100 font-bold">Cancel</button>
                  <button onClick={handleSaveProfile} className="flex-1 py-3 rounded-xl bg-[#1132d4] text-white font-bold">Save</button>
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
                    onChange={(e: any) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-white focus:border-[#1132d4] outline-none"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordForm.new}
                    onChange={(e: any) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-white focus:border-[#1132d4] outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordForm.confirm}
                    onChange={(e: any) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-white focus:border-[#1132d4] outline-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 py-3 rounded-xl bg-slate-100 font-bold">Cancel</button>
                  <button onClick={handleChangePassword} className="flex-1 py-3 rounded-xl bg-[#1132d4] text-white font-bold">Update</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
}

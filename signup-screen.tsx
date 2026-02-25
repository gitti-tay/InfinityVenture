import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import { useAuth } from '@/app/contexts/AuthContext';
import { useNotification } from '@/app/contexts/NotificationContext';

export function SignUpScreen() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { success: showSuccess, error: showError } = useNotification();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setError('');
    
    if (field === 'password') {
      let strength = 0;
      if (value.length >= 8) strength += 25;
      if (value.match(/[a-z]/)) strength += 25;
      if (value.match(/[A-Z]/)) strength += 25;
      if (value.match(/[0-9]/)) strength += 25;
      setPasswordStrength(strength);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!agreeTerms) {
      setError('Please accept the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    
    const result = await signup({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      referralCode: formData.referralCode,
    });
    
    setIsLoading(false);
    
    if (result.success) {
      showSuccess('Account Created!', 'Please verify your email');
      navigate('/email-verification', { state: { email: formData.email } });
    } else {
      setError(result.error || 'Sign up failed');
      showError('Signup Failed', result.error);
    }
  };
  
  const handleSocialSignUp = (provider: string) => {
    setIsLoading(true);
    // Simulate social signup -> auto-create account
    setTimeout(async () => {
      const fakeEmail = `${provider.toLowerCase()}_user_${Date.now()}@example.com`;
      await signup({
        fullName: `${provider} User`,
        email: fakeEmail,
        password: 'SocialAuth123',
      });
      setIsLoading(false);
      navigate('/kyc-start');
    }, 1500);
  };
  
  const getStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };
  
  const getStrengthLabel = () => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };
  
  return (
    <PageWrapper hideNav className="bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0a0b14] dark:via-[#101322] dark:to-[#0a0b14]">
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-80 h-80 bg-[#1132d4]/5 dark:bg-[#1132d4]/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/5 dark:bg-blue-400/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        {/* Header */}
        <header className="relative z-10 px-5 py-4">
          <button 
            onClick={() => navigate('/login')}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </header>
        
        {/* Content */}
        <main className="relative z-10 flex-1 px-5 pb-8 overflow-y-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Create Account</h1>
            <p className="text-slate-500 dark:text-gray-400 text-sm">
              Start your investment journey today
            </p>
          </div>
          
          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600 text-xl">error</span>
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}
          
          {/* Social Signup */}
          <div className="flex gap-3 mb-6">
            {[
              { icon: 'G', label: 'Google', bg: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700' },
              { icon: '', label: 'Apple', bg: 'bg-black text-white' },
            ].map(provider => (
              <button
                key={provider.label}
                onClick={() => handleSocialSignUp(provider.label)}
                className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${provider.bg} transition-all active:scale-95`}
              >
                {provider.label === 'Apple' ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                ) : (
                                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>svg>
                              )}</svg>
                {provider.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            <span className="text-xs text-slate-400 uppercase font-bold">or sign up with email</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-sm font-bold text-slate-600 dark:text-gray-300 mb-1.5 block">Full Name *</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#1132d4] focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label className="text-sm font-bold text-slate-600 dark:text-gray-300 mb-1.5 block">Email Address *</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#1132d4] focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>
            
            {/* Phone */}
            <div>
              <label className="text-sm font-bold text-slate-600 dark:text-gray-300 mb-1.5 block">Phone Number</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">phone</span>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  placeholder="+66 123 456 789"
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#1132d4] focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>
            
            {/* Password */}
            <div>
              <label className="text-sm font-bold text-slate-600 dark:text-gray-300 mb-1.5 block">Password *</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => handleInputChange('password', e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#1132d4] focus:border-transparent outline-none transition-all text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[25, 50, 75, 100].map(level => (
                      <div key={level} className={`h-1 flex-1 rounded-full ${passwordStrength >= level ? getStrengthColor() : 'bg-gray-200 dark:bg-gray-700'}`} />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 font-medium ${
                    passwordStrength <= 25 ? 'text-red-500' : passwordStrength <= 50 ? 'text-orange-500' : passwordStrength <= 75 ? 'text-yellow-600' : 'text-emerald-600'
                  }`}>{getStrengthLabel()}</p>
                </div>
              )}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label className="text-sm font-bold text-slate-600 dark:text-gray-300 mb-1.5 block">Confirm Password *</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={e => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#1132d4] focus:border-transparent outline-none transition-all text-sm"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <span className="material-symbols-outlined text-xl">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
            
            {/* Referral Code */}
            <div>
              <label className="text-sm font-bold text-slate-600 dark:text-gray-300 mb-1.5 block">Referral Code (Optional)</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">redeem</span>
                <input
                  type="text"
                  value={formData.referralCode}
                  onChange={e => handleInputChange('referralCode', e.target.value)}
                  placeholder="Enter referral code"
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#1132d4] focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>
            
            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#1132d4] focus:ring-[#1132d4]"
              />
              <span className="text-xs text-slate-500 leading-relaxed">
                I agree to the <button type="button" className="text-[#1132d4] font-bold">Terms of Service</button> and{' '}
                <button type="button" className="text-[#1132d4] font-bold">Privacy Policy</button>. I understand the risks
                associated with digital asset investments.
              </span>
            </label>
            
            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#1132d4] to-blue-600 hover:from-[#0d26a3] hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#1132d4]/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account<span className="material-symbols-outlined text-sm">arrow_forward</span></>
              )}
            </button>
          </form>
          
          {/* Login Link */}
          <div className="text-center mt-8 pb-8">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="text-[#1132d4] font-bold hover:underline">
                Sign In
              </button>
            </p>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}

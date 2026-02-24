import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import { useAuth } from '@/app/contexts/AuthContext';
import { useNotification } from '@/app/contexts/NotificationContext';

export function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { error: showError } = useNotification();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const from = (location.state as any)?.from || '/home';
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    const result = await login(email, password);
    setIsLoading(false);
    
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Login failed');
      showError('Login Failed', result.error);
    }
  };
  
  const handleBiometricLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setError('Biometric login requires an existing session');
    }, 1000);
  };
  
  return (
    <PageWrapper hideNav className="bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0a0b14] dark:via-[#101322] dark:to-[#0a0b14]">
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1132d4]/5 dark:bg-[#1132d4]/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/5 dark:bg-blue-400/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        {/* Header */}
        <header className="relative z-10 px-5 py-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </header>
        
        {/* Content */}
        <main className="relative z-10 flex-1 flex flex-col justify-center px-5 pb-8">
          {/* Logo & Title */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1132d4] to-blue-600 rounded-3xl blur-xl opacity-30"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-[#1132d4] to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-[#1132d4]/30">
                <span className="material-symbols-outlined text-white text-[42px]">account_balance</span>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 dark:text-gray-400">
              Sign in to continue investing
            </p>
          </div>
          
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="material-symbols-outlined text-emerald-600 text-sm">encrypted</span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                Secure Login
              </span>
            </div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-600 text-xl">error</span>
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}
          
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm font-bold text-slate-600 dark:text-gray-300 mb-1.5 block">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#1132d4] focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
            </div>
            
            {/* Password */}
            <div>
              <label className="text-sm font-bold text-slate-600 dark:text-gray-300 mb-1.5 block">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#1132d4] focus:border-transparent outline-none transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Remember Me & Forgot */}
            <div className="flex justify-between items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#1132d4] focus:ring-[#1132d4]"
                />
                <span className="text-sm text-slate-500">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-[#1132d4] font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>
            
            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#1132d4] to-blue-600 hover:from-[#0d26a3] hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#1132d4]/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In<span className="material-symbols-outlined text-sm">arrow_forward</span></>
              )}
            </button>
          </form>
          
          {/* Biometric Login */}
          <button
            onClick={handleBiometricLogin}
            className="w-full mt-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[#1132d4]">fingerprint</span>
            <span className="font-medium text-sm">Sign in with Biometric</span>
          </button>
          
          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          </div>
          
          {/* Social Login */}
          <div className="flex gap-3">
            {[
              { icon: 'G', label: 'Google', bg: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700' },
              { icon: '', label: 'Apple', bg: 'bg-black text-white' },
            ].map(provider => (
              <button
                key={provider.label}
                className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${provider.bg} transition-all active:scale-95`}
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    navigate('/home');
                  }, 1500);
                }}
              >
                {provider.label === 'Apple' ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                ) : provider.icon}
                {provider.label}
              </button>
            ))}
          </div>
          
          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-[#1132d4] font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}

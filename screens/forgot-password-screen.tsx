import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import api from '@/app/api/client';

export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'token' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) { setError('Please enter a valid email address'); return; }
    setIsLoading(true);
    try {
      await api.requestPasswordReset(email);
    } catch {}
    setIsLoading(false);
    setStep('token'); // Always advance (prevent email enumeration)
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!token.trim()) { setError('Please enter the reset token from your email'); return; }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setIsLoading(true);
    try {
      await api.confirmPasswordReset(token.trim(), newPassword);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Invalid or expired token.');
    } finally { setIsLoading(false); }
  };

  return (
    <PageWrapper hideNav className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-[#101322] dark:to-gray-900">
      <div className="min-h-screen flex flex-col">
        <header className="px-5 py-4">
          <button onClick={() => step === 'email' ? navigate(-1) : setStep('email')}
            className="p-2 -ml-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </header>
        <main className="flex-1 flex flex-col justify-center px-5 pb-8">
          {step === 'email' && (
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1132d4] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-white text-4xl">lock_reset</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
                <p className="text-slate-500">Enter your email and we'll send a reset token.</p>
              </div>
              {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-600 text-sm">{error}</div>}
              <form onSubmit={handleSendReset} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-white mb-2 block">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email"
                    className="w-full h-14 px-4 rounded-xl border-2 border-slate-200 bg-white focus:border-[#1132d4] outline-none" />
                </div>
                <button type="submit" disabled={isLoading}
                  className="w-full h-14 bg-gradient-to-r from-[#1132d4] to-blue-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-50">
                  {isLoading ? 'Sending...' : 'Send Reset Token'}
                </button>
              </form>
              <p className="text-center text-slate-600 mt-6">
                Remember your password? <button onClick={() => navigate('/login')} className="text-[#1132d4] font-bold">Log In</button>
              </p>
            </div>
          )}

          {step === 'token' && (
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1132d4] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-white text-4xl">mark_email_read</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
                <p className="text-slate-500 mb-1">Check your email for the reset token.</p>
                <p className="text-xs text-slate-400">Token expires in 30 minutes.</p>
              </div>
              {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-600 text-sm">{error}</div>}
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-white mb-2 block">Reset Token</label>
                  <input type="text" value={token} onChange={e => setToken(e.target.value)} placeholder="Paste token here"
                    className="w-full h-14 px-4 rounded-xl border-2 border-slate-200 bg-white focus:border-[#1132d4] outline-none font-mono text-sm" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-white mb-2 block">New Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      className="w-full h-14 px-4 pr-12 rounded-xl border-2 border-slate-200 bg-white focus:border-[#1132d4] outline-none" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-white mb-2 block">Confirm Password</label>
                  <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full h-14 px-4 rounded-xl border-2 border-slate-200 bg-white focus:border-[#1132d4] outline-none" />
                </div>
                <button type="submit" disabled={isLoading}
                  className="w-full h-14 bg-gradient-to-r from-[#1132d4] to-blue-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-50">
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
              <p className="text-center text-slate-600 mt-4">
                <button onClick={() => setStep('email')} className="text-[#1132d4] font-bold">Resend token</button>
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="max-w-md mx-auto w-full text-center">
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-white text-5xl">check_circle</span>
              </div>
              <h1 className="text-3xl font-bold mb-3">Password Reset!</h1>
              <p className="text-slate-500 mb-2">Your password has been reset successfully.</p>
              <p className="text-xs text-amber-600 mb-8">All existing sessions have been logged out.</p>
              <button onClick={() => navigate('/login')}
                className="w-full h-14 bg-gradient-to-r from-[#1132d4] to-blue-600 text-white font-bold rounded-xl shadow-lg">
                Continue to Login
              </button>
            </div>
          )}
        </main>
      </div>
    </PageWrapper>
  );
}

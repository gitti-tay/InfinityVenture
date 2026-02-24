import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

export function EmailVerificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your@email.com';
  
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);
  
  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
    
    // Auto-verify when all digits entered
    if (index === 5 && value) {
      const fullCode = [...newCode];
      fullCode[5] = value;
      if (fullCode.every(d => d !== '')) {
        handleVerify(fullCode);
      }
    }
  };
  
  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };
  
  const handleVerify = (codeArray = code) => {
    const enteredCode = codeArray.join('');
    
    if (enteredCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }
    
    setIsVerifying(true);
    
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      navigate('/kyc-start');
    }, 1500);
  };
  
  const handleResend = () => {
    if (!canResend) return;
    
    setCanResend(false);
    setResendTimer(60);
    setCode(['', '', '', '', '', '']);
    setError('');
    
    // Simulate sending new code
    setTimeout(() => {
      alert('Verification code sent to ' + email);
    }, 500);
  };
  
  return (
    <PageWrapper hideNav className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-[#101322] dark:to-gray-900">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-5 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-800"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </header>
        
        {/* Content */}
        <main className="flex-1 flex flex-col justify-center px-5 pb-8">
          <div className="max-w-md mx-auto w-full">
            {/* Email Icon */}
            <div className="text-center mb-8">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1132d4] to-blue-600 rounded-full animate-pulse opacity-20"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-[#1132d4] to-blue-600 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-5xl">mark_email_unread</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-3">Verify Your Email</h1>
              <p className="text-slate-600 dark:text-gray-400 mb-2">
                We sent a 6-digit verification code to
              </p>
              <p className="text-[#1132d4] font-bold text-lg mb-1">{email}</p>
              <button 
                onClick={() => navigate(-1)}
                className="text-sm text-slate-500 hover:underline"
              >
                Change email
              </button>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-600">error</span>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}
            
            {/* Code Input */}
            <div className="mb-6">
              <label className="text-sm font-bold text-slate-700 dark:text-white mb-4 block text-center">
                Enter Verification Code
              </label>
              <div className="flex gap-2 justify-center mb-4">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeInput(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    disabled={isVerifying}
                    className="w-12 h-16 text-center text-2xl font-bold rounded-xl border-2 border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-[#1132d4] outline-none transition-all disabled:opacity-50"
                  />
                ))}
              </div>
              
              {isVerifying && (
                <div className="flex items-center justify-center gap-2 text-[#1132d4] font-medium">
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Verifying...
                </div>
              )}
            </div>
            
            {/* Manual Verify Button */}
            <button
              onClick={() => handleVerify()}
              disabled={isVerifying || code.some(d => !d)}
              className="w-full h-14 bg-gradient-to-r from-[#1132d4] to-blue-600 text-white font-bold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform mb-6 flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </button>
            
            {/* Resend Code */}
            <div className="text-center">
              <p className="text-slate-600 dark:text-gray-400 mb-2">
                Didn't receive the code?
              </p>
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="text-[#1132d4] font-bold hover:underline"
                >
                  Resend Code
                </button>
              ) : (
                <p className="text-slate-500 text-sm">
                  Resend available in {resendTimer}s
                </p>
              )}
            </div>
            
            {/* Help Text */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-blue-600 shrink-0 text-xl">info</span>
                <div className="text-sm text-blue-900 dark:text-blue-200">
                  <p className="font-bold mb-1">Can't find the email?</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Check your spam or junk folder</li>
                    <li>• Make sure {email} is correct</li>
                    <li>• Add noreply@infinityventures.com to contacts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageWrapper>
  );
}
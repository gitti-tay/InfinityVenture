import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';

export function BiometricRegistrationScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'intro' | 'scanning' | 'success' | 'error'>('intro');
  const [biometricType, setBiometricType] = useState<'fingerprint' | 'face'>('fingerprint');
  const [scanProgress, setScanProgress] = useState(0);
  
  const handleStartSetup = (type: 'fingerprint' | 'face') => {
    setBiometricType(type);
    setStep('scanning');
    
    // Simulate biometric scanning progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setScanProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setStep('success');
        }, 500);
      }
    }, 300);
  };
  
  const handleComplete = () => {
    navigate('/home');
  };
  
  const handleSkip = () => {
    navigate('/home');
  };
  
  return (
    <PageWrapper hideNav className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-[#101322] dark:to-gray-900">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        {step === 'intro' && (
          <header className="px-5 py-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-white/50 dark:hover:bg-gray-800"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </header>
        )}
        
        {/* Content */}
        <main className="flex-1 flex flex-col justify-center px-5 pb-8">
          {/* Intro Step */}
          {step === 'intro' && (
            <div className="text-center animate-in">
              <div className="w-32 h-32 bg-gradient-to-br from-[#1132d4] to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <span className="material-symbols-outlined text-white text-6xl">fingerprint</span>
              </div>
              
              <h1 className="text-3xl font-bold mb-3">Setup Biometric Login</h1>
              <p className="text-slate-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                Secure your account and enable quick access with biometric authentication
              </p>
              
              {/* Benefits */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 space-y-4 text-left max-w-md mx-auto border border-slate-100 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-emerald-600 text-xl">speed</span>
                  </div>
                  <div>
                    <p className="font-bold mb-1">Quick & Easy Access</p>
                    <p className="text-sm text-slate-500">Log in instantly without typing passwords</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-blue-600 text-xl">shield</span>
                  </div>
                  <div>
                    <p className="font-bold mb-1">Enhanced Security</p>
                    <p className="text-sm text-slate-500">Your biometrics never leave your device</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-purple-600 text-xl">verified_user</span>
                  </div>
                  <div>
                    <p className="font-bold mb-1">Bank-Level Protection</p>
                    <p className="text-sm text-slate-500">Military-grade encryption for your data</p>
                  </div>
                </div>
              </div>
              
              {/* Setup Options */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleStartSetup('fingerprint')}
                  className="w-full h-16 bg-gradient-to-r from-[#1132d4] to-blue-600 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined text-2xl">fingerprint</span>
                  Setup Fingerprint
                </button>
                
                <button
                  onClick={() => handleStartSetup('face')}
                  className="w-full h-16 bg-white dark:bg-gray-800 border-2 border-slate-200 dark:border-gray-700 font-bold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-3"
                >
                  <span className="material-symbols-outlined text-2xl text-[#1132d4]">face</span>
                  Setup Face ID
                </button>
              </div>
              
              <button
                onClick={handleSkip}
                className="text-slate-500 font-medium hover:underline"
              >
                Skip for now
              </button>
            </div>
          )}
          
          {/* Scanning Step */}
          {step === 'scanning' && (
            <div className="text-center animate-in">
              <div className="relative w-40 h-40 mx-auto mb-8">
                {/* Circular Progress */}
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-slate-200 dark:text-gray-700"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${2 * Math.PI * 70 * (1 - scanProgress / 100)}`}
                    className="text-[#1132d4] transition-all duration-300"
                    strokeLinecap="round"
                  />
                </svg>
                
                {/* Icon in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#1132d4] to-blue-600 rounded-full flex items-center justify-center shadow-xl">
                    <span className="material-symbols-outlined text-white text-5xl animate-pulse">
                      {biometricType === 'fingerprint' ? 'fingerprint' : 'face'}
                    </span>
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-3">
                {biometricType === 'fingerprint' ? 'Place Your Finger' : 'Position Your Face'}
              </h2>
              <p className="text-slate-600 dark:text-gray-400 mb-4">
                {biometricType === 'fingerprint' 
                  ? 'Touch the fingerprint sensor to register your print'
                  : 'Look directly at the camera and keep your face in the frame'
                }
              </p>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 inline-block border border-slate-100 dark:border-gray-700">
                <p className="text-4xl font-bold text-[#1132d4]">{scanProgress}%</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Scanning Progress</p>
              </div>
            </div>
          )}
          
          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center animate-in">
              <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce-once">
                <span className="material-symbols-outlined text-white text-6xl">check_circle</span>
              </div>
              
              <h1 className="text-3xl font-bold mb-3">All Set!</h1>
              <p className="text-slate-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                {biometricType === 'fingerprint' 
                  ? 'Your fingerprint has been registered successfully'
                  : 'Face ID has been set up successfully'
                }
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-8 max-w-md mx-auto">
                <div className="flex items-start gap-3 text-left">
                  <span className="material-symbols-outlined text-blue-600 shrink-0">info</span>
                  <div className="text-sm text-blue-900 dark:text-blue-200">
                    <p className="font-bold mb-1">What's Next?</p>
                    <p>You can now use {biometricType === 'fingerprint' ? 'your fingerprint' : 'Face ID'} to quickly and securely log in to your InfinityVentures account.</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleComplete}
                className="w-full h-14 bg-gradient-to-r from-[#1132d4] to-blue-600 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                Continue to Dashboard
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          )}
        </main>
      </div>
      
      <style>{`
        @keyframes in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: in 0.4s ease-out;
        }
        @keyframes bounce-once {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-out;
        }
      `}</style>
    </PageWrapper>
  );
}
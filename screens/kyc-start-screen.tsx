import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PageWrapper } from '@/app/components/page-wrapper';
import { useAuth } from '@/app/contexts/AuthContext';
import { useNotification } from '@/app/contexts/NotificationContext';
import api from '@/app/api/client';

type KycStep = 'intro' | 'personal' | 'document' | 'selfie' | 'submitted';

export function KYCStartScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success: showSuccess, error: showError } = useNotification();

  const [step, setStep] = useState<KycStep>(
    user?.kycStatus === 'pending' ? 'submitted' :
    user?.kycStatus === 'verified' ? 'submitted' : 'intro'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Personal info form
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Document info
  const [docType, setDocType] = useState<'passport' | 'national_id' | 'drivers_license'>('passport');
  const [docNumber, setDocNumber] = useState('');

  const stepIndex = ['intro', 'personal', 'document', 'selfie', 'submitted'].indexOf(step);

  const handleSubmitKYC = async () => {
    setIsSubmitting(true);
    try {
      // Call backend KYC start endpoint
      await api.kycStart();
      showSuccess('KYC Submitted', 'Your verification is being reviewed. This usually takes 1-2 business days.');
      setStep('submitted');
    } catch (err: any) {
      showError('Submission Failed', err.message || 'Please try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Already verified ──────────────────────────────────────
  if (user?.kycStatus === 'verified') {
    return (
      <PageWrapper hideNav>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0b14]">
          <header className="px-5 py-4">
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </header>
          <main className="flex-1 flex flex-col items-center justify-center px-5 pb-12">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-emerald-600 text-4xl">verified</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Identity Verified</h1>
            <p className="text-slate-500 text-sm mb-6 text-center max-w-xs">
              Your KYC verification is complete. You can now access all platform features including bank transfers.
            </p>
            <button onClick={() => navigate('/home')} className="w-full max-w-xs bg-[#1132d4] text-white font-bold py-4 rounded-xl">
              Go to Dashboard
            </button>
          </main>
        </div>
      </PageWrapper>
    );
  }

  // ─── Render steps ──────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      // ── Intro ──
      case 'intro':
        return (
          <div className="flex-1 flex flex-col">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-[#1132d4]/10 flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[#1132d4] text-[40px]">shield_lock</span>
              </div>
              <h1 className="text-2xl font-bold mb-3">Verify Your Identity</h1>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                KYC verification is required to enable bank transfers and comply with financial regulations.
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {[
                { icon: 'person', title: 'Personal Information', desc: 'Your name, address, and date of birth', time: '~2 min' },
                { icon: 'id_card', title: 'ID Document', desc: 'Passport, national ID, or driver\'s license', time: '~1 min' },
                { icon: 'face', title: 'Selfie Verification', desc: 'Quick selfie to confirm your identity', time: '~1 min' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-[#1132d4]/10 text-[#1132d4] flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-xl">{s.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{s.title}</p>
                    <p className="text-xs text-slate-500">{s.desc}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{s.time}</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                <span className="font-bold">Privacy:</span> Your documents are encrypted and processed securely. We comply with GDPR and data protection regulations.
              </p>
            </div>

            <div className="mt-auto">
              <button
                onClick={() => setStep('personal')}
                className="w-full bg-[#1132d4] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
              >
                Start Verification
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        );

      // ── Personal Info ──
      case 'personal':
        return (
          <div className="flex-1 flex flex-col">
            <h2 className="text-xl font-bold mb-1">Personal Information</h2>
            <p className="text-sm text-slate-500 mb-6">Enter your legal name as it appears on your ID</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-gray-400 mb-1.5 block">Full Legal Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1132d4]"
                  placeholder="As shown on your ID" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-gray-400 mb-1.5 block">Date of Birth</label>
                <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1132d4]" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-gray-400 mb-1.5 block">Nationality</label>
                <input type="text" value={nationality} onChange={e => setNationality(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1132d4]"
                  placeholder="e.g., South Korea, United States" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-gray-400 mb-1.5 block">Address</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1132d4]"
                  placeholder="Street address" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-gray-400 mb-1.5 block">City</label>
                  <input type="text" value={city} onChange={e => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1132d4]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-gray-400 mb-1.5 block">Postal Code</label>
                  <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1132d4]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-gray-400 mb-1.5 block">Country</label>
                <input type="text" value={country} onChange={e => setCountry(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1132d4]"
                  placeholder="Country of residence" />
              </div>
            </div>

            <div className="mt-auto">
              <button
                onClick={() => setStep('document')}
                disabled={!fullName || !dateOfBirth || !nationality || !country}
                className="w-full bg-[#1132d4] text-white font-bold py-4 rounded-xl disabled:opacity-40 flex items-center justify-center gap-2"
              >
                Continue
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        );

      // ── Document ──
      case 'document':
        return (
          <div className="flex-1 flex flex-col">
            <h2 className="text-xl font-bold mb-1">ID Document</h2>
            <p className="text-sm text-slate-500 mb-6">Select and upload your government-issued ID</p>

            <div className="space-y-3 mb-6">
              {([
                { id: 'passport', icon: 'menu_book', label: 'Passport' },
                { id: 'national_id', icon: 'id_card', label: 'National ID Card' },
                { id: 'drivers_license', icon: 'directions_car', label: "Driver's License" },
              ] as const).map(d => (
                <button
                  key={d.id}
                  onClick={() => setDocType(d.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    docType === d.id
                      ? 'border-[#1132d4] bg-[#1132d4]/5'
                      : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <span className={`material-symbols-outlined text-xl ${docType === d.id ? 'text-[#1132d4]' : 'text-slate-400'}`}>{d.icon}</span>
                  <span className="font-bold text-sm">{d.label}</span>
                  {docType === d.id && <span className="material-symbols-outlined text-[#1132d4] ml-auto">check_circle</span>}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold text-slate-600 dark:text-gray-400 mb-1.5 block">Document Number</label>
              <input type="text" value={docNumber} onChange={e => setDocNumber(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1132d4]"
                placeholder="Enter document number" />
            </div>

            {/* Upload area — placeholder for real upload */}
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center mb-6">
              <span className="material-symbols-outlined text-slate-300 text-4xl mb-3 block">cloud_upload</span>
              <p className="text-sm font-bold text-slate-600 dark:text-gray-400 mb-1">Upload Document Photo</p>
              <p className="text-xs text-slate-400">Take a clear photo or upload an image of your {
                docType === 'passport' ? 'passport' : docType === 'national_id' ? 'national ID (front & back)' : "driver's license (front & back)"
              }</p>
              <p className="text-[10px] text-slate-400 mt-2">JPG, PNG · Max 10MB</p>
            </div>

            <div className="mt-auto">
              <button
                onClick={() => setStep('selfie')}
                disabled={!docNumber}
                className="w-full bg-[#1132d4] text-white font-bold py-4 rounded-xl disabled:opacity-40 flex items-center justify-center gap-2"
              >
                Continue
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        );

      // ── Selfie ──
      case 'selfie':
        return (
          <div className="flex-1 flex flex-col">
            <h2 className="text-xl font-bold mb-1">Selfie Verification</h2>
            <p className="text-sm text-slate-500 mb-6">Take a selfie to verify your identity</p>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 mb-6">
              <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-slate-300 text-5xl">photo_camera</span>
              </div>
              <p className="text-center text-sm text-slate-600 dark:text-gray-400 font-medium mb-2">Take a clear selfie</p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Face the camera directly</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Good lighting, no shadows</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> No sunglasses or hats</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Match the photo on your ID</li>
              </ul>
            </div>

            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center mb-6">
              <span className="material-symbols-outlined text-slate-300 text-3xl mb-2 block">add_a_photo</span>
              <p className="text-sm font-bold text-slate-600 dark:text-gray-400">Upload Selfie</p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG · Max 10MB</p>
            </div>

            <div className="mt-auto">
              <button
                onClick={handleSubmitKYC}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#1132d4] to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#1132d4]/30 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">send</span>
                    Submit Verification
                  </>
                )}
              </button>
            </div>
          </div>
        );

      // ── Submitted / Pending ──
      case 'submitted':
        return (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-amber-600 text-4xl">hourglass_top</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Verification In Progress</h1>
            <p className="text-slate-500 text-sm text-center max-w-xs mb-2">
              Your KYC documents are being reviewed by our compliance team.
            </p>
            <p className="text-xs text-slate-400 mb-8">
              Estimated time: 1-2 business days
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 w-full max-w-sm mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-600 text-sm">pending</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Status: Pending Review</p>
                  <p className="text-xs text-slate-500">You'll be notified once verified</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/home')}
              className="w-full max-w-sm bg-[#1132d4] text-white font-bold py-4 rounded-xl"
            >
              Return to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <PageWrapper hideNav>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0b14]">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#101322]/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-5 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (step === 'intro' || step === 'submitted') navigate(-1);
                else {
                  const steps: KycStep[] = ['intro', 'personal', 'document', 'selfie'];
                  const idx = steps.indexOf(step);
                  if (idx > 0) setStep(steps[idx - 1]);
                }
              }}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-bold">KYC Verification</h1>
            <div className="bg-slate-200 dark:bg-gray-800 px-3 py-1 rounded-full text-[10px] font-bold">
              Step {Math.min(stepIndex, 3) + 1} / 4
            </div>
          </div>
          {/* Progress bar */}
          <div className="flex gap-1 mt-3">
            {['intro', 'personal', 'document', 'selfie'].map((s, i) => (
              <div key={s} className={`h-1 flex-1 rounded-full ${i <= stepIndex ? 'bg-[#1132d4]' : 'bg-gray-200 dark:bg-gray-700'}`} />
            ))}
          </div>
        </header>

        <main className="flex-1 flex flex-col px-5 py-6">
          {renderStep()}
        </main>
      </div>
    </PageWrapper>
  );
}

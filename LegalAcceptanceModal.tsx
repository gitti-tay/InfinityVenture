import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';

interface LegalAcceptanceModalProps {
  open: boolean;
  onComplete: () => void;
  requireAll?: boolean;
}

export function LegalAcceptanceModal({ open, onComplete, requireAll = true }: LegalAcceptanceModalProps) {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [viewDoc, setViewDoc] = useState<string | null>(null);
  const [docContent, setDocContent] = useState<string>('');
  const [docLoading, setDocLoading] = useState(false);
  const [checks, setChecks] = useState({ terms: false, privacy: false, risk: false });

  const loadStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getLegalStatus();
      const legal = res.legal;
      setStatus(legal);

      // Pre-check already accepted docs
      setChecks({
        terms: legal?.termsOfService?.accepted || false,
        privacy: legal?.privacyPolicy?.accepted || false,
        risk: legal?.riskDisclosure?.accepted || false,
      });

      // If all already accepted, complete immediately
      if (legal?.allAccepted) {
        onComplete();
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [onComplete]);

  useEffect(() => { if (open) loadStatus(); }, [open, loadStatus]);

  const viewDocument = async (type: string) => {
    setDocLoading(true);
    setViewDoc(type);
    try {
      const res = await api.getLegalDocument(type);
      setDocContent(res.document?.content || 'Document not available.');
    } catch { setDocContent('Failed to load document.'); }
    finally { setDocLoading(false); }
  };

  const acceptAll = async () => {
    setAccepting(true);
    try {
      await api.acceptAllLegal();
      onComplete();
    } catch (e) { alert('Failed to accept documents. Please try again.'); }
    finally { setAccepting(false); }
  };

  if (!open) return null;

  const allChecked = checks.terms && checks.privacy && checks.risk;

  // Document viewer
  if (viewDoc) {
    const titles: Record<string, string> = {
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      risk_disclosure: 'Risk Disclosure',
    };
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-bold text-base">{titles[viewDoc] || viewDoc}</h3>
            <button onClick={() => setViewDoc(null)} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {docLoading ? <div className="text-center py-12 text-gray-400">Loading document...</div> : docContent}
          </div>
          <div className="p-4 border-t">
            <button onClick={() => setViewDoc(null)}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b text-center">
          <div className="text-3xl mb-2">📋</div>
          <h2 className="text-lg font-bold text-gray-900">Legal Agreements</h2>
          <p className="text-sm text-gray-500 mt-1">
            Please review and accept to continue using Infinity Ventures.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading...</div>
        ) : (
          <div className="p-5 space-y-3">
            {/* Terms of Service */}
            <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition
              ${checks.terms ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}
              ${status?.terms?.accepted ? 'opacity-70 cursor-default' : ''}`}>
              <input type="checkbox" checked={checks.terms} disabled={status?.terms?.accepted}
                onChange={e => setChecks({ ...checks, terms: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Terms of Service</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {status?.terms?.accepted
                    ? `✅ Accepted (v${status.terms.currentVersion})`
                    : `Version ${status?.terms?.currentVersion || '1.0'}`}
                </div>
              </div>
              <button onClick={() => viewDocument('terms')} className="text-indigo-600 text-xs font-medium hover:underline">
                Read
              </button>
            </label>

            {/* Privacy Policy */}
            <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition
              ${checks.privacy ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}
              ${status?.privacy?.accepted ? 'opacity-70 cursor-default' : ''}`}>
              <input type="checkbox" checked={checks.privacy} disabled={status?.privacy?.accepted}
                onChange={e => setChecks({ ...checks, privacy: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Privacy Policy</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {status?.privacy?.accepted
                    ? `✅ Accepted (v${status.privacy.currentVersion})`
                    : `Version ${status?.privacy?.currentVersion || '1.0'}`}
                </div>
              </div>
              <button onClick={() => viewDocument('privacy')} className="text-indigo-600 text-xs font-medium hover:underline">
                Read
              </button>
            </label>

            {/* Risk Disclosure */}
            <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition
              ${checks.risk ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}
              ${status?.risk?.accepted ? 'opacity-70 cursor-default' : ''}`}>
              <input type="checkbox" checked={checks.risk} disabled={status?.risk?.accepted}
                onChange={e => setChecks({ ...checks, risk: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">Risk Disclosure</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {status?.risk?.accepted
                    ? `✅ Accepted (v${status.risk.currentVersion})`
                    : `Version ${status?.risk?.currentVersion || '1.0'}`}
                </div>
              </div>
              <button onClick={() => viewDocument('risk_disclosure')} className="text-indigo-600 text-xs font-medium hover:underline">
                Read
              </button>
            </label>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
              ⚠️ By checking above and clicking "Accept All", you confirm that you have read and agree to all documents.
              Investment involves risk of loss.
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-5 border-t">
          <button onClick={acceptAll} disabled={!allChecked || accepting}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition
              ${allChecked ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
            {accepting ? 'Accepting...' : 'Accept All & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

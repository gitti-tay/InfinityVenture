import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode, useState, useEffect, useCallback } from 'react';
import { LegalAcceptanceModal } from '../components/LegalAcceptanceModal';
import api from '../api/client';

const LEGAL_DISMISSED_KEY = 'iv_legal_dismissed';
const LEGAL_ACCEPTED_KEY = 'iv_legal_accepted';

interface ProtectedRouteProps {
  children: ReactNode;
  requireWallet?: boolean;
  requireKYC?: boolean;
}

const isLegalDismissed = (): boolean => {
  try {
    return sessionStorage.getItem(LEGAL_DISMISSED_KEY) === 'true';
  } catch {
    return false;
  }
};

const isLegalAccepted = (): boolean => {
  try {
    return localStorage.getItem(LEGAL_ACCEPTED_KEY) === 'true';
  } catch {
    return false;
  }
};

const saveLegalDismissal = (): void => {
  try {
    sessionStorage.setItem(LEGAL_DISMISSED_KEY, 'true');
  } catch {
    // Silently fail if storage is unavailable
  }
};

const saveLegalAcceptance = (): void => {
  try {
    localStorage.setItem(LEGAL_ACCEPTED_KEY, 'true');
  } catch {
    // Silently fail if storage is unavailable
  }
};

export function ProtectedRoute({ children, requireKYC = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const [legalChecked, setLegalChecked] = useState(false);
  const [showLegal, setShowLegal] = useState(false);

  const handleLegalComplete = useCallback(() => {
    saveLegalAcceptance();
    setShowLegal(false);
  }, []);

  const handleLegalDismiss = useCallback(() => {
    saveLegalDismissal();
    setShowLegal(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    const skipPaths = ['/email-verification', '/connect-wallet', '/biometric-registration'];
    if (skipPaths.some(p => location.pathname.startsWith(p))) {
      setLegalChecked(true);
      return;
    }

    // Skip if already accepted or dismissed this session
    if (isLegalAccepted() || isLegalDismissed()) {
      setLegalChecked(true);
      setShowLegal(false);
      return;
    }

    api.getLegalStatus().then(res => {
      const legal = res.legal;
      const needsAcceptance = !legal?.termsOfService?.accepted
        || !legal?.privacyPolicy?.accepted
        || !legal?.riskDisclosure?.accepted;

      if (!needsAcceptance) {
        saveLegalAcceptance();
      }

      setShowLegal(needsAcceptance);
      setLegalChecked(true);
    }).catch(() => setLegalChecked(true));
  }, [isAuthenticated, isLoading, location.pathname]);

  if (isLoading || (isAuthenticated && !legalChecked)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#1132d4] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireKYC && user?.kycStatus !== 'verified') {
    return <Navigate to="/kyc-start" replace />;
  }

  return (
    <>
      <LegalAcceptanceModal
        open={showLegal}
        onComplete={handleLegalComplete}
        onDismiss={handleLegalDismiss}
      />
      {children}
    </>
  );
}

// Guest-only route (redirect to home if already authenticated)
export function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-[#1132d4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode, useState, useEffect } from 'react';
import { LegalAcceptanceModal } from '../components/LegalAcceptanceModal';
import api from '../api/client';

interface ProtectedRouteProps {
  children: ReactNode;
  requireWallet?: boolean;
  requireKYC?: boolean;
}

export function ProtectedRoute({ children, requireKYC = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  const [legalChecked, setLegalChecked] = useState(false);
  const [showLegal, setShowLegal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;
    // Skip legal check for onboarding pages
    const skipPaths = ['/email-verification', '/connect-wallet', '/biometric-registration'];
    if (skipPaths.some(p => location.pathname.startsWith(p))) {
      setLegalChecked(true);
      return;
    }
    api.getLegalStatus().then(res => {
      const legal = res.legal;
      const needsAcceptance = !legal?.termsOfService?.accepted || !legal?.privacyPolicy?.accepted || !legal?.riskDisclosure?.accepted;
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
      <LegalAcceptanceModal open={showLegal} onComplete={() => setShowLegal(false)} />
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

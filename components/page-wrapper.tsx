import { ReactNode } from 'react';
import { useLocation } from 'react-router';
import { BottomNav } from './bottom-nav';

interface PageWrapperProps {
  children: ReactNode;
  hideNav?: boolean;
  className?: string;
}

export function PageWrapper({ children, hideNav = false, className = "" }: PageWrapperProps) {
  const location = useLocation();
  const isPublicPage = ['/', '/login', '/signup', '/forgot-password'].includes(location.pathname);

  // Public/auth pages: centered card on desktop, full on mobile
  if (isPublicPage) {
    return (
      <div className="min-h-screen w-full bg-background lg:flex lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-slate-100 lg:to-blue-50 dark:lg:from-[#0a0b14] dark:lg:to-[#101322]">
        <div className={`relative flex h-full min-h-screen lg:min-h-0 lg:h-auto w-full flex-col max-w-md lg:max-w-md mx-auto bg-background lg:shadow-2xl lg:rounded-3xl lg:border lg:border-gray-200/50 dark:lg:border-gray-700/50 lg:my-8 overflow-x-hidden ${className}`}>
          {children}
          {!hideNav && <BottomNav />}
        </div>
      </div>
    );
  }

  // Authenticated app pages: full width, responsive
  return (
    <div className={`relative flex h-full min-h-screen w-full flex-col max-w-md lg:max-w-full mx-auto bg-background lg:shadow-none overflow-x-hidden ${className}`}>
      {children}
      {!hideNav && <BottomNav />}
    </div>
  );
}

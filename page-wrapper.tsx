import { ReactNode } from 'react';
import { BottomNav } from './bottom-nav';

interface PageWrapperProps {
  children: ReactNode;
  hideNav?: boolean;
  className?: string;
}

export function PageWrapper({ children, hideNav = false, className = "" }: PageWrapperProps) {
  return (
    <div className={`relative flex h-full min-h-screen w-full flex-col max-w-md mx-auto bg-background shadow-xl overflow-x-hidden ${className}`}>
      {children}
      {!hideNav && <BottomNav />}
    </div>
  );
}

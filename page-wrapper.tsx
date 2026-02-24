import { ReactNode } from 'react';
import { BottomNav } from './bottom-nav';

interface PageWrapperProps {
  children: ReactNode;
  hideNav?: boolean;
  className?: string;
  /** Full width on desktop (for admin, dashboards) */
  wide?: boolean;
}

export function PageWrapper({ children, hideNav = false, className = "", wide = false }: PageWrapperProps) {
  return (
    <div className={`
      relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background
      max-w-md mx-auto shadow-xl
      lg:max-w-none lg:shadow-none lg:mx-0
      ${wide ? 'lg:max-w-full' : 'lg:max-w-3xl lg:mx-auto'}
      ${className}
    `}>
      {children}
      {/* Bottom nav: mobile only */}
      {!hideNav && (
        <div className="lg:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
}

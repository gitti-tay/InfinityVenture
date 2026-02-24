import { ReactNode } from 'react';
import { useLocation } from 'react-router';
import { DesktopSidebar } from './desktop-sidebar';
import { useAuth } from '@/app/contexts/AuthContext';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

// Routes where sidebar should NOT appear (public/auth pages, admin)
const NO_SIDEBAR_ROUTES = [
  '/', '/login', '/signup', '/forgot-password', '/email-verification',
  '/admin',
];

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const location = useLocation();
  const { user } = useAuth();

  const isPublicPage = NO_SIDEBAR_ROUTES.some(r => 
    r === '/' ? location.pathname === '/' : location.pathname.startsWith(r)
  );
  const isAdminPage = location.pathname.startsWith('/admin');
  const showSidebar = !!user && !isPublicPage && !isAdminPage;

  // Admin pages get their own full layout
  if (isAdminPage) {
    return <>{children}</>;
  }

  // Public pages: centered, no sidebar
  if (!showSidebar) {
    return (
      <div className="min-h-screen bg-background">
        {children}
      </div>
    );
  }

  // Authenticated pages: sidebar (desktop) + content
  return (
    <div className="min-h-screen bg-background flex">
      <DesktopSidebar />
      <main className="flex-1 min-w-0 lg:bg-gray-50/50 dark:lg:bg-[#0c0f1a]">
        {children}
      </main>
    </div>
  );
}

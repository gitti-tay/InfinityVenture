import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (n: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((n: Omit<Notification, 'id'>) => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const notification = { ...n, id };
    setNotifications(prev => [...prev, notification]);

    // Auto-remove after duration
    const duration = n.duration || 4000;
    setTimeout(() => {
      setNotifications(prev => prev.filter(x => x.id !== id));
    }, duration);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(x => x.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string) => {
    addNotification({ type: 'success', title, message });
  }, [addNotification]);

  const error = useCallback((title: string, message?: string) => {
    addNotification({ type: 'error', title, message });
  }, [addNotification]);

  const info = useCallback((title: string, message?: string) => {
    addNotification({ type: 'info', title, message });
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, success, error, info }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 left-4 z-[9999] flex flex-col gap-2 pointer-events-none max-w-md mx-auto">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`pointer-events-auto animate-fadeIn rounded-xl p-4 shadow-lg border backdrop-blur-md flex items-start gap-3 ${
              n.type === 'success' ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900' :
              n.type === 'error' ? 'bg-red-50/95 border-red-200 text-red-900' :
              n.type === 'warning' ? 'bg-amber-50/95 border-amber-200 text-amber-900' :
              'bg-blue-50/95 border-blue-200 text-blue-900'
            }`}
            onClick={() => removeNotification(n.id)}
          >
            <span className="material-symbols-outlined text-xl mt-0.5">
              {n.type === 'success' ? 'check_circle' :
               n.type === 'error' ? 'error' :
               n.type === 'warning' ? 'warning' : 'info'}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">{n.title}</p>
              {n.message && <p className="text-xs opacity-80 mt-0.5">{n.message}</p>}
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification(): NotificationContextType {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}

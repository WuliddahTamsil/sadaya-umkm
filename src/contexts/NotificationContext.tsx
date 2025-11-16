import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../config/api';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'delivery' | 'payment' | 'system' | 'weather';
  status?: 'pending' | 'processing' | 'completed';
  timestamp: Date;
  createdAt?: string;
  read: boolean;
  readAt?: string;
  orderId?: string;
  icon?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'userId'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load notifications from backend
  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(api.notifications.getByUser(user.id));
      if (!response.ok) {
        throw new Error('Gagal mengambil data notifications');
      }

      const result = await response.json();
      
      // Transform data dari backend ke format frontend
      const transformedNotifications: Notification[] = result.data.map((notif: any) => ({
        id: notif.id,
        userId: notif.userId,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        status: notif.status,
        timestamp: new Date(notif.createdAt),
        createdAt: notif.createdAt,
        read: notif.read || false,
        readAt: notif.readAt,
        orderId: notif.orderId,
      }));

      setNotifications(transformedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load notifications on mount and when user changes
  useEffect(() => {
    fetchNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'userId'>) => {
    if (!user) return;

    try {
      const response = await fetch(api.notifications.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          orderId: notification.orderId,
          status: notification.status,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal membuat notification');
      }

      // Refresh notifications
      await fetchNotifications();
    } catch (error) {
      console.error('Add notification error:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(api.notifications.markAsRead(id), {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Gagal update notification');
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
      );
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const response = await fetch(api.notifications.markAllAsRead(user.id), {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Gagal update notifications');
      }

      // Update local state
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  };

  const clearNotifications = async () => {
    if (!user) return;

    try {
      const response = await fetch(api.notifications.clear(user.id), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus notifications');
      }

      setNotifications([]);
    } catch (error) {
      console.error('Clear notifications error:', error);
    }
  };

  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      isLoading,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      refreshNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

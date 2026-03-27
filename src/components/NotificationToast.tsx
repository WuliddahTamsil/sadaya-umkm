import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Bell, Package, Truck, CloudRain, CheckCircle, Clock } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import type { Notification } from '../contexts/NotificationContext';

export function NotificationToast() {
  const { notifications } = useNotifications();
  const shownNotificationsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Show only unread notifications that haven't been shown yet
    const unread = notifications.filter(n => !n.read);
    
    unread.forEach((notification) => {
      if (!shownNotificationsRef.current.has(notification.id)) {
        shownNotificationsRef.current.add(notification.id);
        
        const getIcon = () => {
          switch (notification.type) {
            case 'order':
              return <Package size={16} />;
            case 'delivery':
              return <Truck size={16} />;
            case 'weather':
              return <CloudRain size={16} />;
            default:
              return <Bell size={16} />;
          }
        };

        const getToastType = () => {
          switch (notification.status) {
            case 'completed':
              return 'success';
            case 'processing':
              return 'info';
            case 'pending':
              return 'warning';
            default:
              return 'info';
          }
        };

        const toastType = getToastType();
        const icon = getIcon();

        if (toastType === 'success') {
          toast.success(notification.title, {
            description: notification.message,
            icon,
            duration: 5000,
          });
        } else if (toastType === 'warning') {
          toast.warning(notification.title, {
            description: notification.message,
            icon,
            duration: 5000,
          });
        } else {
          toast.info(notification.title, {
            description: notification.message,
            icon,
            duration: 5000,
          });
        }
      }
    });

    // Clean up shown notifications that are now read
    const readIds = notifications.filter(n => n.read).map(n => n.id);
    readIds.forEach(id => shownNotificationsRef.current.delete(id));
  }, [notifications]);

  return null; // This component doesn't render anything, it just triggers toasts
}

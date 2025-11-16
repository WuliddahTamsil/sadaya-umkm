import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Bell, Package, Truck, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { motion } from 'framer-motion';

export function NotificationPage() {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package size={20} />;
      case 'delivery':
        return <Truck size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getColor = (status?: string) => {
    switch (status) {
      case 'pending':
        return '#FFB84D';
      case 'processing':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      default:
        return '#FF8D28';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    return `${days} hari lalu`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: '#2F4858' }}>Notifikasi</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={markAllAsRead}
                disabled={notifications.filter(n => !n.read).length === 0}
              >
                Tandai Semua Dibaca
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearNotifications}
                disabled={notifications.length === 0}
                style={{ color: '#FF6B6B' }}
              >
                <Trash2 size={16} className="mr-1" />
                Hapus Semua
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: '#F5F5F5' }}
              >
                <Bell size={32} style={{ color: '#CCCCCC' }} />
              </div>
              <h4 style={{ color: '#858585' }}>Belum ada notifikasi</h4>
              <p className="body-3 mt-2" style={{ color: '#CCCCCC' }}>
                Notifikasi Anda akan muncul di sini
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
                    onClick={() => markAsRead(notification.id)}
                    style={{
                      borderLeft: `4px solid ${getColor(notification.status)}`,
                      backgroundColor: notification.read ? '#FFFFFF' : '#FFF4E6'
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: getColor(notification.status) + '20' }}
                        >
                          <div style={{ color: getColor(notification.status) }}>
                            {getIcon(notification.type)}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 style={{ color: '#2F4858', fontSize: '14px', fontWeight: 600 }}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <Badge 
                                style={{ 
                                  backgroundColor: '#FF8D28', 
                                  color: '#FFFFFF',
                                  fontSize: '10px'
                                }}
                              >
                                Baru
                              </Badge>
                            )}
                          </div>
                          <p className="body-3 mb-2" style={{ color: '#858585', fontSize: '13px' }}>
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-3">
                            <p className="body-3" style={{ color: '#CCCCCC', fontSize: '12px' }}>
                              {formatTime(notification.timestamp)}
                            </p>
                            
                            {notification.status && (
                              <div className="flex items-center gap-1">
                                {notification.status === 'pending' && (
                                  <>
                                    <Clock size={12} style={{ color: getColor(notification.status) }} />
                                    <span 
                                      className="body-3" 
                                      style={{ color: getColor(notification.status), fontSize: '11px' }}
                                    >
                                      Menunggu
                                    </span>
                                  </>
                                )}
                                {notification.status === 'processing' && (
                                  <>
                                    <div 
                                      className="w-2 h-2 rounded-full animate-pulse"
                                      style={{ backgroundColor: getColor(notification.status) }}
                                    />
                                    <span 
                                      className="body-3" 
                                      style={{ color: getColor(notification.status), fontSize: '11px' }}
                                    >
                                      Diproses
                                    </span>
                                  </>
                                )}
                                {notification.status === 'completed' && (
                                  <>
                                    <CheckCircle size={12} style={{ color: getColor(notification.status) }} />
                                    <span 
                                      className="body-3" 
                                      style={{ color: getColor(notification.status), fontSize: '11px' }}
                                    >
                                      Selesai
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

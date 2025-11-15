import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Package, Truck, CheckCircle, XCircle, Star, Eye, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../config/api';
import { toast } from 'sonner';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled' | 'preparing' | 'ready' | 'pickup' | 'delivered';
  store: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  paymentMethod?: string;
}

export function RiwayatPesanan() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'user') {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`${api.orders.getAll}?userId=${user.id}`);
      if (!response.ok) {
        throw new Error('Gagal mengambil data pesanan');
      }
      const data = await response.json();
      const mappedOrders: Order[] = data.data.map((order: any) => ({
        id: order.id,
        orderNumber: order.id,
        date: new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: order.items.map((item: any) => ({
          name: item.name,
          qty: item.quantity,
          price: item.price
        })),
        total: order.total,
        status: mapOrderStatus(order.status),
        store: order.storeName,
        paymentStatus: order.paymentStatus,
        paymentMethod: order.paymentMethod
      }));
      setOrders(mappedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Gagal memuat riwayat pesanan');
    } finally {
      setIsLoading(false);
    }
  };

  const mapOrderStatus = (status: string): Order['status'] => {
    switch (status) {
      case 'preparing':
        return 'processing';
      case 'ready':
        return 'processing';
      case 'pickup':
        return 'shipping';
      case 'delivered':
        return 'shipping';
      case 'completed':
        return 'completed';
      default:
        return 'pending';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#FDE08E', text: '#F57C00' };
      case 'processing':
        return { bg: '#B3E5FC', text: '#1976D2' };
      case 'shipping':
        return { bg: '#C5CAE9', text: '#5E35B1' };
      case 'completed':
        return { bg: '#C8E6C9', text: '#2E7D32' };
      case 'cancelled':
        return { bg: '#FFCDD2', text: '#C62828' };
      default:
        return { bg: '#E0E0E0', text: '#757575' };
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'processing': return 'Diproses';
      case 'shipping': return 'Dikirim';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Package size={16} />;
      case 'processing': return <Package size={16} />;
      case 'shipping': return <Truck size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') {
      return order.status === 'pending' || order.paymentStatus === 'pending';
    }
    return order.status === activeTab;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto mb-4" style={{ color: '#FF8D28' }} size={48} />
            <p style={{ color: '#858585' }}>Memuat riwayat pesanan...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#2F4858' }}>Riwayat Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="pending">Menunggu Pembayaran</TabsTrigger>
              <TabsTrigger value="processing">Diproses</TabsTrigger>
              <TabsTrigger value="shipping">Dikirim</TabsTrigger>
              <TabsTrigger value="completed">Selesai</TabsTrigger>
              <TabsTrigger value="cancelled">Batal</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div 
                    className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: '#F5F5F5' }}
                  >
                    <Package size={32} style={{ color: '#CCCCCC' }} />
                  </div>
                  <h4 style={{ color: '#858585' }}>Belum ada pesanan</h4>
                  <p className="body-3 mt-2" style={{ color: '#CCCCCC' }}>
                    Pesanan Anda akan muncul di sini
                  </p>
                </div>
              ) : (
                filteredOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 style={{ color: '#2F4858' }}>{order.orderNumber}</h4>
                            <p className="body-3 mt-1" style={{ color: '#858585' }}>
                              {order.date} • {order.store}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge
                              style={{
                                backgroundColor: getStatusColor(order.status).bg,
                                color: getStatusColor(order.status).text
                              }}
                            >
                              <span className="flex items-center gap-1">
                                {getStatusIcon(order.status)}
                                {getStatusLabel(order.status)}
                              </span>
                            </Badge>
                            {order.paymentStatus === 'pending' && (
                              <Badge style={{ backgroundColor: '#FFF3CD', color: '#856404' }}>
                                Menunggu Pembayaran
                              </Badge>
                            )}
                            {order.paymentStatus === 'paid' && (
                              <Badge style={{ backgroundColor: '#D4EDDA', color: '#155724' }}>
                                Sudah Dibayar
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-2 mb-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
                              <div>
                                <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                                  {item.name}
                                </p>
                                <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                                  {item.qty}x
                                </p>
                              </div>
                              <p className="body-3" style={{ color: '#FF8D28', fontWeight: 600 }}>
                                Rp {item.price.toLocaleString('id-ID')}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid #E0E0E0' }}>
                          <div>
                            <p className="body-3" style={{ color: '#858585' }}>Total Pembayaran</p>
                            <h4 style={{ color: '#FF8D28' }}>
                              Rp {order.total.toLocaleString('id-ID')}
                            </h4>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              <Eye size={16} className="mr-1" />
                              Detail
                            </Button>
                            {order.status === 'completed' && (
                              <Button 
                                size="sm"
                                style={{ backgroundColor: '#FFB800', color: '#FFFFFF' }}
                              >
                                <Star size={16} className="mr-1" />
                                Beri Ulasan
                              </Button>
                            )}
                            {order.status === 'shipping' && (
                              <Button 
                                size="sm"
                                style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}
                              >
                                <Truck size={16} className="mr-1" />
                                Lacak
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

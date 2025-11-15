import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { 
  Search, 
  RefreshCw,
  Loader2,
  Eye,
  MoreVertical,
  Package,
  User,
  Store,
  Truck,
  MapPin,
  Calendar,
  DollarSign,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Label } from '../../ui/label';
import { api } from '../../../config/api';
import { toast } from 'sonner';
import type { Order, OrderStatus } from '../../../contexts/OrderContext';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export function ManajemenOrder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all'); // user, umkm, driver
  const [data, setData] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      // Filter berdasarkan role: userId, umkmId, driverId
      // Untuk sekarang ambil semua, filter di frontend jika perlu
      
      const url = `${api.orders.getAll}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Gagal mengambil data orders');
      }

      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Gagal mengambil data orders');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchOrders();
  };

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const getStatusBadge = (status: OrderStatus) => {
    const styles: Record<OrderStatus, { bg: string; text: string; label: string }> = {
      preparing: { bg: '#FDE08E', text: '#F57C00', label: 'Menunggu UMKM' },
      ready: { bg: '#B3E5FC', text: '#1976D2', label: 'Siap Diambil' },
      pickup: { bg: '#C8E6C9', text: '#2E7D32', label: 'Sedang Diantar' },
      delivered: { bg: '#4CAF50', text: '#FFFFFF', label: 'Selesai' },
      completed: { bg: '#4CAF50', text: '#FFFFFF', label: 'Selesai' },
    };
    const style = styles[status] || styles.preparing;
    return (
      <Badge style={{ backgroundColor: style.bg, color: style.text }}>
        {style.label}
      </Badge>
    );
  };

  const filteredData = data.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 style={{ color: '#2F4858', fontSize: '24px', fontWeight: 700 }}>
            Manajemen Order
          </h2>
          <p className="body-3 mt-1" style={{ color: '#858585' }}>
            Kelola semua pesanan dari user, UMKM, dan driver
          </p>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} style={{ color: '#858585' }} />
              <Input
                placeholder="Cari berdasarkan ID order, nama user, atau nama toko..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="preparing">Menunggu UMKM</SelectItem>
                  <SelectItem value="ready">Siap Diambil</SelectItem>
                  <SelectItem value="pickup">Sedang Diantar</SelectItem>
                  <SelectItem value="delivered">Selesai</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 size={32} className="animate-spin mx-auto mb-4" style={{ color: '#FF8D28' }} />
              <p style={{ color: '#858585' }}>Memuat data orders...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={48} style={{ color: '#CCCCCC', margin: '0 auto' }} />
              <p style={{ color: '#858585' }} className="mt-4">
                {searchQuery ? 'Tidak ada order yang sesuai dengan pencarian' : 'Belum ada order'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Order</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>UMKM/Toko</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell>
                        <p className="body-3" style={{ color: '#2F4858', fontWeight: 600, fontFamily: 'monospace' }}>
                          {item.id}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User size={16} style={{ color: '#858585' }} />
                          <p className="body-3" style={{ color: '#2F4858' }}>
                            {item.userName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Store size={16} style={{ color: '#858585' }} />
                          <p className="body-3" style={{ color: '#2F4858' }}>
                            {item.storeName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.driverName ? (
                          <div className="flex items-center gap-2">
                            <Truck size={16} style={{ color: '#858585' }} />
                            <p className="body-3" style={{ color: '#2F4858' }}>
                              {item.driverName}
                            </p>
                          </div>
                        ) : (
                          <p className="body-3" style={{ color: '#CCCCCC' }}>
                            Belum ada driver
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="body-3" style={{ color: '#2F4858' }}>
                          {item.items.length} item
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="body-3" style={{ color: '#FF8D28', fontWeight: 600 }}>
                          Rp {item.total.toLocaleString('id-ID')}
                        </p>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(item.status)}
                      </TableCell>
                      <TableCell>
                        <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                          {new Date(item.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetail(item)}>
                              <Eye size={14} className="mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: '#2F4858' }}>
              Detail Order - {selectedOrder?.id}
            </DialogTitle>
            <DialogDescription>
              Status: {selectedOrder?.status} | Tanggal: {selectedOrder && new Date(selectedOrder.createdAt).toLocaleDateString('id-ID')}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Informasi Order */}
              <div className="space-y-4">
                <h4 style={{ color: '#2F4858', fontWeight: 600 }}>Informasi Order</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="body-3" style={{ color: '#858585' }}>ID Order</Label>
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 500, fontFamily: 'monospace' }}>
                      {selectedOrder.id}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="body-3" style={{ color: '#858585' }}>Status</Label>
                    <div>{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="body-3" style={{ color: '#858585' }}>Tanggal Order</Label>
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                      {new Date(selectedOrder.createdAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {selectedOrder.updatedAt && (
                    <div className="space-y-2">
                      <Label className="body-3" style={{ color: '#858585' }}>Terakhir Update</Label>
                      <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                        {new Date(selectedOrder.updatedAt).toLocaleString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Informasi User */}
              <div className="space-y-4">
                <h4 style={{ color: '#2F4858', fontWeight: 600 }}>Informasi Pembeli</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="body-3" style={{ color: '#858585' }}>Nama Pembeli</Label>
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                      {selectedOrder.userName}
                    </p>
                  </div>
                  {selectedOrder.userEmail && (
                    <div className="space-y-2">
                      <Label className="body-3" style={{ color: '#858585' }}>Email</Label>
                      <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                        {selectedOrder.userEmail}
                      </p>
                    </div>
                  )}
                  <div className="space-y-2 col-span-2">
                    <Label className="body-3" style={{ color: '#858585' }}>Alamat Pengiriman</Label>
                    <div className="flex items-start gap-2">
                      <MapPin size={16} style={{ color: '#858585', marginTop: '2px' }} />
                      <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                        {selectedOrder.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informasi UMKM */}
              <div className="space-y-4">
                <h4 style={{ color: '#2F4858', fontWeight: 600 }}>Informasi UMKM</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="body-3" style={{ color: '#858585' }}>Nama Toko</Label>
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                      {selectedOrder.storeName}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="body-3" style={{ color: '#858585' }}>Alamat Toko</Label>
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                      {selectedOrder.storeAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informasi Driver */}
              {selectedOrder.driverName && (
                <div className="space-y-4">
                  <h4 style={{ color: '#2F4858', fontWeight: 600 }}>Informasi Driver</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="body-3" style={{ color: '#858585' }}>Nama Driver</Label>
                      <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                        {selectedOrder.driverName}
                      </p>
                    </div>
                    {selectedOrder.pickupTime && (
                      <div className="space-y-2">
                        <Label className="body-3" style={{ color: '#858585' }}>Waktu Pengambilan</Label>
                        <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                          {new Date(selectedOrder.pickupTime).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="space-y-4">
                <h4 style={{ color: '#2F4858', fontWeight: 600 }}>Item Pesanan</h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead className="text-right">Harga Satuan</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                              {item.name}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="body-3" style={{ color: '#858585' }}>
                              {item.quantity}
                            </p>
                          </TableCell>
                          <TableCell className="text-right">
                            <p className="body-3" style={{ color: '#858585' }}>
                              Rp {item.price.toLocaleString('id-ID')}
                            </p>
                          </TableCell>
                          <TableCell className="text-right">
                            <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                              Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                            </p>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Total */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex justify-between items-center">
                  <Label className="body-3" style={{ color: '#858585' }}>Subtotal</Label>
                  <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                    Rp {(selectedOrder.subtotal || (selectedOrder.total - selectedOrder.deliveryFee)).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="body-3" style={{ color: '#858585' }}>Ongkos Kirim</Label>
                  <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                    Rp {selectedOrder.deliveryFee.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <Label className="body-2" style={{ color: '#2F4858', fontWeight: 600 }}>Total</Label>
                  <p className="body-2" style={{ color: '#FF8D28', fontWeight: 700, fontSize: '18px' }}>
                    Rp {selectedOrder.total.toLocaleString('id-ID')}
                  </p>
                </div>
                {selectedOrder.paymentMethod && (
                  <div className="flex justify-between items-center">
                    <Label className="body-3" style={{ color: '#858585' }}>Metode Pembayaran</Label>
                    <Badge variant="outline">
                      {selectedOrder.paymentMethod.toUpperCase()}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="space-y-2">
                  <Label className="body-3" style={{ color: '#858585' }}>Catatan</Label>
                  <p className="body-3 p-3 rounded-lg" style={{ backgroundColor: '#F5F5F5', color: '#2F4858' }}>
                    {selectedOrder.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


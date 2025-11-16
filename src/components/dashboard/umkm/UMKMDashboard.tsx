import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { TrendingUp, Star, Package, DollarSign, ShoppingCart, Users, Loader2 } from 'lucide-react';
import { PersonalizedGreeting } from '../../PersonalizedGreeting';
import { GamificationBadge } from '../../GamificationBadge';
import { useAuth } from '../../../contexts/AuthContext';
import { useOrders } from '../../../contexts/OrderContext';
import { api } from '../../../config/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TopProduct {
  name: string;
  sold: number;
  revenue: number;
}

export function UMKMDashboard() {
  const { user } = useAuth();
  const orders = useOrders();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products for this UMKM
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user || user.role !== 'umkm') return;
      
      try {
        const response = await fetch(api.products.getByUMKM(user.id));
        if (response.ok) {
          const data = await response.json();
          setProducts(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  // Filter orders for this UMKM
  const umkmOrders = useMemo(() => {
    if (!user || user.role !== 'umkm') return [];
    return orders.filter(order => order.umkmId === user.id);
  }, [orders, user]);

  // Calculate total revenue from completed orders only
  const totalRevenue = useMemo(() => {
    const completedOrders = umkmOrders.filter(order => 
      (order.status === 'delivered' || order.status === 'completed') && 
      order.paymentStatus === 'paid'
    );
    return completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  }, [umkmOrders]);

  // Calculate orders this month
  const ordersThisMonth = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return umkmOrders.filter(order => 
      new Date(order.createdAt) >= startOfMonth
    ).length;
  }, [umkmOrders]);

  // Calculate top selling products from orders
  const topProducts = useMemo(() => {
    const completedOrders = umkmOrders.filter(order => 
      (order.status === 'delivered' || order.status === 'completed') && 
      order.paymentStatus === 'paid'
    );

    // Aggregate product sales
    const productMap = new Map<string, { name: string; sold: number; revenue: number }>();

    completedOrders.forEach(order => {
      order.items.forEach(item => {
        const existing = productMap.get(item.id) || { name: item.name, sold: 0, revenue: 0 };
        existing.sold += item.quantity;
        existing.revenue += item.price * item.quantity;
        productMap.set(item.id, existing);
      });
    });

    // Convert to array and sort by sold quantity
    const topProductsArray: TopProduct[] = Array.from(productMap.values())
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 4); // Top 4 products

    return topProductsArray;
  }, [umkmOrders]);

  // Calculate unique customers
  const uniqueCustomers = useMemo(() => {
    const customerIds = new Set(umkmOrders.map(order => order.userId));
    return customerIds.size;
  }, [umkmOrders]);

  // Calculate sales data for last 7 days
  const salesData7Days = useMemo(() => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const today = new Date();
    const data = [];

    // Generate data for last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0); // Start of day
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1); // Start of next day

      // Filter orders for this specific day
      const dayOrders = umkmOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= date && orderDate < nextDay;
      });

      // Calculate revenue from completed orders only
      const revenue = dayOrders
        .filter(order => 
          (order.status === 'delivered' || order.status === 'completed') && 
          order.paymentStatus === 'paid'
        )
        .reduce((sum, order) => sum + (order.total || 0), 0);

      // Count total orders
      const orders = dayOrders.length;

      // Format date label
      const dayName = days[date.getDay()];
      const dateLabel = `${dayName}, ${date.getDate()}/${date.getMonth() + 1}`;

      data.push({
        day: dayName,
        date: dateLabel,
        revenue: revenue,
        orders: orders,
        fullDate: date.toISOString().split('T')[0] // For sorting
      });
    }

    return data;
  }, [umkmOrders]);

  const stats = [
    { 
      label: 'Total Penjualan', 
      value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, 
      icon: DollarSign, 
      color: '#4CAF50', 
      change: '+15%' 
    },
    { 
      label: 'Pesanan Bulan Ini', 
      value: ordersThisMonth.toString(), 
      icon: ShoppingCart, 
      color: '#2196F3', 
      change: '+8%' 
    },
    { 
      label: 'Produk Aktif', 
      value: products.filter(p => p.status === 'active').length.toString(), 
      icon: Package, 
      color: '#FF8D28', 
      change: '+2' 
    },
    { 
      label: 'Rating Toko', 
      value: '4.8', 
      icon: Star, 
      color: '#FFB800', 
      change: '+0.2' 
    },
    { 
      label: 'Total Pelanggan', 
      value: uniqueCustomers.toString(), 
      icon: Users, 
      color: '#9C27B0', 
      change: '+23%' 
    },
    { 
      label: 'Pertumbuhan', 
      value: '+18.5%', 
      icon: TrendingUp, 
      color: '#4CAF50', 
      change: 'vs bulan lalu' 
    }
  ];

  // Get recent orders for this UMKM
  const recentOrders = useMemo(() => {
    return umkmOrders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4)
      .map(order => {
        const timeAgo = (() => {
          const now = new Date();
          const orderTime = new Date(order.createdAt);
          const diffMs = now.getTime() - orderTime.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMins / 60);
          const diffDays = Math.floor(diffHours / 24);

          if (diffMins < 1) return 'Baru saja';
          if (diffMins < 60) return `${diffMins} menit lalu`;
          if (diffHours < 24) return `${diffHours} jam lalu`;
          return `${diffDays} hari lalu`;
        })();

        const statusMap: Record<string, string> = {
          'preparing': 'Menunggu',
          'ready': 'Diproses',
          'pickup': 'Dikirim',
          'delivered': 'Selesai',
          'completed': 'Selesai'
        };

        return {
          id: order.id.slice(-6).toUpperCase(),
          customer: order.userName,
          items: `${order.items.length} item${order.items.length > 1 ? 's' : ''}`,
          total: `Rp ${order.total.toLocaleString('id-ID')}`,
          status: statusMap[order.status] || order.status,
          time: timeAgo
        };
      });
  }, [umkmOrders]);


  const reviews = [
    { customer: 'Budi S.', rating: 5, comment: 'Enak banget! Bumbunya pas...', time: '1 jam lalu' },
    { customer: 'Siti N.', rating: 5, comment: 'Pengiriman cepat, rasanya mantap!', time: '3 jam lalu' },
    { customer: 'Ahmad F.', rating: 4, comment: 'Good, tapi bisa lebih pedas lagi', time: '5 jam lalu' }
  ];

  return (
    <div className="space-y-6">
      {/* Personalized Greeting */}
      <PersonalizedGreeting />

      {/* Gamification Badges */}
      <GamificationBadge role="umkm" />

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: stat.color + '20' }}
                  >
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>
                  <span
                    className="body-3 px-2 py-1 rounded"
                    style={{
                      backgroundColor: stat.change.includes('+') ? '#C8E6C9' : '#E3F2FD',
                      color: stat.change.includes('+') ? '#2E7D32' : '#1976D2'
                    }}
                  >
                    {stat.change}
                  </span>
                </div>
                <p className="body-3" style={{ color: '#858585' }}>{stat.label}</p>
                <h3 style={{ color: '#2F4858' }} className="mt-1">{stat.value}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts & Recent */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>Grafik Penjualan 7 Hari Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            {salesData7Days.length === 0 ? (
              <div className="h-64 flex items-center justify-center rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                <p className="body-3" style={{ color: '#858585' }}>Belum ada data penjualan</p>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData7Days} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis 
                      dataKey="day" 
                      stroke="#858585"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      yAxisId="left"
                      stroke="#858585"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => {
                        if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                        return value.toString();
                      }}
                    />
                    <YAxis 
                      yAxisId="right"
                      orientation="right"
                      stroke="#858585"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E0E0E0',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                      formatter={(value: any, name: string) => {
                        if (name === 'revenue') {
                          return [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue'];
                        }
                        return [value, 'Pesanan'];
                      }}
                      labelFormatter={(label) => {
                        const data = salesData7Days.find(d => d.day === label);
                        return data?.date || label;
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      formatter={(value) => {
                        if (value === 'revenue') return 'Revenue';
                        if (value === 'orders') return 'Pesanan';
                        return value;
                      }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#4CAF50"
                      strokeWidth={2}
                      dot={{ fill: '#4CAF50', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="revenue"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="#2196F3"
                      strokeWidth={2}
                      dot={{ fill: '#2196F3', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="orders"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin" size={24} style={{ color: '#FF8D28' }} />
              </div>
            ) : topProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package size={48} style={{ color: '#CCCCCC', margin: '0 auto' }} />
                <p className="body-3 mt-4" style={{ color: '#858585' }}>
                  Belum ada produk terlaris. Produk akan muncul setelah ada pesanan yang selesai.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                    <div className="flex-1">
                      <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>{product.name}</p>
                      <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>{product.sold} terjual</p>
                    </div>
                    <p className="body-3" style={{ color: '#4CAF50', fontWeight: 600 }}>
                      Rp {product.revenue.toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders & Reviews */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>Pesanan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                  <div>
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>{order.id}</p>
                    <p className="body-3" style={{ color: '#858585' }}>{order.customer} • {order.items}</p>
                    <p className="body-3" style={{ color: '#CCCCCC', fontSize: '12px' }}>{order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>{order.total}</p>
                    <span
                      className="body-3 px-2 py-1 rounded"
                      style={{
                        backgroundColor: order.status === 'Selesai' ? '#C8E6C9' : order.status === 'Dikirim' ? '#B3E5FC' : '#FDE08E',
                        color: order.status === 'Selesai' ? '#2E7D32' : order.status === 'Dikirim' ? '#1976D2' : '#F57C00',
                        fontSize: '12px'
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>Ulasan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>{review.customer}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} style={{ color: '#FFB800', fill: '#FFB800' }} />
                      ))}
                    </div>
                  </div>
                  <p className="body-3 mb-1" style={{ color: '#4A4A4A' }}>{review.comment}</p>
                  <p className="body-3" style={{ color: '#CCCCCC', fontSize: '12px' }}>{review.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

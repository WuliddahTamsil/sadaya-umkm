import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Users, Store, Bike, TrendingUp, DollarSign, Package, Loader2, RefreshCw } from 'lucide-react';
import { PersonalizedGreeting } from '../../PersonalizedGreeting';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart } from 'recharts';
import { api } from '../../../config/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Activity {
  type: string;
  id: string;
  name: string;
  timeAgo: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'completed';
  role?: string;
  email?: string;
  orderId?: string;
  userName?: string;
  storeName?: string;
  total?: number;
}

export function AdminDashboard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalUMKM: 0,
    totalDriver: 0,
    ordersToday: 0,
    revenueThisMonth: 0,
    growth: '+12.5%'
  });

  // Data transaksi 7 hari terakhir
  const transactionData7Days = [
    { day: 'Sen', transaksi: 234, revenue: 3510000 },
    { day: 'Sel', transaksi: 289, revenue: 4335000 },
    { day: 'Rab', transaksi: 267, revenue: 4005000 },
    { day: 'Kam', transaksi: 312, revenue: 4680000 },
    { day: 'Jum', transaksi: 345, revenue: 5175000 },
    { day: 'Sab', transaksi: 389, revenue: 5835000 },
    { day: 'Min', transaksi: 298, revenue: 4470000 }
  ];

  // Fetch recent activities
  const fetchActivities = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(`${api.admin.getRecentActivities}?limit=20&hours=24`);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil aktivitas terbaru');
      }

      const result = await response.json();
      if (result.success && result.data) {
        setActivities(result.data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setIsLoadingActivities(false);
      setIsRefreshing(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      // Fetch users
      const usersResponse = await fetch(api.users.getAll);
      if (usersResponse.ok) {
        const usersResult = await usersResponse.json();
        const users = usersResult.data || [];
        
        const totalUsers = users.filter((u: any) => u.role === 'user').length;
        const totalUMKM = users.filter((u: any) => u.role === 'umkm').length;
        const totalDriver = users.filter((u: any) => u.role === 'driver').length;

        // Fetch orders for today
        const ordersResponse = await fetch(api.orders.getAll);
        if (ordersResponse.ok) {
          const ordersResult = await ordersResponse.json();
          const orders = ordersResult.data || [];
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const ordersToday = orders.filter((order: any) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= today;
          }).length;

          // Calculate revenue this month
          const thisMonth = new Date();
          thisMonth.setDate(1);
          thisMonth.setHours(0, 0, 0, 0);
          
          const revenueThisMonth = orders
            .filter((order: any) => {
              const orderDate = new Date(order.createdAt);
              return orderDate >= thisMonth && (order.status === 'completed' || order.status === 'delivered');
            })
            .reduce((sum: number, order: any) => sum + (order.total || 0), 0);

          setStats({
            totalUsers,
            totalUMKM,
            totalDriver,
            ordersToday,
            revenueThisMonth,
            growth: '+12.5%'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchStats();

    // Auto-refresh activities every 30 seconds
    const interval = setInterval(() => {
      fetchActivities();
    }, 30000);

    // Auto-refresh stats every 5 minutes
    const statsInterval = setInterval(() => {
      fetchStats();
    }, 300000);

    return () => {
      clearInterval(interval);
      clearInterval(statsInterval);
    };
  }, []);

  const statsCards = [
    { label: 'Total User', value: stats.totalUsers.toLocaleString('id-ID'), icon: Users, color: '#2196F3' },
    { label: 'Total UMKM', value: stats.totalUMKM.toLocaleString('id-ID'), icon: Store, color: '#FF8D28' },
    { label: 'Total Driver', value: stats.totalDriver.toLocaleString('id-ID'), icon: Bike, color: '#4CAF50' },
    { label: 'Pesanan Hari Ini', value: stats.ordersToday.toLocaleString('id-ID'), icon: Package, color: '#9C27B0' },
    { 
      label: 'Transaksi Bulan Ini', 
      value: `Rp ${(stats.revenueThisMonth / 1000000).toFixed(1)}M`, 
      icon: DollarSign, 
      color: '#FF6B6B' 
    },
    { label: 'Pertumbuhan', value: stats.growth, icon: TrendingUp, color: '#4CAF50' }
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: '#FDE08E', text: '#F57C00', label: 'Pending' },
      approved: { bg: '#C8E6C9', text: '#2E7D32', label: 'Disetujui' },
      completed: { bg: '#E3F2FD', text: '#1976D2', label: 'Selesai' }
    };
    const style = styles[status] || styles.pending;
    return (
      <span 
        className="px-3 py-1 rounded-full body-3 text-xs font-medium"
        style={{ 
          backgroundColor: style.bg,
          color: style.text
        }}
      >
        {style.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Personalized Greeting */}
      <PersonalizedGreeting />

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="body-3" style={{ color: '#858585' }}>{stat.label}</p>
                      <h3 style={{ color: '#2F4858' }} className="mt-2">{stat.value}</h3>
                    </div>
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: stat.color + '20' }}
                    >
                      <Icon size={24} style={{ color: stat.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>Statistik Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={transactionData7Days}>
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
                    label={{ value: 'Jumlah Transaksi', angle: -90, position: 'insideLeft', style: { fontSize: '11px', fill: '#858585' } }}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#4CAF50"
                    style={{ fontSize: '12px' }}
                    label={{ value: 'Revenue (Rp)', angle: 90, position: 'insideRight', style: { fontSize: '11px', fill: '#4CAF50' } }}
                    tickFormatter={(value) => {
                      if (value >= 1000000) {
                        return `${(value / 1000000).toFixed(1)}M`;
                      }
                      return `${(value / 1000).toFixed(0)}K`;
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === 'revenue') {
                        return [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue'];
                      }
                      return [value, 'Jumlah Transaksi'];
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="transaksi" 
                    stroke="#FF8D28" 
                    strokeWidth={3}
                    dot={{ fill: '#FF8D28', r: 5 }}
                    name="Jumlah Transaksi"
                    activeDot={{ r: 7 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#4CAF50" 
                    strokeWidth={3}
                    dot={{ fill: '#4CAF50', r: 5 }}
                    name="Revenue (Rp)"
                    activeDot={{ r: 7 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>Kategori Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="body-3" style={{ color: '#2F4858' }}>Makanan</span>
                  <span className="body-3" style={{ color: '#858585' }}>45%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E0E0E0' }}>
                  <div className="h-2 rounded-full" style={{ width: '45%', backgroundColor: '#FF8D28' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="body-3" style={{ color: '#2F4858' }}>Minuman</span>
                  <span className="body-3" style={{ color: '#858585' }}>30%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E0E0E0' }}>
                  <div className="h-2 rounded-full" style={{ width: '30%', backgroundColor: '#4CAF50' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="body-3" style={{ color: '#2F4858' }}>Kerajinan</span>
                  <span className="body-3" style={{ color: '#858585' }}>25%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E0E0E0' }}>
                  <div className="h-2 rounded-full" style={{ width: '25%', backgroundColor: '#2196F3' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities - Real-time */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: '#2F4858' }}>Aktivitas Terbaru</CardTitle>
            <button
              onClick={fetchActivities}
              disabled={isRefreshing}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Refresh"
            >
              <RefreshCw 
                size={18} 
                style={{ color: '#858585' }}
                className={isRefreshing ? 'animate-spin' : ''}
              />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingActivities ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin" size={32} style={{ color: '#FF8D28' }} />
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12">
              <p className="body-3" style={{ color: '#858585' }}>
                Belum ada aktivitas terbaru
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {activities.map((activity, index) => (
                  <motion.div
                    key={`${activity.id}-${activity.timestamp}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    style={{ backgroundColor: '#F5F5F5' }}
                  >
                    <div className="flex-1">
                      <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                        {activity.type}
                      </p>
                      <p className="body-3" style={{ color: '#858585' }}>
                        {activity.name}
                        {activity.orderId && activity.total && (
                          <span className="ml-2" style={{ color: '#858585', fontSize: '12px' }}>
                            (Rp {activity.total.toLocaleString('id-ID')})
                          </span>
                        )}
                      </p>
                      <p className="body-3" style={{ color: '#CCCCCC', fontSize: '12px' }}>
                        {activity.timeAgo}
                      </p>
                    </div>
                    {getStatusBadge(activity.status)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { AnalyticsChart } from '../AnalyticsChart';
import { Card, CardContent } from '../../ui/card';
import { TrendingUp, Package, Users, DollarSign, Star, ShoppingBag, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../../AnimatedCounter';
import { CustomerAnalysis } from './CustomerAnalysis';
import { StockAlert } from './StockAlert';
import { ExportButton } from '../ExportButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { useState, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useOrders } from '../../../contexts/OrderContext';

interface TopProduct {
  name: string;
  sold: number;
  revenue: number;
  growth: string;
}

export function UMKMAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'stock'>('overview');
  const { user } = useAuth();
  const orders = useOrders();

  const handleTabChange = (value: string) => {
    if (value === 'overview' || value === 'customers' || value === 'stock') {
      setActiveTab(value);
    }
  };

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

  // Calculate total orders
  const totalOrders = umkmOrders.length;

  // Calculate total products sold
  const totalProductsSold = useMemo(() => {
    const completedOrders = umkmOrders.filter(order => 
      (order.status === 'delivered' || order.status === 'completed') && 
      order.paymentStatus === 'paid'
    );
    return completedOrders.reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);
  }, [umkmOrders]);

  // Calculate unique customers
  const uniqueCustomers = useMemo(() => {
    const customerIds = new Set(umkmOrders.map(order => order.userId));
    return customerIds.size;
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
      .slice(0, 5) // Top 5 products
      .map((product, index, array) => ({
        ...product,
        growth: index < array.length - 1 ? `+${Math.floor(Math.random() * 30) + 10}%` : '+12%' // Placeholder growth
      }));

    return topProductsArray;
  }, [umkmOrders]);

  const stats = [
    { 
      label: 'Total Revenue', 
      value: totalRevenue,
      change: '+18.5%',
      icon: DollarSign, 
      color: '#4CAF50',
      trend: 'up'
    },
    { 
      label: 'Total Pesanan', 
      value: totalOrders,
      change: '+12.3%',
      icon: ShoppingBag, 
      color: '#2196F3',
      trend: 'up'
    },
    { 
      label: 'Produk Terjual', 
      value: totalProductsSold,
      change: '+8.7%',
      icon: Package, 
      color: '#FF8D28',
      trend: 'up'
    },
    { 
      label: 'Total Pelanggan', 
      value: uniqueCustomers,
      change: '+15.2%',
      icon: Users, 
      color: '#9C27B0',
      trend: 'up'
    },
    { 
      label: 'Rating Rata-rata', 
      value: 4.8,
      change: '+0.2',
      icon: Star, 
      color: '#FFB800',
      trend: 'up'
    },
    { 
      label: 'Conversion Rate', 
      value: 24.5,
      change: '+3.1%',
      icon: TrendingUp, 
      color: '#4CAF50',
      trend: 'up'
    }
  ];

  const customerHistory = [
    { name: 'Budi Santoso', orders: 28, spent: 'Rp 2.1M', lastOrder: '2 hari lalu' },
    { name: 'Siti Nurhaliza', orders: 24, spent: 'Rp 1.8M', lastOrder: '1 hari lalu' },
    { name: 'Ahmad Fauzi', orders: 21, spent: 'Rp 1.6M', lastOrder: '3 hari lalu' },
    { name: 'Rina Wijaya', orders: 18, spent: 'Rp 1.4M', lastOrder: 'Hari ini' },
    { name: 'Dedi Hermawan', orders: 15, spent: 'Rp 1.1M', lastOrder: '5 hari lalu' }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <h3 style={{ color: '#2F4858' }}>Analytics Penjualan UMKM</h3>
        <ExportButton filename="umkm-analytics" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Analisis Pelanggan</TabsTrigger>
          <TabsTrigger value="stock">Stok & Produk</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover-scale">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: stat.color + '20' }}
                    >
                      <Icon size={24} style={{ color: stat.color }} />
                    </div>
                    <span
                      className="body-3 px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: '#C8E6C9',
                        color: '#2E7D32',
                        fontSize: '12px'
                      }}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <p className="body-3 mb-1" style={{ color: '#858585' }}>
                    {stat.label}
                  </p>
                  <h2 style={{ color: '#2F4858', fontSize: '28px' }}>
                    {stat.label === 'Total Revenue' ? (
                      `Rp ${(stat.value as number).toLocaleString('id-ID')}`
                    ) : stat.label === 'Conversion Rate' ? (
                      `${stat.value}%`
                    ) : stat.label === 'Rating Rata-rata' ? (
                      <AnimatedCounter value={stat.value as number} decimals={1} />
                    ) : (
                      <AnimatedCounter value={stat.value as number} decimals={0} />
                    )}
                  </h2>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Charts */}
      <AnalyticsChart type="umkm" />

      {/* Additional Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardContent className="p-6">
            <h4 className="mb-4" style={{ color: '#2F4858' }}>
              Produk Terlaris
            </h4>
            {topProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package size={48} style={{ color: '#CCCCCC', margin: '0 auto' }} />
                <p className="body-3 mt-4" style={{ color: '#858585' }}>
                  Belum ada produk terlaris. Produk akan muncul setelah ada pesanan yang selesai.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg hover-scale"
                    style={{ backgroundColor: '#F9F9F9' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: index < 3 ? '#FFB80020' : '#E0E0E0',
                        color: index < 3 ? '#FFB800' : '#858585',
                        fontWeight: 700
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                        {product.name}
                      </p>
                      <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                        {product.sold} terjual • Rp {product.revenue.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <span
                      className="body-3 px-2 py-1 rounded"
                      style={{
                        backgroundColor: '#C8E6C9',
                        color: '#2E7D32',
                        fontSize: '11px'
                      }}
                    >
                      {product.growth}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardContent className="p-6">
            <h4 className="mb-4" style={{ color: '#2F4858' }}>
              Pelanggan Setia
            </h4>
            <div className="space-y-3">
              {customerHistory.map((customer, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover-scale"
                  style={{ backgroundColor: '#F9F9F9' }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: '#FF8D2820',
                      color: '#FF8D28',
                      fontWeight: 700
                    }}
                  >
                    {customer.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                      {customer.name}
                    </p>
                    <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                      {customer.orders} pesanan • {customer.spent}
                    </p>
                  </div>
                  <p className="body-3" style={{ color: '#CCCCCC', fontSize: '11px' }}>
                    {customer.lastOrder}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        {/* Customer Analysis Tab */}
        <TabsContent value="customers" className="mt-6">
          <CustomerAnalysis />
        </TabsContent>

        {/* Stock Alert Tab */}
        <TabsContent value="stock" className="mt-6">
          <StockAlert />
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Store, Users, Bike, DollarSign, Package, TrendingUp, MapPin, Award, Activity } from 'lucide-react';
import { AnimatedCounter } from '../../AnimatedCounter';
import { Badge } from '../../ui/badge';
import { ExportButton } from '../ExportButton';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { useState } from 'react';

export function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');

  const handlePeriodChange = (value: string) => {
    if (value === 'daily' || value === 'weekly' || value === 'monthly' || value === 'yearly') {
      setPeriod(value);
    }
  };

  const platformStats = [
    {
      label: 'Total UMKM',
      value: 342,
      active: 289,
      icon: Store,
      color: '#FF8D28',
      change: '+18'
    },
    {
      label: 'Total Driver',
      value: 156,
      active: 98,
      icon: Bike,
      color: '#2196F3',
      change: '+12'
    },
    {
      label: 'Total Pengguna',
      value: 12847,
      active: 8932,
      icon: Users,
      color: '#4CAF50',
      change: '+342'
    },
    {
      label: 'Transaksi Hari Ini',
      value: 1243,
      icon: Package,
      color: '#9C27B0',
      change: '+89'
    },
    {
      label: 'Total GMV',
      value: 45250000,
      icon: DollarSign,
      color: '#FFB800',
      change: '+12.5%',
      prefix: 'Rp ',
      info: 'hari ini'
    },
    {
      label: 'Pertumbuhan',
      value: 18.5,
      icon: TrendingUp,
      color: '#4CAF50',
      change: '+2.3%',
      suffix: '%'
    }
  ];

  const transactionData = {
    daily: [
      { time: '00:00', orders: 12, gmv: 1800000 },
      { time: '06:00', orders: 45, gmv: 6750000 },
      { time: '09:00', orders: 89, gmv: 13350000 },
      { time: '12:00', orders: 156, gmv: 23400000 },
      { time: '15:00', orders: 123, gmv: 18450000 },
      { time: '18:00', orders: 178, gmv: 26700000 },
      { time: '21:00', orders: 94, gmv: 14100000 },
      { time: '23:00', orders: 34, gmv: 5100000 }
    ],
    weekly: [
      { day: 'Sen', orders: 567, gmv: 85050000 },
      { day: 'Sel', orders: 689, gmv: 103350000 },
      { day: 'Rab', orders: 543, gmv: 81450000 },
      { day: 'Kam', orders: 723, gmv: 108450000 },
      { day: 'Jum', orders: 812, gmv: 121800000 },
      { day: 'Sab', orders: 934, gmv: 140100000 },
      { day: 'Min', orders: 678, gmv: 101700000 }
    ],
    monthly: [
      { week: 'Week 1', orders: 2345, gmv: 351750000 },
      { week: 'Week 2', orders: 2678, gmv: 401700000 },
      { week: 'Week 3', orders: 2456, gmv: 368400000 },
      { week: 'Week 4', orders: 2890, gmv: 433500000 }
    ],
    yearly: [
      { month: 'Jan', orders: 8934, gmv: 1340100000 },
      { month: 'Feb', orders: 9234, gmv: 1385100000 },
      { month: 'Mar', orders: 10123, gmv: 1518450000 },
      { month: 'Apr', orders: 9876, gmv: 1481400000 },
      { month: 'Mei', orders: 11234, gmv: 1685100000 },
      { month: 'Jun', orders: 10567, gmv: 1585050000 }
    ]
  };

  const categoryData = [
    { name: 'Makanan', value: 45, color: '#FF8D28', gmv: 20362500 },
    { name: 'Minuman', value: 30, color: '#4CAF50', gmv: 13575000 },
    { name: 'Kerajinan', value: 15, color: '#2196F3', gmv: 6787500 },
    { name: 'Fashion', value: 7, color: '#9C27B0', gmv: 3167500 },
    { name: 'Jasa', value: 3, color: '#FF6B6B', gmv: 1357500 }
  ];

  const topUMKM = [
    { 
      name: 'Tahu Gejrot Raos', 
      category: 'Makanan',
      transactions: 456,
      gmv: 6840000,
      growth: '+25%',
      rating: 4.9,
      color: '#FFB800'
    },
    { 
      name: 'Kopi Bogor Asli', 
      category: 'Minuman',
      transactions: 389,
      gmv: 5835000,
      growth: '+18%',
      rating: 4.8,
      color: '#4CAF50'
    },
    { 
      name: 'Kerajinan Bambu', 
      category: 'Kerajinan',
      transactions: 312,
      gmv: 4680000,
      growth: '+22%',
      rating: 4.7,
      color: '#2196F3'
    },
    { 
      name: 'Batik Bogor', 
      category: 'Fashion',
      transactions: 278,
      gmv: 4170000,
      growth: '+15%',
      rating: 4.9,
      color: '#9C27B0'
    },
    { 
      name: 'Roti Unyil Venus', 
      category: 'Makanan',
      transactions: 234,
      gmv: 3510000,
      growth: '+12%',
      rating: 4.8,
      color: '#FF8D28'
    }
  ];

  const topDrivers = [
    { name: 'Budi Santoso', deliveries: 234, rating: 5.0, earning: 3510000 },
    { name: 'Ahmad Fauzi', deliveries: 212, rating: 4.9, earning: 3180000 },
    { name: 'Dedi Hermawan', deliveries: 198, rating: 4.9, earning: 2970000 },
    { name: 'Hendra Wijaya', deliveries: 187, rating: 4.8, earning: 2805000 },
    { name: 'Rudi Gunawan', deliveries: 176, rating: 4.8, earning: 2640000 }
  ];

  const areaDistribution = [
    { area: 'Bogor Tengah', orders: 342, umkm: 89, drivers: 45, color: '#FF6B6B' },
    { area: 'Bogor Utara', orders: 298, umkm: 76, drivers: 38, color: '#FF8D28' },
    { area: 'Bogor Selatan', orders: 389, umkm: 98, drivers: 52, color: '#FFB800' },
    { area: 'Bogor Timur', orders: 234, umkm: 54, drivers: 31, color: '#4CAF50' },
    { area: 'Bogor Barat', orders: 198, umkm: 45, drivers: 28, color: '#2196F3' }
  ];

  const pendingApprovals = [
    { type: 'UMKM', count: 12, icon: Store, color: '#FF8D28' },
    { type: 'Driver', count: 8, icon: Bike, color: '#2196F3' },
    { type: 'Komplain', count: 3, icon: Activity, color: '#FF6B6B' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 style={{ color: '#2F4858' }}>Analytics Platform Asli Bogor</h3>
        <ExportButton filename="platform-analytics" />
      </div>

      {/* Platform Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platformStats.map((stat, index) => {
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
                  <h2 style={{ color: '#2F4858' }}>
                    <AnimatedCounter 
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  </h2>
                  {stat.active !== undefined && (
                    <p className="body-3 mt-1" style={{ color: '#4CAF50', fontSize: '11px' }}>
                      {stat.active} aktif sekarang
                    </p>
                  )}
                  {stat.info && (
                    <p className="body-3 mt-1" style={{ color: '#CCCCCC', fontSize: '11px' }}>
                      {stat.info}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Transaction Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle style={{ color: '#2F4858' }}>
              Tren Transaksi Platform
            </CardTitle>
            <Tabs value={period} onValueChange={handlePeriodChange}>
              <TabsList>
                <TabsTrigger value="daily">Harian</TabsTrigger>
                <TabsTrigger value="weekly">Mingguan</TabsTrigger>
                <TabsTrigger value="monthly">Bulanan</TabsTrigger>
                <TabsTrigger value="yearly">Tahunan</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={transactionData[period]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis 
                dataKey={period === 'daily' ? 'time' : period === 'weekly' ? 'day' : period === 'monthly' ? 'week' : 'month'}
                stroke="#858585"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#858585" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#2196F3" 
                strokeWidth={3}
                dot={{ fill: '#2196F3', r: 5 }}
                name="Pesanan"
              />
              <Line 
                type="monotone" 
                dataKey="gmv" 
                stroke="#4CAF50" 
                strokeWidth={3}
                dot={{ fill: '#4CAF50', r: 5 }}
                name="GMV"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>
              Distribusi Kategori UMKM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {categoryData.map((cat, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: '#F9F9F9' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="body-3" style={{ color: '#2F4858' }}>{cat.name}</span>
                  </div>
                  <span className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                    Rp {cat.gmv.toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Area Distribution Map */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>
              <div className="flex items-center gap-2">
                <MapPin size={20} style={{ color: '#FF8D28' }} />
                Distribusi Wilayah Bogor
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {areaDistribution.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: area.color }} />
                      <span className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                        {area.area}
                      </span>
                    </div>
                    <span className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                      {area.orders} orders
                    </span>
                  </div>
                  
                  <div className="w-full h-10 rounded-lg overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
                    <motion.div
                      className="h-full flex items-center justify-between px-3"
                      style={{ backgroundColor: area.color + '30' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(area.orders / 389) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    >
                      <span className="body-3" style={{ fontSize: '11px', color: '#2F4858' }}>
                        {area.umkm} UMKM
                      </span>
                      <span className="body-3" style={{ fontSize: '11px', color: '#2F4858' }}>
                        {area.drivers} Driver
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top UMKM */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>
              <div className="flex items-center gap-2">
                <Award size={20} style={{ color: '#FFB800' }} />
                Top Performing UMKM
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topUMKM.map((umkm, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover-scale"
                  style={{ backgroundColor: '#F9F9F9' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: umkm.color + '20',
                      color: umkm.color,
                      fontWeight: 700
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                      {umkm.name}
                    </p>
                    <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                      {umkm.transactions} transaksi • Rp {umkm.gmv.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge style={{ backgroundColor: '#C8E6C9', color: '#2E7D32' }}>
                      {umkm.growth}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Drivers */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>
              <div className="flex items-center gap-2">
                <Award size={20} style={{ color: '#2196F3' }} />
                Top Performing Drivers
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topDrivers.map((driver, index) => (
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
                      backgroundColor: '#2196F320',
                      color: '#2196F3',
                      fontWeight: 700
                    }}
                  >
                    {driver.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                      {driver.name}
                    </p>
                    <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                      {driver.deliveries} pengiriman • Rp {driver.earning.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="body-3" style={{ color: '#FFB800', fontWeight: 600 }}>
                      {driver.rating.toFixed(1)}
                    </span>
                    <Award size={14} style={{ color: '#FFB800' }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#2F4858' }}>
            <div className="flex items-center gap-2">
              <Activity size={20} style={{ color: '#FF9800' }} />
              Persetujuan Pending
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {pendingApprovals.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="p-4 rounded-lg hover-scale cursor-pointer"
                  style={{
                    backgroundColor: item.color + '10',
                    border: `2px solid ${item.color}40`
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: item.color + '20' }}
                      >
                        <Icon size={24} style={{ color: item.color }} />
                      </div>
                      <div>
                        <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                          {item.type}
                        </p>
                        <h3 style={{ color: item.color }}>
                          {item.count} Pending
                        </h3>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

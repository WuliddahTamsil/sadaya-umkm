import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ExportButton } from '../ExportButton';
import { AnimatedCounter } from '../../AnimatedCounter';

export function LayananLaporan() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<'keuangan' | 'transaksi' | 'layanan'>('keuangan');

  const handlePeriodChange = (value: string) => {
    if (value === 'daily' || value === 'weekly' || value === 'monthly' || value === 'yearly') {
      setPeriod(value);
    }
  };

  const handleTabChange = (value: string) => {
    if (value === 'keuangan' || value === 'transaksi' || value === 'layanan') {
      setActiveTab(value);
    }
  };

  const formatCurrency = (value: number | string) => {
    const numericValue = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numericValue)) {
      return `Rp ${String(value)}`;
    }
    return `Rp ${numericValue.toLocaleString('id-ID')}`;
  };

  const financialStats = [
    {
      label: 'Total Pendapatan',
      value: 456800000,
      change: '+18.5%',
      icon: DollarSign,
      color: '#4CAF50',
      trend: 'up'
    },
    {
      label: 'Biaya Operasional',
      value: 89200000,
      change: '+5.2%',
      icon: TrendingDown,
      color: '#FF6B6B',
      trend: 'up'
    },
    {
      label: 'Profit Bersih',
      value: 367600000,
      change: '+22.3%',
      icon: TrendingUp,
      color: '#FFB800',
      trend: 'up'
    },
    {
      label: 'Margin Profit',
      value: 80.5,
      change: '+3.8%',
      icon: PieChartIcon,
      color: '#2196F3',
      trend: 'up',
      suffix: '%'
    }
  ];

  const revenueData = {
    monthly: [
      { month: 'Jan', revenue: 38500000, cost: 7800000, profit: 30700000 },
      { month: 'Feb', revenue: 41200000, cost: 8100000, profit: 33100000 },
      { month: 'Mar', revenue: 39800000, cost: 7900000, profit: 31900000 },
      { month: 'Apr', revenue: 43500000, cost: 8500000, profit: 35000000 },
      { month: 'Mei', revenue: 45600000, cost: 8900000, profit: 36700000 },
      { month: 'Jun', revenue: 48200000, cost: 9200000, profit: 39000000 },
    ]
  };

  const categoryRevenue = [
    { name: 'Komisi UMKM', value: 278400000, percentage: 61, color: '#FF8D28' },
    { name: 'Biaya Pengiriman', value: 114200000, percentage: 25, color: '#2196F3' },
    { name: 'Iklan & Promosi', value: 45680000, percentage: 10, color: '#4CAF50' },
    { name: 'Layanan Premium', value: 18320000, percentage: 4, color: '#9C27B0' },
  ];

  const transactionStats = [
    { label: 'Total Transaksi', value: 45623, icon: BarChart3, color: '#2196F3' },
    { label: 'Transaksi Berhasil', value: 44189, icon: CheckCircle, color: '#4CAF50' },
    { label: 'Transaksi Pending', value: 892, icon: Clock, color: '#FF9800' },
    { label: 'Transaksi Gagal', value: 542, icon: AlertCircle, color: '#FF6B6B' },
  ];

  const serviceIssues = [
    {
      id: '1',
      category: 'Pengiriman',
      issue: 'Keterlambatan Pengiriman',
      count: 23,
      status: 'resolved',
      priority: 'medium',
      resolvedTime: '2 jam'
    },
    {
      id: '2',
      category: 'Pembayaran',
      issue: 'Gagal Bayar via Transfer',
      count: 12,
      status: 'investigating',
      priority: 'high',
      resolvedTime: '-'
    },
    {
      id: '3',
      category: 'UMKM',
      issue: 'Produk Tidak Sesuai Deskripsi',
      count: 8,
      status: 'resolved',
      priority: 'low',
      resolvedTime: '4 jam'
    },
    {
      id: '4',
      category: 'Aplikasi',
      issue: 'Error Loading Halaman',
      count: 15,
      status: 'ongoing',
      priority: 'high',
      resolvedTime: '-'
    },
  ];

  const getPriorityBadge = (priority: string) => {
    const styles = {
      high: { bg: '#FF6B6B', text: 'High' },
      medium: { bg: '#FF9800', text: 'Medium' },
      low: { bg: '#4CAF50', text: 'Low' }
    };
    const style = styles[priority as keyof typeof styles];
    return (
      <Badge style={{ backgroundColor: style.bg, color: '#FFFFFF', fontSize: '10px' }}>
        {style.text}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      resolved: { bg: '#4CAF50', text: 'Resolved', icon: CheckCircle },
      investigating: { bg: '#FF9800', text: 'Investigating', icon: AlertCircle },
      ongoing: { bg: '#2196F3', text: 'Ongoing', icon: Clock }
    };
    const style = styles[status as keyof typeof styles];
    const Icon = style.icon;
    return (
      <Badge variant="outline" style={{ borderColor: style.bg, color: style.bg, fontSize: '10px' }}>
        <Icon size={10} className="mr-1" />
        {style.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h3 style={{ color: '#2F4858' }}>Layanan & Laporan Keuangan</h3>
          <p className="body-3 mt-2" style={{ color: '#858585' }}>
            Monitoring keuangan platform dan layanan operasional
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Harian</SelectItem>
              <SelectItem value="weekly">Mingguan</SelectItem>
              <SelectItem value="monthly">Bulanan</SelectItem>
              <SelectItem value="yearly">Tahunan</SelectItem>
            </SelectContent>
          </Select>
          <ExportButton filename="laporan-keuangan" />
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="keuangan">Keuangan</TabsTrigger>
          <TabsTrigger value="transaksi">Transaksi</TabsTrigger>
          <TabsTrigger value="layanan">Layanan & Issues</TabsTrigger>
        </TabsList>

        {/* Financial Tab */}
        <TabsContent value="keuangan" className="space-y-6 mt-6">
          {/* Financial Stats */}
          <motion.div
            className="grid md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {financialStats.map((stat, index) => {
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
                        <Badge
                          variant="outline"
                          style={{
                            fontSize: '10px',
                            backgroundColor: stat.trend === 'up' ? '#C8E6C920' : '#FFE0B220',
                            color: stat.trend === 'up' ? '#4CAF50' : '#FF9800',
                            borderColor: stat.trend === 'up' ? '#4CAF50' : '#FF9800'
                          }}
                        >
                          {stat.change}
                        </Badge>
                      </div>
                      <p className="body-3 mb-1" style={{ color: '#858585', fontSize: '11px' }}>
                        {stat.label}
                      </p>
                      <h2 style={{ color: stat.color }}>
                        <AnimatedCounter 
                          value={stat.value} 
                          prefix={stat.label.includes('Margin') ? '' : 'Rp '}
                          suffix={stat.suffix}
                          decimals={stat.suffix ? 1 : 0}
                        />
                      </h2>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#2F4858' }}>
                Tren Pendapatan & Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={revenueData.monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis dataKey="month" stroke="#858585" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#858585" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number | string) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2196F3" 
                    strokeWidth={3}
                    name="Pendapatan"
                    dot={{ fill: '#2196F3', r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#4CAF50" 
                    strokeWidth={3}
                    name="Profit"
                    dot={{ fill: '#4CAF50', r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cost" 
                    stroke="#FF6B6B" 
                    strokeWidth={3}
                    name="Biaya"
                    dot={{ fill: '#FF6B6B', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue by Category */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle style={{ color: '#2F4858' }}>
                  Komposisi Pendapatan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number | string) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ color: '#2F4858' }}>
                  Detail Kategori Pendapatan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryRevenue.map((cat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                            {cat.name}
                          </span>
                        </div>
                        <span className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                          {cat.percentage}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          className="h-full"
                          style={{ backgroundColor: cat.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      <p className="body-3 mt-1 text-right" style={{ color: '#858585', fontSize: '11px' }}>
                        Rp {cat.value.toLocaleString('id-ID')}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transaction Tab */}
        <TabsContent value="transaksi" className="space-y-6 mt-6">
          <motion.div
            className="grid md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {transactionStats.map((stat, index) => {
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
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                        style={{ backgroundColor: stat.color + '20' }}
                      >
                        <Icon size={24} style={{ color: stat.color }} />
                      </div>
                      <p className="body-3 mb-1" style={{ color: '#858585', fontSize: '11px' }}>
                        {stat.label}
                      </p>
                      <h2 style={{ color: stat.color }}>
                        <AnimatedCounter value={stat.value} />
                      </h2>
                      <p className="body-3 mt-2" style={{ color: '#CCCCCC', fontSize: '10px' }}>
                        {((stat.value / transactionStats[0].value) * 100).toFixed(1)}% dari total
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </TabsContent>

        {/* Service Tab */}
        <TabsContent value="layanan" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ color: '#2F4858' }}>
                  Issue & Layanan Pelanggan
                </CardTitle>
                <Badge variant="outline">
                  {serviceIssues.filter(i => i.status !== 'resolved').length} Active Issues
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {serviceIssues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: '#F9F9F9' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" style={{ fontSize: '10px' }}>
                            {issue.category}
                          </Badge>
                          {getPriorityBadge(issue.priority)}
                          {getStatusBadge(issue.status)}
                        </div>
                        <h4 style={{ color: '#2F4858', fontSize: '16px' }}>
                          {issue.issue}
                        </h4>
                      </div>
                      <div className="text-right">
                        <p className="body-3" style={{ color: '#FF8D28', fontWeight: 600, fontSize: '18px' }}>
                          {issue.count}
                        </p>
                        <p className="body-3" style={{ color: '#858585', fontSize: '10px' }}>
                          reports
                        </p>
                      </div>
                    </div>
                    
                    {issue.resolvedTime !== '-' && (
                      <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: '#E0E0E0' }}>
                        <Clock size={12} style={{ color: '#858585' }} />
                        <p className="body-3" style={{ color: '#858585', fontSize: '11px' }}>
                          Avg. Resolution Time: {issue.resolvedTime}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

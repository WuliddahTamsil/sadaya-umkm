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
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  BarChart3,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { ExportButton } from '../ExportButton';
import { AnimatedCounter } from '../../AnimatedCounter';
import { Button } from '../../ui/button';

export function AdminKeuangan() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [activeTab, setActiveTab] = useState<'overview' | 'cashflow' | 'revenue' | 'expenses'>('overview');

  const handlePeriodChange = (value: string) => {
    if (value === 'daily' || value === 'weekly' || value === 'monthly' || value === 'yearly') {
      setPeriod(value);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `Rp ${(value / 1000000000).toFixed(2)}M`;
    }
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}M`;
    }
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  // Financial Overview Stats
  const financialStats = [
    {
      label: 'Total Pendapatan',
      value: 456800000,
      change: '+18.5%',
      icon: DollarSign,
      color: '#4CAF50',
      trend: 'up',
      prefix: 'Rp '
    },
    {
      label: 'Biaya Operasional',
      value: 89200000,
      change: '+5.2%',
      icon: TrendingDown,
      color: '#FF6B6B',
      trend: 'up',
      prefix: 'Rp '
    },
    {
      label: 'Profit Bersih',
      value: 367600000,
      change: '+22.3%',
      icon: TrendingUp,
      color: '#FFB800',
      trend: 'up',
      prefix: 'Rp '
    },
    {
      label: 'Margin Profit',
      value: 80.5,
      change: '+3.8%',
      icon: PieChartIcon,
      color: '#2196F3',
      trend: 'up',
      suffix: '%'
    },
    {
      label: 'Cash Flow',
      value: 245000000,
      change: '+15.2%',
      icon: Wallet,
      color: '#9C27B0',
      trend: 'up',
      prefix: 'Rp '
    },
    {
      label: 'Target Bulan Ini',
      value: 500000000,
      progress: 91.4,
      icon: Target,
      color: '#FF8D28',
      prefix: 'Rp '
    }
  ];

  // Cash Flow Data
  const cashFlowData = {
    daily: [
      { date: '01', income: 12500000, expense: 3200000, net: 9300000 },
      { date: '02', income: 15200000, expense: 2800000, net: 12400000 },
      { date: '03', income: 13800000, expense: 3500000, net: 10300000 },
      { date: '04', income: 16800000, expense: 2900000, net: 13900000 },
      { date: '05', income: 14500000, expense: 3100000, net: 11400000 },
      { date: '06', income: 17200000, expense: 2700000, net: 14500000 },
      { date: '07', income: 18900000, expense: 3300000, net: 15600000 }
    ],
    weekly: [
      { week: 'Minggu 1', income: 98500000, expense: 21500000, net: 77000000 },
      { week: 'Minggu 2', income: 112000000, expense: 19800000, net: 92200000 },
      { week: 'Minggu 3', income: 108500000, expense: 22300000, net: 86200000 },
      { week: 'Minggu 4', income: 138300000, expense: 25600000, net: 112700000 }
    ],
    monthly: [
      { month: 'Jan', income: 385000000, expense: 78000000, net: 307000000 },
      { month: 'Feb', income: 412000000, expense: 81000000, net: 331000000 },
      { month: 'Mar', income: 398000000, expense: 79000000, net: 319000000 },
      { month: 'Apr', income: 435000000, expense: 85000000, net: 350000000 },
      { month: 'Mei', income: 456000000, expense: 89000000, net: 367000000 },
      { month: 'Jun', income: 482000000, expense: 92000000, net: 390000000 }
    ],
    yearly: [
      { year: '2020', income: 3850000000, expense: 780000000, net: 3070000000 },
      { year: '2021', income: 4120000000, expense: 810000000, net: 3310000000 },
      { year: '2022', income: 3980000000, expense: 790000000, net: 3190000000 },
      { year: '2023', income: 4350000000, expense: 850000000, net: 3500000000 },
      { year: '2024', income: 4560000000, expense: 890000000, net: 3670000000 }
    ]
  };

  // Revenue Breakdown
  const revenueBreakdown = [
    { name: 'Komisi UMKM', value: 278400000, percentage: 61, color: '#FF8D28' },
    { name: 'Biaya Pengiriman', value: 114200000, percentage: 25, color: '#2196F3' },
    { name: 'Iklan & Promosi', value: 45680000, percentage: 10, color: '#4CAF50' },
    { name: 'Layanan Premium', value: 18320000, percentage: 4, color: '#9C27B0' }
  ];

  // Expense Breakdown
  const expenseBreakdown = [
    { name: 'Infrastruktur', value: 35600000, percentage: 40, color: '#FF6B6B' },
    { name: 'Operasional', value: 26700000, percentage: 30, color: '#FF9800' },
    { name: 'Marketing', value: 17800000, percentage: 20, color: '#2196F3' },
    { name: 'Lainnya', value: 8910000, percentage: 10, color: '#9C27B0' }
  ];

  // Recent Transactions
  const recentTransactions = [
    {
      id: '1',
      type: 'income',
      description: 'Komisi dari Lapis Bogor Sangkuriang',
      amount: 1250000,
      date: '2024-01-15',
      status: 'completed',
      category: 'Komisi UMKM'
    },
    {
      id: '2',
      type: 'expense',
      description: 'Biaya Server & Hosting',
      amount: 3500000,
      date: '2024-01-15',
      status: 'completed',
      category: 'Infrastruktur'
    },
    {
      id: '3',
      type: 'income',
      description: 'Biaya Pengiriman Order #1234',
      amount: 15000,
      date: '2024-01-14',
      status: 'completed',
      category: 'Biaya Pengiriman'
    },
    {
      id: '4',
      type: 'income',
      description: 'Iklan Premium - Roti Unyil Venus',
      amount: 500000,
      date: '2024-01-14',
      status: 'completed',
      category: 'Iklan & Promosi'
    },
    {
      id: '5',
      type: 'expense',
      description: 'Biaya Marketing Digital',
      amount: 2500000,
      date: '2024-01-13',
      status: 'completed',
      category: 'Marketing'
    }
  ];

  // Projection Data
  const projectionData = [
    { month: 'Jul', actual: 456000000, projected: 480000000 },
    { month: 'Agu', actual: null, projected: 495000000 },
    { month: 'Sep', actual: null, projected: 510000000 },
    { month: 'Okt', actual: null, projected: 525000000 },
    { month: 'Nov', actual: null, projected: 540000000 },
    { month: 'Des', actual: null, projected: 560000000 }
  ];

  const currentData = cashFlowData[period];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h3 style={{ color: '#2F4858' }}>Keuangan Platform</h3>
          <p className="body-3 mt-1" style={{ color: '#858585' }}>
            Dashboard keuangan lengkap dengan analisis cash flow, profit margin, dan proyeksi pendapatan
          </p>
        </div>
        <ExportButton filename="laporan-keuangan-platform" />
      </motion.div>

      {/* Financial Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    {stat.change && (
                      <Badge
                        style={{
                          backgroundColor: stat.trend === 'up' ? '#C8E6C920' : '#FFCDD220',
                          color: stat.trend === 'up' ? '#2E7D32' : '#C62828',
                          fontSize: '11px'
                        }}
                      >
                        {stat.trend === 'up' ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                        {stat.change}
                      </Badge>
                    )}
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
                  {stat.progress !== undefined && (
                    <div className="mt-3">
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E0E0E0' }}>
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: stat.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <p className="body-3 mt-1" style={{ color: '#858585', fontSize: '11px' }}>
                        {stat.progress.toFixed(1)}% dari target
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => {
        if (value === 'overview' || value === 'cashflow' || value === 'revenue' || value === 'expenses') {
          setActiveTab(value);
        }
      }}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
          <TabsTrigger value="expenses">Pengeluaran</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Revenue vs Expense Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle style={{ color: '#2F4858' }}>Pendapatan vs Pengeluaran</CardTitle>
                  <Select value={period} onValueChange={handlePeriodChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Harian</SelectItem>
                      <SelectItem value="weekly">Mingguan</SelectItem>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                      <SelectItem value="yearly">Tahunan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={currentData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis 
                      dataKey={period === 'daily' ? 'date' : period === 'weekly' ? 'week' : period === 'monthly' ? 'month' : 'year'}
                      stroke="#858585"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#858585"
                      style={{ fontSize: '12px' }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #E0E0E0',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#4CAF50" 
                      fillOpacity={1} 
                      fill="url(#colorIncome)"
                      name="Pendapatan"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expense" 
                      stroke="#FF6B6B" 
                      fillOpacity={1} 
                      fill="url(#colorExpense)"
                      name="Pengeluaran"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle style={{ color: '#2F4858' }}>Breakdown Pendapatan</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={revenueBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percentage }) => `${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {revenueBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: '#F9F9F9' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="body-3" style={{ color: '#2F4858' }}>{item.name}</span>
                      </div>
                      <span className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                        {formatCurrency(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projection Chart */}
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#2F4858' }}>Proyeksi Pendapatan</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis dataKey="month" stroke="#858585" style={{ fontSize: '12px' }} />
                  <YAxis 
                    stroke="#858585"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#4CAF50" 
                    strokeWidth={3}
                    dot={{ fill: '#4CAF50', r: 5 }}
                    name="Aktual"
                    strokeDasharray="0"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="projected" 
                    stroke="#2196F3" 
                    strokeWidth={3}
                    dot={{ fill: '#2196F3', r: 5 }}
                    strokeDasharray="5 5"
                    name="Proyeksi"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cashflow" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ color: '#2F4858' }}>Cash Flow Analysis</CardTitle>
                <Select value={period} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Harian</SelectItem>
                    <SelectItem value="weekly">Mingguan</SelectItem>
                    <SelectItem value="monthly">Bulanan</SelectItem>
                    <SelectItem value="yearly">Tahunan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis 
                    dataKey={period === 'daily' ? 'date' : period === 'weekly' ? 'week' : period === 'monthly' ? 'month' : 'year'}
                    stroke="#858585"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#858585"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#4CAF50" name="Pendapatan" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expense" fill="#FF6B6B" name="Pengeluaran" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="net" fill="#FFB800" name="Net Cash Flow" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle style={{ color: '#2F4858' }}>Sumber Pendapatan</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ color: '#2F4858' }}>Detail Pendapatan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueBreakdown.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: '#F9F9F9' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                            {item.name}
                          </span>
                        </div>
                        <span className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E0E0E0' }}>
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                        />
                      </div>
                      <p className="body-3 mt-2" style={{ color: '#858585', fontSize: '11px' }}>
                        {item.percentage}% dari total pendapatan
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle style={{ color: '#2F4858' }}>Breakdown Pengeluaran</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle style={{ color: '#2F4858' }}>Detail Pengeluaran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseBreakdown.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: '#F9F9F9' }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                            {item.name}
                          </span>
                        </div>
                        <span className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#E0E0E0' }}>
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                        />
                      </div>
                      <p className="body-3 mt-2" style={{ color: '#858585', fontSize: '11px' }}>
                        {item.percentage}% dari total pengeluaran
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#2F4858' }}>Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 rounded-lg hover-scale"
                style={{ backgroundColor: '#F9F9F9' }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: transaction.type === 'income' ? '#4CAF5020' : '#FF6B6B20'
                    }}
                  >
                    {transaction.type === 'income' ? (
                      <ArrowUpRight size={24} style={{ color: '#4CAF50' }} />
                    ) : (
                      <ArrowDownRight size={24} style={{ color: '#FF6B6B' }} />
                    )}
                  </div>
                  <div>
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" style={{ fontSize: '10px' }}>
                        {transaction.category}
                      </Badge>
                      <span className="body-3" style={{ color: '#858585', fontSize: '11px' }}>
                        {new Date(transaction.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className="body-3"
                    style={{
                      color: transaction.type === 'income' ? '#4CAF50' : '#FF6B6B',
                      fontWeight: 600
                    }}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <Badge
                    style={{
                      backgroundColor: transaction.status === 'completed' ? '#C8E6C920' : '#FFCDD220',
                      color: transaction.status === 'completed' ? '#2E7D32' : '#C62828',
                      fontSize: '10px',
                      marginTop: '4px'
                    }}
                  >
                    {transaction.status === 'completed' ? 'Selesai' : 'Pending'}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
          <Button
            variant="outline"
            className="w-full mt-4"
            style={{ borderColor: '#E0E0E0' }}
          >
            Lihat Semua Transaksi
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Download, TrendingUp, Calendar } from 'lucide-react';
import { useState } from 'react';

interface AnalyticsChartProps {
  type: 'umkm' | 'driver' | 'admin';
}

export function AnalyticsChart({ type }: AnalyticsChartProps) {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  const handlePeriodChange = (value: string) => {
    if (value === 'weekly' || value === 'monthly' || value === 'yearly') {
      setPeriod(value);
    }
  };

  // Sample data - would come from API in production
  const salesData = {
    weekly: [
      { name: 'Sen', value: 450000, orders: 12 },
      { name: 'Sel', value: 520000, orders: 15 },
      { name: 'Rab', value: 380000, orders: 10 },
      { name: 'Kam', value: 650000, orders: 18 },
      { name: 'Jum', value: 780000, orders: 22 },
      { name: 'Sab', value: 920000, orders: 28 },
      { name: 'Min', value: 610000, orders: 17 }
    ],
    monthly: [
      { name: 'Week 1', value: 2500000, orders: 65 },
      { name: 'Week 2', value: 3200000, orders: 82 },
      { name: 'Week 3', value: 2800000, orders: 71 },
      { name: 'Week 4', value: 3500000, orders: 94 }
    ],
    yearly: [
      { name: 'Jan', value: 8500000, orders: 220 },
      { name: 'Feb', value: 9200000, orders: 245 },
      { name: 'Mar', value: 10100000, orders: 268 },
      { name: 'Apr', value: 9800000, orders: 255 },
      { name: 'Mei', value: 11200000, orders: 298 },
      { name: 'Jun', value: 10500000, orders: 275 }
    ]
  };

  const categoryData = [
    { name: 'Makanan', value: 45, color: '#FF8D28' },
    { name: 'Minuman', value: 30, color: '#4CAF50' },
    { name: 'Kerajinan', value: 15, color: '#2196F3' },
    { name: 'Jasa', value: 10, color: '#9C27B0' }
  ];

  const deliveryData = [
    { area: 'Bogor Tengah', count: 45, distance: 125 },
    { area: 'Bogor Utara', count: 38, distance: 98 },
    { area: 'Bogor Selatan', count: 52, distance: 142 },
    { area: 'Bogor Timur', count: 31, distance: 85 },
    { area: 'Bogor Barat', count: 28, distance: 76 }
  ];

  const handleDownloadPDF = () => {
    console.log('Downloading PDF report...');
    // Implementation would generate PDF
  };

  const handleDownloadCSV = () => {
    console.log('Downloading CSV report...');
    // Implementation would generate CSV
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={20} style={{ color: '#FF8D28' }} />
          <h3 style={{ color: '#2F4858' }}>
            {type === 'umkm' ? 'Analytics Penjualan' : 
             type === 'driver' ? 'Analytics Pengiriman' : 
             'Analytics Platform'}
          </h3>
        </div>
        
        <div className="flex items-center gap-3">
          <Tabs value={period} onValueChange={handlePeriodChange}>
            <TabsList>
              <TabsTrigger value="weekly">Minggu Ini</TabsTrigger>
              <TabsTrigger value="monthly">Bulan Ini</TabsTrigger>
              <TabsTrigger value="yearly">Tahun Ini</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadPDF}
            >
              <Download size={16} className="mr-1" />
              PDF
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadCSV}
            >
              <Download size={16} className="mr-1" />
              CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue/Earnings Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#2F4858' }}>
                {type === 'driver' ? 'Penghasilan' : 'Pendapatan'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData[period]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#858585"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#858585"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value: number | string) => {
                      const numericValue = typeof value === 'number' ? value : Number(value);
                      const formatted = Number.isFinite(numericValue)
                        ? `Rp ${numericValue.toLocaleString('id-ID')}`
                        : String(value);
                      return [formatted, 'Total'];
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#FF8D28" 
                    strokeWidth={3}
                    dot={{ fill: '#FF8D28', r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders/Deliveries Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#2F4858' }}>
                {type === 'driver' ? 'Jumlah Pengiriman' : 'Jumlah Pesanan'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData[period]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#858585"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#858585"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #E0E0E0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value: number | string) => {
                      const numericValue = typeof value === 'number' ? value : Number(value);
                      const formatted = Number.isFinite(numericValue) ? `${numericValue} pesanan` : `${value} pesanan`;
                      return [formatted, 'Total'];
                    }}
                  />
                  <Bar 
                    dataKey="orders" 
                    fill="#4CAF50"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Distribution (UMKM/Admin) or Area Heatmap (Driver) */}
        {type !== 'driver' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle style={{ color: '#2F4858' }}>
                  Distribusi Kategori
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
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle style={{ color: '#2F4858' }}>
                  Heatmap Area Pengiriman
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={deliveryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis type="number" stroke="#858585" style={{ fontSize: '12px' }} />
                    <YAxis dataKey="area" type="category" stroke="#858585" style={{ fontSize: '12px' }} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #E0E0E0',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#2196F3" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Growth Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle style={{ color: '#2F4858' }}>
                Tren Pertumbuhan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#4CAF5020' }}
                    >
                      <TrendingUp size={24} style={{ color: '#4CAF50' }} />
                    </div>
                    <div>
                      <p className="body-3" style={{ color: '#858585' }}>Pertumbuhan</p>
                      <h3 style={{ color: '#4CAF50' }}>+18.5%</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>vs bulan lalu</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="body-3" style={{ color: '#2F4858' }}>Target Bulan Ini</span>
                      <span className="body-3" style={{ color: '#4CAF50', fontWeight: 600 }}>85%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #FF8D28 0%, #4CAF50 100%)' }}
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFF4E6' }}>
                      <p className="body-3" style={{ color: '#858585', fontSize: '11px' }}>Rata-rata Harian</p>
                      <p style={{ color: '#FF8D28', fontWeight: 700 }}>Rp 785k</p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#E8F5E9' }}>
                      <p className="body-3" style={{ color: '#858585', fontSize: '11px' }}>Total Bulan Ini</p>
                      <p style={{ color: '#4CAF50', fontWeight: 700 }}>Rp 12.5M</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

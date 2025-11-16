import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bike, DollarSign, MapPin, Star, TrendingUp, Zap, Gift, Target } from 'lucide-react';
import { AnimatedCounter } from '../../AnimatedCounter';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import { ExportButton } from '../ExportButton';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { useState } from 'react';

export function DriverAnalyticsPage() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

  const handlePeriodChange = (value: string) => {
    if (value === 'today' || value === 'week' || value === 'month') {
      setPeriod(value);
    }
  };

  const stats = [
    {
      label: 'Total Pengiriman',
      value: 156,
      icon: Bike,
      color: '#2196F3',
      change: '+12',
      period: 'hari ini'
    },
    {
      label: 'Total Jarak',
      value: 342.5,
      icon: MapPin,
      color: '#FF8D28',
      change: '+45.2',
      suffix: ' km',
      decimals: 1
    },
    {
      label: 'Total Pendapatan',
      value: 1250000,
      icon: DollarSign,
      color: '#4CAF50',
      change: '+18.5%',
      prefix: 'Rp '
    },
    {
      label: 'Rating Driver',
      value: 4.9,
      icon: Star,
      color: '#FFB800',
      change: '+0.1',
      decimals: 1
    }
  ];

  const performanceData = {
    today: [
      { hour: '06:00', deliveries: 3, earning: 45000 },
      { hour: '08:00', deliveries: 8, earning: 120000 },
      { hour: '10:00', deliveries: 12, earning: 180000 },
      { hour: '12:00', deliveries: 15, earning: 225000 },
      { hour: '14:00', deliveries: 10, earning: 150000 },
      { hour: '16:00', deliveries: 14, earning: 210000 },
      { hour: '18:00', deliveries: 18, earning: 270000 },
      { hour: '20:00', deliveries: 7, earning: 105000 }
    ],
    week: [
      { day: 'Sen', deliveries: 45, earning: 675000 },
      { day: 'Sel', deliveries: 52, earning: 780000 },
      { day: 'Rab', deliveries: 38, earning: 570000 },
      { day: 'Kam', deliveries: 61, earning: 915000 },
      { day: 'Jum', deliveries: 58, earning: 870000 },
      { day: 'Sab', deliveries: 72, earning: 1080000 },
      { day: 'Min', deliveries: 48, earning: 720000 }
    ],
    month: [
      { week: 'W1', deliveries: 234, earning: 3510000 },
      { week: 'W2', deliveries: 268, earning: 4020000 },
      { week: 'W3', deliveries: 245, earning: 3675000 },
      { week: 'W4', deliveries: 289, earning: 4335000 }
    ]
  };

  const areaHeatmap = [
    { area: 'Bogor Tengah', deliveries: 45, earning: 675000, color: '#FF6B6B' },
    { area: 'Bogor Utara', deliveries: 38, earning: 570000, color: '#FF8D28' },
    { area: 'Bogor Selatan', deliveries: 52, earning: 780000, color: '#FFB800' },
    { area: 'Bogor Timur', deliveries: 31, earning: 465000, color: '#4CAF50' },
    { area: 'Bogor Barat', deliveries: 28, earning: 420000, color: '#2196F3' }
  ];

  const rewards = [
    {
      title: 'Bonus Harian',
      target: 20,
      current: 16,
      reward: 'Rp 50.000',
      icon: Target,
      color: '#4CAF50'
    },
    {
      title: 'Speed Bonus',
      target: 10,
      current: 7,
      reward: 'Rp 30.000',
      icon: Zap,
      color: '#FF8D28'
    },
    {
      title: 'Rating Bonus',
      target: 4.8,
      current: 4.9,
      reward: 'Rp 100.000',
      icon: Star,
      color: '#FFB800',
      completed: true
    }
  ];

  const recentPerformance = [
    {
      metric: 'Waktu Rata-rata Antar',
      value: '18 menit',
      target: '20 menit',
      status: 'good',
      change: '-2 menit'
    },
    {
      metric: 'Customer Satisfaction',
      value: '98%',
      target: '95%',
      status: 'excellent',
      change: '+3%'
    },
    {
      metric: 'On-Time Delivery',
      value: '96%',
      target: '90%',
      status: 'excellent',
      change: '+6%'
    },
    {
      metric: 'Complaint Rate',
      value: '0.5%',
      target: '2%',
      status: 'excellent',
      change: '-1.5%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <h3 style={{ color: '#2F4858' }}>Analytics Performa Driver</h3>
        <ExportButton filename="driver-analytics" />
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <h2 style={{ color: '#2F4858' }}>
                    <AnimatedCounter 
                      value={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals || 0}
                    />
                  </h2>
                  {stat.period && (
                    <p className="body-3 mt-1" style={{ color: '#CCCCCC', fontSize: '11px' }}>
                      {stat.period}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: '#2F4858' }}>
              Performa Pengiriman
            </CardTitle>
            <Tabs value={period} onValueChange={handlePeriodChange}>
              <TabsList>
                <TabsTrigger value="today">Hari Ini</TabsTrigger>
                <TabsTrigger value="week">Minggu Ini</TabsTrigger>
                <TabsTrigger value="month">Bulan Ini</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData[period]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis 
                dataKey={period === 'today' ? 'hour' : period === 'week' ? 'day' : 'week'}
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
                dataKey="deliveries" 
                stroke="#2196F3" 
                strokeWidth={3}
                dot={{ fill: '#2196F3', r: 5 }}
                name="Pengiriman"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Area Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>
              <div className="flex items-center gap-2">
                <MapPin size={20} style={{ color: '#FF8D28' }} />
                Heatmap Area Pengiriman
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {areaHeatmap.map((area, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: area.color }}
                      />
                      <span className="body-3" style={{ color: '#2F4858' }}>
                        {area.area}
                      </span>
                    </div>
                    <span className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                      {area.deliveries} order
                    </span>
                  </div>
                  <div className="w-full h-8 rounded-lg overflow-hidden" style={{ backgroundColor: '#F5F5F5' }}>
                    <motion.div
                      className="h-full flex items-center justify-end px-3"
                      style={{ backgroundColor: area.color + '40' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(area.deliveries / 52) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    >
                      <span className="body-3" style={{ color: '#2F4858', fontWeight: 600, fontSize: '12px' }}>
                        Rp {area.earning.toLocaleString('id-ID')}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rewards & Bonuses */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>
              <div className="flex items-center gap-2">
                <Gift size={20} style={{ color: '#9C27B0' }} />
                Reward & Bonus
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rewards.map((reward, index) => {
                const Icon = reward.icon;
                const progress = (reward.current / reward.target) * 100;
                const remaining = reward.target - reward.current;

                return (
                  <motion.div
                    key={index}
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: reward.completed ? '#C8E6C920' : '#F9F9F9',
                      border: reward.completed ? '1px solid #4CAF50' : '1px solid #E0E0E0'
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: reward.color + '20' }}
                      >
                        <Icon size={20} style={{ color: reward.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                            {reward.title}
                          </p>
                          {reward.completed && (
                            <Badge style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}>
                              Selesai! ✨
                            </Badge>
                          )}
                        </div>
                        <p className="body-3 mt-1" style={{ color: reward.color, fontWeight: 600 }}>
                          {reward.reward}
                        </p>
                      </div>
                    </div>

                    <div className="mb-2">
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                        {reward.current} / {reward.target}
                      </p>
                      {!reward.completed && (
                        <p className="body-3" style={{ color: reward.color, fontSize: '12px', fontWeight: 600 }}>
                          Tinggal {remaining} lagi! 💪
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Performance Metrics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>
              <div className="flex items-center gap-2">
                <TrendingUp size={20} style={{ color: '#4CAF50' }} />
                Metrik Performa
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {recentPerformance.map((metric, index) => {
                const statusColor = 
                  metric.status === 'excellent' ? '#4CAF50' :
                  metric.status === 'good' ? '#2196F3' : '#FF9800';

                return (
                  <motion.div
                    key={index}
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: '#F9F9F9' }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <p className="body-3 mb-2" style={{ color: '#858585', fontSize: '12px' }}>
                      {metric.metric}
                    </p>
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 style={{ color: statusColor }}>
                          {metric.value}
                        </h2>
                        <p className="body-3 mt-1" style={{ color: '#CCCCCC', fontSize: '11px' }}>
                          Target: {metric.target}
                        </p>
                      </div>
                      <span
                        className="body-3 px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: statusColor + '20',
                          color: statusColor,
                          fontSize: '11px'
                        }}
                      >
                        {metric.change}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

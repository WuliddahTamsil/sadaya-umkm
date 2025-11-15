import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Users, Store, Bike, TrendingUp, DollarSign, Package } from 'lucide-react';
import { PersonalizedGreeting } from '../../PersonalizedGreeting';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart } from 'recharts';

export function AdminDashboard() {
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

  const stats = [
    { label: 'Total User', value: '1,234', icon: Users, color: '#2196F3' },
    { label: 'Total UMKM', value: '156', icon: Store, color: '#FF8D28' },
    { label: 'Total Driver', value: '89', icon: Bike, color: '#4CAF50' },
    { label: 'Pesanan Hari Ini', value: '342', icon: Package, color: '#9C27B0' },
    { label: 'Transaksi Bulan Ini', value: 'Rp 45.5M', icon: DollarSign, color: '#FF6B6B' },
    { label: 'Pertumbuhan', value: '+12.5%', icon: TrendingUp, color: '#4CAF50' }
  ];

  const recentActivities = [
    { type: 'UMKM Baru', name: 'Tahu Gejrot Pak Haji', time: '5 menit yang lalu', status: 'pending' },
    { type: 'Driver Baru', name: 'Ahmad Fauzi', time: '15 menit yang lalu', status: 'pending' },
    { type: 'Pesanan', name: 'Order #1234', time: '20 menit yang lalu', status: 'completed' },
    { type: 'UMKM Disetujui', name: 'Kerajinan Bambu Ibu Siti', time: '1 jam yang lalu', status: 'approved' }
  ];

  return (
    <div className="space-y-6">
      {/* Personalized Greeting */}
      <PersonalizedGreeting />

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
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

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#2F4858' }}>Aktivitas Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                <div>
                  <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>{activity.type}</p>
                  <p className="body-3" style={{ color: '#858585' }}>{activity.name}</p>
                  <p className="body-3" style={{ color: '#CCCCCC', fontSize: '12px' }}>{activity.time}</p>
                </div>
                <span 
                  className="px-3 py-1 rounded-full body-3"
                  style={{ 
                    backgroundColor: activity.status === 'pending' ? '#FDE08E' : activity.status === 'approved' ? '#C8E6C9' : '#E3F2FD',
                    color: activity.status === 'pending' ? '#F57C00' : activity.status === 'approved' ? '#2E7D32' : '#1976D2'
                  }}
                >
                  {activity.status === 'pending' ? 'Pending' : activity.status === 'approved' ? 'Disetujui' : 'Selesai'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Switch } from '../../ui/switch';
import { Bike, DollarSign, Package, Star, TrendingUp, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { PersonalizedGreeting } from '../../PersonalizedGreeting';
import { GamificationBadge } from '../../GamificationBadge';

export function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(true);

  const stats = [
    { label: 'Penghasilan Hari Ini', value: 'Rp 175.000', icon: DollarSign, color: '#4CAF50', change: '+12%' },
    { label: 'Total Pengiriman', value: '12', icon: Package, color: '#2196F3', change: '+3' },
    { label: 'Rating Driver', value: '4.9', icon: Star, color: '#FFB800', change: '+0.1' },
    { label: 'Jarak Tempuh', value: '45 km', icon: Bike, color: '#FF8D28', change: '+8 km' },
    { label: 'Penghasilan Bulan Ini', value: 'Rp 4.2M', icon: TrendingUp, color: '#9C27B0', change: '+18%' },
    { label: 'Order Selesai', value: '234', icon: Package, color: '#4CAF50', change: '+45' }
  ];

  const recentDeliveries = [
    { id: 'DLV-001', from: 'Tahu Gejrot Pak Haji', to: 'Jl. Pajajaran No. 45', amount: 15000, time: '10 menit lalu', status: 'completed' },
    { id: 'DLV-002', from: 'Makaroni Ngehe', to: 'Jl. Suryakencana No. 12', amount: 20000, time: '25 menit lalu', status: 'completed' },
    { id: 'DLV-003', from: 'Es Pala Pak Sahak', to: 'Jl. Raya Pajajaran', amount: 12000, time: '1 jam lalu', status: 'completed' },
    { id: 'DLV-004', from: 'Kopi Kenangan Bogor', to: 'Jl. Bangbarung', amount: 25000, time: '2 jam lalu', status: 'completed' }
  ];

  const pendingOrders = [
    { id: 'ORD-105', pickup: 'Tahu Gejrot Pak Haji', dropoff: 'Jl. Raya Bogor', distance: '2.5 km', fee: 15000 },
    { id: 'ORD-106', pickup: 'Batik Bogor Tradisiku', dropoff: 'Jl. Pahlawan', distance: '3.2 km', fee: 18000 }
  ];

  return (
    <div className="space-y-6">
      {/* Personalized Greeting */}
      <PersonalizedGreeting />

      {/* Gamification Badges */}
      <GamificationBadge role="driver" />

      {/* Online Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  isOnline ? 'bg-green-100' : 'bg-gray-100'
                }`}
              >
                <Bike size={32} style={{ color: isOnline ? '#4CAF50' : '#CCCCCC' }} />
              </div>
              <div>
                <h3 style={{ color: '#2F4858' }}>
                  Status: {isOnline ? 'Online' : 'Offline'}
                </h3>
                <p className="body-3 mt-1" style={{ color: '#858585' }}>
                  {isOnline ? 'Siap menerima order' : 'Tidak menerima order'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="body-3" style={{ color: '#858585' }}>
                {isOnline ? 'Online' : 'Offline'}
              </span>
              <Switch
                checked={isOnline}
                onCheckedChange={setIsOnline}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
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
            </motion.div>
          );
        })}</div>

      {/* Pending Orders */}
      {isOnline && pendingOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>Order Menunggu 🔔</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-lg border-2"
                style={{ 
                  backgroundColor: '#FFF4E6',
                  borderColor: '#FF8D28'
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 style={{ color: '#2F4858' }}>{order.id}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin size={14} style={{ color: '#4CAF50' }} />
                      <p className="body-3" style={{ color: '#2F4858' }}>
                        {order.pickup}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin size={14} style={{ color: '#FF6B6B' }} />
                      <p className="body-3" style={{ color: '#858585' }}>
                        {order.dropoff}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p style={{ color: '#FF8D28', fontWeight: 700, fontSize: '18px' }}>
                      Rp {order.fee.toLocaleString('id-ID')}
                    </p>
                    <p className="body-3" style={{ color: '#858585' }}>
                      {order.distance}
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full"
                  style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}
                >
                  Ambil Order
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#2F4858' }}>Pengiriman Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentDeliveries.map((delivery) => (
              <div 
                key={delivery.id} 
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: '#F5F5F5' }}
              >
                <div className="flex-1">
                  <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                    {delivery.id}
                  </p>
                  <p className="body-3 mt-1" style={{ color: '#858585', fontSize: '13px' }}>
                    {delivery.from} → {delivery.to}
                  </p>
                  <p className="body-3" style={{ color: '#CCCCCC', fontSize: '12px' }}>
                    {delivery.time}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ color: '#4CAF50', fontWeight: 700 }}>
                    Rp {delivery.amount.toLocaleString('id-ID')}
                  </p>
                  <span
                    className="body-3 px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: '#C8E6C9',
                      color: '#2E7D32',
                      fontSize: '11px'
                    }}
                  >
                    ✓ Selesai
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

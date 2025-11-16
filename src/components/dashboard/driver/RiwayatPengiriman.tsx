import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { MapPin, Clock, DollarSign, Star, Package } from 'lucide-react';
import { motion } from 'framer-motion';

interface Delivery {
  id: string;
  orderNumber: string;
  date: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  fee: number;
  rating?: number;
  status: 'completed' | 'cancelled';
}

export function RiwayatPengiriman() {
  const [activeTab, setActiveTab] = useState('all');

  const deliveries: Delivery[] = [
    {
      id: '1',
      orderNumber: 'DLV-2024-001',
      date: '15 Jan 2024, 14:30',
      from: 'Tahu Gejrot Pak Haji - Jl. Suryakencana',
      to: 'Jl. Pajajaran No. 45',
      distance: '2.5 km',
      duration: '15 menit',
      fee: 15000,
      rating: 5,
      status: 'completed'
    },
    {
      id: '2',
      orderNumber: 'DLV-2024-002',
      date: '15 Jan 2024, 13:45',
      from: 'Makaroni Ngehe - Jl. Raya Bogor',
      to: 'Jl. Bangbarung No. 12',
      distance: '3.2 km',
      duration: '20 menit',
      fee: 18000,
      rating: 5,
      status: 'completed'
    },
    {
      id: '3',
      orderNumber: 'DLV-2024-003',
      date: '15 Jan 2024, 12:20',
      from: 'Es Pala Pak Sahak - Jl. Siliwangi',
      to: 'Perumahan Bogor Raya',
      distance: '4.8 km',
      duration: '25 menit',
      fee: 22000,
      rating: 4,
      status: 'completed'
    },
    {
      id: '4',
      orderNumber: 'DLV-2024-004',
      date: '15 Jan 2024, 11:00',
      from: 'Kopi Kenangan Bogor - Jl. Pajajaran',
      to: 'Jl. Veteran',
      distance: '1.8 km',
      duration: '12 menit',
      fee: 12000,
      status: 'cancelled'
    },
    {
      id: '5',
      orderNumber: 'DLV-2024-005',
      date: '14 Jan 2024, 18:30',
      from: 'Batik Bogor Tradisiku - Jl. Surya Kencana',
      to: 'Jl. Pahlawan No. 23',
      distance: '5.2 km',
      duration: '30 menit',
      fee: 25000,
      rating: 5,
      status: 'completed'
    }
  ];

  const filteredDeliveries = deliveries.filter(delivery => {
    if (activeTab === 'all') return true;
    return delivery.status === activeTab;
  });

  const totalEarnings = deliveries
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + d.fee, 0);

  const averageRating = deliveries
    .filter(d => d.rating)
    .reduce((sum, d, _, arr) => sum + (d.rating || 0) / arr.length, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#4CAF5020' }}
              >
                <Package size={24} style={{ color: '#4CAF50' }} />
              </div>
              <div>
                <p className="body-3" style={{ color: '#858585' }}>Total Pengiriman</p>
                <h3 style={{ color: '#2F4858' }}>{deliveries.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#FF8D2820' }}
              >
                <DollarSign size={24} style={{ color: '#FF8D28' }} />
              </div>
              <div>
                <p className="body-3" style={{ color: '#858585' }}>Total Penghasilan</p>
                <h3 style={{ color: '#FF8D28' }}>
                  Rp {totalEarnings.toLocaleString('id-ID')}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#FFB80020' }}
              >
                <Star size={24} style={{ color: '#FFB800' }} />
              </div>
              <div>
                <p className="body-3" style={{ color: '#858585' }}>Rating Rata-rata</p>
                <h3 style={{ color: '#FFB800' }}>
                  {averageRating.toFixed(1)} ⭐
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#2F4858' }}>Riwayat Pengiriman</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="completed">Selesai</TabsTrigger>
              <TabsTrigger value="cancelled">Dibatalkan</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredDeliveries.length === 0 ? (
                <div className="text-center py-12">
                  <p style={{ color: '#858585' }}>Tidak ada riwayat pengiriman</p>
                </div>
              ) : (
                filteredDeliveries.map((delivery, index) => (
                  <motion.div
                    key={delivery.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 style={{ color: '#2F4858' }}>{delivery.orderNumber}</h4>
                            <p className="body-3 mt-1" style={{ color: '#858585' }}>
                              {delivery.date}
                            </p>
                          </div>
                          <Badge
                            style={{
                              backgroundColor: delivery.status === 'completed' ? '#C8E6C9' : '#FFCDD2',
                              color: delivery.status === 'completed' ? '#2E7D32' : '#C62828'
                            }}
                          >
                            {delivery.status === 'completed' ? '✓ Selesai' : '✗ Dibatalkan'}
                          </Badge>
                        </div>

                        {/* Route */}
                        <div className="space-y-3 mb-4 p-4 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
                          <div className="flex items-start gap-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: '#4CAF5020' }}
                            >
                              <MapPin size={16} style={{ color: '#4CAF50' }} />
                            </div>
                            <div>
                              <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                                Pickup
                              </p>
                              <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                                {delivery.from}
                              </p>
                            </div>
                          </div>

                          <div className="border-l-2 ml-4 pl-4" style={{ borderColor: '#E0E0E0', height: '20px' }} />

                          <div className="flex items-start gap-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: '#FF6B6B20' }}
                            >
                              <MapPin size={16} style={{ color: '#FF6B6B' }} />
                            </div>
                            <div>
                              <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                                Dropoff
                              </p>
                              <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                                {delivery.to}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid #E0E0E0' }}>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <MapPin size={16} style={{ color: '#858585' }} />
                              <span className="body-3" style={{ color: '#858585' }}>
                                {delivery.distance}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={16} style={{ color: '#858585' }} />
                              <span className="body-3" style={{ color: '#858585' }}>
                                {delivery.duration}
                              </span>
                            </div>
                            {delivery.rating && (
                              <div className="flex items-center gap-2">
                                <Star size={16} style={{ color: '#FFB800', fill: '#FFB800' }} />
                                <span className="body-3" style={{ color: '#FFB800', fontWeight: 600 }}>
                                  {delivery.rating}.0
                                </span>
                              </div>
                            )}
                          </div>
                          <h4 style={{ color: '#4CAF50' }}>
                            Rp {delivery.fee.toLocaleString('id-ID')}
                          </h4>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Users, UserPlus, Heart, MessageSquare, TrendingUp, Star } from 'lucide-react';
import { AnimatedCounter } from '../../AnimatedCounter';
import { Progress } from '../../ui/progress';

export function CustomerAnalysis() {
  const customerStats = [
    {
      label: 'Total Pelanggan',
      value: 892,
      icon: Users,
      color: '#2196F3',
      change: '+15.2%'
    },
    {
      label: 'Pelanggan Baru',
      value: 127,
      icon: UserPlus,
      color: '#4CAF50',
      change: '+8.3%',
      period: 'bulan ini'
    },
    {
      label: 'Pelanggan Loyal',
      value: 234,
      icon: Heart,
      color: '#FF6B6B',
      change: '+12.1%'
    },
    {
      label: 'Rata-rata Rating',
      value: 4.8,
      icon: Star,
      color: '#FFB800',
      change: '+0.2',
      decimals: 1
    }
  ];

  const topCustomers = [
    { 
      name: 'Budi Santoso', 
      orders: 28, 
      spent: 2100000, 
      lastOrder: '2 hari lalu',
      avatar: 'B',
      color: '#FF8D28'
    },
    { 
      name: 'Siti Nurhaliza', 
      orders: 24, 
      spent: 1800000, 
      lastOrder: '1 hari lalu',
      avatar: 'S',
      color: '#4CAF50'
    },
    { 
      name: 'Ahmad Fauzi', 
      orders: 21, 
      spent: 1600000, 
      lastOrder: '3 hari lalu',
      avatar: 'A',
      color: '#2196F3'
    },
    { 
      name: 'Rina Wijaya', 
      orders: 18, 
      spent: 1400000, 
      lastOrder: 'Hari ini',
      avatar: 'R',
      color: '#9C27B0'
    },
    { 
      name: 'Dedi Hermawan', 
      orders: 15, 
      spent: 1100000, 
      lastOrder: '5 hari lalu',
      avatar: 'D',
      color: '#FF6B6B'
    }
  ];

  const reviews = [
    {
      customer: 'Budi Santoso',
      rating: 5,
      comment: 'Enak banget! Tahu gejrotnya mantap poll!',
      time: '2 jam lalu'
    },
    {
      customer: 'Siti Nurhaliza',
      rating: 5,
      comment: 'Pelayanannya ramah, pasti balik lagi!',
      time: '5 jam lalu'
    },
    {
      customer: 'Ahmad Fauzi',
      rating: 4,
      comment: 'Rasanya juara, cuma agak lama nunggu',
      time: '1 hari lalu'
    }
  ];

  const complaints = [
    {
      customer: 'Rina Wijaya',
      issue: 'Pesanan terlambat 15 menit',
      status: 'resolved',
      time: '3 hari lalu'
    },
    {
      customer: 'Dedi Hermawan',
      issue: 'Kurang pedas',
      status: 'pending',
      time: '1 hari lalu'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Customer Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {customerStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
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
                    <AnimatedCounter value={stat.value} decimals={stat.decimals || 0} />
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>
              <div className="flex items-center gap-2">
                <Heart size={20} style={{ color: '#FF6B6B' }} />
                Pelanggan Setia
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCustomers.map((customer, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover-scale"
                  style={{ backgroundColor: '#F9F9F9' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: customer.color + '20',
                      color: customer.color,
                      fontWeight: 700,
                      fontSize: '18px'
                    }}
                  >
                    {customer.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                      {customer.name}
                    </p>
                    <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                      {customer.orders} pesanan • Rp {customer.spent.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="body-3" style={{ color: '#CCCCCC', fontSize: '11px' }}>
                      {customer.lastOrder}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews & Ratings */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>
              <div className="flex items-center gap-2">
                <MessageSquare size={20} style={{ color: '#2196F3' }} />
                Ulasan Terbaru
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <motion.div
                  key={index}
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: '#F9F9F9' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                      {review.customer}
                    </p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} size={14} fill="#FFB800" style={{ color: '#FFB800' }} />
                      ))}
                    </div>
                  </div>
                  <p className="body-3" style={{ color: '#858585', fontSize: '13px' }}>
                    "{review.comment}"
                  </p>
                  <p className="body-3 mt-2" style={{ color: '#CCCCCC', fontSize: '11px' }}>
                    {review.time}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Complaints */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>
              <div className="flex items-center gap-2">
                <MessageSquare size={20} style={{ color: '#FF9800' }} />
                Komplain & Feedback
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complaints.map((complaint, index) => (
                <motion.div
                  key={index}
                  className="p-3 rounded-lg"
                  style={{ 
                    backgroundColor: complaint.status === 'resolved' ? '#C8E6C920' : '#FFE0B220' 
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                      {complaint.customer}
                    </p>
                    <span
                      className="body-3 px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: complaint.status === 'resolved' ? '#4CAF50' : '#FF9800',
                        color: '#FFFFFF',
                        fontSize: '10px'
                      }}
                    >
                      {complaint.status === 'resolved' ? 'Selesai' : 'Pending'}
                    </span>
                  </div>
                  <p className="body-3" style={{ color: '#858585', fontSize: '13px' }}>
                    {complaint.issue}
                  </p>
                  <p className="body-3 mt-2" style={{ color: '#CCCCCC', fontSize: '11px' }}>
                    {complaint.time}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Growth */}
        <Card>
          <CardHeader>
            <CardTitle style={{ color: '#2F4858' }}>
              <div className="flex items-center gap-2">
                <TrendingUp size={20} style={{ color: '#4CAF50' }} />
                Pertumbuhan Pelanggan
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="body-3" style={{ color: '#2F4858' }}>Pelanggan Baru</span>
                  <span className="body-3" style={{ color: '#4CAF50', fontWeight: 600 }}>
                    <AnimatedCounter value={127} /> / 150
                  </span>
                </div>
                <Progress value={84} className="h-2" />
                <p className="body-3 mt-1" style={{ color: '#858585', fontSize: '11px' }}>
                  Target bulan ini: 150 pelanggan
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="body-3" style={{ color: '#2F4858' }}>Retention Rate</span>
                  <span className="body-3" style={{ color: '#2196F3', fontWeight: 600 }}>78%</span>
                </div>
                <Progress value={78} className="h-2" />
                <p className="body-3 mt-1" style={{ color: '#858585', fontSize: '11px' }}>
                  Pelanggan yang kembali order
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="body-3" style={{ color: '#2F4858' }}>Customer Satisfaction</span>
                  <span className="body-3" style={{ color: '#FFB800', fontWeight: 600 }}>92%</span>
                </div>
                <Progress value={92} className="h-2" />
                <p className="body-3 mt-1" style={{ color: '#858585', fontSize: '11px' }}>
                  Rating 4+ dari total review
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { DollarSign, TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export function KeuanganToko() {
  const balance = 3250000;
  const pending = 425000;
  const thisMonth = 12500000;
  const lastMonth = 10200000;
  const growth = ((thisMonth - lastMonth) / lastMonth * 100).toFixed(1);

  const transactions = [
    { id: 'TRX-001', type: 'income', description: 'Penjualan Order #ORD-001', amount: 45000, date: '15 Jan 2024, 14:30', status: 'completed' },
    { id: 'TRX-002', type: 'income', description: 'Penjualan Order #ORD-002', amount: 15000, date: '15 Jan 2024, 13:45', status: 'completed' },
    { id: 'TRX-003', type: 'withdrawal', description: 'Penarikan ke Bank BCA', amount: 2000000, date: '14 Jan 2024', status: 'completed' },
    { id: 'TRX-004', type: 'income', description: 'Penjualan Order #ORD-003', amount: 60000, date: '15 Jan 2024, 12:20', status: 'pending' },
    { id: 'TRX-005', type: 'fee', description: 'Biaya Platform (5%)', amount: 125000, date: '13 Jan 2024', status: 'completed' }
  ];

  return (
    <div className="space-y-6">
      {/* Balance Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="overflow-hidden relative">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)'
            }}
          />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#4CAF5020' }}
              >
                <DollarSign size={28} style={{ color: '#4CAF50' }} />
              </div>
              <Button
                style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}
              >
                Tarik Dana
              </Button>
            </div>
            <p className="body-3 mb-2" style={{ color: '#858585' }}>
              Saldo Tersedia
            </p>
            <motion.h2
              style={{ color: '#2F4858', fontSize: '32px' }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              Rp {balance.toLocaleString('id-ID')}
            </motion.h2>
          </CardContent>
        </Card>

        <Card className="overflow-hidden relative">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: 'linear-gradient(135deg, #FFB84D 0%, #FF8D28 100%)'
            }}
          />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#FFB84D20' }}
              >
                <TrendingUp size={28} style={{ color: '#FFB84D' }} />
              </div>
            </div>
            <p className="body-3 mb-2" style={{ color: '#858585' }}>
              Saldo Pending
            </p>
            <motion.h2
              style={{ color: '#2F4858', fontSize: '32px' }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              Rp {pending.toLocaleString('id-ID')}
            </motion.h2>
            <p className="body-3 mt-2" style={{ color: '#858585', fontSize: '12px' }}>
              Akan dicairkan Senin, 22 Jan 2024
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#4CAF5020' }}
              >
                <TrendingUp size={20} style={{ color: '#4CAF50' }} />
              </div>
              <p className="body-3" style={{ color: '#858585' }}>Bulan Ini</p>
            </div>
            <h3 style={{ color: '#2F4858' }}>
              Rp {thisMonth.toLocaleString('id-ID')}
            </h3>
            <span 
              className="body-3 px-2 py-1 rounded inline-block mt-2"
              style={{ backgroundColor: '#C8E6C9', color: '#2E7D32' }}
            >
              +{growth}%
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#85858520' }}
              >
                <Calendar size={20} style={{ color: '#858585' }} />
              </div>
              <p className="body-3" style={{ color: '#858585' }}>Bulan Lalu</p>
            </div>
            <h3 style={{ color: '#2F4858' }}>
              Rp {lastMonth.toLocaleString('id-ID')}
            </h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#FF6B6B20' }}
              >
                <TrendingDown size={20} style={{ color: '#FF6B6B' }} />
              </div>
              <p className="body-3" style={{ color: '#858585' }}>Biaya Platform</p>
            </div>
            <h3 style={{ color: '#FF6B6B' }}>
              Rp 625.000
            </h3>
            <p className="body-3 mt-1" style={{ color: '#858585', fontSize: '12px' }}>
              5% dari penjualan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: '#2F4858' }}>Riwayat Transaksi</CardTitle>
            <Button variant="outline" size="sm">
              <Download size={16} className="mr-2" />
              Unduh Laporan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div 
                  className="flex items-center gap-4 p-4 rounded-lg hover:shadow-md transition-shadow"
                  style={{ backgroundColor: '#F9F9F9' }}
                >
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100' : 
                      transaction.type === 'withdrawal' ? 'bg-blue-100' : 'bg-red-100'
                    }`}
                  >
                    {transaction.type === 'income' ? (
                      <TrendingUp size={20} style={{ color: '#4CAF50' }} />
                    ) : transaction.type === 'withdrawal' ? (
                      <Download size={20} style={{ color: '#2196F3' }} />
                    ) : (
                      <TrendingDown size={20} style={{ color: '#FF6B6B' }} />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                      {transaction.description}
                    </p>
                    <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                      {transaction.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <p 
                      style={{ 
                        color: transaction.type === 'income' ? '#4CAF50' : 
                               transaction.type === 'withdrawal' ? '#2196F3' : '#FF6B6B',
                        fontWeight: 700
                      }}
                    >
                      {transaction.type === 'income' ? '+' : '-'} Rp {transaction.amount.toLocaleString('id-ID')}
                    </p>
                    <span
                      className="body-3"
                      style={{
                        color: transaction.status === 'completed' ? '#4CAF50' : '#FFB84D',
                        fontSize: '11px'
                      }}
                    >
                      {transaction.status === 'completed' ? '✓ Selesai' : '⏱ Pending'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#2196F320' }}
              >
                <Calendar size={24} style={{ color: '#2196F3' }} />
              </div>
              <div>
                <h4 style={{ color: '#2F4858' }}>Jadwal Pencairan</h4>
                <p className="body-3 mt-2" style={{ color: '#858585' }}>
                  Dana penjualan akan dicairkan otomatis setiap hari Senin ke rekening terdaftar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#FF8D2820' }}
              >
                <DollarSign size={24} style={{ color: '#FF8D28' }} />
              </div>
              <div>
                <h4 style={{ color: '#2F4858' }}>Biaya Platform</h4>
                <p className="body-3 mt-2" style={{ color: '#858585' }}>
                  Platform mengenakan biaya 5% dari setiap transaksi yang berhasil diselesaikan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

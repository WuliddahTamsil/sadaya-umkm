import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal';
  description: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

export function KeuanganDriver() {
  const balance = 850000;
  const pendingBalance = 125000;

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'earning',
      description: 'Pengiriman DLV-2024-001',
      amount: 15000,
      date: '15 Jan 2024, 14:30',
      status: 'completed'
    },
    {
      id: '2',
      type: 'earning',
      description: 'Pengiriman DLV-2024-002',
      amount: 18000,
      date: '15 Jan 2024, 13:45',
      status: 'completed'
    },
    {
      id: '3',
      type: 'withdrawal',
      description: 'Penarikan ke Bank BCA',
      amount: 500000,
      date: '14 Jan 2024',
      status: 'completed'
    },
    {
      id: '4',
      type: 'earning',
      description: 'Pengiriman DLV-2024-003',
      amount: 22000,
      date: '15 Jan 2024, 12:20',
      status: 'pending'
    },
    {
      id: '5',
      type: 'earning',
      description: 'Bonus Pencapaian Target',
      amount: 50000,
      date: '13 Jan 2024',
      status: 'completed'
    }
  ];

  const thisWeekEarnings = 175000;
  const thisMonthEarnings = 4200000;
  const lastMonthEarnings = 3800000;
  const growth = ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings * 100).toFixed(1);

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
                <Wallet size={28} style={{ color: '#4CAF50' }} />
              </div>
              <Button
                style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}
              >
                Tarik Saldo
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
              Rp {pendingBalance.toLocaleString('id-ID')}
            </motion.h2>
            <p className="body-3 mt-2" style={{ color: '#858585', fontSize: '12px' }}>
              Akan dicairkan Jumat, 19 Jan 2024
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#2196F320' }}
              >
                <TrendingUp size={20} style={{ color: '#2196F3' }} />
              </div>
              <p className="body-3" style={{ color: '#858585' }}>Minggu Ini</p>
            </div>
            <h3 style={{ color: '#2F4858' }}>
              Rp {thisWeekEarnings.toLocaleString('id-ID')}
            </h3>
          </CardContent>
        </Card>

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
              Rp {thisMonthEarnings.toLocaleString('id-ID')}
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
                <TrendingDown size={20} style={{ color: '#858585' }} />
              </div>
              <p className="body-3" style={{ color: '#858585' }}>Bulan Lalu</p>
            </div>
            <h3 style={{ color: '#2F4858' }}>
              Rp {lastMonthEarnings.toLocaleString('id-ID')}
            </h3>
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
                      transaction.type === 'earning' ? 'bg-green-100' : 'bg-blue-100'
                    }`}
                  >
                    {transaction.type === 'earning' ? (
                      <ArrowUpRight size={20} style={{ color: '#4CAF50' }} />
                    ) : (
                      <Download size={20} style={{ color: '#2196F3' }} />
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
                        color: transaction.type === 'earning' ? '#4CAF50' : '#2196F3',
                        fontWeight: 700
                      }}
                    >
                      {transaction.type === 'earning' ? '+' : '-'} Rp {transaction.amount.toLocaleString('id-ID')}
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

      {/* Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#2196F320' }}
            >
              <TrendingUp size={24} style={{ color: '#2196F3' }} />
            </div>
            <div>
              <h4 style={{ color: '#2F4858' }}>Pencairan Otomatis</h4>
              <p className="body-3 mt-2" style={{ color: '#858585' }}>
                Saldo Anda akan dicairkan otomatis setiap hari Jumat ke rekening terdaftar.
                Minimal saldo untuk penarikan adalah Rp 50.000.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

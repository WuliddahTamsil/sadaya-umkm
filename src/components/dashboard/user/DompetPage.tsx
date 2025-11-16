import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Wallet, TrendingUp, TrendingDown, Plus, ArrowUpRight, ArrowDownRight, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../config/api';

interface Transaction {
  id: string;
  type: 'in' | 'out';
  title: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

export function DompetPage() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (user && user.role === 'user') {
      fetchWalletData();
    }
  }, [user]);

  const fetchWalletData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Fetch wallet balance
      const walletResponse = await fetch(api.wallet.getByUser(user.id));
      if (walletResponse.ok) {
        const walletData = await walletResponse.json();
        setBalance(walletData.data?.balance || 0);
      }
      
      // Fetch transactions
      const transactionsResponse = await fetch(api.wallet.getTransactions(user.id));
      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        const mappedTransactions: Transaction[] = transactionsData.data.map((t: any) => ({
          id: t.id,
          type: t.type === 'topup' || t.type === 'refund' ? 'in' : 'out',
          title: t.description || (t.type === 'topup' ? 'Top Up' : t.type === 'payment' ? `Pembayaran Order ${t.orderId || ''}` : 'Refund'),
          amount: t.amount,
          date: new Date(t.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: t.status === 'completed' ? 'completed' : 'pending'
        }));
        setTransactions(mappedTransactions);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Gagal memuat data dompet');
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [50000, 100000, 200000, 500000];

  const handleTopUp = async () => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }
    
    if (!topUpAmount || parseInt(topUpAmount) < 10000) {
      toast.error('Minimal top up Rp 10.000');
      return;
    }
    
    try {
      setIsTopUpLoading(true);
      const response = await fetch(api.wallet.topUp, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          amount: parseInt(topUpAmount),
          paymentMethod: 'Transfer Bank'
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal melakukan top up');
      }
      
      const data = await response.json();
      setBalance(data.data?.balance || 0);
      toast.success(`Top up Rp ${parseInt(topUpAmount).toLocaleString('id-ID')} berhasil!`);
      setTopUpAmount('');
      
      // Refresh transactions
      await fetchWalletData();
    } catch (error: any) {
      console.error('Error top up:', error);
      toast.error(error.message || 'Gagal melakukan top up');
    } finally {
      setIsTopUpLoading(false);
    }
  };

  const totalIn = transactions
    .filter(t => t.type === 'in' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = transactions
    .filter(t => t.type === 'out' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto mb-4" style={{ color: '#FF8D28' }} size={48} />
            <p style={{ color: '#858585' }}>Memuat data dompet...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <Card className="overflow-hidden relative">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)'
          }}
        />
        <CardContent className="p-8 relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#FF8D2820' }}
                >
                  <Wallet size={24} style={{ color: '#FF8D28' }} />
                </div>
                <p className="body-3" style={{ color: '#858585' }}>Saldo Dompet</p>
              </div>
              <motion.h1 
                style={{ color: '#2F4858', fontSize: '36px' }}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                Rp {balance.toLocaleString('id-ID')}
              </motion.h1>
            </div>
            <Button
              style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
            >
              <Plus size={18} className="mr-2" />
              Top Up
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#4CAF5020' }}
              >
                <TrendingUp size={28} style={{ color: '#4CAF50' }} />
              </div>
              <div className="flex-1">
                <p className="body-3" style={{ color: '#858585' }}>Total Pemasukan</p>
                <h3 style={{ color: '#4CAF50' }}>
                  Rp {totalIn.toLocaleString('id-ID')}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#FF6B6B20' }}
              >
                <TrendingDown size={28} style={{ color: '#FF6B6B' }} />
              </div>
              <div className="flex-1">
                <p className="body-3" style={{ color: '#858585' }}>Total Pengeluaran</p>
                <h3 style={{ color: '#FF6B6B' }}>
                  Rp {totalOut.toLocaleString('id-ID')}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Up Section */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#2F4858' }}>Top Up Saldo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="body-3" style={{ color: '#858585' }}>Pilih Nominal</p>
            <div className="grid grid-cols-4 gap-3">
              {quickAmounts.map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setTopUpAmount(amount.toString())}
                  className="hover:border-[#FF8D28] hover:bg-[#FFF4E6] transition-all"
                >
                  Rp {(amount / 1000).toLocaleString('id-ID')}K
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="body-3" style={{ color: '#858585' }}>Atau Masukkan Nominal</p>
            <div className="flex gap-3">
              <Input
                type="number"
                placeholder="Minimal Rp 10.000"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
              />
              <Button
                onClick={handleTopUp}
                style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}
                disabled={isTopUpLoading}
              >
                {isTopUpLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    Top Up
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: '#E3F2FD' }}>
            <CreditCard size={18} style={{ color: '#2196F3' }} />
            <p className="body-3" style={{ color: '#2196F3' }}>
              Metode Pembayaran: Transfer Bank, E-wallet, Credit Card
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#2F4858' }}>Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p style={{ color: '#858585' }}>Belum ada riwayat transaksi</p>
              </div>
            ) : (
              transactions.map((transaction, index) => (
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
                      transaction.type === 'in' ? 'bg-green-100' : 'bg-red-100'
                    }`}
                  >
                    {transaction.type === 'in' ? (
                      <ArrowDownRight size={20} style={{ color: '#4CAF50' }} />
                    ) : (
                      <ArrowUpRight size={20} style={{ color: '#FF6B6B' }} />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                      {transaction.title}
                    </p>
                    <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                      {transaction.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <p 
                      style={{ 
                        color: transaction.type === 'in' ? '#4CAF50' : '#FF6B6B',
                        fontWeight: 700
                      }}
                    >
                      {transaction.type === 'in' ? '+' : '-'} Rp {transaction.amount.toLocaleString('id-ID')}
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
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

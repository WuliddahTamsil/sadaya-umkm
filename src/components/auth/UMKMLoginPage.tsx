import { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Store, ArrowLeft, ShoppingBag, TrendingUp, Users } from 'lucide-react';

import { AsliBogorLogo } from '../ui/asli-bogor-logo';

interface UMKMLoginPageProps {
  onSwitchToRegister: () => void;
  onBack: () => void;
}

export function UMKMLoginPage({ onSwitchToRegister, onBack }: UMKMLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Login berhasil! Selamat datang UMKM.');
    } catch (error: any) {
      console.error('UMKM login error:', error);
      const errorMessage = error?.message || 'Login gagal. Periksa kembali email dan password Anda.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FFF4E6 0%, #FFB84D 50%, #FF8D28 100%)',
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-leaves opacity-20" />

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-20 right-10 text-orange-300 opacity-30"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Store size={80} />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-20 text-yellow-400 opacity-30"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <ShoppingBag size={70} />
      </motion.div>

      <div className="container mx-auto max-w-md relative z-10">
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 text-orange-800 hover:text-orange-900 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white shadow-2xl">
            <CardContent className="p-8">
              {/* Logo & Icon */}
              <div className="flex flex-col items-center mb-6">
                <AsliBogorLogo
                  variant="primary"
                  className="h-12 w-auto mb-4"
                />
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Store size={40} className="text-white" />
                </motion.div>
                <h2 style={{ color: '#FF8D28' }}>UMKM Login</h2>
                <p className="text-gray-600 text-center mt-2">
                  Masuk sebagai pelaku usaha
                </p>
              </div>

              {/* Illustrations */}
              <div className="flex justify-center space-x-4 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                    <ShoppingBag size={24} className="text-orange-600" />
                  </div>
                  <p className="body-3 text-gray-600">Produk</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                    <TrendingUp size={24} className="text-orange-600" />
                  </div>
                  <p className="body-3 text-gray-600">Transaksi</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                    <Users size={24} className="text-orange-600" />
                  </div>
                  <p className="body-3 text-gray-600">Pelanggan</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: '#2F4858' }}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="umkm@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" style={{ color: '#2F4858' }}>
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 hover-lift"
                  style={{ 
                    background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)',
                    color: '#FFFFFF' 
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Memproses...' : 'Masuk UMKM'}
                </Button>

                <div className="text-center">
                  <p className="body-3 text-gray-600">
                    Demo: Gunakan email dengan kata 'umkm' untuk login sebagai UMKM
                  </p>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="body-3 text-gray-600">
                  Belum punya akun?{' '}
                  <button
                    onClick={onSwitchToRegister}
                    className="body-3"
                    style={{ color: '#FF8D28', fontWeight: 600 }}
                  >
                    Daftar UMKM Baru
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

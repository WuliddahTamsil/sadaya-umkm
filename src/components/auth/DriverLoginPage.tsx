import { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Truck, ArrowLeft, MapPin, Package } from 'lucide-react';

import { AsliBogorLogo } from '../ui/asli-bogor-logo';

interface DriverLoginPageProps {
  onSwitchToRegister: () => void;
  onBack: () => void;
}

export function DriverLoginPage({ onSwitchToRegister, onBack }: DriverLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Login berhasil! Selamat datang Driver.');
    } catch (error: any) {
      console.error('Driver login error:', error);
      const errorMessage = error?.message || 'Login gagal. Periksa kembali email dan password Anda.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50"
    >
      {/* Dynamic Bright Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#9ACD32] to-transparent opacity-15 blur-3xl animate-pulse" />
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[60%] rounded-full bg-gradient-to-bl from-[#9370DB] to-transparent opacity-15 blur-3xl" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-leaves opacity-20" />

      {/* Decorative Vibrant Elements */}
      <motion.div
        className="absolute lg:top-[15%] top-10 left-[5%] lg:left-[10%] w-20 h-20 rounded-2xl shadow-[0_10px_35px_rgba(154,205,50,0.4)] flex items-center justify-center pointer-events-none z-0"
        style={{ background: 'linear-gradient(135deg, #aee34b 0%, #9ACD32 100%)', transform: 'rotate(-15deg)' }}
        animate={{ y: [0, -20, 0], rotate: [-15, 5, -15] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Truck className="text-white w-9 h-9" />
      </motion.div>

      <motion.div
        className="absolute lg:bottom-[20%] bottom-10 left-[8%] lg:left-[15%] w-16 h-16 rounded-[1.5rem] shadow-[0_10px_35px_rgba(154,205,50,0.4)] flex items-center justify-center pointer-events-none z-0"
        style={{ background: 'linear-gradient(135deg, #9ACD32 0%, #aee34b 100%)', transform: 'rotate(25deg)' }}
        animate={{ y: [0, -15, 0], rotate: [25, 5, 25] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Package className="text-white w-7 h-7" />
      </motion.div>


      <div className="container mx-auto max-w-md relative z-10">
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
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
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-[0_10px_35px_rgba(154,205,50,0.4)]"
                  style={{ background: 'linear-gradient(135deg, #aee34b 0%, #9ACD32 100%)' }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Truck size={40} className="text-white" />
                </motion.div>
                <h2 style={{ color: '#9ACD32' }} className="font-bold text-2xl">Driver Login</h2>
                <p className="text-gray-600 text-center mt-2">
                  Masuk sebagai mitra pengiriman
                </p>
              </div>

              {/* Illustrations */}
              <div className="flex justify-center space-x-4 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-lime-50 rounded-full flex items-center justify-center mb-2 border border-lime-100">
                    <Package size={24} className="text-[#9ACD32]" />
                  </div>
                  <p className="body-3 text-gray-600">Ambil Order</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-lime-50 rounded-full flex items-center justify-center mb-2 border border-lime-100">
                    <MapPin size={24} className="text-[#9ACD32]" />
                  </div>
                  <p className="body-3 text-gray-600">Navigasi</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-lime-50 rounded-full flex items-center justify-center mb-2 border border-lime-100">
                    <Truck size={24} className="text-[#9ACD32]" />
                  </div>
                  <p className="body-3 text-gray-600">Antar</p>
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
                    placeholder="driver@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-green-200 focus:border-green-400"
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
                    className="border-green-200 focus:border-green-400"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 hover-lift font-bold shadow-lg shadow-lime-500/20 text-lg"
                  style={{
                    background: 'linear-gradient(135deg, #9ACD32 0%, #9370DB 100%)',
                    color: '#FFFFFF'
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Memproses...' : 'Masuk sebagai Driver'}
                </Button>

                <div className="text-center">
                  <p className="body-3 text-gray-600">
                    Demo: Gunakan email dengan kata 'driver' untuk login sebagai driver
                  </p>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="body-3 text-gray-600">
                  Belum punya akun?{' '}
                  <button
                    onClick={onSwitchToRegister}
                    className="body-3 hover:underline"
                    style={{ color: '#9ACD32', fontWeight: 600 }}
                  >
                    Daftar Driver Baru
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

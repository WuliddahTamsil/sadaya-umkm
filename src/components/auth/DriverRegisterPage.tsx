import { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Truck, ArrowLeft } from 'lucide-react';

import { AsliBogorLogo } from '../ui/asli-bogor-logo';

interface DriverRegisterPageProps {
  onSwitchToLogin: () => void;
  onBack: () => void;
}

export function DriverRegisterPage({ onSwitchToLogin, onBack }: DriverRegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Password tidak cocok!');
      return;
    }

    setIsLoading(true);
    
    try {
      await register({
        name,
        email,
        password,
        role: 'driver',
        phone,
      });
      toast.success('Registrasi berhasil! Selamat datang Driver.');
    } catch (error: any) {
      console.error('Driver registration error:', error);
      toast.error(error.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #E8F5E9 0%, #4CAF50 100%)',
      }}
    >
      <div className="absolute inset-0 bg-pattern-leaves opacity-20" />

      <div className="container mx-auto max-w-md relative z-10 py-8">
        <motion.button
          onClick={onBack}
          className="mb-6 flex items-center space-x-2 text-green-800 hover:text-green-900 transition-colors"
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
              <div className="flex flex-col items-center mb-6">
                <AsliBogorLogo
                  variant="primary"
                  className="h-12 w-auto mb-4"
                />
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Truck size={40} className="text-white" />
                </motion.div>
                <h2 style={{ color: '#4CAF50' }}>Daftar Driver Baru</h2>
                <p className="text-gray-600 text-center mt-2">
                  Bergabung sebagai mitra pengiriman
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" style={{ color: '#2F4858' }}>
                    Nama Lengkap
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nama Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-green-200 focus:border-green-400"
                  />
                </div>

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
                  <Label htmlFor="phone" style={{ color: '#2F4858' }}>
                    Nomor HP
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" style={{ color: '#2F4858' }}>
                    Konfirmasi Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="border-green-200 focus:border-green-400"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 hover-lift"
                  style={{ 
                    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                    color: '#FFFFFF' 
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Memproses...' : 'Daftar Driver Baru'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="body-3 text-gray-600">
                  Sudah punya akun?{' '}
                  <button
                    onClick={onSwitchToLogin}
                    className="body-3"
                    style={{ color: '#4CAF50', fontWeight: 600 }}
                  >
                    Masuk di sini
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

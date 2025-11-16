import { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Store, ArrowLeft } from 'lucide-react';

import { AsliBogorLogo } from '../ui/asli-bogor-logo';

interface UMKMRegisterPageProps {
  onSwitchToLogin: () => void;
  onBack: () => void;
}

export function UMKMRegisterPage({ onSwitchToLogin, onBack }: UMKMRegisterPageProps) {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
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
        businessName,
        email,
        password,
        role: 'umkm',
        address,
        description,
      });
      toast.success('Registrasi berhasil! Selamat datang di Asli Bogor.');
    } catch (error: any) {
      console.error('UMKM registration error:', error);
      toast.error(error.message || 'Registrasi gagal. Silakan coba lagi.');
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
      <div className="absolute inset-0 bg-pattern-leaves opacity-20" />

      <div className="container mx-auto max-w-md relative z-10 py-8">
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
                <h2 style={{ color: '#FF8D28' }}>Daftar UMKM Baru</h2>
                <p className="text-gray-600 text-center mt-2">
                  Daftarkan usaha Anda
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName" style={{ color: '#2F4858' }}>
                    Nama UMKM
                  </Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Nama usaha Anda"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>

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
                  <Label htmlFor="address" style={{ color: '#2F4858' }}>
                    Alamat
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Alamat usaha"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="border-orange-200 focus:border-orange-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" style={{ color: '#2F4858' }}>
                    Deskripsi Singkat
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Ceritakan tentang usaha Anda"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="border-orange-200 focus:border-orange-400 min-h-[80px]"
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
                  {isLoading ? 'Memproses...' : 'Daftar UMKM Baru'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="body-3 text-gray-600">
                  Sudah punya akun?{' '}
                  <button
                    onClick={onSwitchToLogin}
                    className="body-3"
                    style={{ color: '#FF8D28', fontWeight: 600 }}
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

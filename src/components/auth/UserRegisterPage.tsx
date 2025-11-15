import { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { User, ArrowLeft } from 'lucide-react';

import { AsliBogorLogo } from '../ui/asli-bogor-logo';

interface UserRegisterPageProps {
  onSwitchToLogin: () => void;
  onBack: () => void;
}

export function UserRegisterPage({ onSwitchToLogin, onBack }: UserRegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
        role: 'user',
      });
      toast.success('Registrasi berhasil! Selamat berbelanja.');
    } catch (error: any) {
      console.error('User registration error:', error);
      toast.error(error.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FFFBF0 0%, #FFF4E6 50%, #FFE5CC 100%)',
      }}
    >
      <div className="absolute inset-0 bg-pattern-leaves opacity-20" />

      <div className="container mx-auto max-w-md relative z-10 py-8">
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
              <div className="flex flex-col items-center mb-6">
                <AsliBogorLogo
                  variant="primary"
                  className="h-12 w-auto mb-4"
                />
                <motion.div
                  className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <User size={40} className="text-white" />
                </motion.div>
                <h2 style={{ color: '#FFB84D' }}>Daftar Sekarang</h2>
                <p className="text-gray-600 text-center mt-2">
                  Buat akun untuk mulai berbelanja
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
                    className="border-yellow-200 focus:border-yellow-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: '#2F4858' }}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-yellow-200 focus:border-yellow-400"
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
                    className="border-yellow-200 focus:border-yellow-400"
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
                    className="border-yellow-200 focus:border-yellow-400"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 hover-lift"
                  style={{ 
                    background: 'linear-gradient(135deg, #FFB84D 0%, #FF8D28 100%)',
                    color: '#FFFFFF' 
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="body-3 text-gray-600">
                  Sudah punya akun?{' '}
                  <button
                    onClick={onSwitchToLogin}
                    className="body-3"
                    style={{ color: '#FFB84D', fontWeight: 600 }}
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

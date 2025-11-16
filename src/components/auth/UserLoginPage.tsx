import { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { User, ArrowLeft, ShoppingCart, Heart, Star } from 'lucide-react';

import { AsliBogorLogo } from '../ui/asli-bogor-logo';

interface UserLoginPageProps {
  onSwitchToRegister: () => void;
  onBack: () => void;
}

export function UserLoginPage({ onSwitchToRegister, onBack }: UserLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Login berhasil! Selamat berbelanja.');
    } catch (error: any) {
      console.error('User login error:', error);
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
        background: 'linear-gradient(135deg, #FFFBF0 0%, #FFF4E6 50%, #FFE5CC 100%)',
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-leaves opacity-20" />

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-20 right-10 text-yellow-300 opacity-40"
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
        <User size={80} />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-20 text-orange-300 opacity-40"
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
        <ShoppingCart size={70} />
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
                  className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <User size={40} className="text-white" />
                </motion.div>
                <h2 style={{ color: '#FFB84D' }}>Masyarakat Login</h2>
                <p className="text-gray-600 text-center mt-2">
                  Masuk sebagai pembeli
                </p>
              </div>

              {/* Illustrations */}
              <div className="flex justify-center space-x-4 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                    <ShoppingCart size={24} className="text-yellow-600" />
                  </div>
                  <p className="body-3 text-gray-600">Belanja</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                    <Heart size={24} className="text-yellow-600" />
                  </div>
                  <p className="body-3 text-gray-600">Favorit</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                    <Star size={24} className="text-yellow-600" />
                  </div>
                  <p className="body-3 text-gray-600">Review</p>
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

                <Button
                  type="submit"
                  className="w-full py-6 hover-lift"
                  style={{ 
                    background: 'linear-gradient(135deg, #FFB84D 0%, #FF8D28 100%)',
                    color: '#FFFFFF' 
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Memproses...' : 'Masuk'}
                </Button>

                <div className="text-center">
                  <p className="body-3 text-gray-600">
                    Demo: Gunakan email biasa (tanpa kata kunci khusus)
                  </p>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="body-3 text-gray-600">
                  Belum punya akun?{' '}
                  <button
                    onClick={onSwitchToRegister}
                    className="body-3"
                    style={{ color: '#FFB84D', fontWeight: 600 }}
                  >
                    Daftar Sekarang
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

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

import { AsliBogorLogo } from '../ui/asli-bogor-logo';

interface LoginPageProps {
  onSwitchToRegister: () => void;
  onClose: () => void;
}

export function LoginPage({ onSwitchToRegister, onClose }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Login berhasil!');
      onClose();
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error?.message || 'Login gagal. Periksa kembali email dan password Anda.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F5F5F5' }}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <AsliBogorLogo variant="primary" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-center" style={{ color: '#2F4858' }}>
            Masuk ke Asli Bogor
          </CardTitle>
          <CardDescription className="text-center body-3">
            Masukkan email dan password untuk melanjutkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="body-3" style={{ color: '#2F4858' }}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="body-3" style={{ color: '#2F4858' }}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </Button>

            <div className="text-center">
              <p className="body-3" style={{ color: '#858585' }}>
                Demo login: gunakan email dengan kata kunci 'admin', 'umkm', 'driver', atau email biasa untuk role User
              </p>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="body-3" style={{ color: '#858585' }}>
              Belum punya akun?{' '}
              <button
                onClick={onSwitchToRegister}
                className="body-3"
                style={{ color: '#FF8D28', fontWeight: 600 }}
              >
                Daftar di sini
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

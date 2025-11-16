import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { User, Store, Bike, Shield } from 'lucide-react';

import { AsliBogorLogo } from '../ui/asli-bogor-logo';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
}

export function RegisterPage({ onSwitchToLogin, onClose }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const roles = [
    { value: 'user' as UserRole, label: 'Pembeli', icon: User, description: 'Belanja produk UMKM' },
    { value: 'umkm' as UserRole, label: 'UMKM', icon: Store, description: 'Jual produk Anda' },
    { value: 'driver' as UserRole, label: 'Driver', icon: Bike, description: 'Antar pesanan' },
    { value: 'admin' as UserRole, label: 'Admin', icon: Shield, description: 'Kelola platform' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await register({
        name,
        email,
        password,
        role: selectedRole,
      });
      toast.success('Registrasi berhasil!');
      onClose();
    } catch (error: any) {
      console.error('Registrasi error:', error);
      toast.error(error.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F5F5F5' }}>
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <AsliBogorLogo variant="primary" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-center" style={{ color: '#2F4858' }}>
            Daftar Asli Bogor
          </CardTitle>
          <CardDescription className="text-center body-3">
            Pilih peran Anda dan buat akun baru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="body-3" style={{ color: '#2F4858' }}>
                Pilih Peran
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedRole === role.value
                          ? 'border-[#FF8D28] bg-[#FDE08E]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon 
                        size={24} 
                        style={{ 
                          color: selectedRole === role.value ? '#FF8D28' : '#858585',
                          margin: '0 auto'
                        }} 
                      />
                      <h4 
                        className="mt-2" 
                        style={{ color: selectedRole === role.value ? '#2F4858' : '#858585' }}
                      >
                        {role.label}
                      </h4>
                      <p className="body-3 mt-1" style={{ color: '#858585' }}>
                        {role.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="body-3" style={{ color: '#2F4858' }}>
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
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
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="body-3" style={{ color: '#858585' }}>
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
    </div>
  );
}

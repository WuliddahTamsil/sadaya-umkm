import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+62 812-3456-7890',
    address: 'Jl. Pajajaran No. 123, Bogor',
    bio: 'Pengguna setia Asli Bogor'
  });

  const handleSave = () => {
    toast.success('Profil berhasil diperbarui!');
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#2F4858' }}>Profil Saya</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar className="w-32 h-32">
                  <AvatarFallback 
                    className="text-2xl"
                    style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                  style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}
                >
                  <Camera size={18} />
                </button>
              </div>
              <div className="text-center">
                <h3 style={{ color: '#2F4858' }}>{user?.name}</h3>
                <p className="body-3" style={{ color: '#858585' }}>
                  {user?.role === 'user' ? 'Pembeli' : 
                   user?.role === 'umkm' ? 'Penjual UMKM' :
                   user?.role === 'driver' ? 'Driver' : 'Administrator'}
                </p>
              </div>
            </div>

            {/* Form Section */}
            <div className="flex-1 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <div className="relative">
                    <User 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                      size={18} 
                      style={{ color: '#858585' }} 
                    />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!editing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                      size={18} 
                      style={{ color: '#858585' }} 
                    />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!editing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">No. Telepon</Label>
                  <div className="relative">
                    <Phone 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                      size={18} 
                      style={{ color: '#858585' }} 
                    />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!editing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <div className="relative">
                    <MapPin 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2" 
                      size={18} 
                      style={{ color: '#858585' }} 
                    />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!editing}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {!editing ? (
                  <Button
                    onClick={() => setEditing(true)}
                    style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
                  >
                    Edit Profil
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}
                    >
                      <Save size={18} className="mr-2" />
                      Simpan
                    </Button>
                    <Button
                      onClick={() => setEditing(false)}
                      variant="outline"
                    >
                      Batal
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Stats/Info */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div 
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: '#FF8D2820' }}
            >
              <User size={24} style={{ color: '#FF8D28' }} />
            </div>
            <h4 style={{ color: '#2F4858' }}>Member Sejak</h4>
            <p className="body-3" style={{ color: '#858585' }}>Januari 2024</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div 
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: '#4CAF5020' }}
            >
              <Mail size={24} style={{ color: '#4CAF50' }} />
            </div>
            <h4 style={{ color: '#2F4858' }}>Status Verifikasi</h4>
            <p className="body-3" style={{ color: '#4CAF50' }}>✓ Terverifikasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div 
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: '#219 6F320' }}
            >
              <MapPin size={24} style={{ color: '#2196F3' }} />
            </div>
            <h4 style={{ color: '#2F4858' }}>Lokasi</h4>
            <p className="body-3" style={{ color: '#858585' }}>Bogor, Jawa Barat</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

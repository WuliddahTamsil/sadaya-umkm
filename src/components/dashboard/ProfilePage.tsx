import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User, Mail, Phone, MapPin, Camera, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { api } from '../../config/api';
import { motion } from 'framer-motion';

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  // Update formData when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - allow PNG, JPG, JPEG, GIF, WEBP
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    const fileType = file.type.toLowerCase();
    
    if (!allowedTypes.includes(fileType) && !file.type.startsWith('image/')) {
      toast.error('Hanya file gambar (PNG, JPG, JPEG, GIF, WEBP) yang diizinkan');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    try {
      setUploadingPhoto(true);
      
      const formData = new FormData();
      formData.append('profilePhoto', file);
      formData.append('userId', user?.id || '');

      const response = await fetch(api.upload.profilePhoto, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Gagal upload foto profil';
        try {
          const error = await response.json();
          errorMessage = error.error || error.message || errorMessage;
          console.error('Upload error response:', error);
        } catch (e) {
          const errorText = await response.text().catch(() => '');
          console.error('Upload error text:', errorText);
          if (errorText) {
            try {
              const parsed = JSON.parse(errorText);
              errorMessage = parsed.error || parsed.message || errorMessage;
            } catch {
              errorMessage = errorText || errorMessage;
            }
          }
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      toast.success('Foto profil berhasil diupload!');
      
      // Refresh user data untuk mendapatkan foto profil terbaru
      if (refreshUser) {
        await refreshUser();
      }
    } catch (error: any) {
      console.error('Error uploading profile photo:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Tidak dapat terhubung ke server. Pastikan koneksi internet Anda aktif.');
      } else {
        toast.error(error.message || 'Gagal upload foto profil. Silakan coba lagi.');
      }
    } finally {
      setUploadingPhoto(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    try {
      if (!user?.id) {
        toast.error('User ID tidak ditemukan');
        return;
      }

      // Update user profile
      const response = await fetch(api.users.getById(user.id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Gagal memperbarui profil' }));
        throw new Error(error.error || 'Gagal memperbarui profil');
      }

      const result = await response.json();
      
      toast.success('Profil berhasil diperbarui!');
      setEditing(false);
      
      // Refresh user data
      if (refreshUser) {
        await refreshUser();
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Gagal memperbarui profil');
    }
  };

  // Get profile photo URL or use fallback
  const profilePhotoUrl = user?.profilePhoto || null;
  const displayName = user?.name || 'User';
  const initials = displayName.charAt(0).toUpperCase();

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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    {profilePhotoUrl ? (
                      <AvatarImage 
                        src={profilePhotoUrl} 
                        alt={displayName}
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback 
                      className="text-4xl font-bold"
                      style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <motion.button
                  onClick={handlePhotoClick}
                  disabled={uploadingPhoto}
                  className="absolute bottom-0 right-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {uploadingPhoto ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Camera size={18} />
                  )}
                </motion.button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
              <div className="text-center">
                <h3 style={{ color: '#2F4858', fontSize: '20px', fontWeight: 600 }}>
                  {displayName}
                </h3>
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
                      disabled={true}
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                  <p className="text-xs" style={{ color: '#858585' }}>
                    Email tidak dapat diubah
                  </p>
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
                      placeholder="+62 812-3456-7890"
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
                      placeholder="Jl. Pajajaran No. 123, Bogor"
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
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || '',
                          phone: user?.phone || '',
                          address: user?.address || '',
                        });
                      }}
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
            <p className="body-3" style={{ color: '#858585' }}>
              {user?.joinDate 
                ? new Date(user.joinDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                : new Date(user?.createdAt || Date.now()).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div 
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: user?.isVerified ? '#4CAF5020' : '#FF980020' }}
            >
              <Mail size={24} style={{ color: user?.isVerified ? '#4CAF50' : '#FF9800' }} />
            </div>
            <h4 style={{ color: '#2F4858' }}>Status Verifikasi</h4>
            <p className="body-3" style={{ color: user?.isVerified ? '#4CAF50' : '#FF9800' }}>
              {user?.isVerified ? '✓ Terverifikasi' : '⏳ Menunggu Verifikasi'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div 
              className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ backgroundColor: '#2196F320' }}
            >
              <MapPin size={24} style={{ color: '#2196F3' }} />
            </div>
            <h4 style={{ color: '#2F4858' }}>Lokasi</h4>
            <p className="body-3" style={{ color: '#858585' }}>
              {user?.address ? user.address.split(',')[user.address.split(',').length - 1].trim() : 'Bogor, Jawa Barat'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

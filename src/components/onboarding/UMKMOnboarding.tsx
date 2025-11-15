import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Upload, FileText, Store, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { api } from '../../config/api';

export function UMKMOnboarding() {
  const { user, completeOnboarding, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    storeAddress: '',
    storeDescription: '',
    phoneNumber: '',
    ktpFile: null as File | null,
    storePhotoFile: null as File | null,
    businessPermitFile: null as File | null
  });

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }

    setIsLoading(true);

    try {
      // Buat FormData untuk mengirim file
      const uploadFormData = new FormData();
      uploadFormData.append('userId', user.id);
      uploadFormData.append('storeName', formData.storeName);
      uploadFormData.append('storeAddress', formData.storeAddress);
      uploadFormData.append('storeDescription', formData.storeDescription);
      uploadFormData.append('phoneNumber', formData.phoneNumber);
      
      // Append files
      if (formData.ktpFile) uploadFormData.append('ktpFile', formData.ktpFile);
      if (formData.storePhotoFile) uploadFormData.append('storePhotoFile', formData.storePhotoFile);
      if (formData.businessPermitFile) uploadFormData.append('businessPermitFile', formData.businessPermitFile);

      const response = await fetch(api.upload.umkm, {
        method: 'POST',
        body: uploadFormData, // Jangan set Content-Type, browser akan set otomatis dengan boundary
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload dokumen gagal');
      }

      const result = await response.json();
      
      // Update user data dengan data terbaru dari backend (termasuk isOnboarded: true)
      await refreshUser();
      
      // Set isOnboarded di state agar langsung masuk dashboard
      completeOnboarding();
      
      toast.success('Pendaftaran toko berhasil! Menunggu verifikasi admin.');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Gagal mengupload dokumen. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-3xl mx-auto py-8">
        <Alert className="mb-6" style={{ backgroundColor: '#FDE08E', borderColor: '#FF8D28' }}>
          <AlertCircle style={{ color: '#FF8D28' }} />
          <AlertDescription className="body-3" style={{ color: '#2F4858' }}>
            Anda perlu melengkapi pendaftaran toko sebelum dapat menggunakan dashboard secara penuh. 
            Akun Anda akan diverifikasi oleh admin dalam 1x24 jam.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-[#FF8D28] flex items-center justify-center">
                <Store size={24} style={{ color: '#FFFFFF' }} />
              </div>
              <div>
                <CardTitle style={{ color: '#2F4858' }}>
                  Lengkapi Pendaftaran Toko
                </CardTitle>
                <CardDescription className="body-3">
                  Isi informasi toko dan unggah dokumen yang diperlukan
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Store Information */}
              <div className="space-y-4">
                <h4 style={{ color: '#2F4858' }}>Informasi Toko</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="body-3">Nama Toko *</Label>
                  <Input
                    id="storeName"
                    placeholder="Contoh: Tahu Gejrot Pak Haji"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="body-3">Nomor Telepon *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+62 812-3456-7890"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeAddress" className="body-3">Alamat Lengkap Toko *</Label>
                  <Textarea
                    id="storeAddress"
                    placeholder="Jl. Suryakencana No. 123, Bogor Tengah"
                    value={formData.storeAddress}
                    onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                    required
                    className="min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeDescription" className="body-3">Deskripsi Toko *</Label>
                  <Textarea
                    id="storeDescription"
                    placeholder="Ceritakan tentang produk dan keunikan toko Anda..."
                    value={formData.storeDescription}
                    onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                    required
                    className="min-h-32"
                  />
                </div>
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <h4 style={{ color: '#2F4858' }}>Dokumen Pendukung</h4>

                <div className="space-y-2">
                  <Label className="body-3">Foto KTP Pemilik *</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center" style={{ borderColor: '#CCCCCC' }}>
                    <Upload size={32} style={{ color: '#858585', margin: '0 auto' }} />
                    <p className="body-3 mt-2" style={{ color: '#858585' }}>
                      {formData.ktpFile ? formData.ktpFile.name : 'Klik untuk unggah atau drag & drop'}
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('ktpFile', e.target.files?.[0] || null)}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="body-3">Foto Tempat Usaha *</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center" style={{ borderColor: '#CCCCCC' }}>
                    <Upload size={32} style={{ color: '#858585', margin: '0 auto' }} />
                    <p className="body-3 mt-2" style={{ color: '#858585' }}>
                      {formData.storePhotoFile ? formData.storePhotoFile.name : 'Klik untuk unggah atau drag & drop'}
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('storePhotoFile', e.target.files?.[0] || null)}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="body-3">Izin Usaha (Opsional)</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center" style={{ borderColor: '#CCCCCC' }}>
                    <FileText size={32} style={{ color: '#858585', margin: '0 auto' }} />
                    <p className="body-3 mt-2" style={{ color: '#858585' }}>
                      {formData.businessPermitFile ? formData.businessPermitFile.name : 'Klik untuk unggah PDF/Image'}
                    </p>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileChange('businessPermitFile', e.target.files?.[0] || null)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
                disabled={isLoading}
              >
                {isLoading ? 'Mengirim...' : 'Kirim Pendaftaran'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

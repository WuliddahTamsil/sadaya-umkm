import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { Upload, Bike, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { api } from '../../config/api';

export function DriverOnboarding() {
  const { user, completeOnboarding, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    vehicleType: '',
    vehiclePlate: '',
    ktpFile: null as File | null,
    simFile: null as File | null,
    stnkFile: null as File | null,
    selfieFile: null as File | null,
    vehiclePhotoFile: null as File | null
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
      uploadFormData.append('phoneNumber', formData.phoneNumber);
      uploadFormData.append('vehicleType', formData.vehicleType);
      uploadFormData.append('vehiclePlate', formData.vehiclePlate);
      
      // Append files
      if (formData.ktpFile) uploadFormData.append('ktpFile', formData.ktpFile);
      if (formData.simFile) uploadFormData.append('simFile', formData.simFile);
      if (formData.stnkFile) uploadFormData.append('stnkFile', formData.stnkFile);
      if (formData.selfieFile) uploadFormData.append('selfieFile', formData.selfieFile);
      if (formData.vehiclePhotoFile) uploadFormData.append('vehiclePhotoFile', formData.vehiclePhotoFile);

      const response = await fetch(api.upload.driver, {
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
      
      toast.success('Pendaftaran driver berhasil! Menunggu verifikasi admin.');
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
            Anda perlu melengkapi pendaftaran driver sebelum dapat menggunakan dashboard secara penuh. 
            Akun Anda akan diverifikasi oleh admin dalam 1x24 jam.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-[#FF8D28] flex items-center justify-center">
                <Bike size={24} style={{ color: '#FFFFFF' }} />
              </div>
              <div>
                <CardTitle style={{ color: '#2F4858' }}>
                  Lengkapi Pendaftaran Driver
                </CardTitle>
                <CardDescription className="body-3">
                  Isi informasi dan unggah dokumen yang diperlukan
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Driver Information */}
              <div className="space-y-4">
                <h4 style={{ color: '#2F4858' }}>Informasi Driver</h4>
                
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
                  <Label htmlFor="vehicleType" className="body-3">Jenis Kendaraan *</Label>
                  <Select value={formData.vehicleType} onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kendaraan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="motor">Motor</SelectItem>
                      <SelectItem value="mobil">Mobil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehiclePlate" className="body-3">Nomor Plat Kendaraan *</Label>
                  <Input
                    id="vehiclePlate"
                    placeholder="Contoh: B 1234 XYZ"
                    value={formData.vehiclePlate}
                    onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Document Upload */}
              <div className="space-y-4">
                <h4 style={{ color: '#2F4858' }}>Dokumen Pendukung</h4>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="body-3">Foto KTP *</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center" style={{ borderColor: '#CCCCCC' }}>
                      <Upload size={24} style={{ color: '#858585', margin: '0 auto' }} />
                      <p className="body-3 mt-2" style={{ color: '#858585', fontSize: '12px' }}>
                        {formData.ktpFile ? formData.ktpFile.name : 'Upload KTP'}
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
                    <Label className="body-3">Foto SIM C *</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center" style={{ borderColor: '#CCCCCC' }}>
                      <Upload size={24} style={{ color: '#858585', margin: '0 auto' }} />
                      <p className="body-3 mt-2" style={{ color: '#858585', fontSize: '12px' }}>
                        {formData.simFile ? formData.simFile.name : 'Upload SIM'}
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('simFile', e.target.files?.[0] || null)}
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="body-3">Foto STNK *</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center" style={{ borderColor: '#CCCCCC' }}>
                      <Upload size={24} style={{ color: '#858585', margin: '0 auto' }} />
                      <p className="body-3 mt-2" style={{ color: '#858585', fontSize: '12px' }}>
                        {formData.stnkFile ? formData.stnkFile.name : 'Upload STNK'}
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('stnkFile', e.target.files?.[0] || null)}
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="body-3">Foto Selfie *</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center" style={{ borderColor: '#CCCCCC' }}>
                      <Upload size={24} style={{ color: '#858585', margin: '0 auto' }} />
                      <p className="body-3 mt-2" style={{ color: '#858585', fontSize: '12px' }}>
                        {formData.selfieFile ? formData.selfieFile.name : 'Upload Selfie'}
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('selfieFile', e.target.files?.[0] || null)}
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="body-3">Foto Kendaraan *</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center" style={{ borderColor: '#CCCCCC' }}>
                    <Upload size={32} style={{ color: '#858585', margin: '0 auto' }} />
                    <p className="body-3 mt-2" style={{ color: '#858585' }}>
                      {formData.vehiclePhotoFile ? formData.vehiclePhotoFile.name : 'Klik untuk unggah atau drag & drop'}
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange('vehiclePhotoFile', e.target.files?.[0] || null)}
                      className="mt-2"
                      required
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

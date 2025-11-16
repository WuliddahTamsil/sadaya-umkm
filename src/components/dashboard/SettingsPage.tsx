import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Bell, Moon, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../ui/input';

export function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    orderNotif: true,
    promoNotif: true,
    emailNotif: false,
    darkMode: false,
    language: 'id',
    twoFactor: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSave = () => {
    toast.success('Pengaturan berhasil disimpan!');
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('Password baru tidak cocok!');
      return;
    }
    toast.success('Password berhasil diubah!');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#FF8D2820' }}
            >
              <Bell size={20} style={{ color: '#FF8D28' }} />
            </div>
            <CardTitle style={{ color: '#2F4858' }}>Notifikasi</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
            <div className="flex-1">
              <Label htmlFor="notifications" className="cursor-pointer">
                <p style={{ color: '#2F4858', fontWeight: 600 }}>Aktifkan Notifikasi</p>
                <p className="body-3 mt-1" style={{ color: '#858585' }}>
                  Terima semua notifikasi dari aplikasi
                </p>
              </Label>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
            <div className="flex-1">
              <Label htmlFor="orderNotif" className="cursor-pointer">
                <p style={{ color: '#2F4858', fontWeight: 600 }}>Notifikasi Pesanan</p>
                <p className="body-3 mt-1" style={{ color: '#858585' }}>
                  Update status pesanan dan pengiriman
                </p>
              </Label>
            </div>
            <Switch
              id="orderNotif"
              checked={settings.orderNotif}
              onCheckedChange={(checked) => setSettings({ ...settings, orderNotif: checked })}
              disabled={!settings.notifications}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
            <div className="flex-1">
              <Label htmlFor="promoNotif" className="cursor-pointer">
                <p style={{ color: '#2F4858', fontWeight: 600 }}>Notifikasi Promo</p>
                <p className="body-3 mt-1" style={{ color: '#858585' }}>
                  Dapatkan info promo dan diskon terbaru
                </p>
              </Label>
            </div>
            <Switch
              id="promoNotif"
              checked={settings.promoNotif}
              onCheckedChange={(checked) => setSettings({ ...settings, promoNotif: checked })}
              disabled={!settings.notifications}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
            <div className="flex-1">
              <Label htmlFor="emailNotif" className="cursor-pointer">
                <p style={{ color: '#2F4858', fontWeight: 600 }}>Email Notifikasi</p>
                <p className="body-3 mt-1" style={{ color: '#858585' }}>
                  Kirim notifikasi ke email
                </p>
              </Label>
            </div>
            <Switch
              id="emailNotif"
              checked={settings.emailNotif}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotif: checked })}
              disabled={!settings.notifications}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#2196F320' }}
            >
              <Moon size={20} style={{ color: '#2196F3' }} />
            </div>
            <CardTitle style={{ color: '#2F4858' }}>Tampilan</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
            <div className="flex-1">
              <Label htmlFor="darkMode" className="cursor-pointer">
                <p style={{ color: '#2F4858', fontWeight: 600 }}>Mode Gelap</p>
                <p className="body-3 mt-1" style={{ color: '#858585' }}>
                  Aktifkan tema gelap untuk kenyamanan mata
                </p>
              </Label>
            </div>
            <Switch
              id="darkMode"
              checked={settings.darkMode}
              onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
            />
          </div>

          <div className="p-4 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
            <Label htmlFor="language">
              <p style={{ color: '#2F4858', fontWeight: 600 }} className="mb-2">Bahasa</p>
            </Label>
            <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Bahasa Indonesia</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="su">Basa Sunda</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#4CAF5020' }}
            >
              <Shield size={20} style={{ color: '#4CAF50' }} />
            </div>
            <CardTitle style={{ color: '#2F4858' }}>Keamanan</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
            <div className="flex-1">
              <Label htmlFor="twoFactor" className="cursor-pointer">
                <p style={{ color: '#2F4858', fontWeight: 600 }}>Autentikasi 2 Faktor</p>
                <p className="body-3 mt-1" style={{ color: '#858585' }}>
                  Tambah lapisan keamanan ekstra
                </p>
              </Label>
            </div>
            <Switch
              id="twoFactor"
              checked={settings.twoFactor}
              onCheckedChange={(checked) => setSettings({ ...settings, twoFactor: checked })}
            />
          </div>

          <div className="p-4 rounded-lg space-y-3" style={{ backgroundColor: '#F9F9F9' }}>
            <div className="flex items-center gap-2 mb-3">
              <Lock size={18} style={{ color: '#FF8D28' }} />
              <p style={{ color: '#2F4858', fontWeight: 600 }}>Ubah Password</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Password Saat Ini</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff size={18} style={{ color: '#858585' }} />
                  ) : (
                    <Eye size={18} style={{ color: '#858585' }} />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <Input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.new}
                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
              />
            </div>

            <Button
              onClick={handleChangePassword}
              style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}
              disabled={!passwordData.current || !passwordData.new || !passwordData.confirm}
            >
              Ubah Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          size="lg"
          style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
        >
          Simpan Pengaturan
        </Button>
      </div>
    </div>
  );
}

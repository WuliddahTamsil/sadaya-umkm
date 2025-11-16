import { useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FloatingShapes } from '../FloatingShapes';
import { MountainSilhouette } from '../MountainSilhouette';
import { motion } from 'framer-motion';

import { AsliBogorLogo } from '../ui/asli-bogor-logo';
import { 
  LayoutDashboard, 
  Store, 
  MapPin, 
  CheckSquare, 
  Users, 
  FileText, 
  AlertCircle, 
  DollarSign, 
  HelpCircle, 
  Settings,
  ShoppingCart,
  Heart,
  Package,
  TrendingUp,
  Wallet,
  Info,
  Navigation,
  User,
  Menu,
  X,
  LogOut,
  Bell,
  BarChart3
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  activeMenu: string;
  onMenuChange: (menu: string) => void;
}

export function DashboardLayout({ children, activeMenu, onMenuChange }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const getMenuItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'analytics', label: 'Analytics Platform', icon: BarChart3 },
          { id: 'persebaran', label: 'Persebaran UMKM', icon: MapPin },
          { id: 'persetujuan', label: 'Manajemen Persetujuan', icon: CheckSquare },
          { id: 'manajemen-data', label: 'Manajemen Data', icon: Users },
          { id: 'manajemen-order', label: 'Manajemen Order', icon: ShoppingCart },
          { id: 'konten', label: 'Manajemen Konten', icon: FileText },
          { id: 'laporan', label: 'Layanan & Laporan', icon: AlertCircle },
          { id: 'keuangan', label: 'Keuangan', icon: DollarSign },
          { id: 'profil', label: 'Profil', icon: User },
          { id: 'notifikasi', label: 'Notifikasi', icon: Bell, badge: unreadCount },
          { id: 'bantuan', label: 'Bantuan', icon: HelpCircle },
          { id: 'pengaturan', label: 'Pengaturan Akun', icon: Settings }
        ];
      case 'user':
        return [
          { id: 'beranda', label: 'Beranda', icon: Store },
          { id: 'keranjang', label: 'Keranjang', icon: ShoppingCart },
          // Menu "Favorit Saya" disembunyikan sementara sesuai requirement
          // { id: 'wishlist', label: 'Favorit Saya', icon: Heart },
          { id: 'pesanan', label: 'Pesanan Saya', icon: Package },
          { id: 'tracking', label: 'Tracking Pesanan', icon: TrendingUp },
          { id: 'dompet', label: 'Dompet Saya', icon: Wallet },
          { id: 'info', label: 'Info', icon: Info },
          { id: 'profil', label: 'Profil', icon: User },
          { id: 'notifikasi', label: 'Notifikasi', icon: Bell, badge: unreadCount },
          { id: 'bantuan', label: 'Bantuan', icon: HelpCircle },
          { id: 'pengaturan', label: 'Pengaturan Akun', icon: Settings }
        ];
      case 'umkm':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'profil-toko', label: 'Profil Toko', icon: Store },
          { id: 'produk', label: 'Data Produk', icon: Package },
          { id: 'pesanan', label: 'Manajemen Pesanan', icon: ShoppingCart },
          { id: 'keuangan', label: 'Keuangan', icon: DollarSign },
          { id: 'info', label: 'Info', icon: Info },
          { id: 'notifikasi', label: 'Notifikasi', icon: Bell, badge: unreadCount },
          { id: 'bantuan', label: 'Bantuan', icon: HelpCircle },
          { id: 'pengaturan', label: 'Pengaturan Akun', icon: Settings }
        ];
      case 'driver':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'order-aktif', label: 'Order Aktif', icon: Package },
          { id: 'peta', label: 'Peta Navigasi', icon: Navigation },
          { id: 'riwayat', label: 'Riwayat Pengiriman', icon: FileText },
          { id: 'keuangan', label: 'Keuangan', icon: DollarSign },
          { id: 'info', label: 'Info', icon: Info },
          { id: 'profil', label: 'Profil', icon: User },
          { id: 'notifikasi', label: 'Notifikasi', icon: Bell, badge: unreadCount },
          { id: 'bantuan', label: 'Bantuan', icon: HelpCircle },
          { id: 'pengaturan', label: 'Pengaturan Akun', icon: Settings }
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <AsliBogorLogo
            variant="logomark"
            className="flex-shrink-0"
          />
          <div>
            <p className="body-3" style={{ color: '#FFFFFF', fontWeight: 600 }}>Asli Bogor</p>
            <p className="body-3" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
              {user.role === 'admin' ? 'Admin' : user.role === 'umkm' ? 'UMKM' : user.role === 'driver' ? 'Driver' : 'Pembeli'}
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#FF8D28] flex items-center justify-center">
            <User size={20} style={{ color: '#FFFFFF' }} />
          </div>
          <div className="flex-1">
            <p className="body-3" style={{ color: '#FFFFFF', fontWeight: 600 }}>{user.name}</p>
            <p className="body-3" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{user.email}</p>
          </div>
        </div>
        {!user.isVerified && (
          <div className="mt-3 p-2 rounded" style={{ backgroundColor: '#FDE08E' }}>
            <p className="body-3" style={{ color: '#2F4858', fontSize: '11px' }}>
              ⏳ Menunggu Verifikasi Admin
            </p>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <nav className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  onMenuChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive ? 'bg-[#FF8D28]' : 'hover:bg-[#3d5866]'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={isActive ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Icon size={20} style={{ color: '#FFFFFF' }} />
                </motion.div>
                <span className="body-3 flex-1 text-left" style={{ color: '#FFFFFF' }}>
                  {item.label}
                </span>
                {item.badge && item.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    <Badge 
                      className="h-5 min-w-[20px] flex items-center justify-center"
                      style={{ 
                        backgroundColor: '#FF6B6B', 
                        color: '#FFFFFF',
                        fontSize: '11px',
                        padding: '0 6px'
                      }}
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start"
          style={{ color: '#FFFFFF' }}
        >
          <LogOut size={20} className="mr-3" />
          Keluar
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Background Effects */}
      <FloatingShapes variant="green" />
      <MountainSilhouette />
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 flex-shrink-0 relative z-10" style={{ backgroundColor: '#2F4858' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 flex flex-col" style={{ backgroundColor: '#2F4858' }}>
            <div className="flex justify-end p-4">
              <button onClick={() => setSidebarOpen(false)}>
                <X size={24} style={{ color: '#FFFFFF' }} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top Bar */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between glass">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu size={24} style={{ color: '#2F4858' }} />
          </button>
          <motion.h3
            className="flex items-center gap-2 text-[#2F4858]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            key={activeMenu}
          >
            <AsliBogorLogo
              variant="logomark"
              className="hidden sm:block h-8 w-8"
            />
            {menuItems.find(item => item.id === activeMenu)?.label || 'Dashboard'}
          </motion.h3>
          <div className="w-6" /> {/* Spacer for centering */}
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: 'rgba(245, 245, 245, 0.95)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key={activeMenu}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

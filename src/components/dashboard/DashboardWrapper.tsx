import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardLayout } from './DashboardLayout';
import { Button } from '../ui/button';

// Admin Components
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminAnalyticsPage } from './admin/AdminAnalyticsPage';
import { PersebaranUMKM } from './admin/PersebaranUMKM';
import { ManajemenData } from './admin/ManajemenData';
import { ManajemenOrder } from './admin/ManajemenOrder';
import { ManajemenKonten } from './admin/ManajemenKonten';

import { LayananLaporan } from './admin/LayananLaporan';
import { AdminKeuangan } from './admin/AdminKeuangan';

// User Components
import { UserBeranda } from './user/UserBeranda';
import { TrackingPesanan } from './user/TrackingPesanan';
import { Keranjang } from './user/Keranjang';
import { RiwayatPesanan } from './user/RiwayatPesanan';
import { WishlistPage } from './user/WishlistPage';
import { DompetPage } from './user/DompetPage';

// UMKM Components
import { UMKMDashboard } from './umkm/UMKMDashboard';
import { ManajemenProduk } from './umkm/ManajemenProduk';
import { ManajemenPesanan } from './umkm/ManajemenPesanan';
import { KeuanganToko } from './umkm/KeuanganToko';
import { UMKMAnalyticsPage } from './umkm/AnalyticsPage';

// Driver Components
import { DriverDashboard } from './driver/DriverDashboard';
import { OrderAktif } from './driver/OrderAktif';
import { PetaNavigasi } from './driver/PetaNavigasi';
import { RiwayatPengiriman } from './driver/RiwayatPengiriman';
import { KeuanganDriver } from './driver/KeuanganDriver';
import { DriverAnalyticsPage } from './driver/DriverAnalyticsPage';

// Common Components
import { ProfilePage } from './ProfilePage';
import { NotificationPage } from './NotificationPage';
import { SettingsPage } from './SettingsPage';
import { HelpPage } from './HelpPage';
import { ComingSoonPage } from './ComingSoonPage';
import { InfoPage } from './InfoPage';

// Pages
import { GamePage } from '../../pages/Game';

// Placeholder Components
import { Card, CardContent } from '../ui/card';

function PlaceholderPage({ title }: { title: string }) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <h3 style={{ color: '#2F4858' }} className="mb-4">{title}</h3>
        <p style={{ color: '#858585' }}>
          Halaman ini sedang dalam pengembangan
        </p>
      </CardContent>
    </Card>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Card>
          <CardContent className="p-12 text-center">
            <h3 style={{ color: '#D32F2F' }} className="mb-4">Terjadi Kesalahan</h3>
            <p style={{ color: '#858585' }} className="mb-4">
              {this.state.error?.message || 'Terjadi kesalahan saat memuat halaman'}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
            >
              Muat Ulang Halaman
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export function DashboardWrapper() {
  const { user, refreshUser } = useAuth();
  const [activeMenu, setActiveMenu] = useState(() => {
    // Set default menu based on role
    switch (user?.role) {
      case 'admin':
        return 'dashboard';
      case 'user':
        return 'beranda';
      case 'umkm':
        return 'dashboard';
      case 'driver':
        return 'dashboard';
      default:
        return 'dashboard';
    }
  });

  if (!user) return null;

  // Refresh user data when dashboard opens
  useEffect(() => {
    if (user && user.role !== 'admin') {
      refreshUser();
    }
  }, []); // Run once on mount

  const renderContent = () => {
    // Admin Pages
    if (user.role === 'admin') {
      switch (activeMenu) {
        case 'dashboard':
          return <AdminDashboard />;
        case 'analytics':
          return <AdminAnalyticsPage />;
        case 'persebaran':
          return <PersebaranUMKM />;
        case 'manajemen-data':
          return (
            <ErrorBoundary>
              <ManajemenData />
            </ErrorBoundary>
          );
        case 'manajemen-order':
          return <ManajemenOrder />;
        case 'konten':
          return <ManajemenKonten isReadOnly={false} />;
        case 'laporan':
          return <LayananLaporan />;
        case 'keuangan':
          return <AdminKeuangan />;
        case 'profil':
          return <ProfilePage />;
        case 'notifikasi':
          return <NotificationPage />;
        case 'bantuan':
          return <HelpPage />;
        case 'pengaturan':
          return <SettingsPage />;
        default:
          return <AdminDashboard />;
      }
    }

    // User Pages
    if (user.role === 'user') {
      switch (activeMenu) {
        case 'beranda':
          return <UserBeranda />;
        case 'keranjang':
          return <Keranjang />;
        case 'wishlist':
          return <WishlistPage />;
        case 'pesanan':
          return <RiwayatPesanan />;
        case 'tracking':
          return <TrackingPesanan />;
        case 'dompet':
          return <DompetPage />;
        case 'game':
          return <GamePage />;
        case 'konten':
          return <InfoPage />;
        case 'profil':
          return <ProfilePage />;
        case 'notifikasi':
          return <NotificationPage />;
        case 'bantuan':
          return <HelpPage />;
        case 'pengaturan':
          return <SettingsPage />;
        default:
          return <UserBeranda />;
      }
    }

    // UMKM Pages
    if (user.role === 'umkm') {
      switch (activeMenu) {
        case 'dashboard':
          return <UMKMDashboard />;
        case 'analytics':
          return <UMKMAnalyticsPage />;
        case 'profil-toko':
          return <ProfilePage />;
        case 'produk':
          return <ManajemenProduk />;
        case 'pesanan':
          return <ManajemenPesanan />;
        case 'keuangan':
          return <KeuanganToko />;
        case 'konten':
          return <ManajemenKonten isReadOnly={true} />;
        case 'notifikasi':
          return <NotificationPage />;
        case 'bantuan':
          return <HelpPage />;
        case 'pengaturan':
          return <SettingsPage />;
        default:
          return <UMKMDashboard />;
      }
    }

    // Driver Pages
    if (user.role === 'driver') {
      switch (activeMenu) {
        case 'dashboard':
          return <DriverDashboard />;
        case 'analytics':
          return <DriverAnalyticsPage />;
        case 'order-aktif':
          return <OrderAktif />;
        case 'peta':
          return <PetaNavigasi />;
        case 'riwayat':
          return <RiwayatPengiriman />;
        case 'keuangan':
          return <KeuanganDriver />;
        case 'konten':
          return <ManajemenKonten isReadOnly={true} />;
        case 'profil':
          return <ProfilePage />;
        case 'notifikasi':
          return <NotificationPage />;
        case 'bantuan':
          return <HelpPage />;
        case 'pengaturan':
          return <SettingsPage />;
        default:
          return <DriverDashboard />;
      }
    }

    return <PlaceholderPage title="Dashboard" />;
  };

  return (
    <DashboardLayout activeMenu={activeMenu} onMenuChange={setActiveMenu}>
      {renderContent()}
    </DashboardLayout>
  );
}

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { MapPin, Navigation, Package, User, Loader2 } from 'lucide-react';
import { useOrderContext } from '../../../contexts/OrderContext';
import { useAuth } from '../../../contexts/AuthContext';
import { TrackingMap } from '../user/TrackingMap';

export function PetaNavigasi() {
  const { user } = useAuth();
  const { orders, refreshOrders } = useOrderContext();
  const [activeOrder, setActiveOrder] = useState<any>(null);

  useEffect(() => {
    // Find active delivery order for this driver
    const active = orders.find(order => 
      order.driverId === user?.id && 
      (order.status === 'pickup' || order.status === 'delivered')
    );
    setActiveOrder(active);
  }, [orders, user]);

  if (!activeOrder) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin size={48} style={{ color: '#CCCCCC', margin: '0 auto' }} />
            <p style={{ color: '#858585' }} className="mt-4">
              Belum ada pengantaran aktif. Terima order untuk melihat peta navigasi.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Delivery Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle style={{ color: '#2F4858' }}>Pengantaran Aktif</CardTitle>
            <Badge style={{ backgroundColor: '#C8E6C9', color: '#2E7D32' }}>
              Dalam Perjalanan
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
              <p className="body-3" style={{ color: '#858585', marginBottom: '4px' }}>Order</p>
              <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                #{activeOrder.id.slice(-6).toUpperCase()}
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
              <p className="body-3" style={{ color: '#858585', marginBottom: '4px' }}>Pelanggan</p>
              <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                {activeOrder.userName}
              </p>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
              <p className="body-3" style={{ color: '#858585', marginBottom: '4px' }}>Upah</p>
              <p className="body-3" style={{ color: '#4CAF50', fontWeight: 600 }}>
                Rp {activeOrder.deliveryFee.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: '#E3F2FD' }}>
            <div className="flex items-start gap-3">
              <MapPin size={20} style={{ color: '#1976D2' }} />
              <div>
                <p className="body-3" style={{ color: '#1976D2', fontWeight: 600, marginBottom: '4px' }}>
                  Tujuan Pengantaran
                </p>
                <p className="body-3" style={{ color: '#2F4858' }}>{activeOrder.userName}</p>
                <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                  {activeOrder.deliveryAddress}
                </p>
              </div>
            </div>
          </div>

          <Button 
            className="w-full" 
            style={{ backgroundColor: '#2196F3', color: '#FFFFFF' }}
            onClick={() => {
              const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeOrder.deliveryAddress)}`;
              window.open(mapsUrl, '_blank');
            }}
          >
            <Navigation size={20} className="mr-2" />
            Buka Google Maps
          </Button>
        </CardContent>
      </Card>

      {/* Map Container */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#2F4858' }}>Peta Navigasi Real-Time</CardTitle>
        </CardHeader>
        <CardContent>
          <TrackingMap
            orderId={activeOrder.id}
            storeAddress={activeOrder.storeAddress}
            deliveryAddress={activeOrder.deliveryAddress}
            driverLocation={activeOrder.driverLocation}
            status={activeOrder.status}
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Button variant="outline" className="h-auto p-4">
          <div className="text-center w-full">
            <User size={24} style={{ color: '#2196F3', margin: '0 auto 8px' }} />
            <p className="body-3" style={{ color: '#2F4858' }}>Hubungi Pelanggan</p>
          </div>
        </Button>
        <Button variant="outline" className="h-auto p-4">
          <div className="text-center w-full">
            <Package size={24} style={{ color: '#FF8D28', margin: '0 auto 8px' }} />
            <p className="body-3" style={{ color: '#2F4858' }}>Detail Pesanan</p>
          </div>
        </Button>
        <Button variant="outline" className="h-auto p-4">
          <div className="text-center w-full">
            <Navigation size={24} style={{ color: '#4CAF50', margin: '0 auto 8px' }} />
            <p className="body-3" style={{ color: '#2F4858' }}>Update Lokasi</p>
          </div>
        </Button>
      </div>

      {/* Delivery Tips */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#2F4858' }}>Tips Pengantaran</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4CAF50' }}>
                <span className="body-3" style={{ color: '#FFFFFF', fontSize: '12px' }}>✓</span>
              </div>
              <p className="body-3" style={{ color: '#4A4A4A' }}>
                Pastikan pesanan dalam kondisi baik sebelum diantar
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4CAF50' }}>
                <span className="body-3" style={{ color: '#FFFFFF', fontSize: '12px' }}>✓</span>
              </div>
              <p className="body-3" style={{ color: '#4A4A4A' }}>
                Hubungi pelanggan jika kesulitan menemukan alamat
              </p>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#4CAF50' }}>
                <span className="body-3" style={{ color: '#FFFFFF', fontSize: '12px' }}>✓</span>
              </div>
              <p className="body-3" style={{ color: '#4A4A4A' }}>
                Update status pengiriman secara berkala
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useMemo, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Package, MapPin, Check, Bike, Store, Clock } from 'lucide-react';
import { useOrders } from '../../../contexts/OrderContext';
import type { OrderStatus } from '../../../contexts/OrderContext';
import { TrackingMap } from './TrackingMap';
import { api } from '../../../config/api';

export function TrackingPesanan() {
  const orders = useOrders();
  const [orderLocations, setOrderLocations] = useState<Record<string, { lat: number; lng: number; updatedAt: string }>>({});

  // Fetch driver locations for active orders
  useEffect(() => {
    const fetchDriverLocations = async () => {
      const activeOrders = orders.filter(order => 
        (order.status === 'pickup' || order.status === 'delivered') && order.driverId
      );

      for (const order of activeOrders) {
        try {
          const response = await fetch(api.orders.getById(order.id));
          if (response.ok) {
            const data = await response.json();
            if (data.data?.driverLocation) {
              setOrderLocations(prev => ({
                ...prev,
                [order.id]: data.data.driverLocation
              }));
            }
          }
        } catch (error) {
          console.error(`Error fetching location for order ${order.id}:`, error);
        }
      }
    };

    fetchDriverLocations();
    
    // Refresh locations every 3 seconds for active deliveries
    const interval = setInterval(fetchDriverLocations, 3000);
    return () => clearInterval(interval);
  }, [orders]);

  // Map order status ke tracking status
  const mapOrderStatus = (status: OrderStatus): 'preparing' | 'pickup' | 'delivering' | 'delivered' => {
    if (status === 'preparing') return 'preparing';
    if (status === 'ready') return 'preparing'; // ready masih di toko
    if (status === 'pickup') return 'delivering'; // pickup berarti sedang diantar
    if (status === 'delivered' || status === 'completed') return 'delivered';
    return 'preparing';
  };

  // Format timeline dari order
  const getTimeline = (order: any) => {
    const timeline: any = {};
    if (order.createdAt) {
      timeline.preparing = new Date(order.createdAt).toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    if (order.pickupTime) {
      timeline.pickup = new Date(order.pickupTime).toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    if (order.status === 'pickup' && order.pickupTime) {
      timeline.delivering = new Date(order.pickupTime).toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    if (order.deliveredAt || order.status === 'delivered' || order.status === 'completed') {
      timeline.delivered = order.deliveredAt 
        ? new Date(order.deliveredAt).toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        : new Date(order.updatedAt || order.createdAt).toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
    }
    return timeline;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'Sedang Disiapkan';
      case 'pickup':
        return 'Driver Menuju Toko';
      case 'delivering':
        return 'Dalam Pengiriman';
      case 'delivered':
        return 'Terkirim';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing':
        return '#FDE08E';
      case 'pickup':
      case 'delivering':
        return '#B3E5FC';
      case 'delivered':
        return '#C8E6C9';
      default:
        return '#E0E0E0';
    }
  };

  const TrackingTimeline = ({ order }: { order: Order }) => {
    const steps = [
      { key: 'preparing', label: 'Sedang Disiapkan', icon: Store, time: order.timeline.preparing },
      { key: 'pickup', label: 'Driver Ambil Pesanan', icon: MapPin, time: order.timeline.pickup },
      { key: 'delivering', label: 'Dalam Perjalanan', icon: Bike, time: order.timeline.delivering },
      { key: 'delivered', label: 'Pesanan Diterima', icon: Package, time: order.timeline.delivered }
    ];

    const statusIndex = steps.findIndex(step => step.key === order.status);

    return (
      <div className="space-y-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= statusIndex;
          const isCurrent = index === statusIndex;

          return (
            <div key={step.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-[#FF8D28]' : 'bg-gray-200'
                  }`}
                >
                  {isCompleted ? (
                    isCurrent && order.status !== 'delivered' ? (
                      <Icon size={24} style={{ color: '#FFFFFF' }} />
                    ) : (
                      <Check size={24} style={{ color: '#FFFFFF' }} />
                    )
                  ) : (
                    <Icon size={24} style={{ color: '#858585' }} />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-0.5 h-16 ${
                      isCompleted ? 'bg-[#FF8D28]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 pb-8">
                <h4
                  style={{ color: isCompleted ? '#2F4858' : '#858585' }}
                  className="mb-1"
                >
                  {step.label}
                </h4>
                {step.time && (
                  <p className="body-3" style={{ color: '#858585' }}>
                    {step.time}
                  </p>
                )}
                {isCurrent && order.driver && (
                  <div className="mt-2 p-3 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                    <p className="body-3" style={{ color: '#2F4858' }}>
                      Driver: {order.driver}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Transform orders untuk tracking view
  const trackingOrders = useMemo(() => {
    return orders
      .filter(order => order.status !== 'completed') // Hanya tampilkan yang belum completed
      .map(order => ({
        id: order.id,
        orderNumber: order.id,
        items: order.items.map(item => `${item.name} (${item.quantity}x)`),
        store: order.storeName,
        storeAddress: order.storeAddress,
        driver: order.driverName || undefined,
        status: mapOrderStatus(order.status),
        timeline: getTimeline(order),
        address: order.deliveryAddress,
        driverLocation: orderLocations[order.id] || null
      }))
      .sort((a, b) => {
        // Sort by newest first
        const orderA = orders.find(o => o.id === a.id);
        const orderB = orders.find(o => o.id === b.id);
        if (!orderA || !orderB) return 0;
        return new Date(orderB.createdAt).getTime() - new Date(orderA.createdAt).getTime();
      });
  }, [orders, orderLocations]);

  return (
    <div className="space-y-6">
      {trackingOrders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package size={48} style={{ color: '#CCCCCC', margin: '0 auto' }} />
            <p style={{ color: '#858585' }} className="mt-4">
              Belum ada pesanan aktif untuk dilacak
            </p>
          </CardContent>
        </Card>
      ) : (
        trackingOrders.map(order => (
          <Card key={order.id}>
            <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle style={{ color: '#2F4858' }}>
                  {order.orderNumber}
                </CardTitle>
                <p className="body-3 mt-1" style={{ color: '#858585' }}>
                  {order.store}
                </p>
              </div>
              <Badge style={{ backgroundColor: getStatusColor(order.status), color: '#2F4858' }}>
                {getStatusText(order.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left: Timeline */}
              <div>
                <h4 style={{ color: '#2F4858' }} className="mb-4">
                  Status Pengiriman
                </h4>
                <TrackingTimeline order={order} />
              </div>

              {/* Right: Map & Details */}
              <div className="space-y-6">
                <div>
                  <h4 style={{ color: '#2F4858' }} className="mb-4">
                    Peta Pengiriman Real-Time
                  </h4>
                  {order.status === 'delivering' || order.status === 'pickup' ? (
                    <TrackingMap
                      orderId={order.id}
                      storeAddress={order.storeAddress || 'Bogor, Jawa Barat'}
                      deliveryAddress={order.address}
                      driverLocation={order.driverLocation}
                      status={order.status}
                    />
                  ) : (
                    <div 
                      className="w-full h-64 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#F5F5F5' }}
                    >
                      <p className="body-3" style={{ color: '#858585' }}>
                        Peta akan aktif saat driver mengambil pesanan
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 style={{ color: '#2F4858' }} className="mb-3">
                    Detail Pesanan
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                      <p className="body-3" style={{ color: '#858585', marginBottom: '4px' }}>
                        Item Pesanan
                      </p>
                      {order.items.map((item, idx) => (
                        <p key={idx} className="body-3" style={{ color: '#2F4858' }}>
                          • {item}
                        </p>
                      ))}
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                      <p className="body-3" style={{ color: '#858585', marginBottom: '4px' }}>
                        Alamat Pengiriman
                      </p>
                      <p className="body-3" style={{ color: '#2F4858' }}>
                        {order.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { MapPin, Package, Clock, Navigation, Phone } from "lucide-react";
import { toast } from "sonner";
import { useOrderContext } from "../../../contexts/OrderContext";
import { useAuth } from "../../../contexts/AuthContext";
import { api } from "../../../config/api";

export function OrderAktif() {
  const { user } = useAuth();
  const { orders, updateOrderStatus, refreshOrders } = useOrderContext();

  const availableOrders = useMemo(
    () => orders.filter((order) => order.status === "ready" || order.status === "pickup"),
    [orders]
  );

  const newOrders = availableOrders.filter((order) => order.status === "ready");
  const inProgressOrders = availableOrders.filter((order) => order.status === "pickup");
  const totalEarnings = availableOrders.reduce((sum, order) => sum + order.deliveryFee, 0);

  const newOrderIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    const currentIds = new Set(newOrders.map((order) => order.id));
    if (!initializedRef.current) {
      newOrderIdsRef.current = currentIds;
      initializedRef.current = true;
      return;
    }
    newOrders.forEach((order) => {
      if (!newOrderIdsRef.current.has(order.id)) {
        toast.info(`Order baru siap diambil di ${order.storeName}`);
      }
    });
    newOrderIdsRef.current = currentIds;
  }, [newOrders]);

  const handleAcceptOrder = async (orderId: string) => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }

    try {
      await updateOrderStatus(orderId, "pickup", {
        driverId: user.id,
        driverName: user.name,
        pickupTime: new Date().toISOString(),
      });
      toast.success("Order diterima! Segera menuju lokasi penjemputan.");
      
      // Start location tracking for this order
      startLocationTracking(orderId);
      
      // Refresh orders untuk mendapatkan data terbaru
      await refreshOrders();
    } catch (error: any) {
      toast.error(error.message || 'Gagal menerima order');
    }
  };

  // Simulate driver location updates
  const startLocationTracking = async (orderId: string) => {
    if (!user) return;

    // Wait a bit for order to be updated in context
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Refresh orders to get latest data
    await refreshOrders();
    
    // Get order from all orders (might not be in availableOrders yet)
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      console.error('Order not found:', orderId);
      return;
    }

    // Helper function to geocode address to coordinates
    const geocodeAddress = (address: string): { lat: number; lng: number } => {
      if (address.includes('Suryakencana')) {
        return { lat: -6.5950, lng: 106.8000 };
      }
      if (address.includes('Pajajaran')) {
        return { lat: -6.6000, lng: 106.8100 };
      }
      return { lat: -6.5978, lng: 106.8067 }; // Default Bogor
    };

    const storeCoords = geocodeAddress(order.storeAddress);
    const deliveryCoords = geocodeAddress(order.deliveryAddress);

    let progress = 0;
    const duration = 60000; // 60 seconds for full journey (more realistic)
    const startTime = Date.now();

    const updateLocation = async () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(1, elapsed / duration);

      // Calculate current location using linear interpolation
      const currentLat = storeCoords.lat + (deliveryCoords.lat - storeCoords.lat) * progress;
      const currentLng = storeCoords.lng + (deliveryCoords.lng - storeCoords.lng) * progress;

      // Update location via API
      try {
        const response = await fetch(api.orders.updateDriverLocation(orderId), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lat: currentLat,
            lng: currentLng,
            driverId: user.id,
          }),
        });

        if (!response.ok) {
          console.error('Failed to update driver location');
        }
      } catch (error) {
        console.error('Error updating driver location:', error);
      }

      // Continue updating until journey is complete
      if (progress < 1) {
        setTimeout(updateLocation, 3000); // Update every 3 seconds
      }
    };

    // Start tracking after a short delay
    setTimeout(updateLocation, 1000);
  };

  const handleCompleteOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "delivered");
      toast.success("Pesanan berhasil diantar! Upah telah ditambahkan ke dompet Anda.");
      // Refresh orders untuk mendapatkan data terbaru
      await refreshOrders();
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyelesaikan order');
    }
  };

  const getStatusBadge = (status: "ready" | "pickup") => {
    const styles = {
      ready: { bg: "#FDE08E", color: "#F57C00", label: "Order Baru" },
      pickup: { bg: "#B3E5FC", color: "#1976D2", label: "Sedang Diantar" },
    } as const;
    const style = styles[status];
    return (
      <Badge style={{ backgroundColor: style.bg, color: style.color }}>
        {style.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="body-3" style={{ color: "#858585" }}>Order Baru</p>
            <h3 style={{ color: "#FF8D28" }}>{newOrders.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="body-3" style={{ color: "#858585" }}>Dalam Proses</p>
            <h3 style={{ color: "#2196F3" }}>{inProgressOrders.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="body-3" style={{ color: "#858585" }}>Estimasi Penghasilan</p>
            <h3 style={{ color: "#4CAF50" }}>
              Rp {totalEarnings.toLocaleString("id-ID")}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {availableOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 style={{ color: "#2F4858" }} className="mb-1">
                    #{order.id.slice(-6).toUpperCase()}
                  </h4>
                  <p className="body-3" style={{ color: "#858585" }}>
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} item • {order.storeName}
                  </p>
                </div>
                {getStatusBadge(order.status as "ready" | "pickup")}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {/* Pickup Location */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#F5F5F5" }}>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#FF8D28" }}>
                      <Package size={16} style={{ color: "#FFFFFF" }} />
                    </div>
                    <div className="flex-1">
                      <p className="body-3" style={{ color: "#858585", marginBottom: "4px" }}>Ambil di</p>
                      <p className="body-3" style={{ color: "#2F4858", fontWeight: 600 }}>{order.storeName}</p>
                      <p className="body-3" style={{ color: "#858585", fontSize: "12px" }}>{order.storeAddress}</p>
                    </div>
                  </div>
                  {order.pickupTime && (
                    <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: "#E0E0E0" }}>
                      <Clock size={14} style={{ color: "#858585" }} />
                      <p className="body-3" style={{ color: "#858585", fontSize: "12px" }}>
                        Dijemput: {order.pickupTime}
                      </p>
                    </div>
                  )}
                </div>

                {/* Delivery Location */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: "#F5F5F5" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "#4CAF50" }}>
                      <MapPin size={16} style={{ color: "#FFFFFF" }} />
                    </div>
                    <div className="flex-1">
                      <p className="body-3" style={{ color: "#858585", marginBottom: "4px" }}>Antar ke</p>
                      <p className="body-3" style={{ color: "#2F4858", fontWeight: 600 }}>{order.userName}</p>
                      <p className="body-3" style={{ color: "#858585", fontSize: "12px" }}>{order.deliveryAddress}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full"
                    style={{ color: "#2196F3" }}
                  >
                    <Phone size={14} className="mr-1" />
                    Hubungi Pelanggan
                  </Button>
                </div>
              </div>

              {/* Fee and Actions */}
              <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "#E0E0E0" }}>
                <div>
                  <p className="body-3" style={{ color: "#858585" }}>Upah Pengantaran</p>
                  <h4 style={{ color: "#4CAF50" }}>
                    Rp {order.deliveryFee.toLocaleString("id-ID")}
                  </h4>
                </div>
                <div className="flex gap-2">
                  {order.status === "ready" && (
                    <Button
                      style={{ backgroundColor: "#FF8D28", color: "#FFFFFF" }}
                      onClick={() => handleAcceptOrder(order.id)}
                    >
                      Terima Order
                    </Button>
                  )}
                  {order.status === "pickup" && (
                    <Button
                      style={{ backgroundColor: "#4CAF50", color: "#FFFFFF" }}
                      onClick={() => handleCompleteOrder(order.id)}
                    >
                      Selesaikan Pengantaran
                    </Button>
                  )}
                  {(order.status === "ready" || order.status === "pickup") && (
                    <Button variant="outline">
                      <Navigation size={16} className="mr-2" />
                      Buka Navigasi
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {availableOrders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package size={48} style={{ color: "#CCCCCC", margin: "0 auto" }} />
            <p style={{ color: "#858585" }} className="mt-4">
              Belum ada order aktif. Tunggu notifikasi order baru!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

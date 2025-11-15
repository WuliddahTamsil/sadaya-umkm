import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Package, User, MapPin, Clock, Phone, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import type { Order, OrderStatus } from "../../../contexts/OrderContext";
import { useOrderContext } from "../../../contexts/OrderContext";
import { useAuth } from "../../../contexts/AuthContext";
import { api } from "../../../config/api";

export function ManajemenPesanan() {
  const { user } = useAuth();
  const { orders, updateOrderStatus, refreshOrders, isLoading } = useOrderContext();
  
  // Filter orders untuk UMKM yang sedang login
  const umkmOrders = useMemo(
    () => orders.filter((order) => order.umkmId === user?.id),
    [orders, user?.id]
  );

  const newOrderIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    const currentIds = new Set(umkmOrders.map((order) => order.id));
    if (!initializedRef.current) {
      newOrderIdsRef.current = currentIds;
      initializedRef.current = true;
      return;
    }
    umkmOrders.forEach((order) => {
      if (!newOrderIdsRef.current.has(order.id) && order.status === "preparing") {
        toast.success(`Pesanan baru dari ${order.userName}`);
      }
    });
    newOrderIdsRef.current = currentIds;
  }, [umkmOrders]);

  const statusMessages: Record<OrderStatus, string> = {
    preparing: "Pesanan sedang disiapkan",
    ready: "Pesanan siap! Driver segera diberi tahu.",
    pickup: "Driver dalam perjalanan ke toko",
    delivered: "Pesanan selesai diantar",
  };

  const getStatusInfo = (status: OrderStatus) => {
    const statusConfig: Record<OrderStatus, { label: string; color: string; textColor: string }> = {
      preparing: { label: "Sedang Disiapkan", color: "#B3E5FC", textColor: "#1976D2" },
      ready: { label: "Menunggu Driver", color: "#FDE08E", textColor: "#F57C00" },
      pickup: { label: "Sedang Diantar", color: "#C8E6C9", textColor: "#2E7D32" },
      delivered: { label: "Selesai", color: "#C8E6C9", textColor: "#2E7D32" },
    };
    return statusConfig[status];
  };

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    if (!user) return;
    
    try {
      // Use tracking endpoint for UMKM to update order status
      const response = await fetch(api.orders.updateTracking(orderId), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: nextStatus,
          umkmId: user.id,
          trackingNumber: nextStatus === 'ready' ? `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}` : undefined
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal update status pesanan');
      }

      toast.success(statusMessages[nextStatus]);
      // Refresh orders untuk mendapatkan data terbaru
      await refreshOrders();
    } catch (error: any) {
      toast.error(error.message || 'Gagal update status pesanan');
    }
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const statusInfo = getStatusInfo(order.status);
    const itemsTotal = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const createdAt = new Date(order.createdAt).toLocaleString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 style={{ color: "#2F4858" }} className="mb-1">
                #{order.id.slice(-6).toUpperCase()}
              </h4>
              <div className="flex items-center gap-2">
                <Clock size={14} style={{ color: "#858585" }} />
                <p className="body-3" style={{ color: "#858585" }}>
                  {createdAt}
                </p>
              </div>
            </div>
            <Badge style={{ backgroundColor: statusInfo.color, color: statusInfo.textColor }}>
              {statusInfo.label}
            </Badge>
          </div>

          {/* Customer Info */}
          <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: "#F5F5F5" }}>
            <div className="flex items-start gap-3 mb-3">
              <User size={20} style={{ color: "#2F4858" }} />
              <div className="flex-1">
                <p className="body-3" style={{ color: "#2F4858", fontWeight: 600 }}>
                  {order.userName}
                </p>
                <p className="body-3" style={{ color: "#858585", fontSize: "12px" }}>
                  {order.paymentMethod?.toUpperCase() || 'Belum dibayar'} • {order.items.length} menu
                </p>
                {order.paymentStatus === 'paid' && (
                  <Badge style={{ backgroundColor: '#D4EDDA', color: '#155724', marginTop: '4px', fontSize: '10px' }}>
                    Sudah Dibayar
                  </Badge>
                )}
                {order.paymentStatus === 'pending' && (
                  <Badge style={{ backgroundColor: '#FFF3CD', color: '#856404', marginTop: '4px', fontSize: '10px' }}>
                    Menunggu Pembayaran
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" style={{ color: "#2196F3" }}>
                <Phone size={16} />
              </Button>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={20} style={{ color: "#FF8D28" }} />
              <p className="body-3" style={{ color: "#858585" }}>
                {order.deliveryAddress}
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <p className="body-3 mb-2" style={{ color: "#858585" }}>
              Pesanan ({itemsTotal} item)
            </p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={`${order.id}-${item.id}`} className="flex justify-between">
                  <p className="body-3" style={{ color: "#2F4858" }}>
                    {item.quantity}x {item.name}
                  </p>
                  <p className="body-3" style={{ color: "#858585" }}>
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t">
              <p style={{ color: "#2F4858", fontWeight: 600 }}>Total</p>
              <h4 style={{ color: "#FF8D28" }}>Rp {order.total.toLocaleString("id-ID")}</h4>
            </div>
          </div>

          {/* Driver Info */}
          {order.driverName && (
            <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: "#E3F2FD" }}>
              <p className="body-3" style={{ color: "#1976D2", fontWeight: 600 }}>
                Driver: {order.driverName}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {order.status === "preparing" && (
              <Button
                className="flex-1"
                style={{ backgroundColor: "#4CAF50", color: "#FFFFFF" }}
                onClick={() => handleStatusChange(order.id, "ready")}
              >
                <CheckCircle size={16} className="mr-2" />
                Pesanan Siap
              </Button>
            )}
            {order.status === "ready" && (
              <Button className="flex-1" style={{ backgroundColor: "#FF8D28", color: "#FFFFFF" }} disabled>
                Menunggu Driver
              </Button>
            )}
            {order.status === "pickup" && (
              <Button className="flex-1" variant="outline" disabled>
                Pesanan Dalam Pengiriman
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const newOrders = umkmOrders.filter((o) => o.status === "preparing");
  const processingOrders = umkmOrders.filter((o) => ["ready", "pickup"].includes(o.status));
  const completedOrders = umkmOrders.filter((o) => o.status === "delivered" || o.status === "completed");

  return (
    <div>
      {isLoading && (
        <div className="text-center py-8">
          <p style={{ color: '#858585' }}>Memuat data pesanan...</p>
        </div>
      )}
      {!isLoading && (
        <>
          <h3 className="mb-4" style={{ color: "#2F4858" }}>
            Manajemen Pesanan
          </h3>
      <Tabs defaultValue="new" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="new">Pesanan Baru ({newOrders.length})</TabsTrigger>
          <TabsTrigger value="processing">Diproses ({processingOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Selesai ({completedOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4">
          {newOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package size={48} style={{ color: "#CCCCCC", margin: "0 auto" }} />
                <p style={{ color: "#858585" }} className="mt-4">
                  Tidak ada pesanan baru
                </p>
              </CardContent>
            </Card>
          ) : (
            newOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          {processingOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p style={{ color: "#858585" }}>Tidak ada pesanan yang sedang diproses</p>
              </CardContent>
            </Card>
          ) : (
            processingOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p style={{ color: "#858585" }}>Belum ada pesanan selesai</p>
              </CardContent>
            </Card>
          ) : (
            completedOrders.map((order) => <OrderCard key={order.id} order={order} />)
          )}
        </TabsContent>
      </Tabs>
        </>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Checkbox } from '../../ui/checkbox';
import { Trash, Plus, Minus, ShoppingBag, Bike, CheckCircle2, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog';
import type { OrderStatus } from '../../../contexts/OrderContext';
import { useOrderById, useOrderContext } from '../../../contexts/OrderContext';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../config/api';

interface CartItem {
  id: string;
  id_user: string;
  id_produk: string;
  jumlah: number;
  harga_saat_ini: number;
  tanggal_ditambahkan: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image: string;
    umkmName: string;
    umkmId: string;
    stock: number;
  };
  selected: boolean;
}

export function Keranjang() {
  const { user } = useAuth();
  const { createOrder } = useOrderContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role === 'user') {
      fetchCart();
      fetchWalletBalance();
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(api.cart.getByUser(user.id));
      if (!response.ok) {
        throw new Error('Gagal mengambil data keranjang');
      }
      const data = await response.json();
      // Map API response to CartItem interface with selected default true
      const mappedItems: CartItem[] = data.map((item: any) => ({
        ...item,
        selected: true
      }));
      setCartItems(mappedItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Gagal memuat keranjang');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string, delta: number) => {
    if (!user) return;
    
    const item = cartItems.find(i => i.id === id);
    if (!item) return;
    
    const newQuantity = Math.max(1, item.jumlah + delta);
    
    // Validasi stok
    if (item.product && newQuantity > item.product.stock) {
      toast.error(`Stok produk hanya tersedia ${item.product.stock} unit`);
      return;
    }
    
    try {
      setUpdatingItem(id);
      const response = await fetch(api.cart.update(id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: newQuantity,
          userId: user.id
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal memperbarui jumlah');
      }

      // Update local state
      setCartItems(items =>
        items.map(i => i.id === id ? { ...i, jumlah: newQuantity } : i)
      );
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      toast.error(error.message || 'Gagal memperbarui jumlah');
    } finally {
      setUpdatingItem(null);
    }
  };

  const toggleSelect = (id: string) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleSelectAll = () => {
    const allSelected = cartItems.every(item => item.selected);
    setCartItems(items =>
      items.map(item => ({ ...item, selected: !allSelected }))
    );
  };

  const removeItem = async (id: string) => {
    if (!user) return;
    
    try {
      const response = await fetch(api.cart.delete(id), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus item');
      }

      setCartItems(items => items.filter(item => item.id !== id));
      toast.success('Item dihapus dari keranjang');
      // Refresh cart to ensure consistency
      await fetchCart();
    } catch (error: any) {
      console.error('Error removing item:', error);
      toast.error(error.message || 'Gagal menghapus item');
    }
  };

  const selectedItems = cartItems.filter(item => item.selected && item.product);
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.harga_saat_ini * item.jumlah), 0);
  const shippingFee = selectedItems.length > 0 ? 10000 : 0;
  const total = subtotal + shippingFee;

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'dana' | 'gopay' | 'ovo' | 'qris' | 'transfer' | 'cod'>('wallet');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoadingWallet, setIsLoadingWallet] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const fetchWalletBalance = async () => {
    if (!user) return;
    
    try {
      setIsLoadingWallet(true);
      const response = await fetch(api.wallet.getByUser(user.id));
      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.data?.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    } finally {
      setIsLoadingWallet(false);
    }
  };
  const [deliveryStep, setDeliveryStep] = useState<0 | 1 | 2 | 3>(0);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const deliveryStages = [
    'Disiapkan di toko',
    'Diambil kurir',
    'Kurir hampir tiba',
    'Pesanan selesai',
  ];
  const deliveryProgress = Math.min((deliveryStep / 3) * 100, 100);
  const indicatorLeft = `${deliveryProgress}%`;
  const trackedOrder = useOrderById(trackingOrderId);
  const statusToStep: Record<OrderStatus, 0 | 1 | 2 | 3> = useMemo(
    () => ({
      preparing: 0,
      ready: 1,
      pickup: 2,
      delivered: 3,
    }),
    []
  );

  useEffect(() => {
    if (!trackedOrder) return;
    setDeliveryStep(statusToStep[trackedOrder.status] ?? 0);
    if (trackedOrder.status === 'delivered') {
      toast.success(`Pesanan #${trackedOrder.id.slice(-5)} sudah selesai diantar!`);
    }
  }, [trackedOrder, statusToStep]);

  const storeAddressMap = useMemo(
    () => ({
      'Tahu Gejrot Pak Haji': 'Jl. Suryakencana No. 123, Bogor',
      'Es Pala Pak Sahak': 'Jl. Pajajaran No. 78, Bogor',
    }),
    []
  );

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      toast.error('Pilih item yang ingin dibeli');
      return;
    }
    
    // Fetch wallet balance before checkout
    if (user) {
      await fetchWalletBalance();
    }
    
    setIsCheckoutOpen(true);
  };

  const proceedToPayment = async () => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }

    // Check wallet balance if using wallet payment
    if (paymentMethod === 'wallet' && walletBalance < total) {
      toast.error('Saldo tidak mencukupi. Silakan top up terlebih dahulu.');
      return;
    }

    setIsProcessingPayment(true);
    
    try {
      const groupedByStore = selectedItems.reduce<Record<string, CartItem[]>>((acc, item) => {
        const storeName = item.product?.umkmName || 'Unknown Store';
        if (!acc[storeName]) {
          acc[storeName] = [];
        }
        acc[storeName].push(item);
        return acc;
      }, {});

      const groupCount = Object.keys(groupedByStore).length || 1;
      const perGroupShipping = shippingFee / groupCount;

      // Buat orders untuk setiap store
      const orderPromises = Object.entries(groupedByStore).map(async ([storeName, items]) => {
        const itemsTotal = items.reduce((sum, item) => sum + item.harga_saat_ini * item.jumlah, 0);
        const orderTotal = itemsTotal + perGroupShipping;
        
        // Ambil UMKM ID dari product
        const umkmId = items[0]?.product?.umkmId;
        
        if (!umkmId) {
          toast.error(`UMKM "${storeName}" tidak ditemukan`);
          throw new Error(`UMKM "${storeName}" tidak ditemukan`);
        }

        // Create order via API
        const orderResponse = await fetch(api.orders.create, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            umkmId,
            storeName,
            storeAddress: storeAddressMap[storeName as keyof typeof storeAddressMap] ?? 'Bogor, Jawa Barat',
            items: items.map((item) => ({
              id: item.id_produk,
              name: item.product?.name || 'Unknown Product',
              quantity: item.jumlah,
              price: item.harga_saat_ini,
            })),
            total: orderTotal,
            deliveryFee: perGroupShipping,
            userName: user.name,
            deliveryAddress: user.address || 'Jl. Pajajaran No. 45, Bogor',
            paymentMethod: paymentMethod === 'wallet' ? 'wallet' : paymentMethod,
          }),
        });

        if (!orderResponse.ok) {
          const error = await orderResponse.json();
          throw new Error(error.error || 'Gagal membuat pesanan');
        }

        const orderData = await orderResponse.json();
        const order = orderData.data;

        // Process payment
        if (paymentMethod === 'wallet') {
          // Payment will be processed automatically in processPayment
        } else {
          // Simulate payment for e-wallet/QRIS (dummy)
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

        // Process payment via API
        const paymentResponse = await fetch(api.orders.processPayment, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: order.id,
            paymentMethod: paymentMethod === 'wallet' ? 'wallet' : paymentMethod,
            userId: user.id,
          }),
        });

        if (!paymentResponse.ok) {
          const error = await paymentResponse.json();
          throw new Error(error.error || 'Gagal memproses pembayaran');
        }

        toast.info(`Pesanan baru terkirim ke ${storeName}.`);
        return order;
      });

      const createdOrders = await Promise.all(orderPromises);

      if (createdOrders.length > 0) {
        setTrackingOrderId(createdOrders[0].id);
      }

      setIsProcessingPayment(false);
      setIsPaymentDone(true);
      
      const paymentMethodLabel = paymentMethod === 'wallet' ? 'Saldo Web' : 
                                 paymentMethod === 'dana' ? 'DANA' :
                                 paymentMethod === 'gopay' ? 'GoPay' :
                                 paymentMethod === 'ovo' ? 'OVO' :
                                 paymentMethod === 'qris' ? 'QRIS' :
                                 paymentMethod === 'transfer' ? 'Transfer Bank' : 'COD';
      toast.success(`Pembayaran berhasil (${paymentMethodLabel}).`);

      // Refresh wallet balance if using wallet
      if (paymentMethod === 'wallet') {
        await fetchWalletBalance();
      }

      // Remove selected items from cart
      const itemsToRemove = selectedItems.map(item => item.id);
      for (const itemId of itemsToRemove) {
        try {
          const response = await fetch(api.cart.delete(itemId), {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.id }),
          });
          if (!response.ok) {
            console.error(`Failed to remove cart item ${itemId}`);
          }
        } catch (error) {
          console.error('Error removing cart item:', error);
        }
      }
      setCartItems(items => items.filter(item => !item.selected));
      await fetchCart(); // Refresh cart after checkout
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Gagal membuat pesanan. Silakan coba lagi.');
      setIsProcessingPayment(false);
      setIsPaymentDone(false);
    }
  };

  const closeCheckoutDialog = () => {
    setIsCheckoutOpen(false);
    setIsProcessingPayment(false);
    setIsPaymentDone(false);
    setDeliveryStep(0);
  };


  return (
    <div className="space-y-6">
      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto mb-4" style={{ color: '#FF8D28' }} size={48} />
            <p style={{ color: '#858585' }}>Memuat keranjang...</p>
          </CardContent>
        </Card>
      ) : cartItems.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingBag size={48} style={{ color: '#CCCCCC', margin: '0 auto' }} />
            <h4 style={{ color: '#2F4858' }} className="mt-4 mb-2">
              Keranjang Masih Kosong
            </h4>
            <p style={{ color: '#858585' }}>
              Belum ada produk di keranjang Anda. Mulai berbelanja untuk menambahkan produk ke keranjang!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                  <Checkbox
                    checked={cartItems.every(item => item.selected)}
                    onCheckedChange={toggleSelectAll}
                  />
                  <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                    Pilih Semua ({cartItems.length} item)
                  </p>
                </div>

                <div className="space-y-4">
                  {cartItems.filter(item => item.product).map(item => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                      <Checkbox
                        checked={item.selected}
                        onCheckedChange={() => toggleSelect(item.id)}
                      />
                      <ImageWithFallback
                        src={item.product?.image || ''}
                        alt={item.product?.name || ''}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 style={{ color: '#2F4858' }} className="mb-1">
                          {item.product?.name || 'Produk tidak ditemukan'}
                        </h4>
                        <p className="body-3 mb-2" style={{ color: '#858585' }}>
                          {item.product?.umkmName || 'Unknown Store'}
                        </p>
                        <p style={{ color: '#FF8D28', fontWeight: 600 }}>
                          Rp {item.harga_saat_ini.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button onClick={() => removeItem(item.id)}>
                          <Trash size={20} style={{ color: '#F44336' }} />
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 rounded flex items-center justify-center"
                            style={{ backgroundColor: '#E0E0E0' }}
                            disabled={updatingItem === item.id || item.jumlah <= 1}
                          >
                            <Minus size={16} style={{ color: '#2F4858' }} />
                          </button>
                          <Input
                            value={item.jumlah}
                            readOnly
                            className="w-12 text-center p-1"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 rounded flex items-center justify-center"
                            style={{ backgroundColor: '#FF8D28' }}
                            disabled={updatingItem === item.id || (item.product && item.jumlah >= item.product.stock)}
                          >
                            {updatingItem === item.id ? (
                              <Loader2 className="animate-spin" size={16} style={{ color: '#FFFFFF' }} />
                            ) : (
                              <Plus size={16} style={{ color: '#FFFFFF' }} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h4 style={{ color: '#2F4858' }} className="mb-4">
                  Ringkasan Belanja
                </h4>
                <div className="space-y-3 mb-4 pb-4 border-b">
                  <div className="flex justify-between">
                    <span className="body-3" style={{ color: '#858585' }}>
                      Subtotal ({selectedItems.length} item)
                    </span>
                    <span className="body-3" style={{ color: '#2F4858' }}>
                      Rp {subtotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="body-3" style={{ color: '#858585' }}>
                      Ongkos Kirim
                    </span>
                    <span className="body-3" style={{ color: '#2F4858' }}>
                      Rp {shippingFee.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mb-6">
                  <span style={{ color: '#2F4858', fontWeight: 600 }}>
                    Total
                  </span>
                  <h4 style={{ color: '#FF8D28' }}>
                    Rp {total.toLocaleString('id-ID')}
                  </h4>
                </div>
                <Button
                  className="w-full"
                  style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                >
                  Checkout ({selectedItems.length})
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <AlertDialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#2F4858' }}>
              {isPaymentDone ? 'Pembayaran Selesai' : 'Lanjut ke Pembayaran'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {!isPaymentDone ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ongkos Kirim</span>
                      <span>Rp {shippingFee.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span style={{ color: '#FF8D28' }}>Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium" style={{ color: '#2F4858' }}>Metode Pembayaran</p>
                    <div className="grid gap-2">
                      <label className="flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: paymentMethod === 'wallet' ? '#FF8D28' : '#E0E0E0' }}>
                        <input
                          type="radio"
                          name="pay"
                          checked={paymentMethod === 'wallet'}
                          onChange={() => setPaymentMethod('wallet')}
                          className="mr-2"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Saldo Web (Dompet Saya)</span>
                            {isLoadingWallet ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : (
                              <span className="text-sm" style={{ color: '#FF8D28' }}>
                                Rp {walletBalance.toLocaleString('id-ID')}
                              </span>
                            )}
                          </div>
                          {paymentMethod === 'wallet' && walletBalance < total && (
                            <p className="text-xs mt-1" style={{ color: '#F44336' }}>
                              Saldo tidak mencukupi. Silakan top up terlebih dahulu.
                            </p>
                          )}
                        </div>
                      </label>
                      <label className="flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: paymentMethod === 'dana' ? '#FF8D28' : '#E0E0E0' }}>
                        <input
                          type="radio"
                          name="pay"
                          checked={paymentMethod === 'dana'}
                          onChange={() => setPaymentMethod('dana')}
                          className="mr-2"
                        />
                        <span>DANA</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: paymentMethod === 'gopay' ? '#FF8D28' : '#E0E0E0' }}>
                        <input
                          type="radio"
                          name="pay"
                          checked={paymentMethod === 'gopay'}
                          onChange={() => setPaymentMethod('gopay')}
                          className="mr-2"
                        />
                        <span>GoPay</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: paymentMethod === 'ovo' ? '#FF8D28' : '#E0E0E0' }}>
                        <input
                          type="radio"
                          name="pay"
                          checked={paymentMethod === 'ovo'}
                          onChange={() => setPaymentMethod('ovo')}
                          className="mr-2"
                        />
                        <span>OVO</span>
                      </label>
                      <label className="flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: paymentMethod === 'qris' ? '#FF8D28' : '#E0E0E0' }}>
                        <input
                          type="radio"
                          name="pay"
                          checked={paymentMethod === 'qris'}
                          onChange={() => setPaymentMethod('qris')}
                          className="mr-2"
                        />
                        <span>QRIS</span>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>Terima kasih! Pembayaran Anda sudah kami terima.</div>
                  <div className="space-y-4">
                    <div className="text-sm" style={{ color: '#2F4858' }}>
                      Pesanan Anda sedang diproses. Berikut status terkininya.
                    </div>
                    <div className="space-y-3">
                      <div className="relative w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E9EEF1' }}>
                        <div
                          className="absolute h-full transition-all duration-500"
                          style={{ width: `${deliveryProgress}%`, backgroundColor: '#FF8D28' }}
                        />
                        <div
                          className="absolute -top-3 h-6 w-6 rounded-full flex items-center justify-center transition-all duration-500"
                          style={{
                            left: indicatorLeft,
                            transform: 'translateX(-50%)',
                            backgroundColor: '#FFFFFF',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
                            border: '1px solid #FF8D28',
                          }}
                          aria-label={deliveryStages[deliveryStep]}
                          title={deliveryStages[deliveryStep]}
                        >
                          {deliveryStep < 3 ? (
                            deliveryStep === 0 ? (
                              <ShoppingBag size={14} style={{ color: '#FF8D28' }} />
                            ) : (
                              <Bike size={14} style={{ color: '#FF8D28' }} />
                            )
                          ) : (
                            <CheckCircle2 size={14} style={{ color: '#4CAF50' }} />
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between text-xs">
                        {deliveryStages.map((stage, index) => (
                          <div
                            key={stage}
                            style={{
                              color: deliveryStep >= index ? '#FF8D28' : '#9AA6AF',
                              fontWeight: deliveryStep === index ? 600 : 500,
                            }}
                          >
                            {stage}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {!isPaymentDone ? (
              <>
                <AlertDialogCancel onClick={closeCheckoutDialog}>
                  Batal
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={proceedToPayment}
                  disabled={isProcessingPayment}
                  style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
                >
                  {isProcessingPayment ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                </AlertDialogAction>
              </>
            ) : (
              <AlertDialogAction onClick={closeCheckoutDialog}>
                Selesai
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

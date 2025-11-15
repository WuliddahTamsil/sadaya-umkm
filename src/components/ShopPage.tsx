import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { ArrowLeft, ShoppingCart, Plus, Minus, Search, Star, Phone, Clock } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  sold: number;
  stock: number;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface UMKMShop {
  id: number;
  name: string;
  category: string;
  address: string;
  image: string;
  phone?: string;
  operatingHours?: string;
}

interface ShopPageProps {
  umkm: UMKMShop;
  onBack: () => void;
  onCheckout: (items: CartItem[]) => void;
}

// Sample products data - in real app, this would come from API
const getProductsByUMKM = (umkmId: number): Product[] => {
  const productsMap: Record<number, Product[]> = {
    1: [ // Lapis Bogor Sangkuriang
      { id: '1-1', name: 'Lapis Talas Original', price: 45000, image: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=400', description: 'Lapis talas dengan topping keju melimpah', rating: 4.9, sold: 2345, stock: 50 },
      { id: '1-2', name: 'Lapis Talas Cokelat', price: 48000, image: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=400', description: 'Lapis talas dengan varian cokelat premium', rating: 4.8, sold: 1890, stock: 45 },
      { id: '1-3', name: 'Lapis Talas Keju', price: 50000, image: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=400', description: 'Lapis talas dengan keju ekstra', rating: 4.9, sold: 3120, stock: 60 },
    ],
    2: [ // Roti Unyil Venus
      { id: '2-1', name: 'Roti Unyil Sosis', price: 3000, image: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=400', description: 'Roti unyil dengan isian sosis', rating: 4.8, sold: 5678, stock: 200 },
      { id: '2-2', name: 'Roti Unyil Keju', price: 3000, image: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=400', description: 'Roti unyil dengan isian keju', rating: 4.9, sold: 6234, stock: 250 },
      { id: '2-3', name: 'Roti Unyil Cokelat', price: 3000, image: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=400', description: 'Roti unyil dengan isian cokelat', rating: 4.7, sold: 4890, stock: 180 },
    ],
    3: [ // Asinan Sedap Gedung Dalam
      { id: '3-1', name: 'Asinan Sayur', price: 15000, image: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=400', description: 'Asinan sayur segar dengan kuah cuka khas', rating: 4.8, sold: 3456, stock: 100 },
      { id: '3-2', name: 'Asinan Buah', price: 18000, image: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=400', description: 'Asinan buah segar dengan taburan kacang', rating: 4.9, sold: 4123, stock: 120 },
    ],
  };
  return productsMap[umkmId] || [
    { id: 'default-1', name: 'Produk 1', price: 25000, image: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=400', description: 'Produk unggulan dari toko ini', rating: 4.5, sold: 100, stock: 50 },
    { id: 'default-2', name: 'Produk 2', price: 30000, image: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=400', description: 'Produk unggulan dari toko ini', rating: 4.6, sold: 150, stock: 60 },
  ];
};

export function ShopPage({ umkm, onBack, onCheckout }: ShopPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const products = getProductsByUMKM(umkm.id);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast.error(`Stok hanya tersedia ${product.stock} item`);
        return;
      }
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }]);
    }
    toast.success(`${product.name} ditambahkan ke keranjang`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.productId === productId) {
        const product = products.find(p => p.id === productId);
        const newQuantity = Math.max(1, Math.min(item.quantity + delta, product?.stock || 1));
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
    toast.success('Item dihapus dari keranjang');
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = cart.length > 0 ? 10000 : 0;
  const total = cartTotal + shippingFee;

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Keranjang masih kosong');
      return;
    }
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    toast.success(`Checkout berhasil! ${totalItems} item akan diproses.`);
    onCheckout(cart);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="body-3"
              style={{ color: '#2F4858' }}
            >
              <ArrowLeft className="mr-2" size={20} />
              Kembali
            </Button>
            <div className="flex items-center gap-2">
              <ShoppingCart size={24} style={{ color: '#FF8D28' }} />
              {cart.length > 0 && (
                <span className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Store Info Banner */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src={umkm.image}
              alt={umkm.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 style={{ color: '#2F4858' }} className="mb-1">
                {umkm.name}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm" style={{ color: '#858585' }}>
                {umkm.phone && (
                  <div className="flex items-center gap-1">
                    <Phone size={14} />
                    <span>{umkm.phone}</span>
                  </div>
                )}
                {umkm.operatingHours && (
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{umkm.operatingHours}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2">
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#858585' }} size={20} />
                <Input
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {filteredProducts.map(product => {
                const cartItem = cart.find(item => item.productId === product.id);
                const inCart = cartItem !== undefined;

                return (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center gap-1 shadow-md">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span className="text-xs font-semibold" style={{ color: '#2F4858' }}>{product.rating}</span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 style={{ color: '#2F4858' }} className="mb-2">
                        {product.name}
                      </h4>
                      <p className="body-3 mb-3" style={{ color: '#858585' }}>
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <p style={{ color: '#FF8D28', fontWeight: 600, fontSize: '18px' }}>
                          Rp {product.price.toLocaleString('id-ID')}
                        </p>
                        <span className="body-3" style={{ color: '#858585' }}>
                          Stok: {product.stock}
                        </span>
                      </div>

                      {inCart ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(product.id, -1)}
                            className="flex-1"
                          >
                            <Minus size={16} />
                          </Button>
                          <span className="px-4 py-2 body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                            {cartItem.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(product.id, 1)}
                            className="flex-1"
                            disabled={cartItem.quantity >= product.stock}
                          >
                            <Plus size={16} />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="w-full"
                          style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart size={16} className="mr-2" />
                          {product.stock === 0 ? 'Stok Habis' : 'Tambah ke Keranjang'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <p style={{ color: '#858585' }}>
                    Tidak ada produk yang ditemukan.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h4 style={{ color: '#2F4858' }} className="mb-4">
                  Keranjang ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </h4>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart size={48} style={{ color: '#CCCCCC' }} className="mx-auto mb-4" />
                    <p className="body-3" style={{ color: '#858585' }}>
                      Keranjang masih kosong
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                      {cart.map(item => {
                        const product = products.find(p => p.id === item.productId);
                        return (
                          <div key={item.productId} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                            <ImageWithFallback
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex-1">
                              <p className="body-3 font-semibold" style={{ color: '#2F4858' }}>
                                {item.name}
                              </p>
                              <p className="body-3 mb-2" style={{ color: '#FF8D28' }}>
                                Rp {item.price.toLocaleString('id-ID')}
                              </p>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.productId, -1)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Minus size={12} />
                                </Button>
                                <span className="text-sm" style={{ color: '#2F4858' }}>
                                  {item.quantity}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.productId, 1)}
                                  className="h-6 w-6 p-0"
                                  disabled={item.quantity >= (product?.stock || 0)}
                                >
                                  <Plus size={12} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeFromCart(item.productId)}
                                  className="ml-auto text-red-500"
                                >
                                  Hapus
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-3 mb-4 pb-4 border-b">
                      <div className="flex justify-between">
                        <span className="body-3" style={{ color: '#858585' }}>
                          Subtotal
                        </span>
                        <span className="body-3" style={{ color: '#2F4858' }}>
                          Rp {cartTotal.toLocaleString('id-ID')}
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
                    >
                      Checkout Sekarang
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


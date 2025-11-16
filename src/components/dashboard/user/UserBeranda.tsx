import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Search, Heart, ShoppingCart, Star, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { toast } from 'sonner';
import { PersonalizedGreeting } from '../../PersonalizedGreeting';
import { GamificationBadge } from '../../GamificationBadge';
import { api } from '../../../config/api';
import { useAuth } from '../../../contexts/AuthContext';
import { ProductDetailPage } from './ProductDetailPage';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  umkmName: string;
  rating: number;
  sold: number;
  category: string;
}

export function UserBeranda() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const categories = ['Semua', 'Makanan', 'Minuman', 'Kerajinan', 'Jasa'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(api.products.getAll);
      if (!response.ok) {
        throw new Error('Gagal mengambil data produk');
      }
      const data = await response.json();
      // Map API response to Product interface
      const mappedProducts: Product[] = data.map((product: any) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        umkmName: product.umkmName || 'UMKM',
        rating: product.rating || 0,
        sold: product.sold || 0,
        category: product.category
      }));
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Gagal memuat produk. Silakan refresh halaman.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }

    try {
      setAddingToCart(product.id);
      const response = await fetch(api.cart.add, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          quantity: 1
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menambahkan ke keranjang');
      }

      toast.success(`${product.name} ditambahkan ke keranjang!`);
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || 'Gagal menambahkan ke keranjang');
    } finally {
      setAddingToCart(null);
    }
  };

  const handleAddToWishlist = (productName: string) => {
    toast.success(`${productName} ditambahkan ke wishlist!`);
  };

  const handleProductClick = (productId: string) => {
    setSelectedProductId(productId);
  };

  const handleBackToBeranda = () => {
    setSelectedProductId(null);
  };

  // Show product detail page if a product is selected
  if (selectedProductId) {
    return (
      <ProductDetailPage 
        productId={selectedProductId} 
        onBack={handleBackToBeranda}
        onProductSelect={setSelectedProductId}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Personalized Greeting */}
      <PersonalizedGreeting />

      {/* Gamification Badges */}
      <GamificationBadge role="user" />

      {/* Hero Banner */}
      <Card className="overflow-hidden">
        <div 
          className="p-8 lg:p-12"
          style={{ 
            background: 'linear-gradient(135deg, #FF8D28 0%, #2F4858 100%)'
          }}
        >
          <h2 style={{ color: '#FFFFFF' }} className="mb-4">
            Selamat Datang di Asli Bogor! 🎉
          </h2>
          <p style={{ color: '#FFFFFF', opacity: 0.9 }}>
            Temukan produk lokal terbaik dari UMKM Bogor pilihan
          </p>
        </div>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#858585' }} size={20} />
              <Input
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  size="sm"
                  variant={activeCategory === category ? 'default' : 'outline'}
                  onClick={() => setActiveCategory(category)}
                  style={
                    activeCategory === category
                      ? { backgroundColor: '#FF8D28', color: '#FFFFFF' }
                      : {}
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="animate-spin mx-auto mb-4" style={{ color: '#FF8D28' }} size={48} />
            <p style={{ color: '#858585' }}>Memuat produk...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleProductClick(product.id)}>
            <div className="relative">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist(product.name);
                }}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors z-10"
              >
                <Heart size={20} style={{ color: '#FF8D28' }} />
              </button>
              <Badge 
                className="absolute top-3 left-3"
                style={{ backgroundColor: '#FDE08E', color: '#2F4858' }}
              >
                {product.category}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h4 style={{ color: '#2F4858' }} className="mb-2">
                {product.name}
              </h4>
              <p className="body-3 mb-2" style={{ color: '#858585' }}>
                {product.umkmName}
              </p>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star size={16} style={{ color: '#FFB800', fill: '#FFB800' }} />
                  <span className="body-3" style={{ color: '#2F4858' }}>{product.rating}</span>
                </div>
                <span className="body-3" style={{ color: '#CCCCCC' }}>•</span>
                <span className="body-3" style={{ color: '#858585' }}>{product.sold} terjual</span>
              </div>
              <div className="flex items-center justify-between">
                <p style={{ color: '#FF8D28', fontWeight: 600 }}>
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                <Button
                  size="sm"
                  style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={addingToCart === product.id}
                >
                  {addingToCart === product.id ? (
                    <>
                      <Loader2 className="animate-spin mr-1" size={16} />
                      Menambah...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} className="mr-1" />
                      Beli
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p style={{ color: '#858585' }}>
              Tidak ada produk yang ditemukan. Coba kata kunci lain.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

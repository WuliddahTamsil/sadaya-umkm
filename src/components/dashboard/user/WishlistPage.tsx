import { useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Heart, ShoppingCart, Star, Trash2 } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  store: string;
  rating: number;
  sold: number;
  category: string;
}

export function WishlistPage() {
  // User baru TIDAK memiliki data favorit sama sekali - array kosong
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const handleRemove = (id: string, name: string) => {
    setWishlist(wishlist.filter(item => item.id !== id));
    toast.success(`${name} dihapus dari wishlist`);
  };

  const handleAddToCart = (name: string) => {
    toast.success(`${name} ditambahkan ke keranjang!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ color: '#2F4858' }}>Wishlist Saya</h2>
          <p className="body-3 mt-2" style={{ color: '#858585' }}>
            {wishlist.length} produk dalam wishlist
          </p>
        </div>
        {wishlist.length > 0 && (
          <Button
            variant="outline"
            onClick={() => {
              setWishlist([]);
              toast.success('Semua item dihapus dari wishlist');
            }}
            style={{ color: '#FF6B6B' }}
          >
            <Trash2 size={16} className="mr-2" />
            Hapus Semua
          </Button>
        )}
      </div>

      {/* Wishlist Grid */}
      {wishlist.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: '#FFF4E6' }}
            >
              <Heart size={32} style={{ color: '#FF8D28' }} />
            </div>
            <h3 style={{ color: '#2F4858' }}>Belum Ada Produk Favorit</h3>
            <p className="body-3 mt-2 mb-6" style={{ color: '#858585' }}>
              Belum ada produk favorit. Tambahkan produk ke favorit dengan menekan tombol "Tambah ke Favorit" pada produk yang Anda sukai.
            </p>
            <Button style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}>
              Mulai Belanja
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-xl transition-all">
                <div className="relative">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleRemove(item.id, item.name)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-red-50 transition-colors group"
                  >
                    <Heart 
                      size={20} 
                      style={{ color: '#FF8D28' }} 
                      fill="#FF8D28"
                      className="group-hover:fill-red-500 group-hover:stroke-red-500 transition-colors"
                    />
                  </button>
                  <Badge 
                    className="absolute top-3 left-3"
                    style={{ backgroundColor: '#FDE08E', color: '#2F4858' }}
                  >
                    {item.category}
                  </Badge>
                  {item.originalPrice && (
                    <Badge 
                      className="absolute bottom-3 left-3"
                      style={{ backgroundColor: '#FF6B6B', color: '#FFFFFF' }}
                    >
                      Diskon {Math.round((1 - item.price / item.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h4 style={{ color: '#2F4858' }} className="mb-2">
                    {item.name}
                  </h4>
                  <p className="body-3 mb-2" style={{ color: '#858585' }}>
                    {item.store}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star size={16} style={{ color: '#FFB800', fill: '#FFB800' }} />
                      <span className="body-3" style={{ color: '#2F4858' }}>{item.rating}</span>
                    </div>
                    <span className="body-3" style={{ color: '#CCCCCC' }}>•</span>
                    <span className="body-3" style={{ color: '#858585' }}>{item.sold} terjual</span>
                  </div>
                  <div className="flex items-end gap-2 mb-4">
                    <p style={{ color: '#FF8D28', fontWeight: 700, fontSize: '18px' }}>
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                    {item.originalPrice && (
                      <p 
                        className="body-3 line-through" 
                        style={{ color: '#CCCCCC', fontSize: '14px' }}
                      >
                        Rp {item.originalPrice.toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                  <Button
                    className="w-full"
                    style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
                    onClick={() => handleAddToCart(item.name)}
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    Tambah ke Keranjang
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

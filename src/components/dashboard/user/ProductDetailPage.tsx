import { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { ArrowLeft, MapPin, Phone, Clock, ExternalLink, Star, ShoppingCart, Plus, Minus, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { toast } from 'sonner';
import { api } from '../../../config/api';
import { useAuth } from '../../../contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
  image: string;
  umkmId: string;
  umkmName: string;
  sold: number;
  rating: number;
}

interface UMKMInfo {
  id: string;
  name: string;
  storeName: string;
  storeAddress: string;
  phone?: string;
  storeDescription?: string;
  address?: string;
}

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
  onProductSelect?: (productId: string) => void;
}

export function ProductDetailPage({ productId, onBack, onProductSelect }: ProductDetailPageProps) {
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [umkmInfo, setUmkmInfo] = useState<UMKMInfo | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    fetchProductDetails();
    setQuantity(1); // Reset quantity when product changes
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      
      // Fetch product details
      const productResponse = await fetch(api.products.getById(productId));
      if (!productResponse.ok) {
        throw new Error('Gagal mengambil data produk');
      }
      const productData = await productResponse.json();
      setProduct(productData);

      // Fetch UMKM info
      const umkmResponse = await fetch(api.users.getById(productData.umkmId));
      if (umkmResponse.ok) {
        const umkmData = await umkmResponse.json();
        setUmkmInfo(umkmData);
      }

      // Fetch related products from same UMKM
      const relatedResponse = await fetch(api.products.getByUMKM(productData.umkmId));
      if (relatedResponse.ok) {
        const relatedData = await relatedResponse.json();
        // Filter out current product
        const filtered = relatedData.filter((p: Product) => p.id !== productId);
        setRelatedProducts(filtered.slice(0, 3));
        
        // Create gallery images from related products
        const images = [productData.image];
        filtered.slice(0, 3).forEach((p: Product) => {
          if (p.image && !images.includes(p.image)) {
            images.push(p.image);
          }
        });
        // Pad to 4 images if needed
        while (images.length < 4) {
          images.push(productData.image);
        }
        setGalleryImages(images.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast.error('Gagal memuat detail produk');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu');
      return;
    }

    if (!product) return;

    try {
      setAddingToCart(true);
      const response = await fetch(api.cart.add, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          quantity: quantity
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal menambahkan ke keranjang');
      }

      toast.success(`${product.name} (${quantity}x) ditambahkan ke keranjang!`);
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || 'Gagal menambahkan ke keranjang');
    } finally {
      setAddingToCart(false);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Google Maps embed URL - using the same format as UMKMDetailPage
  const getMapEmbedUrl = () => {
    // Using a simple embed URL that shows Bogor area
    // This matches the format used in UMKMDetailPage
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56402638384!2d106.72782745!3d-6.595038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c5d2e602b5f5%3A0x4027980f0e5c7e0!2sBogor%2C%20West%20Java%2C%20Indonesia!5e0!3m2!1sen!2s!4v1234567890`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin" size={48} style={{ color: '#FF8D28' }} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <p style={{ color: '#858585' }}>Produk tidak ditemukan</p>
            <Button onClick={onBack} className="mt-4" style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}>
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky at top */}
      <div className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="body-3"
            style={{ color: '#2F4858' }}
          >
            <ArrowLeft className="mr-2" size={20} />
            Kembali ke Beranda
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Product Images and Info */}
          <div className="space-y-6">
            {/* Main Product Image */}
            <Card>
              <CardContent className="p-0">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                      className="w-full h-96 object-cover rounded-t-lg"
                />
              </CardContent>
            </Card>

            {/* Gallery Images */}
            {galleryImages.length > 0 && (
              <div>
                <h4 style={{ color: '#2F4858' }} className="mb-3">Galeri Produk</h4>
                <div className="grid grid-cols-4 gap-2">
                  {galleryImages.map((image, index) => (
                    <ImageWithFallback
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => {
                        if (product) {
                          setProduct({ ...product, image });
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Product Info Card */}
            <Card>
              <CardContent className="p-6">
                <Badge className="mb-3" style={{ backgroundColor: '#FDE08E', color: '#2F4858' }}>
                  {product.category}
                </Badge>
                <h2 style={{ color: '#2F4858' }} className="mb-4">
                  {product.name}
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={20} style={{ color: '#FFB800', fill: '#FFB800' }} />
                    <span style={{ color: '#2F4858', fontWeight: 600 }}>{product.rating}</span>
                  </div>
                  <span style={{ color: '#CCCCCC' }}>•</span>
                  <span style={{ color: '#858585' }}>{product.sold} terjual</span>
                  <span style={{ color: '#CCCCCC' }}>•</span>
                  <span style={{ color: product.stock > 10 ? '#4CAF50' : '#F44336', fontWeight: 600 }}>
                    Stok: {product.stock}
                  </span>
                </div>
                <p style={{ color: '#4A4A4A', fontSize: '18px' }} className="mb-6">
                  {product.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="body-3" style={{ color: '#858585' }}>Harga</p>
                    <h3 style={{ color: '#FF8D28' }}>
                      Rp {product.price.toLocaleString('id-ID')}
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: UMKM Info and Actions */}
          <div className="space-y-6">
            {/* UMKM Info Card */}
            <Card>
              <CardContent className="p-6">
                <h3 style={{ color: '#2F4858' }} className="mb-4">
                  Tentang UMKM
                </h3>
                <h4 style={{ color: '#2F4858' }} className="mb-3">
                  {product.umkmName}
                </h4>
                {umkmInfo?.storeDescription && (
                  <p style={{ color: '#4A4A4A' }} className="mb-6">
                    {umkmInfo.storeDescription}
                  </p>
                )}

                {/* Contact Information */}
                <div className="space-y-4 mb-6">
                  {(umkmInfo?.storeAddress || umkmInfo?.address) && (
                    <div className="flex items-start gap-3">
                      <MapPin size={20} style={{ color: '#FF8D28' }} className="mt-1 flex-shrink-0" />
                      <div>
                        <p className="body-3" style={{ color: '#858585' }}>Alamat</p>
                        <p style={{ color: '#2F4858' }}>
                          {umkmInfo?.storeAddress || umkmInfo?.address}
                        </p>
                      </div>
                    </div>
                  )}
                  {umkmInfo?.phone && (
                    <div className="flex items-start gap-3">
                      <Phone size={20} style={{ color: '#FF8D28' }} className="mt-1 flex-shrink-0" />
                      <div>
                        <p className="body-3" style={{ color: '#858585' }}>Telepon</p>
                        <p style={{ color: '#2F4858' }}>{umkmInfo.phone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Map - Always show map */}
                <div>
                  <h3 style={{ color: '#2F4858' }} className="mb-4">
                    Lokasi
                  </h3>
                  <div className="w-full h-80 rounded-lg overflow-hidden border mb-4">
                    <iframe
                      src={getMapEmbedUrl()}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Peta lokasi ${product.umkmName}`}
                    />
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${product.umkmName}, ${umkmInfo?.storeAddress || umkmInfo?.address || 'Bogor'}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm"
                    style={{ color: '#FF8D28' }}
                  >
                    <ExternalLink size={16} />
                    <span>Klik di sini untuk Peta dan Galeri Foto Lengkap (Google Maps)</span>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Add to Cart Card */}
            <Card>
              <CardContent className="p-6">
                <h4 style={{ color: '#2F4858' }} className="mb-4">
                  Beli Produk
                </h4>
                
                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="body-3" style={{ color: '#858585' }}>Jumlah:</span>
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="w-10 h-10 p-0"
                    >
                      <Minus size={16} />
                    </Button>
                    <span style={{ color: '#2F4858', fontWeight: 600, minWidth: '2rem', textAlign: 'center' }}>
                      {quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={increaseQuantity}
                      disabled={!product || quantity >= product.stock}
                      className="w-10 h-10 p-0"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="flex justify-between items-center mb-6 pb-6 border-b">
                  <span style={{ color: '#858585' }}>Total Harga</span>
                  <h3 style={{ color: '#FF8D28' }}>
                    Rp {(product.price * quantity).toLocaleString('id-ID')}
                  </h3>
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full"
                  style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock === 0 || quantity > product.stock}
                >
                  {addingToCart ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Menambahkan...
                    </>
                  ) : product.stock === 0 ? (
                    'Stok Habis'
                  ) : (
                    <>
                      <ShoppingCart size={20} className="mr-2" />
                      Tambah ke Keranjang
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h4 style={{ color: '#2F4858' }} className="mb-4">
                    Produk Lainnya dari {product.umkmName}
                  </h4>
                  <div className="space-y-3">
                    {relatedProducts.map((relatedProduct) => (
                      <div
                        key={relatedProduct.id}
                        className="flex gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={() => {
                          if (onProductSelect) {
                            onProductSelect(relatedProduct.id);
                          }
                        }}
                      >
                        <ImageWithFallback
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h5 style={{ color: '#2F4858' }} className="mb-1">
                            {relatedProduct.name}
                          </h5>
                          <p style={{ color: '#FF8D28', fontWeight: 600 }}>
                            Rp {relatedProduct.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


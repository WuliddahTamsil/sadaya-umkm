import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Plus, Edit, Trash, Star, Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
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
  sold: number;
  rating: number;
  status: 'active' | 'inactive';
}

export function ManajemenProduk() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    image: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (user && user.role === 'umkm') {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    if (!user || user.role !== 'umkm') return;
    
    try {
      setIsLoading(true);
      const response = await fetch(api.products.getByUMKM(user.id));
      if (!response.ok) {
        throw new Error('Gagal mengambil data produk');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Gagal memuat produk');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category,
        description: product.description,
        image: product.image
      });
      setImagePreview(product.image);
      setSelectedImage(null);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        stock: '',
        category: '',
        description: '',
        image: ''
      });
      setImagePreview('');
      setSelectedImage(null);
    }
    setIsDialogOpen(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview('');
    setFormData({ ...formData, image: '' });
  };

  const handleUploadImage = async (): Promise<string | null> => {
    if (!selectedImage || !user) return null;

    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append('productImage', selectedImage);
      formData.append('userId', user.id);

      const response = await fetch(api.upload.productImage, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Gagal mengupload gambar');
      }

      const data = await response.json();
      toast.success('Gambar berhasil diupload');
      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Gagal mengupload gambar');
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!user || user.role !== 'umkm') return;

    try {
      // Upload image first if there's a new image selected
      let imageUrl = formData.image;
      if (selectedImage) {
        const uploadedUrl = await handleUploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          // If upload fails, don't proceed
          return;
        }
      }

      if (editingProduct) {
        // Update existing product
        const response = await fetch(api.products.update(editingProduct.id), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            price: formData.price,
            stock: formData.stock,
            category: formData.category,
            description: formData.description,
            image: imageUrl,
            umkmId: user.id
          }),
        });

        if (!response.ok) {
          throw new Error('Gagal memperbarui produk');
        }

        toast.success('Produk berhasil diperbarui!');
      } else {
        // Create new product
        const response = await fetch(api.products.create, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            price: formData.price,
            stock: formData.stock,
            category: formData.category,
            description: formData.description,
            image: imageUrl,
            umkmId: user.id,
            umkmName: user.name || user.storeName || 'UMKM'
          }),
        });

        if (!response.ok) {
          throw new Error('Gagal menambahkan produk');
        }

        toast.success('Produk berhasil ditambahkan!');
      }

      setIsDialogOpen(false);
      setSelectedImage(null);
      setImagePreview('');
      fetchProducts(); // Refresh products list
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Gagal menyimpan produk');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      return;
    }

    try {
      const response = await fetch(api.products.delete(id), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus produk');
      }

      toast.success('Produk berhasil dihapus!');
      fetchProducts(); // Refresh products list
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Gagal menghapus produk');
    }
  };

  const toggleStatus = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      const response = await fetch(api.products.update(id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          umkmId: user?.id
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengubah status produk');
      }

      toast.success(`Produk berhasil di${newStatus === 'active' ? 'aktifkan' : 'nonaktifkan'}!`);
      fetchProducts(); // Refresh products list
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast.error('Gagal mengubah status produk');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 style={{ color: '#2F4858' }}>Manajemen Produk</h3>
          <p className="body-3" style={{ color: '#858585' }}>
            Kelola produk toko Anda
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
        >
          <Plus size={20} className="mr-2" />
          Tambah Produk
        </Button>
      </div>

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
          {products.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <Badge
                className="absolute top-3 right-3"
                style={{
                  backgroundColor: product.status === 'active' ? '#C8E6C9' : '#FFCDD2',
                  color: product.status === 'active' ? '#2E7D32' : '#C62828'
                }}
              >
                {product.status === 'active' ? 'Aktif' : 'Nonaktif'}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h4 style={{ color: '#2F4858' }} className="mb-2">
                {product.name}
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <Badge style={{ backgroundColor: '#FDE08E', color: '#2F4858' }}>
                  {product.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star size={14} style={{ color: '#FFB800', fill: '#FFB800' }} />
                  <span className="body-3" style={{ color: '#858585' }}>{product.rating}</span>
                </div>
              </div>
              <p className="body-3 mb-3" style={{ color: '#858585' }}>
                {product.description.substring(0, 60)}...
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="body-3" style={{ color: '#858585' }}>Harga</span>
                  <span className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="body-3" style={{ color: '#858585' }}>Stok</span>
                  <span className="body-3" style={{ color: product.stock < 10 ? '#F44336' : '#2F4858', fontWeight: 600 }}>
                    {product.stock} unit
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="body-3" style={{ color: '#858585' }}>Terjual</span>
                  <span className="body-3" style={{ color: '#4CAF50', fontWeight: 600 }}>
                    {product.sold} unit
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleOpenDialog(product)}
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={() => toggleStatus(product.id)}
                  style={{
                    borderColor: product.status === 'active' ? '#F44336' : '#4CAF50',
                    color: product.status === 'active' ? '#F44336' : '#4CAF50'
                  }}
                >
                  {product.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p style={{ color: '#858585' }}>
              Belum ada produk. Klik tombol "Tambah Produk" untuk mulai.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            // Reset state when dialog closes
            setSelectedImage(null);
            setImagePreview('');
            setEditingProduct(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: '#2F4858' }}>
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Perbarui informasi produk Anda' : 'Tambahkan produk baru ke toko Anda'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="body-3">Nama Produk *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Tahu Gejrot Original"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="body-3">Harga *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="15000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock" className="body-3">Stok *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="body-3">Kategori *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Makanan">Makanan</SelectItem>
                  <SelectItem value="Minuman">Minuman</SelectItem>
                  <SelectItem value="Kerajinan">Kerajinan</SelectItem>
                  <SelectItem value="Jasa">Jasa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="body-3">Deskripsi *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsikan produk Anda..."
                className="min-h-24"
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label className="body-3">Foto Produk *</Label>
              <div className="space-y-3">
                {imagePreview ? (
                  <div className="relative">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                      <ImageWithFallback
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    {selectedImage && (
                      <p className="text-xs text-gray-500 mt-1">
                        File: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                ) : (
                  <label
                    htmlFor="product-image"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon size={48} style={{ color: '#858585' }} className="mb-2" />
                      <p className="mb-2 text-sm" style={{ color: '#858585' }}>
                        <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                      </p>
                      <p className="text-xs" style={{ color: '#858585' }}>
                        PNG, JPG, GIF (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      id="product-image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                  </label>
                )}
                {!imagePreview && (
                  <div className="space-y-2">
                    <p className="text-xs" style={{ color: '#858585' }}>Atau masukkan URL gambar:</p>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value });
                        if (e.target.value) {
                          setImagePreview(e.target.value);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsDialogOpen(false)}
              >
                Batal
              </Button>
              <Button
                className="flex-1"
                style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
                onClick={handleSave}
                disabled={isUploadingImage}
              >
                {isUploadingImage ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Mengupload...
                  </>
                ) : (
                  `${editingProduct ? 'Perbarui' : 'Tambah'} Produk`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

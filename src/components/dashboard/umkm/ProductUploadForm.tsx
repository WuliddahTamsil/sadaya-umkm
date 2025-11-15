import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { ImagePlus, X, MapPin, Eye, Save, FileText, Package } from 'lucide-react';
import { toast } from 'sonner';

interface ProductForm {
  name: string;
  price: string;
  category: string;
  description: string;
  stock: string;
  images: string[];
  location: string;
  variations: { name: string; price: string }[];
}

export function ProductUploadForm({ onClose }: { onClose?: () => void }) {
  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    images: [],
    location: 'Jl. Suryakencana No. 123, Bogor',
    variations: []
  });

  const categories = ['Makanan', 'Minuman', 'Kerajinan', 'Jasa', 'Fashion', 'Elektronik'];

  const handleImageUpload = () => {
    // Simulate image upload - in production would use file input
    const newImage = `https://images.unsplash.com/photo-${Date.now()}-${Math.random()}?w=400`;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, newImage]
    }));
    toast.success('Foto berhasil ditambahkan!');
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addVariation = () => {
    setFormData(prev => ({
      ...prev,
      variations: [...prev.variations, { name: '', price: '' }]
    }));
  };

  const removeVariation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }));
  };

  const handleSaveDraft = () => {
    toast.success('Produk disimpan sebagai draft!');
    onClose?.();
  };

  const handlePublish = () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Mohon lengkapi data produk!');
      return;
    }
    toast.success('Produk berhasil dipublikasikan! 🎉');
    onClose?.();
  };

  const ProductPreview = () => (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-yellow-50">
        {formData.images[0] ? (
          <img src={formData.images[0]} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} style={{ color: '#CCCCCC' }} />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h4 style={{ color: '#2F4858' }}>
          {formData.name || 'Nama Produk'}
        </h4>
        <p className="body-3 mt-2" style={{ color: '#858585' }}>
          {formData.description || 'Deskripsi produk akan muncul di sini...'}
        </p>
        <div className="flex items-center justify-between mt-4">
          <h3 style={{ color: '#FF8D28' }}>
            {formData.price ? `Rp ${parseInt(formData.price).toLocaleString('id-ID')}` : 'Rp 0'}
          </h3>
          <div className="flex items-center gap-2">
            <span className="body-3" style={{ color: '#858585' }}>
              Stok: {formData.stock || '0'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= s ? 'bg-orange-500' : 'bg-gray-200'
              }`}
              whileHover={{ scale: 1.1 }}
            >
              <span style={{ color: step >= s ? '#FFFFFF' : '#858585', fontWeight: 600 }}>
                {s}
              </span>
            </motion.div>
            {s < 3 && (
              <div className="flex-1 h-1 mx-2" style={{ backgroundColor: step > s ? '#FF8D28' : '#E0E0E0' }} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText size={20} style={{ color: '#FF8D28' }} />
              <h4 style={{ color: '#2F4858' }}>Informasi Dasar</h4>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama Produk *</Label>
              <Input
                id="name"
                placeholder="Contoh: Tahu Gejrot Original"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Harga *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="15000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stok</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="50"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Produk</Label>
              <Textarea
                id="description"
                placeholder="Ceritakan tentang produk Anda..."
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </motion.div>
        )}

        {/* Step 2: Images & Gallery */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <ImagePlus size={20} style={{ color: '#FF8D28' }} />
              <h4 style={{ color: '#2F4858' }}>Foto Produk</h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((img, index) => (
                <motion.div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} style={{ color: '#FFFFFF' }} />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-orange-500 text-white body-3" style={{ fontSize: '10px' }}>
                      Utama
                    </div>
                  )}
                </motion.div>
              ))}

              {formData.images.length < 8 && (
                <button
                  onClick={handleImageUpload}
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-500 flex flex-col items-center justify-center gap-2 transition-colors"
                >
                  <ImagePlus size={32} style={{ color: '#CCCCCC' }} />
                  <span className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                    Upload Foto
                  </span>
                </button>
              )}
            </div>

            <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
              * Maksimal 8 foto. Foto pertama akan menjadi foto utama produk.
            </p>
          </motion.div>
        )}

        {/* Step 3: Variations & Location */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package size={20} style={{ color: '#FF8D28' }} />
                <h4 style={{ color: '#2F4858' }}>Variasi Produk (Opsional)</h4>
              </div>

              <div className="space-y-3">
                {formData.variations.map((variation, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Input
                      placeholder="Nama variasi (Contoh: Pedas Level 1)"
                      value={variation.name}
                      onChange={(e) => {
                        const newVariations = [...formData.variations];
                        newVariations[index].name = e.target.value;
                        setFormData({ ...formData, variations: newVariations });
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Harga"
                      value={variation.price}
                      onChange={(e) => {
                        const newVariations = [...formData.variations];
                        newVariations[index].price = e.target.value;
                        setFormData({ ...formData, variations: newVariations });
                      }}
                      className="w-32"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeVariation(index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addVariation}
                  className="w-full"
                >
                  + Tambah Variasi
                </Button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} style={{ color: '#FF8D28' }} />
                <h4 style={{ color: '#2F4858' }}>Lokasi Toko</h4>
              </div>

              <div className="space-y-3">
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Alamat lengkap toko"
                />
                
                <div
                  className="w-full h-48 rounded-lg overflow-hidden"
                  style={{ backgroundColor: '#F5F5F5' }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin size={48} style={{ color: '#CCCCCC' }} />
                  </div>
                </div>
                <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                  * Klik peta untuk pin lokasi yang tepat
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Toggle */}
      <Button
        variant="outline"
        onClick={() => setShowPreview(!showPreview)}
        className="w-full"
      >
        <Eye size={16} className="mr-2" />
        {showPreview ? 'Sembunyikan' : 'Lihat'} Preview
      </Button>

      {showPreview && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <ProductPreview />
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3 pt-4">
        <div className="flex gap-2">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
            >
              Kembali
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
          >
            <FileText size={16} className="mr-2" />
            Simpan Draft
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
            >
              Lanjut
            </Button>
          ) : (
            <Button
              onClick={handlePublish}
              style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}
            >
              <Save size={16} className="mr-2" />
              Publikasikan
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { AlertTriangle, Package, TrendingDown } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';

export function StockAlert() {
  const lowStockProducts = [
    {
      id: '1',
      name: 'Tahu Gejrot Original',
      currentStock: 5,
      minStock: 20,
      sold24h: 15,
      image: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=100',
      category: 'Makanan',
      urgency: 'critical'
    },
    {
      id: '2',
      name: 'Tahu Gejrot Pedas',
      currentStock: 12,
      minStock: 20,
      sold24h: 8,
      image: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=100',
      category: 'Makanan',
      urgency: 'warning'
    },
    {
      id: '3',
      name: 'Paket Hemat 3pcs',
      currentStock: 8,
      minStock: 15,
      sold24h: 12,
      image: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=100',
      category: 'Paket',
      urgency: 'warning'
    },
    {
      id: '4',
      name: 'Sambal Extra Pedas',
      currentStock: 3,
      minStock: 25,
      sold24h: 22,
      image: 'https://images.unsplash.com/photo-1596040033229-a0b3b9b82276?w=100',
      category: 'Tambahan',
      urgency: 'critical'
    }
  ];

  const outOfStockProducts = [
    {
      id: '5',
      name: 'Tahu Gejrot Manis',
      lastStock: '2 hari lalu',
      missedSales: 18,
      image: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=100'
    },
    {
      id: '6',
      name: 'Es Teh Manis Jumbo',
      lastStock: '1 hari lalu',
      missedSales: 12,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=100'
    }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return { bg: '#FF6B6B20', border: '#FF6B6B', text: '#FF6B6B' };
      case 'warning':
        return { bg: '#FF980020', border: '#FF9800', text: '#FF9800' };
      default:
        return { bg: '#2196F320', border: '#2196F3', text: '#2196F3' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="hover-scale" style={{ borderLeft: '4px solid #FF6B6B' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#FF6B6B20' }}
                >
                  <AlertTriangle size={24} style={{ color: '#FF6B6B' }} />
                </div>
                <div>
                  <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                    Stok Kritis
                  </p>
                  <h3 style={{ color: '#FF6B6B' }}>2 Produk</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="hover-scale" style={{ borderLeft: '4px solid #FF9800' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#FF980020' }}
                >
                  <TrendingDown size={24} style={{ color: '#FF9800' }} />
                </div>
                <div>
                  <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                    Stok Menipis
                  </p>
                  <h3 style={{ color: '#FF9800' }}>2 Produk</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="hover-scale" style={{ borderLeft: '4px solid #858585' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#85858520' }}
                >
                  <Package size={24} style={{ color: '#858585' }} />
                </div>
                <div>
                  <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                    Stok Habis
                  </p>
                  <h3 style={{ color: '#858585' }}>2 Produk</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Low Stock Products */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#2F4858' }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} style={{ color: '#FF9800' }} />
              Produk Perlu Restock
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lowStockProducts.map((product, index) => {
              const colors = getUrgencyColor(product.urgency);
              const percentage = (product.currentStock / product.minStock) * 100;
              
              return (
                <motion.div
                  key={product.id}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: colors.bg,
                    border: `1px solid ${colors.border}`
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                          {product.name}
                        </p>
                        <Badge
                          style={{
                            backgroundColor: colors.border,
                            color: '#FFFFFF',
                            fontSize: '10px'
                          }}
                        >
                          {product.urgency === 'critical' ? 'KRITIS!' : 'Peringatan'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-2">
                        <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                          Stok saat ini: <span style={{ color: colors.text, fontWeight: 600 }}>
                            {product.currentStock}
                          </span> / {product.minStock}
                        </p>
                        <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                          Terjual 24 jam: {product.sold24h}
                        </p>
                      </div>

                      <div className="w-full h-2 rounded-full bg-white overflow-hidden">
                        <motion.div
                          className="h-full"
                          style={{ backgroundColor: colors.border }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                        />
                      </div>
                    </div>

                    <Button
                      size="sm"
                      style={{ backgroundColor: colors.border, color: '#FFFFFF' }}
                    >
                      Restock
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Out of Stock Products */}
      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#2F4858' }}>
            <div className="flex items-center gap-2">
              <Package size={20} style={{ color: '#858585' }} />
              Produk Habis
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {outOfStockProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: '#F5F5F5',
                  border: '1px solid #E0E0E0'
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover opacity-50"
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '8px'
                      }}
                    >
                      <span style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: 600 }}>
                        HABIS
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="body-3 mb-1" style={{ color: '#2F4858', fontWeight: 600 }}>
                      {product.name}
                    </p>
                    <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                      Habis sejak {product.lastStock}
                    </p>
                    <p className="body-3" style={{ color: '#FF6B6B', fontSize: '12px' }}>
                      {product.missedSales} potensi penjualan terlewat
                    </p>
                  </div>

                  <Button variant="outline" size="sm">
                    Aktifkan Lagi
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

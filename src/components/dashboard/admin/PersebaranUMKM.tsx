import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { MapPin, Store, Search, ZoomIn, ZoomOut } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface UMKMPoint {
  id: string;
  name: string;
  category: string;
  address: string;
  area: string;
  status: 'active' | 'inactive';
  x: number; // percentage position
  y: number; // percentage position
  color: string;
  orders: number;
  rating: number;
}

export function PersebaranUMKM() {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<UMKMPoint | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Helper function to determine area from address
  const getAreaFromAddress = (address: string): string => {
    const addr = address.toLowerCase();
    if (addr.includes('bogor tengah') || addr.includes('babakan') || addr.includes('suryakencana')) {
      return 'Bogor Tengah';
    }
    if (addr.includes('bogor utara') || addr.includes('bantarjati') || addr.includes('tegal gundil')) {
      return 'Bogor Utara';
    }
    if (addr.includes('bogor selatan') || addr.includes('cikaret') || addr.includes('bogor sel')) {
      return 'Bogor Selatan';
    }
    if (addr.includes('bogor timur') || addr.includes('bogor tim') || addr.includes('baranangsiang') || addr.includes('sukasari') || addr.includes('ciawi') || addr.includes('cisarua')) {
      return 'Bogor Timur';
    }
    if (addr.includes('bogor barat') || addr.includes('dramaga')) {
      return 'Bogor Barat';
    }
    // Default to Bogor Tengah if unclear
    return 'Bogor Tengah';
  };

  // Helper function to get color by category
  const getColorByCategory = (category: string): string => {
    const colors: Record<string, string> = {
      'Makanan': '#FF8D28',
      'Minuman': '#4CAF50',
      'Kerajinan': '#2196F3',
      'Fashion': '#9C27B0',
      'Jasa': '#FF6B6B'
    };
    return colors[category] || '#858585';
  };

  // Helper function to get position based on area
  const getPositionByArea = (area: string, index: number): { x: number; y: number } => {
    const positions: Record<string, { baseX: number; baseY: number; spread: number }> = {
      'Bogor Tengah': { baseX: 50, baseY: 45, spread: 8 },
      'Bogor Utara': { baseX: 50, baseY: 25, spread: 10 },
      'Bogor Selatan': { baseX: 50, baseY: 70, spread: 8 },
      'Bogor Timur': { baseX: 70, baseY: 50, spread: 10 },
      'Bogor Barat': { baseX: 25, baseY: 50, spread: 8 }
    };
    
    const pos = positions[area] || positions['Bogor Tengah'];
    const offset = (index % 3) * pos.spread - pos.spread;
    return {
      x: pos.baseX + offset,
      y: pos.baseY + (Math.floor(index / 3) * 5)
    };
  };

  // Real UMKM data from directory
  const realUMKMData = [
    { id: 1, name: 'Lapis Bogor Sangkuriang', category: 'Makanan', address: 'Jl. Pajajaran No.20i, RT.01/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143' },
    { id: 2, name: 'Roti Unyil Venus', category: 'Makanan', address: 'Ruko V-Point, Jl. Pajajaran No.1, RT.01/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128' },
    { id: 3, name: 'Asinan Sedap Gedung Dalam', category: 'Makanan', address: 'Jl. Siliwangi No.27C, RT.01/RW.01, Sukasari, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16142' },
    { id: 4, name: 'PIA Apple Pie', category: 'Makanan', address: 'Jl. Pangrango No.10, RT.04/RW.04, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128' },
    { id: 5, name: 'Bika Bogor Talubi', category: 'Makanan', address: 'Jl. Pajajaran No.20M, RT.01/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143' },
    { id: 6, name: 'Macaroni Panggang (MP)', category: 'Makanan', address: 'Jl. Salak No.24, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128' },
    { id: 7, name: 'Jumbo Bakery (Pusat Strudel Bogor)', category: 'Makanan', address: 'Jl. Pajajaran No.3F, RT.02/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128' },
    { id: 8, name: 'Chocomory', category: 'Makanan', address: 'Jl. Raya Puncak - Gadog No.KM 77, Leuwimalang, Kec. Cisarua, Kabupaten Bogor, Jawa Barat 16770' },
    { id: 9, name: 'Kacang Bogor Istana', category: 'Makanan', address: 'Dijual di banyak pusat oleh-oleh, contoh: Priangansari, Jl. Raya Puncak - Gadog No.45, Ciawi, Kabupaten Bogor' },
    { id: 10, name: 'Bogor Raincake', category: 'Makanan', address: 'Jl. Pajajaran No.31, RT.02/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128' },
    { id: 11, name: 'Rumah Talas Bogor', category: 'Makanan', address: 'Jl. Raya Pajajaran No.98, Bantarjati, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16153' },
    { id: 12, name: 'Miss Pumpkin', category: 'Makanan', address: 'Jl. Pajajaran No.43, RT.03/RW.10, Bantarjati, Kec. Bogor Utara, Kota Bogor, Jawa Barat 16153' },
    { id: 13, name: 'Brownies Pisang Citarasa', category: 'Makanan', address: 'Toko Oleh-Oleh Citarasa, Jl. Raya Puncak - Gadog, Ciawi, Bogor' },
    { id: 14, name: 'Mochi Mochi "Mochilaku"', category: 'Makanan', address: 'Ruko Villa Indah Pajajaran, Jl. Pajajaran No.18, RT.02/RW.11, Bantarjati, Kec. Bogor Utara, Kota Bogor' },
    { id: 15, name: 'Priangansari', category: 'Makanan', address: 'Jl. Raya Puncak - Gadog No.45, Ciawi, Kec. Ciawi, Kabupaten Bogor, Jawa Barat 16720' },
    { id: 16, name: 'Kopi Halimun', category: 'Minuman', address: 'Jl. Malabar No.23, RT.04/RW.07, Tegal Gundil, Kec. Bogor Utara, Kota Bogor' },
    { id: 17, name: 'Batik Tradisiku', category: 'Kerajinan', address: 'Jl. Neglasari I No.2, RT.01/RW.04, Cikaret, Kec. Bogor Sel., Kota Bogor, Jawa Barat 16132' },
    { id: 18, name: 'Galeri Dekranasda Kota Bogor', category: 'Kerajinan', address: 'Jl. Bina Marga No.1D, RT.04/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor' },
    { id: 19, name: 'Unchal Kaos Bogor', category: 'Kerajinan', address: 'Jl. Pajajaran No.1, RT.01/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor' },
    { id: 20, name: 'Bir Kotjok Si Abah', category: 'Minuman', address: 'Jl. Suryakencana No.291, RT.02/RW.06, Gudang, Kecamatan Bogor Tengah, Kota Bogor' }
  ];

  // Convert to UMKMPoint format with consistent values
  const umkmPoints: UMKMPoint[] = useMemo(() => {
    return realUMKMData.map((umkm, index) => {
      const area = getAreaFromAddress(umkm.address);
      const areaIndex = realUMKMData.filter((u, i) => i < index && getAreaFromAddress(u.address) === area).length;
      const finalPos = getPositionByArea(area, areaIndex);
      
      // Generate consistent pseudo-random values based on ID
      const seed = umkm.id * 17;
      const orders = 100 + (seed % 500);
      const rating = 4.5 + ((seed % 50) / 100);
      
      return {
        id: umkm.id.toString(),
        name: umkm.name,
        category: umkm.category,
        address: umkm.address,
        area: area,
        status: 'active' as const,
        x: finalPos.x,
        y: finalPos.y,
        color: getColorByCategory(umkm.category),
        orders: orders,
        rating: Math.round(rating * 10) / 10
      };
    });
  }, []);

  // Calculate area stats from real data
  const areaStats = useMemo(() => [
    { area: 'Bogor Tengah', count: umkmPoints.filter(p => p.area === 'Bogor Tengah').length, active: umkmPoints.filter(p => p.area === 'Bogor Tengah' && p.status === 'active').length, color: '#FF8D28' },
    { area: 'Bogor Utara', count: umkmPoints.filter(p => p.area === 'Bogor Utara').length, active: umkmPoints.filter(p => p.area === 'Bogor Utara' && p.status === 'active').length, color: '#2196F3' },
    { area: 'Bogor Selatan', count: umkmPoints.filter(p => p.area === 'Bogor Selatan').length, active: umkmPoints.filter(p => p.area === 'Bogor Selatan' && p.status === 'active').length, color: '#FFB800' },
    { area: 'Bogor Timur', count: umkmPoints.filter(p => p.area === 'Bogor Timur').length, active: umkmPoints.filter(p => p.area === 'Bogor Timur' && p.status === 'active').length, color: '#4CAF50' },
    { area: 'Bogor Barat', count: umkmPoints.filter(p => p.area === 'Bogor Barat').length, active: umkmPoints.filter(p => p.area === 'Bogor Barat' && p.status === 'active').length, color: '#9C27B0' },
  ], [umkmPoints]);

  const filteredPoints = umkmPoints.filter(point => {
    const matchesArea = selectedArea === 'all' || point.area === selectedArea;
    const matchesSearch = point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         point.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesArea && matchesSearch;
  });

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 0.2, 0.5));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 style={{ color: '#2F4858' }}>Persebaran UMKM Bogor</h3>
        <p className="body-3 mt-2" style={{ color: '#858585' }}>
          Peta interaktif menampilkan lokasi dan status UMKM di seluruh wilayah Kota Bogor
        </p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid md:grid-cols-5 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {areaStats.map((stat, index) => (
          <motion.div
            key={stat.area}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            <Card className="hover-scale cursor-pointer" onClick={() => setSelectedArea(stat.area)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  />
                  <Badge variant="outline" style={{ fontSize: '10px' }}>
                    {stat.active}/{stat.count}
                  </Badge>
                </div>
                <p className="body-3" style={{ color: '#2F4858', fontWeight: 600, fontSize: '13px' }}>
                  {stat.area.replace('Bogor ', '')}
                </p>
                <p className="body-3 mt-1" style={{ color: '#858585', fontSize: '11px' }}>
                  {stat.count} UMKM
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: '#858585' }} />
                <Input
                  placeholder="Cari UMKM berdasarkan nama atau kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Area Filter */}
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Pilih Wilayah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Wilayah</SelectItem>
                  <SelectItem value="Bogor Tengah">Bogor Tengah</SelectItem>
                  <SelectItem value="Bogor Utara">Bogor Utara</SelectItem>
                  <SelectItem value="Bogor Selatan">Bogor Selatan</SelectItem>
                  <SelectItem value="Bogor Timur">Bogor Timur</SelectItem>
                  <SelectItem value="Bogor Barat">Bogor Barat</SelectItem>
                </SelectContent>
              </Select>

              {/* Zoom Controls */}
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={handleZoomOut}>
                  <ZoomOut size={18} />
                </Button>
                <Button variant="outline" size="icon" onClick={handleZoomIn}>
                  <ZoomIn size={18} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Interactive Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div
              className="relative bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden"
              style={{ height: '600px' }}
            >
              {/* Map Background with Bogor Illustration */}
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {/* Mountain Silhouette Background */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-200 to-transparent opacity-30" />
                
                {/* Grid Lines */}
                <svg className="absolute inset-0 w-full h-full opacity-10">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2F4858" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Area Labels */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
                  <p className="body-3" style={{ color: '#2196F3', fontWeight: 600 }}>Bogor Utara</p>
                </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                  <p className="body-3" style={{ color: '#FFB800', fontWeight: 600 }}>Bogor Selatan</p>
                </div>
                <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
                  <p className="body-3" style={{ color: '#9C27B0', fontWeight: 600 }}>Bogor Barat</p>
                </div>
                <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
                  <p className="body-3" style={{ color: '#4CAF50', fontWeight: 600 }}>Bogor Timur</p>
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <p className="body-3" style={{ color: '#FF8D28', fontWeight: 600, fontSize: '16px' }}>
                    Bogor Tengah
                  </p>
                </div>
              </motion.div>

              {/* UMKM Points */}
              <motion.div
                className="absolute inset-0"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.3s ease-out'
                }}
              >
                <AnimatePresence>
                  {filteredPoints.map((point, index) => (
                    <motion.div
                      key={point.id}
                      className="absolute cursor-pointer"
                      style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        delay: index * 0.05,
                        type: 'spring',
                        stiffness: 300,
                        damping: 20
                      }}
                      onMouseEnter={() => setHoveredPoint(point.id)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      onClick={() => setSelectedPoint(point)}
                      whileHover={{ scale: 1.3 }}
                    >
                      {/* Pulsing Animation for Active UMKM */}
                      {point.status === 'active' && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{
                            backgroundColor: point.color,
                            opacity: 0.3,
                          }}
                          animate={{
                            scale: [1, 1.8, 1],
                            opacity: [0.3, 0, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      )}

                      {/* Point Marker */}
                      <motion.div
                        className="relative w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: point.color,
                          boxShadow: `0 4px 12px ${point.color}60`,
                        }}
                      >
                        <Store size={16} style={{ color: '#FFFFFF' }} />
                      </motion.div>

                      {/* Hover Tooltip */}
                      <AnimatePresence>
                        {hoveredPoint === point.id && (
                          <motion.div
                            className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 w-64 p-3 rounded-lg shadow-lg z-50"
                            style={{ backgroundColor: '#FFFFFF', border: `2px solid ${point.color}` }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                          >
                            <div className="flex items-start gap-2">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: point.color + '20' }}
                              >
                                <Store size={20} style={{ color: point.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="body-3 mb-1" style={{ color: '#2F4858', fontWeight: 600 }}>
                                  {point.name}
                                </p>
                                <Badge
                                  variant="outline"
                                  style={{
                                    fontSize: '10px',
                                    backgroundColor: point.status === 'active' ? '#C8E6C920' : '#F5F5F5',
                                    color: point.status === 'active' ? '#4CAF50' : '#858585',
                                    borderColor: point.status === 'active' ? '#4CAF50' : '#858585'
                                  }}
                                >
                                  {point.status === 'active' ? 'Aktif' : 'Nonaktif'}
                                </Badge>
                                <p className="body-3 mt-2" style={{ color: '#858585', fontSize: '11px' }}>
                                  📍 {point.address}
                                </p>
                                <p className="body-3 mt-1" style={{ color: '#858585', fontSize: '11px' }}>
                                  🏷️ {point.category} • {point.area}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="body-3" style={{ color: '#FF8D28', fontSize: '11px', fontWeight: 600 }}>
                                    {point.orders} orders
                                  </span>
                                  <span className="body-3" style={{ color: '#FFB800', fontSize: '11px', fontWeight: 600 }}>
                                    ⭐ {point.rating}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Legend */}
              <motion.div
                className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <p className="body-3 mb-3" style={{ color: '#2F4858', fontWeight: 600, fontSize: '12px' }}>
                  Legend
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#4CAF50' }} />
                    <p className="body-3" style={{ color: '#858585', fontSize: '11px' }}>UMKM Aktif</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#858585' }} />
                    <p className="body-3" style={{ color: '#858585', fontSize: '11px' }}>UMKM Nonaktif</p>
                  </div>
                </div>
              </motion.div>

              {/* Info Badge */}
              <motion.div
                className="absolute top-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                  {filteredPoints.length} UMKM ditampilkan
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPoint && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPoint(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: selectedPoint.color + '20' }}
                >
                  <Store size={32} style={{ color: selectedPoint.color }} />
                </div>
                <div className="flex-1">
                  <h3 style={{ color: '#2F4858', fontSize: '20px' }}>
                    {selectedPoint.name}
                  </h3>
                  <Badge
                    className="mt-2"
                    style={{
                      backgroundColor: selectedPoint.status === 'active' ? '#4CAF50' : '#858585',
                      color: '#FFFFFF'
                    }}
                  >
                    {selectedPoint.status === 'active' ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
                  <MapPin size={18} style={{ color: selectedPoint.color }} />
                  <div>
                    <p className="body-3" style={{ color: '#858585', fontSize: '11px' }}>Alamat</p>
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                      {selectedPoint.address}
                    </p>
                    <p className="body-3 mt-1" style={{ color: '#858585', fontSize: '11px' }}>
                      {selectedPoint.area}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#FF8D2820' }}>
                    <p className="body-3 mb-1" style={{ color: '#858585', fontSize: '11px' }}>Total Orders</p>
                    <p className="body-3" style={{ color: '#FF8D28', fontWeight: 600, fontSize: '18px' }}>
                      {selectedPoint.orders}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: '#FFB80020' }}>
                    <p className="body-3 mb-1" style={{ color: '#858585', fontSize: '11px' }}>Rating</p>
                    <p className="body-3" style={{ color: '#FFB800', fontWeight: 600, fontSize: '18px' }}>
                      ⭐ {selectedPoint.rating}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
                  <p className="body-3 mb-1" style={{ color: '#858585', fontSize: '11px' }}>Kategori</p>
                  <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                    {selectedPoint.category}
                  </p>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                style={{ backgroundColor: selectedPoint.color }}
                onClick={() => setSelectedPoint(null)}
              >
                Tutup
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

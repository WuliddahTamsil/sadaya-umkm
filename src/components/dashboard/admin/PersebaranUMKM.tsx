import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { MapPin, Store, Search, ZoomIn, ZoomOut, Filter, X, Coffee, UtensilsCrossed, Hammer, Shirt, Wrench, Building2, TrendingUp, Users, Activity, Star, Navigation, Info } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';

interface UMKMPoint {
  id: string;
  name: string;
  category: string;
  address: string;
  area: string;
  status: 'active' | 'inactive';
  x: number;
  y: number;
  color: string;
  orders: number;
  rating: number;
  icon: any;
}

export function PersebaranUMKM() {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<UMKMPoint | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

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
    return 'Bogor Tengah';
  };

  const getColorByCategory = (category: string): string => {
    const colors: Record<string, string> = {
      'Makanan': '#F99912', // Orange
      'Minuman': '#9ACD32', // Lime
      'Kerajinan': '#9370DB', // Purple
      'Fashion': '#F99912', // Orange
      'Jasa': '#9ACD32' // Lime
    };
    return colors[category] || '#757575';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      'Makanan': UtensilsCrossed,
      'Minuman': Coffee,
      'Kerajinan': Hammer,
      'Fashion': Shirt,
      'Jasa': Wrench
    };
    return icons[category] || Store;
  };

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

  const umkmPoints: UMKMPoint[] = useMemo(() => {
    return realUMKMData.map((umkm, index) => {
      const area = getAreaFromAddress(umkm.address);
      const areaIndex = realUMKMData.filter((u, i) => i < index && getAreaFromAddress(u.address) === area).length;
      const finalPos = getPositionByArea(area, areaIndex);
      
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
        rating: Math.round(rating * 10) / 10,
        icon: getCategoryIcon(umkm.category)
      };
    });
  }, []);

  const areaStats = useMemo(() => [
    { 
      area: 'Bogor Tengah', 
      count: umkmPoints.filter(p => p.area === 'Bogor Tengah').length, 
      active: umkmPoints.filter(p => p.area === 'Bogor Tengah' && p.status === 'active').length, 
      color: '#9ACD32'
    },
    { 
      area: 'Bogor Utara', 
      count: umkmPoints.filter(p => p.area === 'Bogor Utara').length, 
      active: umkmPoints.filter(p => p.area === 'Bogor Utara' && p.status === 'active').length, 
      color: '#1565C0'
    },
    { 
      area: 'Bogor Selatan', 
      count: umkmPoints.filter(p => p.area === 'Bogor Selatan').length, 
      active: umkmPoints.filter(p => p.area === 'Bogor Selatan' && p.status === 'active').length, 
      color: '#F99912'
    },
    { 
      area: 'Bogor Timur', 
      count: umkmPoints.filter(p => p.area === 'Bogor Timur').length, 
      active: umkmPoints.filter(p => p.area === 'Bogor Timur' && p.status === 'active').length, 
      color: '#388E3C'
    },
    { 
      area: 'Bogor Barat', 
      count: umkmPoints.filter(p => p.area === 'Bogor Barat').length, 
      active: umkmPoints.filter(p => p.area === 'Bogor Barat' && p.status === 'active').length, 
      color: '#7B1FA2'
    },
  ], [umkmPoints]);

  const filteredPoints = umkmPoints.filter(point => {
    const matchesArea = selectedArea === 'all' || point.area === selectedArea;
    const matchesCategory = selectedCategory === 'all' || point.category === selectedCategory;
    const matchesSearch = point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         point.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         point.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesArea && matchesCategory && matchesSearch;
  });

  const handleZoomIn = () => setZoomLevel(Math.min(zoomLevel + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(Math.max(zoomLevel - 0.2, 0.5));

  // Enhanced Area polygon paths with more detail
  const getAreaPath = (area: string): string => {
    const paths: Record<string, string> = {
      'Bogor Tengah': 'M 35,30 Q 40,25 50,30 T 65,30 Q 70,35 65,50 T 50,60 Q 40,55 35,50 T 35,30 Z',
      'Bogor Utara': 'M 35,5 Q 50,0 65,5 L 70,20 Q 65,25 50,25 T 30,20 Q 30,10 35,5 Z',
      'Bogor Selatan': 'M 35,65 Q 50,70 65,65 L 70,85 Q 65,90 50,90 T 30,85 Q 30,75 35,65 Z',
      'Bogor Timur': 'M 60,30 Q 75,35 85,40 L 90,55 Q 85,60 75,60 T 60,55 Q 55,45 60,30 Z',
      'Bogor Barat': 'M 10,30 Q 5,35 10,50 T 25,60 Q 30,55 25,40 T 10,30 Z'
    };
    return paths[area] || paths['Bogor Tengah'];
  };

  // Enhanced Road network with more detail and curves
  const roadLines = [
    // Main horizontal roads
    { x1: 0, y1: 20, x2: 100, y2: 20, width: 3 }, // Jalan Raya Utama Utara
    { x1: 0, y1: 40, x2: 100, y2: 40, width: 4 }, // Jalan Raya Pusat
    { x1: 0, y1: 60, x2: 100, y2: 60, width: 3 }, // Jalan Raya Selatan
    { x1: 0, y1: 80, x2: 100, y2: 80, width: 2 }, // Jalan Kecil Selatan
    
    // Main vertical roads
    { x1: 20, y1: 0, x2: 20, y2: 100, width: 2 }, // Jalan Barat
    { x1: 40, y1: 0, x2: 40, y2: 100, width: 3 }, // Jalan Tengah Barat
    { x1: 50, y1: 0, x2: 50, y2: 100, width: 4 }, // Jalan Pusat
    { x1: 60, y1: 0, x2: 60, y2: 100, width: 3 }, // Jalan Tengah Timur
    { x1: 80, y1: 0, x2: 80, y2: 100, width: 2 }, // Jalan Timur
    
    // Diagonal/curved roads
    { x1: 10, y1: 10, x2: 30, y2: 30, width: 2 },
    { x1: 70, y1: 30, x2: 90, y2: 50, width: 2 },
    { x1: 30, y1: 70, x2: 50, y2: 90, width: 2 },
  ];

  const totalUMKM = umkmPoints.length;
  const activeUMKM = umkmPoints.filter(p => p.status === 'active').length;
  const avgRating = useMemo(() => {
    const sum = umkmPoints.reduce((acc, p) => acc + p.rating, 0);
    return (sum / umkmPoints.length).toFixed(1);
  }, [umkmPoints]);
  const totalOrders = useMemo(() => {
    return umkmPoints.reduce((acc, p) => acc + p.orders, 0);
  }, [umkmPoints]);

  return (
    <div className="space-y-6">
      {/* Elegant Header with Statistics */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm mb-2" style={{ color: '#858585' }}>
              Visualisasi distribusi UMKM di seluruh wilayah Kota Bogor
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-48 bg-white shadow-sm hover:shadow-md transition-shadow">
                <MapPin size={16} className="mr-2" />
                <SelectValue placeholder="Wilayah" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Wilayah</SelectItem>
                {areaStats.map(stat => (
                  <SelectItem key={stat.area} value={stat.area}>
                    {stat.area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-white shadow-sm hover:shadow-md transition-shadow">
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="Makanan">Makanan</SelectItem>
                <SelectItem value="Minuman">Minuman</SelectItem>
                <SelectItem value="Kerajinan">Kerajinan</SelectItem>
                <SelectItem value="Fashion">Fashion</SelectItem>
                <SelectItem value="Jasa">Jasa</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: '#858585' }} />
              <Input
                placeholder="Cari UMKM, kategori, atau alamat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white shadow-sm hover:shadow-md transition-shadow"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Total UMKM</p>
                  <p className="text-3xl font-bold">{totalUMKM}</p>
                  <p className="text-xs opacity-75 mt-1">Seluruh wilayah</p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Store size={40} className="opacity-80" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">UMKM Aktif</p>
                  <p className="text-3xl font-bold">{activeUMKM}</p>
                  <p className="text-xs opacity-75 mt-1">{((activeUMKM / totalUMKM) * 100).toFixed(0)}% dari total</p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Activity size={40} className="opacity-80" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card 
            className="text-white border-2 shadow-2xl hover:shadow-3xl transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #E65100 0%, #FF6F00 50%, #FF8F00 100%)',
              borderColor: '#E65100',
              boxShadow: '0 10px 40px rgba(230, 81, 0, 0.5), 0 0 0 1px rgba(230, 81, 0, 0.1)'
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Total Orders</p>
                  <p className="text-3xl font-bold" style={{ color: '#FFFFFF', textShadow: '0 3px 6px rgba(0,0,0,0.4)' }}>{totalOrders.toLocaleString()}</p>
                  <p className="text-xs font-medium mt-1" style={{ color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>Semua waktu</p>
                </div>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <TrendingUp size={40} style={{ color: '#FFFFFF', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))' }} />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card 
            className="text-white border-2 shadow-2xl hover:shadow-3xl transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #6A1B9A 0%, #8E24AA 50%, #AB47BC 100%)',
              borderColor: '#6A1B9A',
              boxShadow: '0 10px 40px rgba(106, 27, 154, 0.5), 0 0 0 1px rgba(106, 27, 154, 0.1)'
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Rating Rata-rata</p>
                  <p className="text-3xl font-bold" style={{ color: '#FFFFFF', textShadow: '0 3px 6px rgba(0,0,0,0.4)' }}>{avgRating}</p>
                  <p className="text-xs font-medium mt-1" style={{ color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>Dari semua UMKM</p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Star size={40} style={{ color: '#FFD700', fill: '#FFD700', filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))' }} />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Area Statistics Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: '#2F4858' }}>
          Statistik per Wilayah
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {areaStats.map((stat, index) => (
            <motion.div
              key={stat.area}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onMouseEnter={() => setHoveredArea(stat.area)}
              onMouseLeave={() => setHoveredArea(null)}
              onClick={() => setSelectedArea(stat.area === selectedArea ? 'all' : stat.area)}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  selectedArea === stat.area ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{
                  borderColor: selectedArea === stat.area ? stat.color : '#E0E0E0',
                  ringColor: stat.color,
                  backgroundColor: hoveredArea === stat.area ? `${stat.color}10` : 'white'
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                    <Badge 
                      variant="outline"
                      style={{
                        borderColor: stat.color,
                        color: stat.color,
                        fontSize: '10px'
                      }}
                    >
                      {stat.area}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: '#858585' }}>Total</span>
                      <span className="text-lg font-bold" style={{ color: '#2F4858' }}>
                        {stat.count}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{ color: '#858585' }}>Aktif</span>
                      <span className="text-sm font-semibold" style={{ color: stat.color }}>
                        {stat.active}
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: stat.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.active / stat.count) * 100}%` }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Professional Map */}
      <Card className="overflow-hidden border-0 shadow-2xl" style={{ 
        borderColor: '#E0E0E0',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <CardContent className="p-0">
          <div
            className="relative overflow-hidden"
            style={{ 
              height: '750px',
              background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)',
              position: 'relative'
            }}
          >
            {/* Decorative Background Pattern */}
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, #2F4858 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}
            />
            
            {/* Gradient Overlay for Depth */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(0,0,0,0.05) 0%, transparent 50%)'
              }}
            />
            {/* Enhanced Detailed Grid with Modern Style */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#2F4858" strokeWidth="1" opacity="0.6" />
                </pattern>
                <pattern id="subgrid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#2F4858" strokeWidth="0.5" opacity="0.3" />
                </pattern>
                <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2F4858" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#2F4858" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridGradient)" />
              <rect width="100%" height="100%" fill="url(#grid)" />
              <rect width="100%" height="100%" fill="url(#subgrid)" />
            </svg>

            {/* Enhanced Area Polygons with Gradient and Labels */}
            <svg className="absolute inset-0 w-full h-full">
              <defs>
                {areaStats.map(stat => (
                  <linearGradient key={`gradient-${stat.area}`} id={`gradient-${stat.area}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={stat.color} stopOpacity="0.3" />
                    <stop offset="50%" stopColor={stat.color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={stat.color} stopOpacity="0.1" />
                  </linearGradient>
                ))}
              </defs>
              {areaStats.map((stat, index) => (
                <g key={stat.area}>
                  <motion.path
                    d={getAreaPath(stat.area)}
                    fill={`url(#gradient-${stat.area})`}
                    fillOpacity={selectedArea === stat.area ? 0.5 : hoveredArea === stat.area ? 0.4 : 0.25}
                    stroke={stat.color}
                    strokeWidth={selectedArea === stat.area ? 4 : hoveredArea === stat.area ? 3 : 2}
                    strokeDasharray={selectedArea === stat.area ? '0' : '5,5'}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    onMouseEnter={() => setHoveredArea(stat.area)}
                    onMouseLeave={() => setHoveredArea(null)}
                    style={{ cursor: 'pointer' }}
                  />
                  {/* Area Labels */}
                  <motion.text
                    x={stat.area === 'Bogor Tengah' ? '50%' : stat.area === 'Bogor Utara' ? '50%' : stat.area === 'Bogor Selatan' ? '50%' : stat.area === 'Bogor Timur' ? '75%' : '20%'}
                    y={stat.area === 'Bogor Tengah' ? '45%' : stat.area === 'Bogor Utara' ? '15%' : stat.area === 'Bogor Selatan' ? '75%' : '50%'}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill={stat.color}
                    opacity={selectedArea === stat.area || hoveredArea === stat.area ? 0.9 : 0.6}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: selectedArea === stat.area || hoveredArea === stat.area ? 0.9 : 0.6, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    style={{ 
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      pointerEvents: 'none',
                      userSelect: 'none'
                    }}
                  >
                    {stat.area}
                  </motion.text>
                </g>
              ))}
            </svg>

            {/* Enhanced Road Network with Modern Styling */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#F5F5F5" stopOpacity="0.6" />
                </linearGradient>
                <filter id="roadShadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                  <feOffset dx="0" dy="1" result="offsetblur"/>
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.3"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {roadLines.map((road, index) => (
                <g key={index} filter="url(#roadShadow)">
                  {/* Road shadow for depth */}
                  <motion.line
                    x1={`${road.x1}%`}
                    y1={`${road.y1}%`}
                    x2={`${road.x2}%`}
                    y2={`${road.y2}%`}
                    stroke="#000000"
                    strokeWidth={(road.width || 2) + 3}
                    opacity={0.15}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.2 + index * 0.08, duration: 1.2, ease: 'easeOut' }}
                  />
                  {/* Main road with gradient */}
                  <motion.line
                    x1={`${road.x1}%`}
                    y1={`${road.y1}%`}
                    x2={`${road.x2}%`}
                    y2={`${road.y2}%`}
                    stroke="url(#roadGradient)"
                    strokeWidth={road.width || 2}
                    strokeDasharray={road.width && road.width >= 3 ? "0" : "15,8"}
                    opacity={0.7}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.2 + index * 0.08, duration: 1.2, ease: 'easeOut' }}
                  />
                  {/* Road center line for main roads */}
                  {road.width && road.width >= 3 && (
                    <motion.line
                      x1={`${road.x1}%`}
                      y1={`${road.y1}%`}
                      x2={`${road.x2}%`}
                      y2={`${road.y2}%`}
                      stroke="#FFD700"
                      strokeWidth="1.5"
                      strokeDasharray="10,6"
                      opacity={0.6}
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.4 + index * 0.08, duration: 1, ease: 'easeOut' }}
                    />
                  )}
                </g>
              ))}
            </svg>

            {/* UMKM Markers - Enhanced Professional Style */}
            <motion.div
              className="absolute inset-0"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <AnimatePresence mode="popLayout">
                {filteredPoints.map((point, index) => {
                  const IconComponent = point.icon;
                  return (
                    <motion.div
                      key={point.id}
                      className="absolute cursor-pointer z-10 group"
                      style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      initial={{ scale: 0, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0, opacity: 0, y: -20 }}
                      transition={{
                        delay: index * 0.03,
                        type: 'spring',
                        stiffness: 400,
                        damping: 25
                      }}
                      onMouseEnter={() => setHoveredPoint(point.id)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      onClick={() => setSelectedPoint(point)}
                      whileHover={{ scale: 1.2, zIndex: 50 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Enhanced Pulsing Animation */}
                      {point.status === 'active' && (
                        <>
                          <motion.div
                            className="absolute inset-0 rounded-full -z-10"
                            style={{
                              backgroundColor: point.color,
                              opacity: 0.3,
                            }}
                            animate={{
                              scale: [1, 1.8, 1],
                              opacity: [0.3, 0, 0.3],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          />
                          <motion.div
                            className="absolute inset-0 rounded-full -z-10"
                            style={{
                              backgroundColor: point.color,
                              opacity: 0.2,
                            }}
                            animate={{
                              scale: [1, 2.2, 1],
                              opacity: [0.2, 0, 0.2],
                            }}
                            transition={{
                              duration: 2.5,
                              repeat: Infinity,
                              ease: 'easeInOut',
                              delay: 0.5,
                            }}
                          />
                        </>
                      )}

                      {/* Enhanced Marker with Shadow and Glow */}
                      <motion.div
                        className="relative"
                        whileHover={{ 
                          scale: 1.1,
                          transition: { type: 'spring', stiffness: 400 }
                        }}
                      >
                        <motion.div
                          className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl"
                          style={{
                            border: `3px solid ${point.color}`,
                            boxShadow: `0 4px 20px ${point.color}60, 0 2px 8px rgba(0,0,0,0.15)`,
                          }}
                          animate={{
                            boxShadow: [
                              `0 4px 20px ${point.color}60, 0 2px 8px rgba(0,0,0,0.15)`,
                              `0 6px 30px ${point.color}80, 0 4px 12px rgba(0,0,0,0.2)`,
                              `0 4px 20px ${point.color}60, 0 2px 8px rgba(0,0,0,0.15)`,
                            ],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        >
                          <IconComponent 
                            size={24} 
                            style={{ color: point.color }} 
                          />
                        </motion.div>
                      </motion.div>

                      {/* Enhanced Tooltip with More Details */}
                      <AnimatePresence>
                        {hoveredPoint === point.id && (
                          <motion.div
                            className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 z-50"
                            initial={{ opacity: 0, x: -10, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -10, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          >
                            <div 
                              className="bg-white rounded-xl shadow-2xl p-4 border-2"
                              style={{ 
                                borderColor: point.color,
                                minWidth: '280px',
                                boxShadow: `0 10px 40px ${point.color}40`
                              }}
                            >
                              <div className="flex items-start gap-3 mb-3">
                                <div
                                  className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                                  style={{ backgroundColor: `${point.color}15` }}
                                >
                                  {(() => {
                                    const IconComponent = point.icon;
                                    return <IconComponent size={24} style={{ color: point.color }} />;
                                  })()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm mb-1 truncate" style={{ color: '#2F4858' }}>
                                    {point.name}
                                  </p>
                                  <div className="flex items-center gap-1 mb-2">
                                    <MapPin size={12} style={{ color: '#858585' }} />
                                    <p className="text-xs truncate" style={{ color: '#858585' }}>
                                      {point.area}
                                    </p>
                                  </div>
                                  <Badge 
                                    variant="outline"
                                    className="text-xs"
                                    style={{
                                      borderColor: point.color,
                                      color: point.color,
                                      backgroundColor: `${point.color}10`
                                    }}
                                  >
                                    {point.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3 pt-3 border-t" style={{ borderColor: '#E0E0E0' }}>
                                <div>
                                  <p className="text-xs mb-1" style={{ color: '#858585' }}>Orders</p>
                                  <p className="text-sm font-bold" style={{ color: '#2F4858' }}>
                                    {point.orders.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs mb-1" style={{ color: '#858585' }}>Rating</p>
                                  <div className="flex items-center gap-1">
                                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                    <p className="text-sm font-bold" style={{ color: '#2F4858' }}>
                                      {point.rating}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <motion.div
                                className="mt-3 pt-3 border-t"
                                style={{ borderColor: '#E0E0E0' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                              >
                                <Button
                                  size="sm"
                                  className="w-full text-xs"
                                  style={{
                                    backgroundColor: point.color,
                                    color: 'white'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPoint(point);
                                  }}
                                >
                                  <Info size={12} className="mr-1" />
                                  Lihat Detail
                                </Button>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Enhanced Title Box - Top Left with Modern Design */}
            <motion.div
              className="absolute top-6 left-6 z-20"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div 
                className="px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm border-2"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.95) 0%, rgba(56, 142, 60, 0.95) 100%)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  boxShadow: '0 20px 60px rgba(46, 125, 50, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <MapPin size={24} className="text-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                  </motion.div>
                  <div>
                    <p className="font-bold text-base mb-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                      Peta UMKM Kota Bogor
                    </p>
                    <p className="text-xs font-medium opacity-90" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                      Visualisasi Interaktif & Real-time
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Legend - Bottom Left with Modern Glass Design */}
            <motion.div
              className="absolute bottom-6 left-6 z-20"
              initial={{ opacity: 0, y: 20, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div 
                className="rounded-2xl shadow-2xl backdrop-blur-md border-2"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
                  borderColor: 'rgba(46, 125, 50, 0.3)',
                  minWidth: '280px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                }}
              >
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b" style={{ borderColor: 'rgba(46, 125, 50, 0.2)' }}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                      <Filter size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-base" style={{ color: '#2F4858' }}>Kategori UMKM</p>
                      <p className="text-xs" style={{ color: '#858585' }}>Filter berdasarkan jenis</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: 'Makanan', color: '#F99912', icon: UtensilsCrossed, count: filteredPoints.filter(p => p.category === 'Makanan').length },
                      { name: 'Minuman', color: '#9ACD32', icon: Coffee, count: filteredPoints.filter(p => p.category === 'Minuman').length },
                      { name: 'Kerajinan', color: '#9370DB', icon: Hammer, count: filteredPoints.filter(p => p.category === 'Kerajinan').length },
                      { name: 'Fashion', color: '#F99912', icon: Shirt, count: filteredPoints.filter(p => p.category === 'Fashion').length },
                      { name: 'Jasa', color: '#9ACD32', icon: Wrench, count: filteredPoints.filter(p => p.category === 'Jasa').length },
                    ].map((cat, index) => {
                      const IconComponent = cat.icon;
                      const isSelected = selectedCategory === cat.name;
                      return (
                        <motion.div
                          key={cat.name}
                          className="flex items-center justify-between gap-3 p-3 rounded-xl transition-all cursor-pointer"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.05, type: 'spring', stiffness: 200 }}
                          onClick={() => setSelectedCategory(cat.name === selectedCategory ? 'all' : cat.name)}
                          whileHover={{ scale: 1.02, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            background: isSelected 
                              ? `linear-gradient(135deg, ${cat.color}15 0%, ${cat.color}08 100%)`
                              : 'transparent',
                            border: isSelected 
                              ? `2px solid ${cat.color}` 
                              : '2px solid rgba(0, 0, 0, 0.05)',
                            boxShadow: isSelected 
                              ? `0 4px 20px ${cat.color}30, inset 0 1px 0 rgba(255, 255, 255, 0.5)`
                              : '0 2px 8px rgba(0, 0, 0, 0.05)'
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <motion.div 
                              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                              style={{ 
                                background: `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}dd 100%)`,
                                boxShadow: `0 4px 15px ${cat.color}40`
                              }}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                            >
                              <IconComponent size={20} className="text-white" />
                            </motion.div>
                            <div className="flex-1">
                              <p className="text-sm font-bold" style={{ color: '#2F4858' }}>{cat.name}</p>
                              <p className="text-xs font-medium" style={{ color: '#858585' }}>
                                {cat.count} UMKM {isSelected && '• Aktif'}
                              </p>
                            </div>
                          </div>
                          <motion.div 
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                            style={{ 
                              backgroundColor: isSelected ? cat.color : 'transparent',
                              borderColor: cat.color,
                            }}
                            animate={{ scale: isSelected ? 1.1 : 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 rounded-full bg-white"
                              />
                            )}
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Info Box - Bottom Right with Modern Glass Design */}
            <motion.div
              className="absolute bottom-6 right-6 z-20"
              initial={{ opacity: 0, x: 20, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div 
                className="rounded-2xl shadow-2xl backdrop-blur-md border-2"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
                  borderColor: 'rgba(46, 125, 50, 0.3)',
                  minWidth: '300px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                }}
              >
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b" style={{ borderColor: 'rgba(46, 125, 50, 0.2)' }}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <Info size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-base" style={{ color: '#2F4858' }}>Informasi Peta</p>
                      <p className="text-xs" style={{ color: '#858585' }}>Statistik real-time</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { 
                        label: 'UMKM Ditampilkan', 
                        value: `${filteredPoints.length} / ${totalUMKM}`,
                        color: '#9370DB',
                        icon: Store
                      },
                      { 
                        label: 'UMKM Aktif', 
                        value: filteredPoints.filter(p => p.status === 'active').length.toString(),
                        color: '#9ACD32',
                        icon: Activity
                      },
                      { 
                        label: 'Wilayah', 
                        value: selectedArea === 'all' ? 'Semua' : selectedArea,
                        color: '#FF9800',
                        icon: MapPin
                      },
                      { 
                        label: 'Kategori', 
                        value: selectedCategory === 'all' ? 'Semua' : selectedCategory,
                        color: '#9370DB',
                        icon: Filter
                      },
                    ].map((stat, index) => {
                      const IconComponent = stat.icon;
                      return (
                        <motion.div
                          key={stat.label}
                          className="flex items-center justify-between p-3 rounded-xl"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.05, type: 'spring', stiffness: 200 }}
                          style={{
                            background: `linear-gradient(135deg, ${stat.color}08 0%, ${stat.color}03 100%)`,
                            border: `1px solid ${stat.color}20`
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${stat.color}20` }}
                            >
                              <IconComponent size={16} style={{ color: stat.color }} />
                            </div>
                            <p className="text-xs font-medium" style={{ color: '#858585' }}>{stat.label}</p>
                          </div>
                          <p className="text-sm font-bold" style={{ color: stat.color }}>
                            {stat.value}
                          </p>
                        </motion.div>
                      );
                    })}
                    <div className="pt-3 mt-3 border-t" style={{ borderColor: 'rgba(46, 125, 50, 0.2)' }}>
                      <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: 'rgba(46, 125, 50, 0.05)' }}>
                        <MapPin size={16} style={{ color: '#9ACD32' }} />
                        <p className="text-xs font-semibold" style={{ color: '#9ACD32' }}>
                          Kota Bogor, Jawa Barat
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Zoom Controls with Modern Design */}
            <motion.div 
              className="absolute top-6 right-6 z-20 flex flex-col gap-3"
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 300 }}
            >
              <motion.div 
                whileHover={{ scale: 1.1, y: -2 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleZoomIn}
                  className="w-12 h-12 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 backdrop-blur-sm"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: 'rgba(46, 125, 50, 0.3)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                  }}
                  disabled={zoomLevel >= 2}
                >
                  <ZoomIn size={20} style={{ color: '#9ACD32' }} />
                </Button>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.1, y: -2 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleZoomOut}
                  className="w-12 h-12 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 backdrop-blur-sm"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderColor: 'rgba(46, 125, 50, 0.3)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                  }}
                  disabled={zoomLevel <= 0.5}
                >
                  <ZoomOut size={20} style={{ color: '#9ACD32' }} />
                </Button>
              </motion.div>
              <motion.div 
                className="px-4 py-2 rounded-xl shadow-xl text-sm font-bold text-center border-2 backdrop-blur-sm"
                style={{ 
                  backgroundColor: 'rgba(46, 125, 50, 0.95)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  boxShadow: '0 8px 25px rgba(46, 125, 50, 0.3)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                {Math.round(zoomLevel * 100)}%
              </motion.div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Detail Modal */}
      <Dialog open={!!selectedPoint} onOpenChange={() => setSelectedPoint(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedPoint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center border-4 shadow-lg"
                    style={{ borderColor: selectedPoint.color }}
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {(() => {
                      const IconComponent = selectedPoint.icon;
                      return <IconComponent size={36} style={{ color: selectedPoint.color }} />;
                    })()}
                  </motion.div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl mb-2" style={{ color: '#2F4858' }}>
                      {selectedPoint.name}
                    </DialogTitle>
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <Badge
                        className="px-3 py-1"
                        style={{
                          backgroundColor: selectedPoint.color,
                          color: '#FFFFFF',
                          fontSize: '12px'
                        }}
                      >
                        {selectedPoint.category}
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        <MapPin size={12} className="mr-1" />
                        {selectedPoint.area}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className="px-3 py-1"
                        style={{
                          borderColor: selectedPoint.status === 'active' ? '#9ACD32' : '#F44336',
                          color: selectedPoint.status === 'active' ? '#9ACD32' : '#F44336'
                        }}
                      >
                        <Activity size={12} className="mr-1" />
                        {selectedPoint.status === 'active' ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </DialogHeader>
              <DialogDescription className="mt-6 space-y-6">
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border" style={{ borderColor: '#E0E0E0' }}>
                  <div className="flex items-start gap-3">
                    <MapPin size={20} style={{ color: selectedPoint.color, marginTop: '2px' }} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-2" style={{ color: '#2F4858' }}>
                        Alamat Lengkap
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: '#858585' }}>
                        {selectedPoint.address}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        style={{ borderColor: selectedPoint.color, color: selectedPoint.color }}
                      >
                        <Navigation size={14} className="mr-2" />
                        Buka di Maps
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    className="p-4 rounded-xl border bg-gradient-to-br from-blue-50 to-white"
                    style={{ borderColor: '#E0E0E0' }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={18} style={{ color: '#9370DB' }} />
                      <p className="text-xs font-semibold" style={{ color: '#858585' }}>Total Orders</p>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: '#2F4858' }}>
                      {selectedPoint.orders.toLocaleString()}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#858585' }}>
                      Pesanan diterima
                    </p>
                  </motion.div>

                  <motion.div
                    className="p-4 rounded-xl border bg-gradient-to-br from-yellow-50 to-white"
                    style={{ borderColor: '#E0E0E0' }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={18} className="fill-yellow-400 text-yellow-400" />
                      <p className="text-xs font-semibold" style={{ color: '#858585' }}>Rating</p>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: '#2F4858' }}>
                      {selectedPoint.rating}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          className={star <= Math.round(selectedPoint.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    className="p-4 rounded-xl border bg-gradient-to-br from-green-50 to-white"
                    style={{ borderColor: '#E0E0E0' }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Activity size={18} style={{ color: '#9ACD32' }} />
                      <p className="text-xs font-semibold" style={{ color: '#858585' }}>Status</p>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: selectedPoint.status === 'active' ? '#9ACD32' : '#F44336' }}>
                      {selectedPoint.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#858585' }}>
                      {selectedPoint.status === 'active' ? 'Sedang beroperasi' : 'Tidak beroperasi'}
                    </p>
                  </motion.div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: '#E0E0E0' }}>
                  <div className="flex items-center gap-2">
                    <Button
                      className="flex-1"
                      style={{
                        backgroundColor: selectedPoint.color,
                        color: 'white'
                      }}
                    >
                      <Store size={16} className="mr-2" />
                      Kunjungi Toko
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      style={{ borderColor: selectedPoint.color, color: selectedPoint.color }}
                    >
                      <Users size={16} className="mr-2" />
                      Hubungi UMKM
                    </Button>
                  </div>
                </div>
              </DialogDescription>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

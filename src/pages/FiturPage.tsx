import { motion } from "framer-motion";
import { Package, Truck, Heart, Shield, Star, Zap, Search, MapPin, Clock, CreditCard, Bell, Gift, Navigation, Radio, UtensilsCrossed, TrendingUp, Award } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface UMKMItem {
  id: number;
  name: string;
  category: string;
  address: string;
  image: string;
  description: string;
  about?: string;
  phone?: string;
  operatingHours?: string;
  mapsLink?: string;
}

interface FiturPageProps {
  onSelectUMKM?: (umkm: UMKMItem) => void;
}

export function FiturPage({ onSelectUMKM }: FiturPageProps = {}) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Mock UMKM locations in Bogor
  const nearbyUMKM = [
    { name: "Lapis Bogor Sangkuriang", lat: -6.5978, lng: 106.8067, distance: "0.5 km", category: "Makanan" },
    { name: "Roti Unyil Venus", lat: -6.5950, lng: 106.8000, distance: "1.2 km", category: "Makanan" },
    { name: "Asinan Sedap", lat: -6.6000, lng: 106.8100, distance: "0.8 km", category: "Makanan" },
    { name: "PIA Apple Pie", lat: -6.5980, lng: 106.8050, distance: "0.3 km", category: "Makanan" },
  ];

  // Data UMKM untuk mapping
  const umkmData: UMKMItem[] = [
    {
      id: 1,
      name: "Lapis Bogor Sangkuriang",
      category: "Makanan",
      address: "Jl. Pajajaran No.20i, RT.01/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143",
      image: "https://agrinesia.co.id/uploads/2024-07/jfzaH33tlscoG2xPGHd8ykIuUGsU3zTo5NrCzWX4.jpeg",
      description: "Pelopor dan pencetus pertama bolu lapis yang menggunakan bahan dasar talas",
      about: "Berdiri sejak tahun 2011, Lapis Bogor Sangkuriang merupakan pelopor dan pencetus pertama bolu lapis yang menggunakan bahan dasar talas. Dikenal dengan teksturnya yang lembut dan topping keju yang melimpah, Lapis Sangkuriang terus berinovasi untuk memberikan oleh-oleh khas Bogor terbaik.",
      phone: "(0251) 1500262",
      operatingHours: "Setiap Hari, 06.00 - 22.00 WIB",
      mapsLink: "https://www.google.com/maps/search/?api=1&query=Lapis+Bogor+Sangkuriang"
    },
    {
      id: 2,
      name: "Roti Unyil Venus",
      category: "Makanan",
      address: "Ruko V-Point, Jl. Pajajaran No.1, RT.01/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
      image: "https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/87ea29fa-9cf9-4c78-874a-a843af6c2747_Go-Biz_20230807_104930.jpeg",
      description: "Produsen 'Roti Unyil' legendaris di Bogor dengan ukuran kecil dan puluhan varian rasa",
      about: "Venus Bakery adalah produsen \"Roti Unyil\" yang legendaris di Bogor. Disebut roti unyil karena ukurannya yang kecil dan bisa dinikmati sekali lahap. Produknya selalu dibuat fresh setiap hari tanpa menggunakan bahan pengawet dan menawarkan puluhan varian rasa, dari asin (sosis, keju) hingga manis (cokelat, kismis).",
      phone: "0878-7880-5735",
      operatingHours: "Setiap Hari, 05.30 - 21.00 WIB",
      mapsLink: "https://www.google.com/maps/search/?api=1&query=Roti+Unyil+Venus+Bogor"
    },
    {
      id: 3,
      name: "Asinan Sedap Gedung Dalam",
      category: "Makanan",
      address: "Jl. Siliwangi No.27C, RT.01/RW.01, Sukasari, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16142",
      image: "https://assets.pikiran-rakyat.com/crop/0x0:0x0/750x500/photo/2022/06/27/903345014.jpg",
      description: "Salah satu gerai asinan paling legendaris dan tertua di Bogor, berdiri sejak 1978",
      about: "Salah satu gerai asinan paling legendaris dan tertua di Bogor, berdiri sejak 1978. Terkenal dengan asinan sayur dan asinan buahnya yang menggunakan bahan-bahan segar, kuah cuka yang khas (pedas, asam, manis), dan taburan kacang yang melimpah.",
      phone: "(0251) 8313099",
      operatingHours: "Setiap Hari, 07.00 - 20.00 WIB",
      mapsLink: "https://www.google.com/maps/search/?api=1&query=Asinan+Sedap+Gedung+Dalam"
    },
    {
      id: 4,
      name: "PIA Apple Pie",
      category: "Makanan",
      address: "Jl. Pangrango No.10, RT.04/RW.04, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
      image: "https://s3.us-east-1.wasabisys.com/agendaindonesia/2022/10/Pie-Apple-Pie-Bogor.jpg",
      description: "Toko pie terkenal di Bogor dengan apple pie yang renyah di luar dan lembut di dalam",
      about: "Toko pie yang sangat terkenal di Bogor dengan suasana tempat yang unik dan homey. Sesuai namanya, produk andalan mereka adalah apple pie (pai apel) yang renyah di luar dan lembut di dalam. Mereka juga menyediakan varian pie lain seperti stroberi, keju, dan pie gurih (ayam).",
      phone: "(0251) 8324169",
      operatingHours: "Senin-Jumat (07.00-20.00 WIB), Sabtu-Minggu (07.00-22.00 WIB)",
      mapsLink: "https://www.google.com/maps/search/?api=1&query=PIA+Apple+Pie+Bogor"
    },
    {
      id: 5,
      name: "Bika Bogor Talubi",
      category: "Makanan",
      address: "Jl. Pajajaran No.20M, RT.01/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvrRS7rbZ9JBrHa85YQJgvl8ZW3uYsmoWwwCEvM_-L1en-5d5g6Oa6akl07FmbHbHnlzJPQ0GQPtA0ny44_7b7TazCgvtOneEj3hVZAf27KM28PPC1_t_B0GSyJ0hgM8CjwxYZS9zqeda7/s1600/20170103_165122_wm.jpg",
      description: "Inovasi oleh-oleh khas Bogor yang mengolah talas menjadi kue bika ambon",
      about: "Sebuah inovasi oleh-oleh khas Bogor yang mengolah talas menjadi kue bika ambon. Bika Bogor Talubi terkenal dengan teksturnya yang lembut, kenyal, dan memiliki aroma yang khas. Selain rasa original talas, tersedia juga varian rasa lain seperti Ubi Ungu, Nangka, dan Pandan.",
      phone: "(0251) 8338788",
      operatingHours: "Setiap Hari, 07.00 - 21.00 WIB",
      mapsLink: "https://www.google.com/maps/search/?api=1&query=Bika+Bogor+Talubi"
    },
    {
      id: 6,
      name: "Macaroni Panggang (MP)",
      category: "Makanan",
      address: "Jl. Salak No.24, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
      image: "https://images.tokopedia.net/img/cache/700/hDjmkQ/2025/4/18/856dcaaf-3fe4-4d7c-8a4b-095d0240b5e8.jpg",
      description: "UMKM legendaris di Bogor yang terkenal dengan makaroni skotel panggangnya",
      about: "Sebuah UMKM legendaris di Bogor yang terkenal dengan makaroni skotel panggangnya. Disajikan dalam cup aluminium foil, MP menawarkan makaroni panggang dengan isian keju, sosis, dan daging yang melimpah. Tempatnya juga cozy dan menjual aneka kue lain seperti pastries dan cookies.",
      phone: "(0251) 8324042",
      operatingHours: "Setiap Hari, 07.00 - 20.00 WIB",
      mapsLink: "https://www.google.com/maps/search/?api=1&query=Macaroni+Panggang+MP+Bogor"
    }
  ];

  // Rekomendasi Makanan Kota Bogor
  const recommendedFoods = [
    {
      id: 1,
      name: "Lapis Bogor Sangkuriang",
      image: "https://agrinesia.co.id/uploads/2024-07/jfzaH33tlscoG2xPGHd8ykIuUGsU3zTo5NrCzWX4.jpeg",
      rating: 4.8,
      reviews: 245,
      description: "Pelopor dan pencetus pertama bolu lapis yang menggunakan bahan dasar talas",
      category: "Oleh-Oleh",
      price: "Rp 25.000",
      badge: "Terlaris",
      umkmId: 1
    },
    {
      id: 2,
      name: "Roti Unyil Venus",
      image: "https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/87ea29fa-9cf9-4c78-874a-a843af6c2747_Go-Biz_20230807_104930.jpeg",
      rating: 4.7,
      reviews: 189,
      description: "Produsen 'Roti Unyil' legendaris di Bogor dengan ukuran kecil dan puluhan varian rasa",
      category: "Roti",
      price: "Rp 3.000",
      badge: "Favorit",
      umkmId: 2
    },
    {
      id: 3,
      name: "Asinan Sedap Gedung Dalam",
      image: "https://assets.pikiran-rakyat.com/crop/0x0:0x0/750x500/photo/2022/06/27/903345014.jpg",
      rating: 4.9,
      reviews: 312,
      description: "Salah satu gerai asinan paling legendaris dan tertua di Bogor, berdiri sejak 1978",
      category: "Asinan",
      price: "Rp 15.000",
      badge: "Legendaris",
      umkmId: 3
    },
    {
      id: 4,
      name: "PIA Apple Pie",
      image: "https://s3.us-east-1.wasabisys.com/agendaindonesia/2022/10/Pie-Apple-Pie-Bogor.jpg",
      rating: 4.6,
      reviews: 156,
      description: "Toko pie terkenal di Bogor dengan apple pie yang renyah di luar dan lembut di dalam",
      category: "Pie",
      price: "Rp 35.000",
      badge: "Premium",
      umkmId: 4
    },
    {
      id: 5,
      name: "Bika Bogor Talubi",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvrRS7rbZ9JBrHa85YQJgvl8ZW3uYsmoWwwCEvM_-L1en-5d5g6Oa6akl07FmbHbHnlzJPQ0GQPtA0ny44_7b7TazCgvtOneEj3hVZAf27KM28PPC1_t_B0GSyJ0hgM8CjwxYZS9zqeda7/s1600/20170103_165122_wm.jpg",
      rating: 4.5,
      reviews: 98,
      description: "Inovasi oleh-oleh khas Bogor yang mengolah talas menjadi kue bika ambon",
      category: "Oleh-Oleh",
      price: "Rp 20.000",
      badge: "Baru",
      umkmId: 5
    },
    {
      id: 6,
      name: "Macaroni Panggang (MP)",
      image: "https://images.tokopedia.net/img/cache/700/hDjmkQ/2025/4/18/856dcaaf-3fe4-4d7c-8a4b-095d0240b5e8.jpg",
      rating: 4.7,
      reviews: 203,
      description: "UMKM legendaris di Bogor yang terkenal dengan makaroni skotel panggangnya",
      category: "Makanan",
      price: "Rp 18.000",
      badge: "Klasik",
      umkmId: 6
    },
  ];

  // Function to handle detail click
  const handleDetailClick = (foodId: number) => {
    if (!onSelectUMKM) return;
    const food = recommendedFoods.find(f => f.id === foodId);
    if (food) {
      const umkm = umkmData.find(u => u.id === food.umkmId);
      if (umkm) {
        onSelectUMKM(umkm);
      }
    }
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocating(false);
        },
        () => {
          // Fallback to Bogor center if geolocation fails
          setUserLocation({ lat: -6.5978, lng: 106.8067 });
          setIsLocating(false);
        }
      );
    } else {
      // Fallback to Bogor center
      setUserLocation({ lat: -6.5978, lng: 106.8067 });
      setIsLocating(false);
    }
  };

  const getMapUrl = () => {
    const center = userLocation || { lat: -6.5978, lng: 106.8067 };
    // Using Google Maps embed without API key (public embed)
    const markers = nearbyUMKM.map(umkm => `${umkm.lat},${umkm.lng}`).join('/');
    return `https://www.google.com/maps?q=${center.lat},${center.lng}&hl=id&z=14&output=embed`;
  };
  const mainFeatures = [
    {
      icon: Package,
      title: "Produk Lokal Berkualitas",
      description: "Semua produk yang dijual berasal dari UMKM asli Bogor yang sudah terkurasi dengan standar kualitas tinggi. Setiap produk dipastikan autentik dan berkualitas.",
      gradient: "from-orange-400 to-yellow-400",
      color: "#F99912"
    },
    {
      icon: Truck,
      title: "Pesan Antar Cepat & Mudah",
      description: "Tinggal klik, pesan, dan tunggu di rumah! Layanan pesan antar yang cepat dan terpercaya dengan driver berpengalaman.",
      gradient: "from-green-400 to-green-600",
      color: "#9ACD32"
    },
    {
      icon: Heart,
      title: "Dukung UMKM, Bangga Bogor",
      description: "Setiap pembelian Anda membantu UMKM berkembang dan memperkuat ekonomi Bogor. Bersama kita bangun ekonomi lokal yang kuat.",
      gradient: "from-yellow-300 to-orange-500",
      color: "#F99912"
    },
    {
      icon: Shield,
      title: "Transaksi Aman Terpercaya",
      description: "Sistem pembayaran yang aman dan terpercaya untuk setiap transaksi Anda. Data pribadi dan transaksi dijamin keamanannya.",
      gradient: "from-blue-400 to-blue-600",
      color: "#9370DB"
    },
    {
      icon: Star,
      title: "Rating & Review Transparan",
      description: "Lihat ulasan dan rating dari pembeli lain untuk memilih produk terbaik. Sistem review yang jujur dan transparan.",
      gradient: "from-yellow-400 to-orange-400",
      color: "#F99912"
    },
    {
      icon: Zap,
      title: "Promo Menarik Setiap Hari",
      description: "Dapatkan berbagai promo dan diskon menarik untuk produk UMKM favorit Anda. Hemat lebih banyak dengan promo spesial.",
      gradient: "from-purple-400 to-pink-500",
      color: "#9370DB"
    }
  ];

  const additionalFeatures = [
    {
      icon: Search,
      title: "Pencarian Cerdas",
      description: "Cari produk berdasarkan nama, kategori, atau lokasi dengan mudah",
      color: "#F99912"
    },
    {
      icon: MapPin,
      title: "Lokasi Terintegrasi",
      description: "Lihat lokasi UMKM di peta dan dapatkan arah dengan mudah",
      color: "#9ACD32"
    },
    {
      icon: Clock,
      title: "Jam Operasional",
      description: "Lihat jam buka UMKM dan pesan pada waktu yang tepat",
      color: "#9370DB"
    },
    {
      icon: CreditCard,
      title: "Pembayaran Fleksibel",
      description: "Berbagai metode pembayaran yang nyaman untuk Anda",
      color: "#F99912"
    },
    {
      icon: Bell,
      title: "Notifikasi Real-time",
      description: "Dapatkan update pesanan dan promo terbaru secara real-time",
      color: "#9370DB"
    },
    {
      icon: Gift,
      title: "Program Loyalitas",
      description: "Dapatkan poin dan reward setiap kali berbelanja",
      color: "#F99912"
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF4E6 0%, #FFFFFF 100%)' }}>
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#2F4858' }}>
              Fitur-Fitur Unggulan
            </h1>
            <p className="text-xl lg:text-2xl mb-8" style={{ color: '#4A4A4A' }}>
              Semua yang Anda butuhkan untuk menemukan dan membeli produk UMKM terbaik
            </p>
            <p className="text-lg" style={{ color: '#858585', maxWidth: '800px', margin: '0 auto' }}>
              Platform digital untuk UMKM Bogor yang menghubungkan produk lokal berkualitas dengan pelanggan di seluruh Indonesia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features Section - Horizontal Scrolling Animation */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#2F4858' }}>
              Fitur Utama
            </h2>
            <p style={{ color: '#4A4A4A', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
              Dengan berbelanja di sini, kamu ikut melestarikan budaya dan produk khas Bogor sambil mendukung pertumbuhan ekonomi lokal
            </p>
          </motion.div>

          {/* Horizontal Scrolling Container */}
          <div className="overflow-hidden relative max-w-6xl mx-auto py-4">
            <motion.div
              className="flex gap-6"
              animate={{
                x: ["0%", "-50%"], // Move by half (since we duplicate the cards)
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
              style={{
                width: "200%", // Double width for seamless loop
              }}
            >
              {/* Render cards twice for seamless loop */}
              {[...mainFeatures, ...mainFeatures].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex-shrink-0 group"
                    style={{
                      minWidth: "400px",
                      width: "400px",
                    }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all h-full border-2 border-orange-100 relative overflow-hidden">
                      {/* Decorative background pattern */}
                      <div
                        className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl transition-opacity group-hover:opacity-20"
                        style={{
                          background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}CC 100%)`,
                        }}
                      />
                      
                      <motion.div 
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 relative z-10`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon size={32} style={{ color: '#FFFFFF' }} />
                      </motion.div>
                      <h4 style={{ color: '#2F4858' }} className="mb-3 text-xl font-bold relative z-10">
                        {feature.title}
                      </h4>
                      <p className="text-base leading-relaxed relative z-10" style={{ color: '#4A4A4A' }}>
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
            
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-20 lg:py-28" style={{ background: 'linear-gradient(to bottom, #FFFFFF 0%, #FFF4E6 100%)' }}>
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#2F4858' }}>
              Fitur Tambahan
            </h2>
            <p style={{ color: '#4A4A4A', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
              Fitur-fitur pendukung yang membuat pengalaman berbelanja lebih mudah dan menyenangkan
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-orange-100"
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}CC 100%)` }}
                    >
                      <Icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1" style={{ color: '#2F4858' }}>
                        {feature.title}
                      </h4>
                      <p className="text-sm" style={{ color: '#4A4A4A' }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cari UMKM Terdekat Section */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: '#F99912' }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: '#9ACD32' }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div 
                className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)' }}
              >
                <Navigation size={40} className="text-white" />
              </div>
            </motion.div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#2F4858' }}>
              Cari UMKM Terdekat
            </h2>
            <p style={{ color: '#4A4A4A', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
              Temukan UMKM terdekat dari lokasi Anda dengan mudah menggunakan peta interaktif
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto items-stretch">
            {/* Map Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative h-full flex flex-col"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-orange-100 flex-1 flex flex-col">
                {/* Map Header */}
                <div 
                  className="p-4 flex items-center justify-between flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)' }}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="text-white" size={24} />
                    <span className="text-white font-semibold">Peta Lokasi UMKM</span>
                  </div>
                  <motion.button
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLocating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Radio size={16} />
                        </motion.div>
                        <span>Mencari...</span>
                      </>
                    ) : (
                      <>
                        <Navigation size={16} />
                        <span>Lokasi Saya</span>
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Map Container */}
                <div className="relative flex-1 min-h-[400px]">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full"
                  >
                    <iframe
                      src={getMapUrl()}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Peta UMKM Terdekat"
                      className="rounded-b-3xl"
                    />
                  </motion.div>

                  {/* Pulsing location indicator */}
                  {userLocation && (
                    <motion.div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.5, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    >
                      <div className="w-6 h-6 rounded-full bg-[#F99912] border-4 border-white shadow-lg" />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

             {/* Nearby UMKM List */}
             <motion.div
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.7 }}
               className="h-full flex flex-col"
             >
               <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-orange-100 flex-1 flex flex-col">
                 <h3 className="text-xl font-bold mb-6" style={{ color: '#2F4858' }}>
                   UMKM Terdekat
                 </h3>
                 <div className="space-y-3 flex-1">
                   {nearbyUMKM.map((umkm, index) => (
                     <motion.div
                       key={index}
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: index * 0.1, duration: 0.5 }}
                       whileHover={{ x: 8, scale: 1.02 }}
                       className="p-4 rounded-xl border-2 border-orange-100 hover:border-[#F99912] transition-all cursor-pointer bg-gradient-to-r from-white to-[#FFF4E6]"
                     >
                       <div className="flex items-start justify-between gap-4">
                         <div className="flex-1">
                           <div className="flex items-center gap-2 mb-2">
                             <MapPin size={18} style={{ color: '#F99912' }} />
                             <h4 className="font-bold" style={{ color: '#2F4858' }}>
                               {umkm.name}
                             </h4>
                           </div>
                           <div className="flex items-center gap-4 text-sm">
                             <span 
                               className="px-3 py-1 rounded-full text-xs font-semibold"
                               style={{ 
                                 background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)',
                                 color: '#FFFFFF'
                               }}
                             >
                               {umkm.category}
                             </span>
                             <span style={{ color: '#858585' }} className="flex items-center gap-1">
                               <Navigation size={14} />
                               {umkm.distance}
                             </span>
                           </div>
                         </div>
                         <motion.div
                           whileHover={{ scale: 1.2, rotate: 90 }}
                           transition={{ type: "spring", stiffness: 300 }}
                         >
                           <div 
                             className="w-10 h-10 rounded-full flex items-center justify-center"
                             style={{ background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)' }}
                           >
                             <Navigation size={20} className="text-white" />
                           </div>
                         </motion.div>
                       </div>
                     </motion.div>
                   ))}
                 </div>

                 {/* View All Button */}
                 <motion.button
                   className="w-full mt-6 py-3 rounded-xl font-semibold text-white"
                   style={{ background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)' }}
                   whileHover={{ scale: 1.02, y: -2 }}
                   whileTap={{ scale: 0.98 }}
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.4, duration: 0.5 }}
                 >
                   Lihat Semua UMKM Terdekat
                 </motion.button>

                 {/* Features Card - Inside the same container */}
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.3, duration: 0.5 }}
                   className="mt-6 bg-gradient-to-br from-[#FFF4E6] to-white rounded-2xl p-6 border-2 border-orange-100"
                 >
                   <h4 className="font-bold mb-3" style={{ color: '#2F4858' }}>
                     ✨ Fitur Unggulan
                   </h4>
                   <ul className="space-y-2 text-sm" style={{ color: '#4A4A4A' }}>
                     <li className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ background: '#F99912' }} />
                       Pencarian berdasarkan lokasi Anda
                     </li>
                     <li className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ background: '#F99912' }} />
                       Tampilkan jarak dan rute terdekat
                     </li>
                     <li className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ background: '#F99912' }} />
                       Integrasi dengan Google Maps
                     </li>
                     <li className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ background: '#F99912' }} />
                       Update lokasi real-time
                     </li>
                   </ul>
                 </motion.div>
               </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Rekomendasi Makanan Kota Bogor Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #FFFFFF 0%, #FFF4E6 100%)' }}>
        {/* Animated background elements */}
        <motion.div
          className="absolute top-10 left-10 w-72 h-72 rounded-full opacity-5 blur-3xl"
          style={{ background: '#F99912' }}
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ background: '#9ACD32' }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center justify-center gap-3 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)' }}
              >
                <UtensilsCrossed size={32} className="text-white" />
              </div>
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #9ACD32 0%, #9370DB 100%)' }}
              >
                <TrendingUp size={32} className="text-white" />
              </div>
            </motion.div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#2F4858' }}>
              Rekomendasi Makanan Kota Bogor
            </h2>
            <p style={{ color: '#4A4A4A', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
              Temukan kuliner khas Bogor terbaik yang direkomendasikan untuk Anda. Dari oleh-oleh legendaris hingga makanan kekinian
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {recommendedFoods.map((food, index) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-orange-100 hover:border-[#F99912] h-full flex flex-col">
                  {/* Image Section */}
                  <div className="relative h-48 lg:h-56 overflow-hidden">
                    <ImageWithFallback
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span 
                        className="px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
                        style={{ 
                          background: food.badge === "Terlaris" 
                            ? 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)'
                            : food.badge === "Legendaris"
                            ? 'linear-gradient(135deg, #9370DB 0%, #E91E63 100%)'
                            : food.badge === "Premium"
                            ? 'linear-gradient(135deg, #9370DB 0%, #F99912 100%)'
                            : 'linear-gradient(135deg, #9ACD32 0%, #9370DB 100%)'
                        }}
                      >
                        {food.badge}
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span 
                        className="px-3 py-1.5 rounded-full text-xs font-semibold text-white backdrop-blur-sm bg-white/20"
                      >
                        {food.category}
                      </span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-bold" style={{ color: '#2F4858' }}>
                        {food.rating}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#F99912] transition-colors" style={{ color: '#2F4858' }}>
                      {food.name}
                    </h3>
                    <p className="text-sm mb-4 line-clamp-2 flex-1" style={{ color: '#4A4A4A' }}>
                      {food.description}
                    </p>

                    {/* Rating & Reviews */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: '#FFE5CC' }}>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < Math.floor(food.rating) ? "text-yellow-500 fill-current" : "text-gray-300"}
                            />
                          ))}
                        </div>
                        <span className="text-xs" style={{ color: '#858585' }}>
                          ({food.reviews} ulasan)
                        </span>
                      </div>
                      <span className="text-lg font-bold" style={{ color: '#F99912' }}>
                        {food.price}
                      </span>
                    </div>

                    {/* Action Button */}
                    <motion.button
                      className="w-full py-3 rounded-xl font-semibold text-white text-sm"
                      style={{ background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)' }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDetailClick(food.id)}
                    >
                      Lihat Detail
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.button
              className="px-8 py-4 rounded-xl font-bold text-white text-lg inline-flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)' }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Award size={24} />
              <span>Lihat Semua Rekomendasi</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="bg-white rounded-3xl p-12 lg:p-16 text-center shadow-2xl border-2 border-orange-100"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Orange Card Decoration */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#F99912] to-[#F99912] rounded-3xl opacity-10 -z-10"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Orange Card Accent */}
            <div className="relative">
              <motion.div
                className="absolute -top-6 -left-6 w-32 h-32 rounded-2xl opacity-20 blur-2xl"
                style={{ background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)' }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl opacity-20 blur-2xl"
                style={{ background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)' }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -90, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#2F4858' }}>
                Siap Memulai Perjalanan Bersama Kami?
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#4A4A4A' }}>
                Bergabunglah dengan ribuan pengguna yang sudah merasakan kemudahan berbelanja produk UMKM lokal terbaik
              </p>
              
              {/* Orange Card Highlight */}
              <motion.div
                className="mb-8 inline-block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <div 
                  className="px-8 py-4 rounded-2xl shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)' }}
                >
                  <p className="text-white font-semibold text-lg">
                    ✨ Platform Terpercaya untuk UMKM Bogor
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.a
                  href="#"
                  className="px-8 py-4 rounded-xl font-semibold text-white hover:shadow-xl transition-all inline-block"
                  style={{ background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)' }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Jelajahi Direktori
                </motion.a>
                <motion.a
                  href="#"
                  className="px-8 py-4 rounded-xl font-semibold border-2 transition-all inline-block"
                  style={{ 
                    borderColor: '#F99912',
                    color: '#F99912',
                    backgroundColor: 'transparent'
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    backgroundColor: '#FFF4E6'
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Daftar Sekarang
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { AsliBogorLogo } from "../components/ui/asli-bogor-logo";
import { Leaf, TrendingUp, Users, Store, Award, ArrowRight, Package, Truck, Heart, Shield, Star, Gift, Sparkles, Clock, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { AuthSectionLanding } from "../components/AuthSectionLanding";

interface BerandaPageProps {
  onRoleSelect: (role: 'user' | 'umkm' | 'driver') => void;
  onNavigateToDirectory: () => void;
}

function parseCompactNumber(raw: string): { end: number; suffix: string; isK: boolean } {
  const trimmed = (raw || "").trim();
  const hasPlus = trimmed.includes("+");
  const suffix = hasPlus ? "+" : "";
  const isK = /[kK]/.test(trimmed);
  const numberPart = trimmed.replace(/[^0-9.]/g, "");
  const base = numberPart ? Number(numberPart) : 0;
  const end = isK ? base * 1000 : base;
  return { end, suffix, isK };
}

function StatCountUp({
  valueStr,
  color,
}: {
  valueStr: string;
  color: string;
}) {
  const { end, suffix, isK } = parseCompactNumber(valueStr);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const inView = useInView(headingRef, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 1100;
    const start = performance.now();
    const from = 0;

    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const v = from + (end - from) * eased;
      setDisplay(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end]);

  const formatted = isK
    ? `${Math.round(display / 1000)}K${suffix}`
    : `${Math.round(display)}${suffix}`;

  return (
    <h3
      ref={headingRef}
      style={{ color, fontSize: "28px", fontWeight: 700, lineHeight: 1.1 }}
    >
      {formatted}
    </h3>
  );
}

export function BerandaPage({ onRoleSelect, onNavigateToDirectory }: BerandaPageProps) {
  const scrollToAuth = () => {
    const element = document.getElementById('auth-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [reviewIndex, setReviewIndex] = useState(0);
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroParallax = useTransform(scrollYProgress, [0, 1], [0, -28]);

  const [directoryQuery, setDirectoryQuery] = useState("");
  const [directoryCategory, setDirectoryCategory] = useState<"Semua" | "Makanan" | "Minuman" | "Jasa" | "Kerajinan">("Semua");

  const directoryPreview = [
    {
      name: "Lapis Bogor Sangkuriang",
      category: "Makanan" as const,
      address: "Jl. Pajajaran No.20i, RT.01/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143",
      image: "https://agrinesia.co.id/uploads/2024-07/jfzaH33tlscoG2xPGHd8ykIuUGsU3zTo5NrCzWX4.jpeg",
      description: "Pelopor dan pencetus pertama bolu lapis yang menggunakan bahan dasar talas",
      rating: 4.8,
    },
    {
      name: "Roti Unyil Venus",
      category: "Makanan" as const,
      address: "Ruko V-Point, Jl. Pajajaran No.1, RT.01/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
      image: "https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/87ea29fa-9cf9-4c78-874a-a843af6c2747_Go-Biz_20230807_104930.jpeg",
      description: "Produsen 'Roti Unyil' legendaris di Bogor dengan ukuran kecil dan puluhan varian rasa",
      rating: 4.8,
    },
    {
      name: "Asinan Sedap Gedung Dalam",
      category: "Makanan" as const,
      address: "Jl. Siliwangi No.27C, RT.01/RW.01, Sukasari, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16142",
      image: "https://assets.pikiran-rakyat.com/crop/0x0:0x0/750x500/photo/2022/06/27/903345014.jpg",
      description: "Salah satu gerai asinan paling legendaris dan tertua di Bogor, berdiri sejak 1978",
      rating: 4.8,
    },
    {
      name: "PIA Apple Pie",
      category: "Makanan" as const,
      address: "Jl. Pangrango No.10, RT.04/RW.04, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
      image: "https://s3.us-east-1.wasabisys.com/agendaindonesia/2022/10/Pie-Apple-Pie-Bogor.jpg",
      description: "Toko pie terkenal di Bogor dengan apple pie yang renyah di luar dan lembut di dalam",
      rating: 4.8,
    },
    {
      name: "Bika Bogor Talubi",
      category: "Makanan" as const,
      address: "Jl. Pajajaran No.20M, RT.01/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvrRS7rbZ9JBrHa85YQJgvl8ZW3uYsmoWwwCEvM_-L1en-5d5g6Oa6akl07FmbHbHnlzJPQ0GQPtA0ny44_7b7TazCgvtOneEj3hVZAf27KM28PPC1_t_B0GSyJ0hgM8CjwxYZS9zqeda7/s1600/20170103_165122_wm.jpg",
      description: "Inovasi oleh-oleh khas Bogor yang mengolah talas menjadi kue bika ambon",
      rating: 4.8,
    },
    {
      name: "Macaroni Panggang (MP)",
      category: "Makanan" as const,
      address: "Jl. Salak No.24, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
      image: "https://images.tokopedia.net/img/cache/700/hDjmkQ/2025/4/18/856dcaaf-3fe4-4d7c-8a4b-095d0240b5e8.jpg",
      description: "UMKM legendaris di Bogor yang terkenal dengan makaroni skotel panggangnya",
      rating: 4.8,
    },
  ];

  const filteredDirectory = directoryPreview.filter((umkm) => {
    const q = directoryQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      umkm.name.toLowerCase().includes(q) ||
      umkm.category.toLowerCase().includes(q) ||
      umkm.address.toLowerCase().includes(q);
    const matchesCategory = directoryCategory === "Semua" || umkm.category === directoryCategory;
    return matchesQuery && matchesCategory;
  });

  const stats = [
    { value: "500+", label: "UMKM Terdaftar", icon: Store, color: "#FF8D28" },
    { value: "10K+", label: "Pengguna Aktif", icon: Users, color: "#4CAF50" },
    { value: "50+", label: "Driver Siap", icon: TrendingUp, color: "#2F4858" },
  ];

  const categories = [
    { name: "Makanan", count: "150+ UMKM", gradient: "from-orange-400 to-yellow-300" },
    { name: "Minuman", count: "80+ UMKM", gradient: "from-green-400 to-green-600" },
    { name: "Fashion", count: "120+ UMKM", gradient: "from-yellow-300 to-orange-400" },
    { name: "Jasa", count: "150+ UMKM", gradient: "from-green-500 to-emerald-600" },
  ];

  const benefits = [
    {
      text: "Produk lokal berkualitas tinggi",
      icon: Package,
      gradient: "from-orange-500 to-orange-400",
      bgGradient: "from-orange-50 to-orange-100",
      iconBg: "linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)",
      accentColor: "#FF8D28",
      colorTheme: "orange",
    },
    {
      text: "Pesan antar cepat & mudah",
      icon: Truck,
      gradient: "from-green-500 to-green-400",
      bgGradient: "from-green-50 to-green-100",
      iconBg: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
      accentColor: "#4CAF50",
      colorTheme: "green",
    },
    {
      text: "Dukung UMKM, bangga Bogor",
      icon: Heart,
      gradient: "from-blue-500 to-blue-400",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
      accentColor: "#2196F3",
      colorTheme: "blue",
    },
    {
      text: "Transaksi aman terpercaya",
      icon: Shield,
      gradient: "from-orange-600 to-orange-400",
      bgGradient: "from-orange-50 to-orange-100",
      iconBg: "linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)",
      accentColor: "#FF8D28",
      colorTheme: "orange",
    },
    {
      text: "Rating & review transparan",
      icon: Star,
      gradient: "from-green-600 to-green-400",
      bgGradient: "from-green-50 to-green-100",
      iconBg: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
      accentColor: "#4CAF50",
      colorTheme: "green",
    },
    {
      text: "Promo menarik setiap hari",
      icon: Gift,
      gradient: "from-blue-600 to-blue-400",
      bgGradient: "from-blue-50 to-blue-100",
      iconBg: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
      accentColor: "#2196F3",
      colorTheme: "blue",
    },
  ];

  const testimonials = [
    {
      name: "Andi Prasetyo",
      time: "2 Hari yang lalu",
      shop: "Warung Makan Bu Siti",
      text: "Makanannya enak banget! Rasanya kayak masakan rumah sendiri. Porsi banyak, harga terjangkau. Poin Qoin-nya juga bikin makin hemat belanja! Recommended banget deh.",
      likes: 45,
    },
    {
      name: "Andi Prasetyo",
      time: "2 Hari yang lalu",
      shop: "Bakery Talas Bogor",
      text: "Gila enak! Teksturnya legit dan rasanya berasa. Packaging rapi, sampai dengan kondisi bagus. Next mau repeat lagi.",
      likes: 39,
    },
    {
      name: "Andi Prasetyo",
      time: "2 Hari yang lalu",
      shop: "Toko Oleh-oleh Kujang",
      text: "Oleh-olehnya unik dan premium. Banyak pilihan, jadi gampang cari yang cocok buat keluarga. Pelayanannya juga ramah.",
      likes: 28,
    },
  ];

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = window.setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % testimonials.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  const activeTestimonial = testimonials[reviewIndex];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Keep original design */}
      <section 
        ref={heroRef}
        id="hero" 
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #FFF4E6 0%, #FFB84D 50%, #FF8D28 100%)',
        }}
      >
        {/* Decorative Elements - Floating Leaves */}
        <motion.div
          className="absolute top-20 left-10 text-green-600 opacity-20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Leaf size={80} />
        </motion.div>

        <motion.div
          className="absolute top-40 right-20 text-green-600 opacity-20"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Leaf size={60} />
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-1/4 text-green-600 opacity-15"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Leaf size={70} />
        </motion.div>

        {/* Mountain Silhouette */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-64 opacity-10"
          style={{
            background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 300\'%3E%3Cpath fill=\'%232F4858\' d=\'M0,200 L300,50 L500,120 L700,30 L900,100 L1200,80 L1200,300 L0,300 Z\'/%3E%3C/svg%3E")',
            backgroundSize: 'cover',
            backgroundPosition: 'bottom',
            y: heroParallax,
          }}
        />

        <div className="container mx-auto px-4 py-20 pt-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0 
                }}
                transition={{ 
                  delay: 0.25, 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
                }}
                className="flex items-center mb-4"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    filter: [
                      "drop-shadow(0 10px 20px rgba(255, 141, 40, 0.3))",
                      "drop-shadow(0 15px 30px rgba(255, 141, 40, 0.5))",
                      "drop-shadow(0 10px 20px rgba(255, 141, 40, 0.3))"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <AsliBogorLogo
                    variant="primary"
                    className="h-32 md:h-40 lg:h-48 w-auto drop-shadow-2xl"
                    style={{
                      filter: "drop-shadow(0 10px 25px rgba(255, 141, 40, 0.4))"
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Hook badge (wow in 3 detik pertama) */}
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-sm border border-orange-100 shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.55 }}
              >
                <Sparkles size={18} style={{ color: "#FF8D28" }} />
                <span style={{ color: "#2F4858", fontWeight: 800 }}>
                  OH INI UMKM untuk beli produk lokal
                </span>
              </motion.div>

              <motion.h1
                style={{ 
                  color: '#2F4858',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 700,
                  lineHeight: 1.2
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-2"
              >
                Bikin Keren UMKM Lokal
              </motion.h1>

              <motion.p 
                style={{ color: '#4A4A4A', fontSize: '18px' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Temukan dan dukung usaha keren di sekitarmu. Platform digital yang menghubungkan UMKM Bogor dengan pelanggan di seluruh Indonesia.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Button 
                  onClick={onNavigateToDirectory}
                  className="px-8 py-6 text-lg hover-lift"
                  style={{ 
                    background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)',
                    color: '#FFFFFF',
                    border: 'none'
                  }}
                >
                  Jelajahi Direktori
                </Button>

                <Button 
                  onClick={scrollToAuth}
                  className="px-8 py-6 text-lg hover-lift"
                  style={{ 
                    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                    color: '#FFFFFF',
                    border: 'none'
                  }}
                >
                  Masuk / Daftar Sekarang
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-6 pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Icon size={24} style={{ color: stat.color }} className="mr-2" />
                        <StatCountUp valueStr={stat.value} color={stat.color} />
                      </div>
                      <p className="body-3" style={{ color: '#4A4A4A' }}>{stat.label}</p>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Right: Illustration/Image - Keep original */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                {/* Decorative circles */}
                <motion.div
                  className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-green-400 opacity-30 blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-orange-400 opacity-30 blur-xl"
                  animate={{
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                {/* Main visual - Decorative card grid */}
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-90">
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((category, index) => (
                      <motion.div
                        key={index}
                        className={`bg-gradient-to-br ${category.gradient} rounded-2xl p-6 h-32 flex items-center justify-center`}
                        whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="text-center text-white">
                          <h4 className="font-bold text-lg mb-1">{category.name}</h4>
                          <p className="body-3 text-white/90">{category.count}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path 
              d="M0,50 C300,100 500,0 800,50 L800,120 L0,120 Z" 
              fill="#FFFFFF"
              opacity="0.3"
            />
            <path 
              d="M0,70 C400,20 700,100 1200,50 L1200,120 L0,120 Z" 
              fill="#FFFFFF"
            />
          </svg>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#2F4858' }}>
              Kenapa Pilih Asli Bogor?
            </h2>
            <p style={{ color: '#4A4A4A', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
              Platform digital untuk UMKM Bogor yang menghubungkan produk lokal berkualitas dengan pelanggan di seluruh Indonesia.
            </p>
          </motion.div>

          {/* Animated Sliding Cards */}
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
              {[...benefits, ...benefits].map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex-shrink-0"
                    style={{
                      minWidth: "320px", // Fixed min width for consistent card size
                      width: "320px", // Fixed width for consistent animation
                    }}
                    whileHover={{ scale: 1.05, y: -8, rotate: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div 
                      className={`bg-gradient-to-br ${benefit.bgGradient} p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all border-2 h-full relative overflow-hidden group`}
                      style={{
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      {/* Decorative background pattern */}
                      <div 
                        className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-2xl transition-opacity group-hover:opacity-20"
                        style={{
                          background: benefit.iconBg,
                        }}
                      />
                      
                      {/* Animated sparkle effect */}
                      <motion.div
                        className="absolute top-2 right-2"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Sparkles size={20} style={{ color: benefit.accentColor }} />
                      </motion.div>
                      
                      <div className="flex flex-col items-center text-center gap-4 relative z-10 h-full justify-center">
                        <motion.div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg relative z-20"
                          style={{ background: benefit.iconBg }}
                          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon 
                            size={32} 
                            style={{ 
                              color: '#FFFFFF',
                              display: 'block',
                              zIndex: 10,
                              position: 'relative'
                            }} 
                            strokeWidth={2.5} 
                          />
                          {/* Glow effect on icon */}
                          <div 
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-50 blur-md transition-opacity"
                            style={{ background: benefit.iconBg }}
                          />
                        </motion.div>
                        <div className="flex-1 flex items-center justify-center">
                          <p className="text-base font-semibold leading-relaxed text-center" style={{ color: '#2F4858' }}>
                            {benefit.text}
                          </p>
                        </div>
                      </div>
                      
                      {/* Decorative corner accent */}
                      <div 
                        className="absolute bottom-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity"
                        style={{
                          background: `linear-gradient(135deg, transparent 0%, ${benefit.accentColor} 100%)`,
                        }}
                      />
                      
                      {/* Bottom border accent */}
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                          background: benefit.iconBg,
                        }}
                      />
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

      {/* CTA Section */}
      <section id="auth-section" className="py-20 lg:py-28 bg-gradient-to-b from-white to-[#FFF4E6]">
        <AuthSectionLanding onRoleSelect={onRoleSelect} />
      </section>

      {/* Success Stories Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4">
              <Award size={48} style={{ color: '#FF8D28' }} />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#2F4858' }}>
              UMKM Sukses Bersama Kami
            </h2>
            <p style={{ color: '#4A4A4A', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
              Ribuan UMKM telah berkembang dan mencapai kesuksesan melalui platform Asli Bogor
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { title: "Peningkatan Penjualan", value: "300%", desc: "Rata-rata peningkatan penjualan UMKM" },
              { title: "Jangkauan Pasar", value: "Seluruh Indonesia", desc: "Produk UMKM Bogor bisa dinikmati di mana saja" },
              { title: "Kepuasan Pelanggan", value: "4.8/5", desc: "Rating tinggi dari ribuan pelanggan" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-gradient-to-br from-[#FFF4E6] to-white p-8 rounded-2xl shadow-lg text-center border border-orange-100"
              >
                <h3 className="text-3xl font-bold mb-2" style={{ color: '#FF8D28' }}>
                  {stat.value}
                </h3>
                <h4 className="text-lg font-semibold mb-2" style={{ color: '#2F4858' }}>
                  {stat.title}
                </h4>
                <p className="text-sm" style={{ color: '#858585' }}>
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Direktori (style seperti halaman Direktori) */}
      <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF4E6 30%, #FFE5CC 100%)' }}>
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto mb-10 lg:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#2F4858' }}>
              Temukan UMKM Lokal Terbaik
            </h2>
            <p style={{ color: '#4A4A4A', fontSize: '18px', maxWidth: '900px', margin: '0 auto' }}>
              Jelajahi berbagai produk dan jasa dari UMKM terbaik di Bogor dengan kualitas premium
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[
              { icon: Store, value: "500+", label: "UMKM", color: "#FF8D28" },
              { icon: Users, value: "10K+", label: "Pengguna", color: "#4CAF50" },
              { icon: TrendingUp, value: "50+", label: "Driver", color: "#2196F3" },
              { icon: Star, value: "4.8", label: "Rating", color: "#FFB84D" },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-orange-100 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <div
                    className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${s.color} 0%, ${s.color}CC 100%)` }}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  {s.label === "Rating" ? (
                    <div className="text-xl font-bold mb-1" style={{ color: s.color }}>
                      {s.value}
                    </div>
                  ) : (
                    <StatCountUp valueStr={s.value} color={s.color} />
                  )}
                  <div className="text-xs font-medium" style={{ color: '#4A4A4A' }}>
                    {s.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Search */}
          <motion.div
            className="max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative group">
              <div
                className="absolute -inset-1 rounded-3xl opacity-70 blur-xl transition duration-300 group-hover:opacity-100"
                style={{ background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 50%, #4CAF50 100%)' }}
              />
              <div className="relative bg-white rounded-3xl shadow-2xl border border-orange-100">
                <div className="flex items-center gap-4 p-2">
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ml-2"
                    style={{ background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)' }}
                  >
                    <Search className="text-white" size={24} />
                  </div>
                  <Input
                    placeholder="Cari UMKM berdasarkan nama, kategori, atau lokasi..."
                    value={directoryQuery}
                    onChange={(e) => setDirectoryQuery(e.target.value)}
                    className="flex-1 border-0 focus:ring-0 text-base py-6 px-0 bg-transparent"
                    style={{ color: '#2F4858', fontSize: '16px' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {(["Semua", "Makanan", "Minuman", "Jasa", "Kerajinan"] as const).map((c) => (
              <motion.button
                key={c}
                onClick={() => setDirectoryCategory(c)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-2xl font-bold text-sm border-2 shadow-sm"
                style={
                  directoryCategory === c
                    ? { background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)', color: '#FFFFFF', borderColor: 'transparent' }
                    : { background: '#FFFFFF', color: '#2F4858', borderColor: '#FFE5CC' }
                }
              >
                {c}
              </motion.button>
            ))}
          </motion.div>

          {/* Grid UMKM (preview seperti Direktori) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredDirectory.map((umkm, idx) => (
              <motion.div
                key={umkm.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className="bg-white rounded-3xl overflow-hidden border-2 border-orange-100 shadow-xl hover:shadow-2xl transition-all h-full flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={umkm.image}
                      alt={umkm.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div
                      className="absolute top-4 left-4 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm"
                      style={{ background: 'linear-gradient(135deg, rgba(255, 141, 40, 0.95) 0%, rgba(255, 184, 77, 0.95) 100%)' }}
                    >
                      <span className="text-xs font-bold text-white">{umkm.category}</span>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center space-x-1 shadow-lg">
                      <Star size={16} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-bold" style={{ color: '#2F4858' }}>{umkm.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#FF8D28] transition-colors" style={{ color: '#2F4858' }}>
                      {umkm.name}
                    </h3>
                    <p className="text-sm mb-4 line-clamp-2 flex-1" style={{ color: '#4A4A4A' }}>
                      {umkm.description}
                    </p>
                    <div className="pt-4 border-t" style={{ borderColor: '#FFE5CC' }}>
                      <p className="text-sm line-clamp-2" style={{ color: '#858585' }}>
                        {umkm.address}
                      </p>
                    </div>

                    <motion.button
                      onClick={onNavigateToDirectory}
                      className="w-full mt-5 py-3 rounded-xl font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)' }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Lihat Detail →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <motion.button
              onClick={onNavigateToDirectory}
              className="px-8 py-4 rounded-xl font-bold text-white shadow-xl"
              style={{ background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)' }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Lihat Semua UMKM →
            </motion.button>
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 mb-4 px-5 py-2.5 rounded-full bg-[#FFF4E6] border border-orange-100">
              <Gift size={18} style={{ color: '#FF8D28' }} />
              <span className="font-bold" style={{ color: '#2F4858' }}>
                Promo Spesial Buat Kamu
              </span>
            </div>
            <p style={{ color: '#4A4A4A', fontSize: '18px', maxWidth: 760, margin: '0 auto' }}>
              Belanja hemat sambil dukung UMKM lokal. Promo dipilih yang paling relevan untuk kamu.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Diskon 15% Mingguan", desc: "Pakai kode: BOGOR15", accent: "#FF8D28" },
              { title: "Ongkir Hemat", desc: "Untuk UMKM pilihan, mulai Rp0", accent: "#4CAF50" },
              { title: "Poin Reward Lebih Banyak", desc: "Setiap transaksi dapat reward tambahan", accent: "#2196F3" },
            ].map((promo, idx) => (
              <motion.div
                key={promo.title}
                className="group relative overflow-hidden rounded-3xl border-2 border-orange-100 shadow-xl p-6 bg-white"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.6 }}
                whileHover={{ y: -6 }}
              >
                <motion.div
                  className="absolute -top-10 -right-10"
                  initial={{ opacity: 0.15, scale: 0.9 }}
                  whileHover={{ opacity: 0.8, scale: 1.15 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sparkles size={46} style={{ color: promo.accent }} />
                </motion.div>

                {/* Shimmer on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ x: ["-110%", "110%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0) 100%)",
                  }}
                />
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: `linear-gradient(135deg, ${promo.accent} 0%, rgba(255,255,255,0) 100%)` }}
                >
                  <Gift size={22} style={{ color: '#FFFFFF' }} />
                </div>
                <h3 className="font-bold text-lg" style={{ color: '#2F4858' }}>
                  {promo.title}
                </h3>
                <p className="body-3 mt-2" style={{ color: '#858585' }}>
                  {promo.desc}
                </p>
                <motion.button
                  onClick={onNavigateToDirectory}
                  className="w-full mt-5 py-3 rounded-xl font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${promo.accent} 0%, #FFB84D 100%)` }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ boxShadow: ["0 0 0 rgba(255,141,40,0)", `0 0 26px rgba(255,141,40,0.25)`, "0 0 0 rgba(255,141,40,0)"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  Ambil Promo
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-[#FFF4E6] relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 mb-4 px-5 py-2.5 rounded-full bg-white/70 border border-orange-100 backdrop-blur-sm shadow-sm">
              <Star size={18} style={{ color: '#FF8D28' }} />
              <span className="font-bold" style={{ color: '#2F4858' }}>
                Review dari Komunitas
              </span>
            </div>
            <p style={{ color: '#4A4A4A', fontSize: '18px', maxWidth: 760, margin: '0 auto' }}>
              Cerita mereka yang sudah coba dan ngerasa terbantu. Rating tinggi karena pengalaman nyata.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl">
              <motion.div
                key={reviewIndex}
                drag="x"
                dragElastic={0.18}
                onDragEnd={(_, info) => {
                  const dx = info.offset.x;
                  if (dx < -70) {
                    setReviewIndex((prev) => (prev + 1) % testimonials.length);
                  } else if (dx > 70) {
                    setReviewIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
                  }
                }}
                className="bg-white rounded-3xl border-2 border-orange-100 shadow-xl p-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 25, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                whileHover={{ y: -6 }}
              >
                <motion.div
                  className="absolute -top-8 -left-8 opacity-15"
                  initial={{ scale: 0.9, rotate: 0 }}
                  animate={{ rotate: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles size={48} style={{ color: '#FF8D28' }} />
                </motion.div>

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)',
                        color: '#FFFFFF',
                      }}
                    >
                      {activeTestimonial.name
                        .split(" ")
                        .map((s) => s[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold" style={{ color: '#2F4858', lineHeight: 1.1 }}>
                        {activeTestimonial.name}
                      </div>
                      <div className="body-3" style={{ color: '#858585' }}>
                        {activeTestimonial.time}
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0.6, opacity: 0.2 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.04, duration: 0.25 }}
                      >
                        <Star size={14} className="text-yellow-500 fill-current" />
                      </motion.span>
                    ))}
                  </div>
                </div>

                <h4 className="font-bold mb-2 relative z-10" style={{ color: '#2F4858' }}>
                  {activeTestimonial.shop}
                </h4>
                <p className="body-3 relative z-10" style={{ color: '#4A4A4A', fontSize: 15, lineHeight: 1.6 }}>
                  {activeTestimonial.text}
                </p>

                <div className="mt-5 flex items-center justify-end gap-2 relative z-10">
                  <Heart size={16} style={{ color: '#FF8D28' }} fill="#FF8D28" />
                  <span className="body-3" style={{ color: '#858585' }}>
                    {activeTestimonial.likes} Orang merasa terbantu
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <motion.button
                type="button"
                onClick={() => setReviewIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="px-4 py-2 rounded-xl border-2"
                style={{ borderColor: "#FFE5CC", color: "#FF8D28", background: "#FFF4E6" }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Sebelumnya"
              >
                <ChevronLeft size={18} />
              </motion.button>

              <div className="inline-flex items-center gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setReviewIndex(i)}
                    className="rounded-full"
                    style={{
                      width: 10,
                      height: 10,
                      background:
                        i === reviewIndex
                          ? "linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)"
                          : "rgba(255,141,40,0.15)",
                      border: "none",
                    }}
                    aria-label={`Pindah ke review ${i + 1}`}
                  />
                ))}
              </div>

              <motion.button
                type="button"
                onClick={() => setReviewIndex((prev) => (prev + 1) % testimonials.length)}
                className="px-4 py-2 rounded-xl border-2"
                style={{ borderColor: "#FFE5CC", color: "#FF8D28", background: "#FFF4E6" }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Berikutnya"
              >
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiration / Tips Section */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 mb-4 px-5 py-2.5 rounded-full bg-[#FFF4E6] border border-orange-100">
              <Sparkles size={18} style={{ color: '#FF8D28' }} />
              <span className="font-bold" style={{ color: '#2F4858' }}>
                Inspirasi Buat Kamu
              </span>
            </div>
            <p style={{ color: '#4A4A4A', fontSize: '18px', maxWidth: 760, margin: '0 auto' }}>
              Inspirasi, rekomendasi, dan hal-hal seru biar kamu makin semangat dukung UMKM lokal.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "5 Tips Mudah Dukung UMKM Lokal di Sekitarmu",
                tag: "Kuliner",
                time: "5 menit",
                image: "https://images.unsplash.com/photo-1526318898511-5c3f7f5f5c2e?auto=format&fit=crop&w=1200&q=80",
              },
              {
                title: "10 Kuliner Khas Nusantara yang Wajib Kamu Coba!",
                tag: "Kuliner",
                time: "7 menit",
                image: "https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?auto=format&fit=crop&w=1200&q=80",
              },
              {
                title: "Panduan Lengkap Memulai Usaha Kecil dari Nol",
                tag: "Bisnis",
                time: "10 menit",
                image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
              },
              {
                title: "Kenapa UMKM Harus Go Digital? Ini Manfaatnya!",
                tag: "Teknologi",
                time: "15 menit",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
              },
            ].map((tip, idx) => (
              <motion.div
                key={tip.title}
                className="group rounded-3xl border-2 border-orange-100 shadow-lg bg-gradient-to-b from-white to-[#FFF4E6] p-6 relative overflow-hidden"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.6 }}
                whileHover={{ y: -6 }}
              >
                <motion.div
                  className="absolute -top-8 -right-8 opacity-15"
                  animate={{ rotate: [0, 14, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles size={44} style={{ color: '#FF8D28' }} />
                </motion.div>

                <div className="relative h-36 rounded-2xl overflow-hidden mb-4">
                  <img
                    src={tip.image}
                    alt={tip.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                </div>
                <div className="flex items-center justify-between gap-4 mb-3 relative z-10">
                  <div className="inline-flex items-center gap-2">
                    <Clock size={18} style={{ color: '#FF8D28' }} />
                    <span className="body-3" style={{ color: '#858585', fontWeight: 700 }}>
                      {tip.time}
                    </span>
                  </div>
                  <div
                    className="px-4 py-2 rounded-full text-xs font-bold"
                    style={{
                      background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)',
                      color: '#FFFFFF',
                    }}
                  >
                    {tip.tag}
                  </div>
                </div>
                <h3
                  className="font-bold text-lg relative z-10 transition-transform duration-300 group-hover:-translate-y-1"
                  style={{ color: '#2F4858' }}
                >
                  {tip.title}
                </h3>
                <motion.button
                  onClick={onNavigateToDirectory}
                  className="mt-5 inline-flex items-center gap-2 font-bold"
                  style={{ color: '#FF8D28' }}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Baca Selengkapnya
                  <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <motion.button
              onClick={scrollToAuth}
              className="px-10 py-4 rounded-xl font-bold text-white shadow-xl border-0 inline-flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)' }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: [
                  "0 0 0 rgba(255,141,40,0)",
                  "0 0 30px rgba(255,141,40,0.25)",
                  "0 0 0 rgba(255,141,40,0)",
                ],
              }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={18} />
              Gabung Sekarang
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}


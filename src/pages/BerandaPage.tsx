import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import {
  Leaf,
  TrendingUp,
  Users,
  Store,
  Award,
  ArrowRight,
  Package,
  Truck,
  Heart,
  Shield,
  Star,
  Gift,
  Sparkles,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { AuthSectionLanding } from "../components/AuthSectionLanding";

interface BerandaPageProps {
  onRoleSelect: (role: "user" | "umkm" | "driver") => void;
  onNavigateToDirectory: () => void;
}

function parseCompactNumber(raw: string): {
  end: number;
  suffix: string;
  isK: boolean;
} {
  const trimmed = (raw || "").trim();
  const hasPlus = trimmed.includes("+");
  const suffix = hasPlus ? "+" : "";
  const isK = /[kK]/.test(trimmed);
  const numberPart = trimmed.replace(/[^0-9.]/g, "");
  const base = numberPart ? Number(numberPart) : 0;
  const end = isK ? base * 1000 : base;
  return { end, suffix, isK };
}

function StatCountUp({ valueStr, color }: { valueStr: string; color: string }) {
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

export function BerandaPage({
  onRoleSelect,
  onNavigateToDirectory,
}: BerandaPageProps) {
  const scrollToAuth = () => {
    const element = document.getElementById("auth-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
  const [directoryCategory, setDirectoryCategory] = useState<
    "Semua" | "Makanan" | "Minuman" | "Jasa" | "Kerajinan"
  >("Semua");

  const directoryPreview = [
    {
      name: "Lapis Bogor Sangkuriang",
      category: "Makanan" as const,
      address:
        "Jl. Pajajaran No.20i, RT.01/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143",
      image:
        "https://agrinesia.co.id/uploads/2024-07/jfzaH33tlscoG2xPGHd8ykIuUGsU3zTo5NrCzWX4.jpeg",
      description:
        "Pelopor dan pencetus pertama bolu lapis yang menggunakan bahan dasar talas",
      rating: 4.8,
    },
    {
      name: "Roti Unyil Venus",
      category: "Makanan" as const,
      address:
        "Ruko V-Point, Jl. Pajajaran No.1, RT.01/RW.01, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
      image:
        "https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/87ea29fa-9cf9-4c78-874a-a843af6c2747_Go-Biz_20230807_104930.jpeg",
      description:
        "Produsen 'Roti Unyil' legendaris di Bogor dengan ukuran kecil dan puluhan varian rasa",
      rating: 4.8,
    },
    {
      name: "Asinan Sedap Gedung Dalam",
      category: "Makanan" as const,
      address:
        "Jl. Siliwangi No.27C, RT.01/RW.01, Sukasari, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16142",
      image:
        "https://s3-ap-southeast-1.amazonaws.com/paxelbucket/revamp/upload-image-1BQ4P6I-E6RINM8-MG2EE3E-R4QAADJ.png",
      description:
        "Salah satu gerai asinan paling legendaris dan tertua di Bogor, berdiri sejak 1978",
      rating: 4.8,
    },
    {
      name: "PIA Apple Pie",
      category: "Makanan" as const,
      address:
        "Jl. Pangrango No.10, RT.04/RW.04, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
      image:
        "https://s3.us-east-1.wasabisys.com/agendaindonesia/2022/10/Pie-Apple-Pie-Bogor.jpg",
      description:
        "Toko pie terkenal di Bogor dengan apple pie yang renyah di luar dan lembut di dalam",
      rating: 4.8,
    },
    {
      name: "Bika Bogor Talubi",
      category: "Makanan" as const,
      address:
        "Jl. Pajajaran No.20M, RT.01/RW.11, Baranangsiang, Kec. Bogor Tim., Kota Bogor, Jawa Barat 16143",
      image:
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvrRS7rbZ9JBrHa85YQJgvl8ZW3uYsmoWwwCEvM_-L1en-5d5g6Oa6akl07FmbHbHnlzJPQ0GQPtA0ny44_7b7TazCgvtOneEj3hVZAf27KM28PPC1_t_B0GSyJ0hgM8CjwxYZS9zqeda7/s1600/20170103_165122_wm.jpg",
      description:
        "Inovasi oleh-oleh khas Bogor yang mengolah talas menjadi kue bika ambon",
      rating: 4.8,
    },
    {
      name: "Macaroni Panggang (MP)",
      category: "Makanan" as const,
      address:
        "Jl. Salak No.24, Babakan, Kecamatan Bogor Tengah, Kota Bogor, Jawa Barat 16128",
      image:
        "https://images.tokopedia.net/img/cache/700/hDjmkQ/2025/4/18/856dcaaf-3fe4-4d7c-8a4b-095d0240b5e8.jpg",
      description:
        "UMKM legendaris di Bogor yang terkenal dengan makaroni skotel panggangnya",
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
    const matchesCategory =
      directoryCategory === "Semua" || umkm.category === directoryCategory;
    return matchesQuery && matchesCategory;
  });

  const stats = [
    { value: "500+", label: "UMKM Terdaftar", icon: Store, color: "#9370DB" },
    { value: "10K+", label: "Pengguna Aktif", icon: Users, color: "#9ACD32" },
    { value: "50+", label: "Driver Siap", icon: TrendingUp, color: "#F99912" },
  ];

  const categories = [
    {
      name: "Makanan",
      count: "150+ UMKM",
      gradient: "bg-gradient-lime-purple text-white shadow-md",
    },
    {
      name: "Minuman",
      count: "80+ UMKM",
      gradient: "bg-gradient-orange-lime text-white shadow-md",
    },
    {
      name: "Fashion",
      count: "120+ UMKM",
      gradient: "bg-gradient-purple-orange text-white shadow-md",
    },
    {
      name: "Jasa",
      count: "150+ UMKM",
      gradient: "bg-gradient-primary text-white shadow-md",
    },
  ];

  const benefits = [
    {
      text: "Produk lokal berkualitas tinggi",
      icon: Package,
      gradient: "bg-gradient-purple-orange",
      bgGradient: "bg-purple-50",
      iconBg: "linear-gradient(135deg, #9370DB 0%, #F99912 100%)",
      accentColor: "#9370DB",
      colorTheme: "purple",
    },
    {
      text: "Pesan antar cepat & mudah",
      icon: Truck,
      gradient: "bg-gradient-lime-purple",
      bgGradient: "bg-lime-50",
      iconBg: "linear-gradient(135deg, #9ACD32 0%, #9370DB 100%)",
      accentColor: "#9ACD32",
      colorTheme: "lime",
    },
    {
      text: "Dukung UMKM, bangga Bogor",
      icon: Heart,
      gradient: "bg-gradient-orange-lime",
      bgGradient: "bg-orange-50",
      iconBg: "linear-gradient(135deg, #F99912 0%, #9ACD32 100%)",
      accentColor: "#F99912",
      colorTheme: "orange",
    },
    {
      text: "Transaksi aman terpercaya",
      icon: Shield,
      gradient: "bg-gradient-primary",
      bgGradient: "bg-lime-50",
      iconBg: "linear-gradient(135deg, #9ACD32 0%, #9370DB 100%)",
      accentColor: "#9ACD32",
      colorTheme: "lime",
    },
    {
      text: "Rating & review transparan",
      icon: Star,
      gradient: "bg-gradient-orange-lime",
      bgGradient: "bg-orange-50",
      iconBg: "linear-gradient(135deg, #F99912 0%, #9ACD32 100%)",
      accentColor: "#F99912",
      colorTheme: "orange",
    },
    {
      text: "Promo menarik setiap hari",
      icon: Gift,
      gradient: "bg-gradient-purple-orange",
      bgGradient: "bg-purple-50",
      iconBg: "linear-gradient(135deg, #9370DB 0%, #F99912 100%)",
      accentColor: "#9370DB",
      colorTheme: "purple",
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

  const MOCK_MARQUEE_UMKM = [
    { name: "Lapis Bogor Sangkuriang", category: "Oleh-Oleh", image: "https://agrinesia.co.id/uploads/2024-07/jfzaH33tlscoG2xPGHd8ykIuUGsU3zTo5NrCzWX4.jpeg" },
    { name: "Roti Unyil Venus", category: "Roti", image: "https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/87ea29fa-9cf9-4c78-874a-a843af6c2747_Go-Biz_20230807_104930.jpeg" },
    { name: "Asinan Sedap Gedung Dalam", category: "Asinan", image: "https://assets.pikiran-rakyat.com/crop/0x0:0x0/750x500/photo/2022/06/27/903345014.jpg" },
    { name: "PIA Apple Pie", category: "Pie", image: "https://s3.us-east-1.wasabisys.com/agendaindonesia/2022/10/Pie-Apple-Pie-Bogor.jpg" },
    { name: "Bika Bogor Talubi", category: "Oleh-Oleh", image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvrRS7rbZ9JBrHa85YQJgvl8ZW3uYsmoWwwCEvM_-L1en-5d5g6Oa6akl07FmbHbHnlzJPQ0GQPtA0ny44_7b7TazCgvtOneEj3hVZAf27KM28PPC1_t_B0GSyJ0hgM8CjwxYZS9zqeda7/s1600/20170103_165122_wm.jpg" },
  ];

  return (
    <div className="min-h-screen">
      <section
        ref={heroRef}
        id="hero"
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(249, 153, 18, 0.05) 0%, rgba(147, 112, 219, 0.08) 50%, rgba(154, 205, 50, 0.05) 100%)' }}
      >

        {/* Luminous Soft Mesh Gradient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Blob 1: Green Top Left */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[60%] rounded-full bg-[#9ACD32] opacity-50 blur-[100px]" />
          {/* Blob 2: Orange Center Right */}
          <div className="absolute top-[20%] right-[-10%] w-[45%] h-[55%] rounded-full bg-[#F99812] opacity-40 blur-[120px]" />
          {/* Blob 3: Purple Bottom Left */}
          <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[50%] rounded-full bg-[#9070D0] opacity-40 blur-[100px]" />
        </div>

        {/* Vibrant Floating Elements (Spread out to fill empty spaces) */}

        {/* Floating Asset 1 - Top Left (Vibrant Orange Card) */}
        <motion.div
          className="absolute w-20 h-20 rounded-2xl shadow-[0_10px_35px_rgba(249,152,18,0.4)] flex items-center justify-center pointer-events-none z-20"
          style={{ background: 'linear-gradient(135deg, #FFB84D 0%, #F99812 100%)', top: '15%', left: '8%', transform: 'rotate(-12deg)' }}
          animate={{ y: [0, -20, 0], rotate: [-12, 5, -12] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Sparkles className="text-white w-9 h-9" />
        </motion.div>

        {/* Floating Asset 2 - Bottom Left (Lime Pill - below the text block edge) */}
        <motion.div
          className="absolute w-16 h-16 rounded-[1.5rem] shadow-[0_10px_35px_rgba(154,205,50,0.4)] flex items-center justify-center pointer-events-none z-20"
          style={{ background: 'linear-gradient(135deg, #aee34b 0%, #9ACD32 100%)', bottom: '15%', left: '15%', transform: 'rotate(25deg)' }}
          animate={{ y: [0, -15, 0], rotate: [25, 5, 25] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Leaf className="text-white w-7 h-7" />
        </motion.div>

        {/* Floating Asset 3 - Top Center-Right (Purple Circle - above slider) */}
        <motion.div
          className="absolute w-16 h-16 rounded-full shadow-[0_10px_35px_rgba(144,112,208,0.4)] flex items-center justify-center pointer-events-none z-20"
          style={{ background: 'linear-gradient(135deg, #b39ddb 0%, #9070D0 100%)', top: '12%', left: '55%' }}
          animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Store className="text-white w-8 h-8" />
        </motion.div>

        {/* Floating Asset 4 - Center Bottom (Orange-Purple Badge - completely replacing the stats void) */}
        <motion.div
          className="absolute w-20 h-20 lg:w-24 lg:h-24 rounded-full shadow-[0_15px_40px_rgba(249,152,18,0.3)] flex items-center justify-center pointer-events-none z-20"
          style={{ background: 'linear-gradient(135deg, #F99812 0%, #9070D0 100%)', bottom: '8%', left: '50%', marginLeft: '-3rem' }}
          animate={{ y: [0, 25, 0], rotate: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Award className="text-white w-10 h-10" />
        </motion.div>

        {/* Floating Asset 5 - Bottom Right (Lime Circle - near the slider end/side) */}
        <motion.div
          className="absolute w-14 h-14 rounded-full shadow-[0_10px_35px_rgba(154,205,50,0.4)] flex items-center justify-center pointer-events-none z-20"
          style={{ background: 'linear-gradient(135deg, #aee34b 0%, #9ACD32 100%)', bottom: '18%', right: '6%' }}
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Star className="text-white w-6 h-6" />
        </motion.div>

        {/* Vibrant ambient sparkling dots */}
        <motion.div className="absolute w-4 h-4 rounded-full bg-[#F99812] shadow-[0_0_15px_#F99812] z-20 pointer-events-none" style={{ top: '30%', left: '35%' }} animate={{ y: [0, 15, 0], opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 3, repeat: Infinity }} />
        <motion.div className="absolute w-5 h-5 rounded-full bg-[#9070D0] shadow-[0_0_15px_#9070D0] z-20 pointer-events-none" style={{ bottom: '25%', right: '28%' }} animate={{ y: [0, -20, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 4, repeat: Infinity }} />
        <motion.div className="absolute w-3 h-3 rounded-full bg-[#9ACD32] shadow-[0_0_15px_#9ACD32] z-20 pointer-events-none" style={{ top: '45%', right: '15%' }} animate={{ y: [0, -10, 0], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.5, repeat: Infinity }} />
        <div className="container mx-auto px-4 lg:px-12 pt-28 pb-32 relative z-10 flex-1 flex flex-col justify-center">
          {/* Glassmorphism Wrapping Container */}
          <div
            className="backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-[2.5rem] p-6 lg:p-12 mb-16 mt-8 relative overflow-hidden z-10"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.6)'
            }}
          >
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              {/* Left: Text Content */}
              <motion.div
                className="space-y-6 lg:pr-8 relative z-10"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Overline */}
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100/60 backdrop-blur-sm border border-orange-200/50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <Sparkles size={16} className="text-[#F99812]" />
                  <span className="text-[#F99812] font-bold text-sm tracking-wider uppercase">
                    Platform Ekosistem UMKM Indonesia
                  </span>
                </motion.div>

                {/* Headline with Gradient Text */}
                <motion.h1
                  style={{
                    color: "#2B323B",
                    fontSize: "clamp(2.5rem, 4.5vw, 4.5rem)",
                    fontWeight: 900,
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em"
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="mb-2"
                >
                  <span style={{ background: 'linear-gradient(to right, #F99812, #9070D0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>
                    SADAYA
                  </span> Tumbuh Bersama, Majukan UMKM Nusantara
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  style={{ color: "#4D4D4D", fontSize: "1.125rem", lineHeight: 1.6 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="max-w-xl font-medium"
                >
                  Platform modern yang menghubungkan Customer, Driver, dan UMKM di seluruh Indonesia dalam satu ekosistem interaktif yang adil, kreatif, dan penuh semangat.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <Button
                    onClick={onNavigateToDirectory}
                    className="px-8 py-6 text-base shadow-xl font-bold bg-[#9070D0] hover:bg-[#7b5bc0] text-white rounded-xl transition-all hover:translate-y-[-2px]"
                  >
                    Jelajahi Direktori
                  </Button>
                  <Button
                    onClick={scrollToAuth}
                    className="px-8 py-6 text-base shadow-xl font-bold bg-[#F99812] hover:bg-[#e08910] text-white rounded-xl transition-all hover:translate-y-[-2px]"
                  >
                    Masuk / Daftar Sekarang
                  </Button>
                </motion.div>
              </motion.div>

              {/* Right: Dual-Direction Infinite Slider/Marquee */}
              <motion.div
                className="relative z-10 w-full py-2 lg:-mr-[20vw]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
              >
                <div className="flex flex-col gap-6">
                  {/* Row 1 (Top) - Right to Left */}
                  <div className="flex overflow-hidden">
                    <motion.div
                      className="flex gap-6 pr-6"
                      animate={{ x: ["0%", "-50%"] }}
                      transition={{ ease: "linear", duration: 35, repeat: Infinity }}
                      style={{ width: "max-content" }}
                    >
                      {[...MOCK_MARQUEE_UMKM, ...MOCK_MARQUEE_UMKM].map((umkm, i) => (
                        <div
                          key={`row1-${i}`}
                          className="relative rounded-2xl overflow-hidden shadow-md flex-none border border-slate-100/50 group bg-slate-100"
                          style={{ minWidth: '240px', width: '240px', height: '160px' }}
                        >
                          <img src={umkm.image} alt={umkm.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/90 via-[#1E293B]/20 to-transparent opacity-90" />
                          <div className="absolute bottom-4 left-4 right-4 text-left">
                            <p className="text-white/90 text-[10px] font-bold uppercase tracking-wider mb-1">{umkm.category}</p>
                            <h3 className="text-white font-bold text-sm leading-tight drop-shadow-md line-clamp-2 h-[40px] overflow-hidden">{umkm.name}</h3>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Row 2 (Bottom) - Left to Right */}
                  <div className="flex overflow-hidden">
                    <motion.div
                      className="flex gap-6 pr-6"
                      animate={{ x: ["-50%", "0%"] }}
                      transition={{ ease: "linear", duration: 40, repeat: Infinity }}
                      style={{ width: "max-content" }}
                    >
                      {[...MOCK_MARQUEE_UMKM, ...MOCK_MARQUEE_UMKM].reverse().map((umkm, i) => (
                        <div
                          key={`row2-${i}`}
                          className="relative rounded-2xl overflow-hidden shadow-md flex-none border border-slate-100/50 group bg-slate-100"
                          style={{ minWidth: '240px', width: '240px', height: '160px' }}
                        >
                          <img src={umkm.image} alt={umkm.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/90 via-[#1E293B]/20 to-transparent opacity-90" />
                          <div className="absolute bottom-4 left-4 right-4 text-left">
                            <p className="text-white/90 text-[10px] font-bold uppercase tracking-wider mb-1">{umkm.category}</p>
                            <h3 className="text-white font-bold text-sm leading-tight drop-shadow-md line-clamp-2 h-[40px] overflow-hidden">{umkm.name}</h3>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>


        </div>

        {/* Bottom Wave Shape */}
        <div className="absolute bottom-[-2px] left-0 right-0 pointer-events-none z-0">
          <svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: "100px" }}>
            <path d="M0,50 C300,100 500,0 800,50 L800,120 L0,120 Z" fill="#FFFFFF" opacity="0.3" />
            <path d="M0,70 C400,20 700,100 1200,50 L1200,120 L0,120 Z" fill="#FFFFFF" />
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
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ color: "#2F4858" }}
            >
              Kenapa Pilih Sadaya?
            </h2>
            <p
              style={{
                color: "#4A4A4A",
                fontSize: "18px",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              Platform digital untuk UMKM Bogor yang menghubungkan produk lokal
              berkualitas dengan pelanggan di seluruh Indonesia.
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
                      className={`p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all border-2 h-full relative overflow-hidden group bg-white ${benefit.bgGradient}`}
                      style={{
                        borderColor: "rgba(255, 255, 255, 0.8)",
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
                        <Sparkles
                          size={20}
                          style={{ color: benefit.accentColor }}
                        />
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
                              color: "#FFFFFF",
                              display: "block",
                              zIndex: 10,
                              position: "relative",
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
                          <p
                            className="text-base font-semibold leading-relaxed text-center"
                            style={{ color: "#2F4858" }}
                          >
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
      <section
        id="auth-section"
        className="py-20 lg:py-28 bg-slate-50 relative"
      >
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
              <Award size={48} style={{ color: "#F99912" }} />
            </div>
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ color: "#2F4858" }}
            >
              UMKM Sukses Bersama Kami
            </h2>
            <p
              style={{
                color: "#4A4A4A",
                fontSize: "18px",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              Ribuan UMKM telah berkembang dan mencapai kesuksesan melalui
              platform Asli Bogor
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Peningkatan Penjualan",
                value: "300%",
                desc: "Rata-rata peningkatan penjualan UMKM",
              },
              {
                title: "Jangkauan Pasar",
                value: "Seluruh Indonesia",
                desc: "Produk UMKM Bogor bisa dinikmati di mana saja",
              },
              {
                title: "Kepuasan Pelanggan",
                value: "4.8/5",
                desc: "Rating tinggi dari ribuan pelanggan",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-gradient-to-br from-[#FFF4E6] to-white p-8 rounded-2xl shadow-lg text-center border border-orange-100"
              >
                <h3
                  className="text-3xl font-bold mb-2"
                  style={{ color: "#F99912" }}
                >
                  {stat.value}
                </h3>
                <h4
                  className="text-lg font-semibold mb-2"
                  style={{ color: "#2F4858" }}
                >
                  {stat.title}
                </h4>
                <p className="text-sm" style={{ color: "#858585" }}>
                  {stat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Direktori (style seperti halaman Direktori) */}
      <section
        className="py-20 lg:py-28 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #FFFFFF 0%, #FFF4E6 30%, #FFE5CC 100%)",
        }}
      >
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto mb-10 lg:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ color: "#2F4858" }}
            >
              Temukan UMKM Lokal Terbaik
            </h2>
            <p
              style={{
                color: "#4A4A4A",
                fontSize: "18px",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              Jelajahi berbagai produk dan jasa dari UMKM terbaik di Bogor
              dengan kualitas premium
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
              { icon: Store, value: "500+", label: "UMKM", color: "#F99912" },
              {
                icon: Users,
                value: "10K+",
                label: "Pengguna",
                color: "#9ACD32",
              },
              {
                icon: TrendingUp,
                value: "50+",
                label: "Driver",
                color: "#9370DB",
              },
              { icon: Star, value: "4.8", label: "Rating", color: "#F99912" },
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
                    style={{
                      background: `linear-gradient(135deg, ${s.color} 0%, ${s.color}CC 100%)`,
                    }}
                  >
                    <Icon size={20} className="text-white" />
                  </div>
                  {s.label === "Rating" ? (
                    <div
                      className="text-xl font-bold mb-1"
                      style={{ color: s.color }}
                    >
                      {s.value}
                    </div>
                  ) : (
                    <StatCountUp valueStr={s.value} color={s.color} />
                  )}
                  <div
                    className="text-xs font-medium"
                    style={{ color: "#4A4A4A" }}
                  >
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
                style={{
                  background:
                    "linear-gradient(135deg, #F99912 0%, #9ACD32 50%, #9370DB 100%)",
                }}
              />
              <div className="relative bg-white rounded-3xl shadow-2xl border border-orange-100">
                <div className="flex items-center gap-4 p-2">
                  <div
                    className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ml-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #F99912 0%, #9ACD32 100%)",
                    }}
                  >
                    <Search className="text-white" size={24} />
                  </div>
                  <Input
                    placeholder="Cari UMKM berdasarkan nama, kategori, atau lokasi..."
                    value={directoryQuery}
                    onChange={(e) => setDirectoryQuery(e.target.value)}
                    className="flex-1 border-0 focus:ring-0 text-base py-6 px-0 bg-transparent"
                    style={{ color: "#2F4858", fontSize: "16px" }}
                  />
                </div>
              </div>
            </div>
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
              whileHover={{
                y: -12,
                scale: 1.02,
                rotateY: 2,
                transition: { duration: 0.3 }
              }}
              className="group h-full"
            >
              <div className="bg-white rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-gray-200 shadow-xl hover:shadow-2xl transition-all h-full flex flex-col cursor-pointer">
                <div className="relative overflow-hidden">
                  <div className="relative h-64 lg:h-72 overflow-hidden bg-gray-100">
                    <img
                      src={umkm.image}
                      alt={umkm.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        minHeight: '256px'
                      }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  <div
                    className="absolute top-4 left-4 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255, 141, 40, 0.95) 0%, rgba(255, 184, 77, 0.95) 100%)",
                    }}
                  >
                    <span className="text-xs font-bold text-white">
                      {umkm.category}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center space-x-1 shadow-lg">
                    <Star size={16} className="text-yellow-500 fill-current" />
                    <span className="text-sm font-bold" style={{ color: "#2F4858" }}>
                      {umkm.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col relative z-10">
                  <motion.h4
                    style={{
                      color: '#2F4858',
                      fontSize: '20px',
                      fontWeight: 700,
                      lineHeight: 1.3
                    }}
                    className="mb-3 group-hover:text-[#9370DB] transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {umkm.name}
                  </motion.h4>

                  <p
                    className="text-sm mb-4 line-clamp-2"
                    style={{
                      color: '#4A4A4A',
                      lineHeight: 1.5
                    }}
                  >
                    {umkm.description}
                  </p>

                  <div className="flex items-start gap-2 pt-3 border-t mt-auto" style={{ borderColor: '#D7BDE2' }}>
                    <Store size={18} style={{ color: '#9370DB' }} className="mt-0.5 flex-shrink-0" />
                    <p className="text-sm line-clamp-2" style={{ color: '#858585' }}>
                      {umkm.address}
                    </p>
                  </div>

                  <motion.div
                    className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    <motion.button
                      onClick={onNavigateToDirectory}
                      className="w-full py-4 rounded-xl text-center font-semibold text-sm"
                      style={{
                        background: 'linear-gradient(135deg, #9370DB 0%, #B4A7D6 100%)',
                        color: '#FFFFFF'
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Lihat Detail →
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
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
              <Gift size={18} style={{ color: "#F99912" }} />
              <span className="font-bold" style={{ color: "#2F4858" }}>
                Promo Spesial Buat Kamu
              </span>
            </div>
            <p
              style={{
                color: "#4A4A4A",
                fontSize: "18px",
                maxWidth: 760,
                margin: "0 auto",
              }}
            >
              Belanja hemat sambil dukung UMKM lokal. Promo dipilih yang paling
              relevan untuk kamu.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Diskon 15% Mingguan",
                desc: "Pakai kode: BOGOR15",
                accent: "#F99912",
                gradient: "linear-gradient(135deg, #F99912 0%, #9ACD32 100%)",
              },
              {
                title: "Ongkir Hemat",
                desc: "Untuk UMKM pilihan, mulai Rp0",
                accent: "#9ACD32",
                gradient: "linear-gradient(135deg, #9ACD32 0%, #9370DB 100%)",
              },
              {
                title: "Poin Reward Lebih Banyak",
                desc: "Setiap transaksi dapat reward tambahan",
                accent: "#9370DB",
                gradient: "linear-gradient(135deg, #9370DB 0%, #F99912 100%)",
              },
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
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0) 100%)",
                  }}
                />
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${promo.accent} 0%, rgba(255,255,255,0) 100%)`,
                  }}
                >
                  <Gift size={22} style={{ color: "#FFFFFF" }} />
                </div>
                <h3 className="font-bold text-lg" style={{ color: "#2F4858" }}>
                  {promo.title}
                </h3>
                <p className="body-3 mt-2" style={{ color: "#858585" }}>
                  {promo.desc}
                </p>
                <motion.button
                  onClick={onNavigateToDirectory}
                  className="w-full mt-5 py-3 rounded-xl font-bold text-white"
                  style={{
                    background: promo.gradient,
                  }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{
                    boxShadow: [
                      "0 0 0 rgba(255,141,40,0)",
                      `0 0 26px rgba(255,141,40,0.25)`,
                      "0 0 0 rgba(255,141,40,0)",
                    ],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
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
              <Star size={18} style={{ color: "#F99912" }} />
              <span className="font-bold" style={{ color: "#2F4858" }}>
                Review dari Komunitas
              </span>
            </div>
            <p
              style={{
                color: "#4A4A4A",
                fontSize: "18px",
                maxWidth: 760,
                margin: "0 auto",
              }}
            >
              Cerita mereka yang sudah coba dan ngerasa terbantu. Rating tinggi
              karena pengalaman nyata.
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
                    setReviewIndex(
                      (prev) =>
                        (prev - 1 + testimonials.length) % testimonials.length,
                    );
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
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles size={48} style={{ color: "#F99912" }} />
                </motion.div>

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                      style={{
                        background:
                          "linear-gradient(135deg, #F99912 0%, #9ACD32 100%)",
                        color: "#FFFFFF",
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
                      <div
                        className="font-bold"
                        style={{ color: "#2F4858", lineHeight: 1.1 }}
                      >
                        {activeTestimonial.name}
                      </div>
                      <div className="body-3" style={{ color: "#858585" }}>
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
                        <Star
                          size={14}
                          className="text-yellow-500 fill-current"
                        />
                      </motion.span>
                    ))}
                  </div>
                </div>

                <h4
                  className="font-bold mb-2 relative z-10"
                  style={{ color: "#2F4858" }}
                >
                  {activeTestimonial.shop}
                </h4>
                <p
                  className="body-3 relative z-10"
                  style={{ color: "#4A4A4A", fontSize: 15, lineHeight: 1.6 }}
                >
                  {activeTestimonial.text}
                </p>

                <div className="mt-5 flex items-center justify-end gap-2 relative z-10">
                  <Heart
                    size={16}
                    style={{ color: "#F99912" }}
                    fill="#F99912"
                  />
                  <span className="body-3" style={{ color: "#858585" }}>
                    {activeTestimonial.likes} Orang merasa terbantu
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <motion.button
                type="button"
                onClick={() =>
                  setReviewIndex(
                    (prev) =>
                      (prev - 1 + testimonials.length) % testimonials.length,
                  )
                }
                className="px-4 py-2 rounded-xl border-2"
                style={{
                  borderColor: "#FFE5CC",
                  color: "#F99912",
                  background: "#FFF4E6",
                }}
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
                          ? "linear-gradient(135deg, #F99912 0%, #9ACD32 100%)"
                          : "rgba(255,141,40,0.15)",
                      border: "none",
                    }}
                    aria-label={`Pindah ke review ${i + 1}`}
                  />
                ))}
              </div>

              <motion.button
                type="button"
                onClick={() =>
                  setReviewIndex((prev) => (prev + 1) % testimonials.length)
                }
                className="px-4 py-2 rounded-xl border-2"
                style={{
                  borderColor: "#FFE5CC",
                  color: "#F99912",
                  background: "#FFF4E6",
                }}
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
              <Sparkles size={18} style={{ color: "#F99912" }} />
              <span className="font-bold" style={{ color: "#2F4858" }}>
                Inspirasi Buat Kamu
              </span>
            </div>
            <p
              style={{
                color: "#4A4A4A",
                fontSize: "18px",
                maxWidth: 760,
                margin: "0 auto",
              }}
            >
              Inspirasi, rekomendasi, dan hal-hal seru biar kamu makin semangat
              dukung UMKM lokal.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "5 Tips Mudah Dukung UMKM Lokal di Sekitarmu",
                tag: "Kuliner",
                time: "5 menit",
                image:
                  "https://image.idntimes.com/post/20250825/2148896942_6ba49f76-ca2b-441f-ab69-b57627b8c6ca.jpg",
              },
              {
                title: "10 Kuliner Khas Nusantara yang Wajib Kamu Coba!",
                tag: "Kuliner",
                time: "7 menit",
                image:
                  "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2024/07/16062938/Ragam-Makanan-Khas-Indonesia-yang-Lezat-dan-Kaya-Nutrisi.jpg",
              },
              {
                title: "Panduan Lengkap Memulai Usaha Kecil dari Nol",
                tag: "Bisnis",
                time: "10 menit",
                image:
                  "https://img.freepik.com/free-photo/business-objects-with-executives-discussing-blueprint-meeting_1098-4066.jpg?semt=ais_hybrid&w=740&q=80",
              },
              {
                title: "Kenapa UMKM Harus Go Digital? Ini Manfaatnya!",
                tag: "Teknologi",
                time: "15 menit",
                image:
                  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
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
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles size={44} style={{ color: "#F99912" }} />
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
                    <Clock size={18} style={{ color: "#F99912" }} />
                    <span
                      className="body-3"
                      style={{ color: "#858585", fontWeight: 700 }}
                    >
                      {tip.time}
                    </span>
                  </div>
                  <div
                    className="px-4 py-2 rounded-full text-xs font-bold"
                    style={{
                      background:
                        "linear-gradient(135deg, #F99912 0%, #9ACD32 100%)",
                      color: "#FFFFFF",
                    }}
                  >
                    {tip.tag}
                  </div>
                </div>
                <h3
                  className="font-bold text-lg relative z-10 transition-transform duration-300 group-hover:-translate-y-1"
                  style={{ color: "#2F4858" }}
                >
                  {tip.title}
                </h3>
                <motion.button
                  onClick={onNavigateToDirectory}
                  className="mt-5 inline-flex items-center gap-2 font-bold"
                  style={{ color: "#F99912" }}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Baca Selengkapnya
                  <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { AsliBogorLogo } from "../components/ui/asli-bogor-logo";
import { Leaf, TrendingUp, Users, Store, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { AuthSectionLanding } from "../components/AuthSectionLanding";

interface BerandaPageProps {
  onRoleSelect: (role: 'user' | 'umkm' | 'driver') => void;
  onNavigateToDirectory: () => void;
}

export function BerandaPage({ onRoleSelect, onNavigateToDirectory }: BerandaPageProps) {
  const scrollToAuth = () => {
    const element = document.getElementById('auth-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
    "Produk lokal berkualitas tinggi",
    "Pesan antar cepat & mudah",
    "Dukung UMKM, bangga Bogor",
    "Transaksi aman terpercaya",
    "Rating & review transparan",
    "Promo menarik setiap hari",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Keep original design */}
      <section 
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
        <div 
          className="absolute bottom-0 left-0 right-0 h-64 opacity-10"
          style={{
            background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 300\'%3E%3Cpath fill=\'%232F4858\' d=\'M0,200 L300,50 L500,120 L700,30 L900,100 L1200,80 L1200,300 L0,300 Z\'/%3E%3C/svg%3E")',
            backgroundSize: 'cover',
            backgroundPosition: 'bottom',
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
                        <h3 style={{ color: stat.color, fontSize: '28px', fontWeight: 700 }}>{stat.value}</h3>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-gradient-to-br from-white to-[#FFF4E6] p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-orange-100"
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)' }}
                  >
                    <CheckCircle2 size={24} className="text-white" />
                  </div>
                  <p className="text-base font-medium" style={{ color: '#2F4858' }}>
                    {benefit}
                  </p>
                </div>
              </motion.div>
            ))}
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
    </div>
  );
}


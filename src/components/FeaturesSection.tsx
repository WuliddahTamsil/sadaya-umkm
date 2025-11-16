import { motion } from "framer-motion";
import { Package, Truck, Heart, Shield, Star, Zap } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Package,
      title: "Produk Lokal Berkualitas",
      description: "Semua produk yang dijual berasal dari UMKM asli Bogor yang sudah terkurasi dengan standar kualitas tinggi.",
      gradient: "from-orange-400 to-yellow-400"
    },
    {
      icon: Truck,
      title: "Pesan Antar Cepat & Mudah",
      description: "Tinggal klik, pesan, dan tunggu di rumah! Layanan pesan antar yang cepat dan terpercaya.",
      gradient: "from-green-400 to-green-600"
    },
    {
      icon: Heart,
      title: "Dukung UMKM, Bangga Bogor",
      description: "Setiap pembelian Anda membantu UMKM berkembang dan memperkuat ekonomi Bogor.",
      gradient: "from-yellow-300 to-orange-500"
    },
    {
      icon: Shield,
      title: "Transaksi Aman Terpercaya",
      description: "Sistem pembayaran yang aman dan terpercaya untuk setiap transaksi Anda.",
      gradient: "from-blue-400 to-blue-600"
    },
    {
      icon: Star,
      title: "Rating & Review Transparan",
      description: "Lihat ulasan dan rating dari pembeli lain untuk memilih produk terbaik.",
      gradient: "from-yellow-400 to-orange-400"
    },
    {
      icon: Zap,
      title: "Promo Menarik Setiap Hari",
      description: "Dapatkan berbagai promo dan diskon menarik untuk produk UMKM favorit Anda.",
      gradient: "from-purple-400 to-pink-500"
    }
  ];

  return (
    <section id="fitur" className="py-24 lg:py-32 relative" style={{ background: 'linear-gradient(to bottom, #FFFFFF 0%, #FFF4E6 100%)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-leaves opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Title */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={{ color: '#2F4858' }} className="mb-4">
            Kenapa Harus Asli Bogor
          </h2>
          <p style={{ color: '#4A4A4A', fontSize: '18px' }} className="max-w-2xl mx-auto">
            Dengan berbelanja di sini, kamu ikut melestarikan budaya dan produk khas Bogor sambil mendukung pertumbuhan ekonomi lokal
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="bg-white p-8 rounded-3xl shadow-lg hover-lift h-full border border-orange-100">
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon size={32} style={{ color: '#FFFFFF' }} />
                  </motion.div>
                  <h4 style={{ color: '#2F4858' }} className="mb-3">
                    {feature.title}
                  </h4>
                  <p className="body-3" style={{ color: '#4A4A4A' }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

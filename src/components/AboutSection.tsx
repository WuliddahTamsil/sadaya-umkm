import { motion } from "framer-motion";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart, Target, Users } from "lucide-react";

export function AboutSection() {
  const values = [
    {
      icon: Heart,
      title: "Cinta Lokal",
      description: "Mendukung produk asli Bogor"
    },
    {
      icon: Target,
      title: "Naik Kelas",
      description: "Memberdayakan UMKM dengan teknologi"
    },
    {
      icon: Users,
      title: "Bersama",
      description: "Membangun ekosistem yang berkelanjutan"
    }
  ];

  return (
    <section id="tentang" className="py-24 lg:py-32 relative" style={{ background: 'linear-gradient(to bottom, #FFF4E6 0%, #FFFFFF 100%)' }}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Illustration */}
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              <ImageWithFallback
                src="https://shopee.co.id/inspirasi-shopee/wp-content/uploads/2025/03/umkm-adalah.webp"
                alt="UMKM Kota Bogor - Tugu Kujang dan Pasar Tradisional Bogor"
                className="w-full h-auto rounded-3xl shadow-2xl object-cover"
              />
              {/* Decorative gradient overlay */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-30 blur-2xl" style={{ background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)' }}></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full opacity-30 blur-2xl" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' }}></div>
            </div>
          </motion.div>

          {/* Right: Text Content */}
          <motion.div 
            className="order-1 lg:order-2 space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <motion.h2 
              style={{ color: '#2F4858' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Tentang Asli Bogor
            </motion.h2>
            <motion.p 
              style={{ color: '#4A4A4A', fontSize: '17px' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Asli Bogor adalah platform digital yang lahir dari kecintaan terhadap produk lokal. Kami hadir untuk menjembatani para pelaku UMKM hebat di Bogor dengan pasar yang lebih luas. Misi kami sederhana: membantu UMKM naik kelas melalui teknologi, sekaligus memudahkan Anda menemukan dan menikmati produk-produk otentik khas Bogor.
            </motion.p>
            <motion.p 
              style={{ color: '#4A4A4A', fontSize: '17px' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Bersama kami, setiap transaksi adalah langkah untuk memperkuat ekonomi lokal dan melestarikan warisan kuliner serta kerajinan kota kita.
            </motion.p>

            {/* Values Grid */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                >
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)' }}>
                    <value.icon size={24} className="text-white" />
                  </div>
                  <h4 style={{ color: '#2F4858', fontSize: '14px' }}>{value.title}</h4>
                  <p className="body-3 text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Heart, Target, Users, Award, Globe, Handshake, Lightbulb, Sparkles, Zap, Rocket } from "lucide-react";
import AISImage from "../assets/AIS.png";
import GHINAImage from "../assets/GHINA.png";
import ILHAMImage from "../assets/ilham.png";
import WUWUImage from "../assets/WUWU.png";

export function TentangPage() {
  const values = [
    {
      icon: Heart,
      title: "Cinta Lokal",
      description: "Mendukung produk asli Bogor dengan sepenuh hati",
      color: "#F99912"
    },
    {
      icon: Target,
      title: "Naik Kelas",
      description: "Memberdayakan UMKM dengan teknologi modern",
      color: "#9ACD32"
    },
    {
      icon: Users,
      title: "Bersama",
      description: "Membangun ekosistem yang berkelanjutan",
      color: "#9370DB"
    }
  ];

  const milestones = [
    { year: "2025", title: "Platform Diluncurkan", desc: "SADAYA resmi diluncurkan untuk mendukung UMKM Bogor" },
    { year: "2026", title: "100+ UMKM Bergabung", desc: "Mencapai milestone pertama dengan 100 UMKM terdaftar" },
    { year: "2027", title: "5K+ Pengguna Aktif", desc: "Komunitas pengguna berkembang pesat" },
    { year: "2028", title: "Ekspansi Nasional", desc: "Produk UMKM Bogor bisa dinikmati di seluruh Indonesia" },
    { year: "2029", title: "500+ UMKM", desc: "Mencapai 500 UMKM terdaftar dengan berbagai kategori" },
  ];

  const teamValues = [
    { icon: Globe, title: "Inovasi", desc: "Terus berinovasi untuk memberikan solusi terbaik" },
    { icon: Handshake, title: "Kolaborasi", desc: "Bekerja sama dengan semua pihak untuk kemajuan bersama" },
    { icon: Lightbulb, title: "Kreativitas", desc: "Mengembangkan ide-ide kreatif untuk mendukung UMKM" },
    { icon: Award, title: "Kualitas", desc: "Memastikan kualitas produk dan layanan terbaik" },
  ];


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Enhanced */}
      <section className="relative py-20 lg:py-32 overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF4E6 0%, #FFFFFF 100%)' }}>
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-10 blur-3xl"
          style={{ background: '#F99912' }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: '#9ACD32' }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -50, 0],
            y: [0, 30, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full opacity-5 blur-3xl"
          style={{ background: '#9370DB' }}
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating Sparkles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Sparkles size={20} style={{ color: '#F99912', opacity: 0.6 }} />
          </motion.div>
        ))}

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div 
                className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)' }}
              >
                <Zap size={48} className="text-white" />
              </div>
            </motion.div>

            <motion.h1 
              className="text-4xl lg:text-5xl font-bold mb-6"
              style={{ color: '#2F4858' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Tentang SADAYA
            </motion.h1>
            <motion.p 
              className="text-xl lg:text-2xl mb-8 font-semibold"
              style={{ color: '#4A4A4A' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Platform digital yang lahir dari kecintaan terhadap produk lokal
            </motion.p>
            <motion.p 
              className="text-lg leading-relaxed"
              style={{ color: '#858585', maxWidth: '800px', margin: '0 auto' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Kami hadir untuk menjembatani para pelaku UMKM hebat di Bogor dengan pasar yang lebih luas. 
              Misi kami sederhana: membantu UMKM naik kelas melalui teknologi, sekaligus memudahkan Anda 
              menemukan dan menikmati produk-produk otentik khas Bogor.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Story Section - Enhanced */}
      <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #FFFFFF 0%, #FFF4E6 50%, #FFFFFF 100%)' }}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image - Enhanced */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#F99912] to-[#F99912] rounded-3xl opacity-20 blur-2xl transform rotate-6"></div>
                <ImageWithFallback
                  src="https://shopee.co.id/inspirasi-shopee/wp-content/uploads/2025/03/umkm-adalah.webp"
                  alt="UMKM Kota Bogor - Tugu Kujang dan Pasar Tradisional Bogor"
                  className="w-full h-auto rounded-3xl shadow-2xl object-cover relative z-10"
                />
              </motion.div>
              
              {/* Animated decorative elements */}
              <motion.div 
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-30 blur-2xl"
                style={{ background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)' }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute -top-6 -left-6 w-32 h-32 rounded-full opacity-30 blur-2xl"
                style={{ background: 'linear-gradient(135deg, #9ACD32 0%, #9370DB 100%)' }}
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, -90, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            {/* Right: Content - Enhanced */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full" style={{ background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)' }}>
                  <Sparkles size={20} className="text-white" />
                  <span className="text-white font-semibold text-sm">Cerita Kami</span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: '#2F4858' }}>
                  Dari Visi Sederhana Menjadi Platform Terpercaya
                </h2>
              </motion.div>
              
              {[
                "SADAYA dimulai dari sebuah visi sederhana: bagaimana cara membantu UMKM lokal untuk berkembang dan menjangkau pasar yang lebih luas. Kami percaya bahwa setiap produk lokal memiliki cerita dan nilai yang unik.",
                "Bersama kami, setiap transaksi adalah langkah untuk memperkuat ekonomi lokal dan melestarikan warisan kuliner serta kerajinan kota kita. Kami tidak hanya menjual produk, tetapi juga membangun komunitas yang saling mendukung.",
                "Dengan teknologi yang mudah digunakan dan dukungan penuh, kami membantu UMKM untuk naik kelas dan bersaing di era digital."
              ].map((text, index) => (
                <motion.p 
                  key={index}
                  className="text-lg leading-relaxed p-4 rounded-xl"
                  style={{ 
                    color: '#4A4A4A',
                    background: index % 2 === 0 ? 'linear-gradient(135deg, #FFF4E6 0%, transparent 100%)' : 'transparent'
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  {text}
                </motion.p>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section - Enhanced */}
      <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, #FFFFFF 0%, #FFF4E6 100%)' }}>
        {/* Animated background */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-5"
          style={{
            background: 'radial-gradient(circle at 20% 50%, #F99912 0%, transparent 50%), radial-gradient(circle at 80% 50%, #9ACD32 0%, transparent 50%)'
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
              className="inline-block mb-4"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Award size={48} style={{ color: '#F99912' }} />
            </motion.div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#2F4858' }}>
              Nilai-Nilai Kami
            </h2>
            <p style={{ color: '#4A4A4A', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
              Prinsip yang menjadi fondasi dalam setiap langkah kami
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all text-center border-2 border-transparent hover:border-orange-200 relative overflow-hidden group"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -12, scale: 1.03 }}
                >
                  {/* Animated background gradient on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10"
                    style={{ background: `linear-gradient(135deg, ${value.color} 0%, ${value.color}CC 100%)` }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <motion.div 
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center relative z-10"
                    style={{ background: `linear-gradient(135deg, ${value.color} 0%, ${value.color}CC 100%)` }}
                    whileHover={{ scale: 1.15, rotate: 360 }}
                    transition={{ duration: 0.6, type: "spring" }}
                  >
                    <Icon size={40} className="text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 relative z-10" style={{ color: '#2F4858' }}>
                    {value.title}
                  </h3>
                  <p className="text-base relative z-10" style={{ color: '#4A4A4A' }}>
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tim Pengembang Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-white">
        {/* Animated Background Elements - Lighter */}
        <motion.div
          className="absolute top-10 left-10 w-72 h-72 rounded-full opacity-3 blur-3xl"
          style={{ background: '#F99912' }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-3 blur-3xl"
          style={{ background: '#9ACD32' }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="container mx-auto px-4 lg:px-6 relative z-20">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block mb-4"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Users size={48} style={{ color: '#F99912' }} />
            </motion.div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#2F4858' }}>
              Tim Pengembang
            </h2>
            <p style={{ color: '#4A4A4A', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
              Tim kreatif dan berdedikasi di balik kesuksesan SADAYA
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-7xl mx-auto relative z-20">
            {[
              {
                name: "AISYAH",
                role: "Project Manager + Backend Developer",
                description: "Bertanggung jawab dalam manajemen proyek secara keseluruhan dan pengembangan arsitektur server-side yang robust.",
                image: AISImage,
                color: "#F59E0B",
                gradient: "linear-gradient(135deg, #FBBF24 0%, #D97706 100%)"
              },
              {
                name: "GHINA",
                role: "UI Designer",
                description: "Menciptakan desain antarmuka pengguna yang intuitif, estetis, dan memastikan pengalaman visual yang konsisten.",
                image: GHINAImage,
                color: "#3B82F6",
                gradient: "linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)"
              },
              {
                name: "WULIDDAH",
                role: "UX Designer + Frontend Developer",
                description: "Fokus pada pengalaman pengguna (UX) dan mentransformasikan desain menjadi kode frontend yang responsif dan interaktif.",
                image: WUWUImage,
                color: "#10B981",
                gradient: "linear-gradient(135deg, #34D399 0%, #059669 100%)"
              },
              {
                name: "ILHAM",
                role: "Backend Developer + Cloud Engineer",
                description: "Mengelola integrasi database, logika bisnis server, serta bertanggung jawab penuh pada proses deployment dan maintenance hosting platform.",
                image: ILHAMImage,
                color: "#EF4444",
                gradient: "linear-gradient(135deg, #F87171 0%, #DC2626 100%)"
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-orange-100 h-full flex flex-col relative z-20">
                  {/* Photo Section - Clear and Sharp */}
                  <div className="relative h-80 overflow-hidden bg-gray-50">
                    <ImageWithFallback
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{
                        imageRendering: 'crisp-edges',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        filter: 'none'
                      }}
                    />
                    {/* Animated Sparkle Effect */}
                    <motion.div
                      className="absolute top-4 right-4 z-10"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Sparkles size={24} style={{ color: member.color }} />
                    </motion.div>
                    {/* Name Badge - Clear and Visible */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                      <motion.div
                        className="bg-white rounded-xl p-4 shadow-2xl border-2"
                        style={{ borderColor: member.color }}
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                      >
                        <h3 className="text-xl font-bold mb-1" style={{ color: '#2F4858' }}>
                          {member.name}
                        </h3>
                        <p 
                          className="text-sm font-bold"
                          style={{ color: member.color }}
                        >
                          {member.role}
                        </p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col bg-white relative z-10">
                    {/* Job Description */}
                    <motion.p
                      className="text-base leading-relaxed mb-4 flex-1 font-medium"
                      style={{ color: '#2F4858' }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.4, duration: 0.5 }}
                    >
                      {member.description}
                    </motion.p>

                    {/* Decorative Element */}
                    <motion.div
                      className="flex items-center gap-3 pt-4 border-t-2"
                      style={{ borderColor: '#FFE5CC' }}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                    >
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                        style={{ background: member.gradient }}
                      >
                        <Users size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold mb-1" style={{ color: '#858585' }}>
                          Tim SADAYA
                        </p>
                        <p className="text-sm font-bold" style={{ color: member.color }}>
                          {member.role}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section - Enhanced */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-5 blur-3xl"
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
        
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block mb-4"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <Rocket size={48} style={{ color: '#F99912' }} />
            </motion.div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#2F4858' }}>
              Perjalanan Kami
            </h2>
            <p style={{ color: '#4A4A4A', fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
              Momen-momen penting dalam perjalanan SADAYA
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 hidden lg:block" style={{ background: 'linear-gradient(to bottom, #F99912, #9ACD32, #9ACD32)' }} />
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className="flex gap-6 items-start relative"
                  initial={{ opacity: 0, x: -50, scale: 0.9 }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6, type: "spring", stiffness: 100 }}
                  whileHover={{ x: 10 }}
                >
                  <div className="flex-shrink-0 relative z-10">
                    <motion.div 
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-xl"
                      style={{ background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)' }}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6, type: "spring" }}
                    >
                      {milestone.year}
                    </motion.div>
                    {index < milestones.length - 1 && (
                      <motion.div 
                        className="w-0.5 h-24 mx-auto mt-2 hidden lg:block"
                        style={{ background: 'linear-gradient(to bottom, #F99912, #9ACD32)' }}
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                      />
                    )}
                  </div>
                  <motion.div 
                    className="flex-1 pb-8 bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-100 hover:border-[#F99912] transition-all"
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#2F4858' }}>
                      {milestone.title}
                    </h3>
                    <p className="text-base" style={{ color: '#4A4A4A' }}>
                      {milestone.desc}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Values Section */}
      <section className="py-20 lg:py-28" style={{ background: 'linear-gradient(to bottom, #FFF4E6 0%, #FFFFFF 100%)' }}>
        <div className="container mx-auto px-4 lg:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#2F4858' }}>
              Komitmen Kami
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {teamValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  className="bg-white p-6 rounded-2xl shadow-lg text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                >
                  <div 
                    className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)' }}
                  >
                    <Icon size={28} className="text-white" />
                  </div>
                  <h4 className="font-bold mb-2" style={{ color: '#2F4858' }}>
                    {value.title}
                  </h4>
                  <p className="text-sm" style={{ color: '#4A4A4A' }}>
                    {value.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}


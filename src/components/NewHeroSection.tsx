import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

import { AsliBogorLogo } from "./ui/asli-bogor-logo";

export function NewHeroSection() {
  const scrollToDirectory = () => {
    const element = document.getElementById('direktori');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAuth = () => {
    const element = document.getElementById('auth-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom right, #FFFFFF 0%, #FFFDF7 50%, #FFF8FA 100%)'
      }}
    >
      {/* Dynamic Bright Background Mesh Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#F99912] to-transparent opacity-[0.16] blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[70%] rounded-full bg-gradient-to-bl from-[#9ACD32] to-transparent opacity-[0.18] blur-[130px]" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] rounded-full bg-gradient-to-tr from-[#9370DB] to-transparent opacity-[0.16] blur-[140px]" style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        
        {/* Subtle grid mesh pattern layer */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
      </div>
      {/* Decorative Elements - Floating Leaves */}
      <motion.div
        className="absolute top-20 left-10 text-purple-600 opacity-20"
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
        className="absolute top-40 right-20 text-lime-500 opacity-20"
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
        className="absolute bottom-32 left-1/4 text-orange-400 opacity-15"
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
                    "drop-shadow(0 10px 20px rgba(249, 153, 18, 0.3))",
                    "drop-shadow(0 15px 30px rgba(249, 153, 18, 0.5))",
                    "drop-shadow(0 10px 20px rgba(249, 153, 18, 0.3))"
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
                    filter: "drop-shadow(0 10px 25px rgba(249, 153, 18, 0.4))"
                  }}
                />
              </motion.div>
            </motion.div>

              <motion.h1
              style={{ 
                color: '#1e293b',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
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
                onClick={scrollToDirectory}
                className="px-8 py-6 text-lg hover-lift"
                style={{ 
                  background: 'linear-gradient(135deg, #9370DB 0%, #F99912 100%)',
                  color: '#FFFFFF',
                  border: 'none'
                }}
              >
                Jelajahi Direktori
              </Button>

              <Button 
                onClick={scrollToAuth}
                className="px-8 py-6 text-lg hover-lift shadow-lg font-bold"
                style={{ 
                  background: 'linear-gradient(135deg, #F99912 0%, #9ACD32 100%)',
                  color: '#FFFFFF',
                  border: 'none'
                }}
              >
                Masuk / Daftar Sekarang
              </Button>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-6 pt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="text-center">
                <h3 className="text-3xl font-extrabold" style={{ color: '#9ACD32' }}>500+</h3>
                <p className="body-3 font-semibold text-slate-600">UMKM Terdaftar</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-extrabold" style={{ color: '#9370DB' }}>10K+</h3>
                <p className="body-3 font-semibold text-slate-600">Pengguna Aktif</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-extrabold" style={{ color: '#F99912' }}>50+</h3>
                <p className="body-3 font-semibold text-slate-600">Driver Siap</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Illustration/Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              {/* Decorative circles */}
              <motion.div
                className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-purple-400 opacity-30 blur-xl"
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
                className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-lime-400 opacity-30 blur-xl"
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Main visual - High Fidelity 3D Render */}
              <motion.div 
                className="relative z-10 w-full flex justify-center items-center p-4 lg:p-0"
                animate={{
                  y: [-15, 5, -15]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Stunning gradient glowing backdrop container to match the reference look */}
                <div className="relative rounded-[2.5rem] p-2 bg-gradient-to-br from-[#F99912]/20 via-[#9370DB]/30 to-transparent backdrop-blur-sm shadow-[0_20px_50px_rgba(147,112,219,0.2)]">
                  <div className="absolute inset-0 bg-white/40 rounded-[2.5rem] backdrop-blur-md border border-white/60"></div>
                  
                  <img 
                    src="/hero-3d.png" 
                    alt="SADAYA 3D E-Commerce Platform" 
                    className="relative z-10 w-[95%] sm:w-[85%] lg:w-full max-w-[550px] mx-auto object-contain drop-shadow-2xl rounded-[2.2rem]"
                  />
                  
                  {/* Floating geometric decorative blocks over the container */}
                  <motion.div 
                    className="absolute -right-6 top-16 w-16 h-16 rounded-2xl bg-[#9ACD32]/80 backdrop-blur-xl shadow-lg border border-white/40"
                    animate={{ rotate: [12, 24, 12], y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div 
                    className="absolute -left-8 bottom-12 w-20 h-20 rounded-full bg-gradient-to-br from-[#F99912] to-[#ffb84d] opacity-90 shadow-lg border border-white/30"
                    animate={{ scale: [1, 1.1, 1], x: [0, 8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  />
                </div>
              </motion.div>
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
  );
}

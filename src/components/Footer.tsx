import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Leaf } from "lucide-react";
import { motion } from "framer-motion";

import { AsliBogorLogo } from "./ui/asli-bogor-logo";

export function Footer() {
  return (
    <footer 
      className="py-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #2F4858 0%, #1a2a35 100%)' }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 opacity-10">
        <Leaf size={100} className="text-green-400" />
      </div>
      <div className="absolute bottom-0 right-0 opacity-10">
        <Leaf size={120} className="text-orange-400" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Logo & Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-4">
              <AsliBogorLogo
                variant="secondary"
                className="h-12 w-auto drop-shadow-lg"
                alt="Asli Bogor"
              />
            </div>
            <p className="body-3 mb-4" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Platform digital untuk UMKM Bogor yang menghubungkan produk lokal berkualitas dengan pelanggan di seluruh Indonesia.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://instagram.com/aslibogor" 
                target="_blank"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Instagram size={20} style={{ color: '#FFFFFF' }} />
              </motion.a>
              <motion.a 
                href="https://facebook.com/aslibogor" 
                target="_blank"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Facebook size={20} style={{ color: '#FFFFFF' }} />
              </motion.a>
              <motion.a 
                href="https://twitter.com/aslibogor" 
                target="_blank"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                style={{ background: 'linear-gradient(135deg, #FFB84D 0%, #FF8D28 100%)' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Twitter size={20} style={{ color: '#FFFFFF' }} />
              </motion.a>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h4 style={{ color: '#FFFFFF' }} className="mb-4">
              Menu Cepat
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#hero" className="body-3 hover:text-[#FFB84D] transition-colors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Beranda
                </a>
              </li>
              <li>
                <a href="#direktori" className="body-3 hover:text-[#FFB84D] transition-colors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Direktori UMKM
                </a>
              </li>
              <li>
                <a href="#auth-section" className="body-3 hover:text-[#FFB84D] transition-colors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Masuk / Daftar
                </a>
              </li>
              <li>
                <a href="#tentang" className="body-3 hover:text-[#FFB84D] transition-colors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#keunggulan" className="body-3 hover:text-[#FFB84D] transition-colors" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Keunggulan
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h4 style={{ color: '#FFFFFF' }} className="mb-4">
              Kontak
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={20} style={{ color: '#FFB84D' }} className="flex-shrink-0 mt-1" />
                <span className="body-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Jl. Pajajaran No. 123, Bogor, Jawa Barat 16143
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} style={{ color: '#FFB84D' }} className="flex-shrink-0" />
                <span className="body-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  +62-853-8937-1126
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} style={{ color: '#FFB84D' }} className="flex-shrink-0" />
                <span className="body-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  info@aslibogor.id
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          className="border-t pt-8" 
          style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="body-3 text-center" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            © 2025 Asli Bogor. Bikin Keren UMKM Lokal. All rights reserved.
          </p>
          <p className="body-3 text-center mt-2" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            Follow us: <a href="https://instagram.com/aslibogor" target="_blank" className="hover:text-[#FFB84D] transition-colors">@AsliBogor</a>
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

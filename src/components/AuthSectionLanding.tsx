import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { User, Store, Truck } from "lucide-react";

interface AuthSectionLandingProps {
  onRoleSelect: (role: 'user' | 'umkm' | 'driver') => void;
}

export function AuthSectionLanding({ onRoleSelect }: AuthSectionLandingProps) {
  return (
    <section 
      id="auth-section" 
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF4E6 100%)',
      }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={{ color: '#2F4858' }}>Mulai Bersama Kami</h2>
          <p className="mt-4 text-gray-600" style={{ fontSize: '18px' }}>
            Pilih cara Anda bergabung dengan ekosistem Asli Bogor
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* User Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white rounded-3xl p-8 shadow-lg hover-lift cursor-pointer border-2 border-transparent hover:border-yellow-300"
            onClick={() => onRoleSelect('user')}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <h3 style={{ color: '#FFB84D' }}>Masyarakat</h3>
              <p className="text-gray-600">
                Belanja produk UMKM lokal terbaik
              </p>
              <Button
                className="w-full"
                style={{ 
                  background: 'linear-gradient(135deg, #FFB84D 0%, #FF8D28 100%)',
                  color: '#FFFFFF' 
                }}
              >
                Masuk / Daftar
              </Button>
            </div>
          </motion.div>

          {/* UMKM Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-3xl p-8 shadow-lg hover-lift cursor-pointer border-2 border-transparent hover:border-orange-400"
            onClick={() => onRoleSelect('umkm')}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <Store size={32} className="text-white" />
              </div>
              <h3 style={{ color: '#FF8D28' }}>UMKM</h3>
              <p className="text-gray-600">
                Daftarkan dan kembangkan usaha Anda
              </p>
              <Button
                className="w-full"
                style={{ 
                  background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)',
                  color: '#FFFFFF' 
                }}
              >
                Masuk / Daftar
              </Button>
            </div>
          </motion.div>

          {/* Driver Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-3xl p-8 shadow-lg hover-lift cursor-pointer border-2 border-transparent hover:border-green-400"
            onClick={() => onRoleSelect('driver')}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <Truck size={32} className="text-white" />
              </div>
              <h3 style={{ color: '#4CAF50' }}>Driver</h3>
              <p className="text-gray-600">
                Bergabung sebagai mitra pengiriman
              </p>
              <Button
                className="w-full"
                style={{ 
                  background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                  color: '#FFFFFF' 
                }}
              >
                Masuk / Daftar
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

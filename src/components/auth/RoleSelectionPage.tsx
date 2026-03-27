import { motion } from "framer-motion";
import { User, Store, Truck, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "../ui/card";

import { AsliBogorLogo } from "../ui/asli-bogor-logo";

interface RoleSelectionPageProps {
  onSelectRole: (role: 'user' | 'umkm' | 'driver') => void;
  onClose: () => void;
}

export function RoleSelectionPage({ onSelectRole, onClose }: RoleSelectionPageProps) {
  const roles = [
    {
      id: 'user' as const,
      title: 'Masyarakat',
      subtitle: 'Pembeli / Pelanggan',
      description: 'Temukan dan beli produk UMKM lokal terbaik',
      icon: User,
      gradient: 'from-[#F99912] to-[#9ACD32]',
      color: '#F99912'
    },
    {
      id: 'umkm' as const,
      title: 'UMKM',
      subtitle: 'Penjual / Pelaku Usaha',
      description: 'Daftarkan usaha dan jual produk Anda',
      icon: Store,
      gradient: 'from-[#9370DB] to-[#F99912]',
      color: '#9370DB'
    },
    {
      id: 'driver' as const,
      title: 'Driver',
      subtitle: 'Mitra Pengiriman',
      description: 'Bergabung sebagai mitra pengiriman kami',
      icon: Truck,
      gradient: 'from-[#9ACD32] to-[#9370DB]',
      color: '#9ACD32'
    }
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50"
    >
      {/* Dynamic Bright Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#F99912] to-transparent opacity-10 blur-3xl animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-gradient-to-bl from-[#9ACD32] to-transparent opacity-10 blur-3xl" style={{ animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-gradient-to-tr from-[#9370DB] to-transparent opacity-10 blur-3xl" style={{ animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
      </div>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern-leaves opacity-30" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Back Button */}
        <motion.button
          onClick={onClose}
          className="mb-8 flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Landing Page</span>
        </motion.button>

        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-6">
            <AsliBogorLogo
              variant="primary"
              className="h-14 w-auto drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold" style={{ color: '#0f172a' }}>Pilih Peran Anda</h1>
          <p className="mt-4" style={{ color: '#4A4A4A', fontSize: '18px' }}>
            Silakan pilih kategori yang sesuai dengan kebutuhan Anda di ekosistem SADAYA
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <Card 
                className="cursor-pointer hover-lift bg-white border-2 border-transparent hover:border-opacity-50 transition-all"
                style={{ borderColor: role.color }}
                onClick={() => onSelectRole(role.id)}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <motion.div
                    className="mx-auto w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${role.color} 0%, ${role.color}aa 100%)` }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <role.icon size={40} className="text-white" />
                  </motion.div>

                  <div>
                    <h3 style={{ color: role.color }}>{role.title}</h3>
                    <p className="body-3 text-gray-600 mt-1">{role.subtitle}</p>
                  </div>

                  <p className="text-gray-600">
                    {role.description}
                  </p>

                  <motion.button
                    className="w-full py-3 px-6 rounded-lg text-white transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${role.color} 0%, ${role.color}dd 100%)`
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Pilih {role.title}
                  </motion.button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

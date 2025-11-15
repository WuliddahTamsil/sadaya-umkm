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
      gradient: 'from-yellow-300 to-orange-400',
      color: '#FFB84D'
    },
    {
      id: 'umkm' as const,
      title: 'UMKM',
      subtitle: 'Penjual / Pelaku Usaha',
      description: 'Daftarkan usaha dan jual produk Anda',
      icon: Store,
      gradient: 'from-orange-400 to-red-500',
      color: '#FF8D28'
    },
    {
      id: 'driver' as const,
      title: 'Driver',
      subtitle: 'Mitra Pengiriman',
      description: 'Bergabung sebagai mitra pengiriman kami',
      icon: Truck,
      gradient: 'from-green-400 to-green-600',
      color: '#4CAF50'
    }
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FFF4E6 0%, #FFB84D 50%, #FF8D28 100%)',
      }}
    >
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

        {/* Header */}
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
          <h1 style={{ color: '#2F4858' }}>Pilih Role Anda</h1>
          <p className="mt-4" style={{ color: '#4A4A4A', fontSize: '18px' }}>
            Silakan pilih kategori yang sesuai dengan kebutuhan Anda
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
                    className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-br ${role.gradient} flex items-center justify-center`}
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

        {/* Admin Login Info */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 inline-block">
            <p className="body-3" style={{ color: '#4A4A4A' }}>
              <strong>Login Admin:</strong> Gunakan email <code className="bg-gray-200 px-2 py-1 rounded">admin@gmail.com</code> dengan password <code className="bg-gray-200 px-2 py-1 rounded">123123</code>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

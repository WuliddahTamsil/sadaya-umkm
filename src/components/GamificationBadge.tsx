import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Award, Crown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  earned: boolean;
  progress?: number;
}

export function GamificationBadge({ role }: { role: 'umkm' | 'driver' | 'user' | 'admin' }) {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  const getBadges = (): Badge[] => {
    switch (role) {
      case 'umkm':
        return [
          {
            id: 'top-seller',
            title: 'Top Seller Bulan Ini',
            description: 'Penjualan tertinggi di kategori Anda!',
            icon: Trophy,
            color: '#FFB800',
            earned: true
          },
          {
            id: 'fast-response',
            title: 'Respons Kilat',
            description: 'Selalu balas pesanan dalam 5 menit',
            icon: Zap,
            color: '#FF6B6B',
            earned: true
          },
          {
            id: 'rising-star',
            title: 'Bintang Baru',
            description: '50 pesanan pertama selesai!',
            icon: Star,
            color: '#4CAF50',
            earned: true
          },
          {
            id: 'customer-favorite',
            title: 'Favorit Pelanggan',
            description: 'Rating 4.8+ dari 100 review',
            icon: Award,
            color: '#2196F3',
            earned: false,
            progress: 85
          }
        ];
      case 'driver':
        return [
          {
            id: 'speed-king',
            title: 'Raja Kecepatan',
            description: '100 pengiriman tepat waktu!',
            icon: Zap,
            color: '#FF8D28',
            earned: true
          },
          {
            id: 'marathon-driver',
            title: 'Driver Marathon',
            description: '500km perjalanan selesai',
            icon: Trophy,
            color: '#4CAF50',
            earned: true
          },
          {
            id: 'friendly-courier',
            title: 'Kurir Ramah',
            description: 'Rating 5.0 dari pelanggan',
            icon: Star,
            color: '#FFB800',
            earned: false,
            progress: 92
          }
        ];
      case 'user':
        return [
          {
            id: 'local-hero',
            title: 'Pahlawan UMKM Lokal',
            description: 'Belanja dari 10 UMKM berbeda',
            icon: Crown,
            color: '#9C27B0',
            earned: true
          },
          {
            id: 'frequent-buyer',
            title: 'Pelanggan Setia',
            description: '50 transaksi berhasil',
            icon: Award,
            color: '#FF8D28',
            earned: false,
            progress: 70
          }
        ];
      default:
        return [];
    }
  };

  const badges = getBadges();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy size={20} style={{ color: '#FFB800' }} />
        <h4 style={{ color: '#2F4858' }}>Pencapaian Anda</h4>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.id}
              className="relative"
              onMouseEnter={() => setHoveredBadge(badge.id)}
              onMouseLeave={() => setHoveredBadge(null)}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div
                className={`p-4 rounded-2xl text-center transition-all cursor-pointer ${
                  badge.earned ? 'glass' : 'bg-gray-100'
                }`}
                style={{
                  border: badge.earned ? `2px solid ${badge.color}` : '2px solid #E0E0E0',
                  opacity: badge.earned ? 1 : 0.6
                }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: badge.earned ? `${badge.color}20` : '#F5F5F5'
                  }}
                  animate={badge.earned ? {
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Icon size={32} style={{ color: badge.earned ? badge.color : '#CCCCCC' }} />
                </motion.div>
                
                <p className="body-3" style={{ color: '#2F4858', fontWeight: 600, fontSize: '13px' }}>
                  {badge.title}
                </p>
                
                {!badge.earned && badge.progress && (
                  <div className="mt-2">
                    <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: badge.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${badge.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <p className="body-3 mt-1" style={{ color: '#858585', fontSize: '11px' }}>
                      {badge.progress}%
                    </p>
                  </div>
                )}
              </div>

              {/* Tooltip */}
              {hoveredBadge === badge.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 rounded-lg whitespace-nowrap"
                  style={{
                    backgroundColor: 'rgba(47, 72, 88, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <p className="body-3" style={{ color: '#FFFFFF', fontSize: '12px' }}>
                    {badge.description}
                  </p>
                  <div
                    className="absolute top-full left-1/2 transform -translate-x-1/2"
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid rgba(47, 72, 88, 0.95)'
                    }}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

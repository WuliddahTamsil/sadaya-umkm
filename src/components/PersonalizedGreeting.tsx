import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Sun, Moon, Cloud, Coffee } from 'lucide-react';

export function PersonalizedGreeting() {
  const { user } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Selamat pagi', icon: Sun, color: '#FFB84D' };
    if (hour < 15) return { text: 'Selamat siang', icon: Sun, color: '#FF8D28' };
    if (hour < 18) return { text: 'Selamat sore', icon: Cloud, color: '#FF8D28' };
    return { text: 'Selamat malam', icon: Moon, color: '#2196F3' };
  };

  const getRoleMessage = () => {
    switch (user?.role) {
      case 'umkm':
        return 'Semangat jualan hari ini! ☕';
      case 'driver':
        return 'Hati-hati di jalan ya! 🚗';
      case 'user':
        return 'Ada yang mau dipesan hari ini? 🛍️';
      case 'admin':
        return 'Platform berjalan lancar! 📊';
      default:
        return 'Selamat datang kembali!';
    }
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <motion.div
      className="mb-6 p-6 rounded-2xl overflow-hidden relative"
      style={{
        background: `linear-gradient(135deg, ${greeting.color}20 0%, ${greeting.color}10 100%)`,
        border: `1px solid ${greeting.color}40`
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated background shapes */}
      <motion.div
        className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-20"
        style={{ backgroundColor: greeting.color }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      <div className="relative flex items-center gap-4">
        <motion.div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${greeting.color}30` }}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <GreetingIcon size={28} style={{ color: greeting.color }} />
        </motion.div>
        
        <div className="flex-1">
          <motion.h3
            style={{ color: '#2F4858' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {greeting.text}, {user?.name}! 👋
          </motion.h3>
          <motion.p
            className="body-3 mt-1"
            style={{ color: '#858585' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {getRoleMessage()}
          </motion.p>
        </div>

        {user?.role === 'umkm' && (
          <motion.div
            className="hidden md:block"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Coffee size={40} style={{ color: greeting.color, opacity: 0.3 }} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

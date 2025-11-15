import { toast } from 'sonner';
import { CloudRain, Package, TrendingUp, AlertTriangle, CheckCircle, Info, Zap, Gift } from 'lucide-react';

// Playful Bogor-themed toast notifications
export const BogorToast = {
  // Order notifications
  newOrder: (orderNumber: string) => {
    toast.success(`Pesanan baru #${orderNumber}! Langsung gaskeun! 🚀`, {
      icon: <Package size={20} style={{ color: '#4CAF50' }} />,
      description: 'Ada yang menunggu nih, buruan diproses ya!',
      duration: 5000,
    });
  },

  orderProcessed: (orderNumber: string) => {
    toast.success(`Pesanan #${orderNumber} lagi diproses! 📦`, {
      icon: <CheckCircle size={20} style={{ color: '#2196F3' }} />,
      description: 'Pelanggan pasti seneng nih!',
      duration: 5000,
    });
  },

  orderCompleted: (orderNumber: string) => {
    toast.success(`Yeay! Pesanan #${orderNumber} selesai! 🎉`, {
      icon: <CheckCircle size={20} style={{ color: '#4CAF50' }} />,
      description: 'Mantap! Jangan lupa minta review ya!',
      duration: 5000,
    });
  },

  // Sales notifications
  salesBoom: () => {
    toast.success('Wah, UMKM kamu lagi rame nih! 🔥', {
      icon: <TrendingUp size={20} style={{ color: '#FF8D28' }} />,
      description: '5 pesanan dalam 10 menit terakhir!',
      duration: 5000,
    });
  },

  dailyTarget: (percentage: number) => {
    toast.info(`Target harian ${percentage}% tercapai! Keep going! 💪`, {
      icon: <TrendingUp size={20} style={{ color: '#FF8D28' }} />,
      description: 'Tinggal sedikit lagi nih!',
      duration: 5000,
    });
  },

  // Weather-themed
  rainyDay: () => {
    toast.info('Hujan turun ~ tetap semangat kirim pesanan ya! ☔', {
      icon: <CloudRain size={20} style={{ color: '#2196F3' }} />,
      description: 'Hati-hati di jalan, safety first!',
      duration: 5000,
    });
  },

  // Stock alerts
  lowStock: (productName: string, stock: number) => {
    toast.warning(`Stok ${productName} tinggal ${stock}! ⚠️`, {
      icon: <AlertTriangle size={20} style={{ color: '#FF9800' }} />,
      description: 'Segera restock sebelum kehabisan!',
      duration: 5000,
    });
  },

  outOfStock: (productName: string) => {
    toast.error(`Waduh! ${productName} habis! 😱`, {
      icon: <AlertTriangle size={20} style={{ color: '#FF6B6B' }} />,
      description: 'Customer lagi banyak yang nyari nih!',
      duration: 5000,
    });
  },

  // Driver notifications
  newDelivery: (distance: string) => {
    toast.success(`Order baru! Jarak ${distance} km 🏍️`, {
      icon: <Zap size={20} style={{ color: '#FFB800' }} />,
      description: 'Gas poll, jangan lupa helm!',
      duration: 5000,
    });
  },

  bonusAlert: (remaining: number) => {
    toast.success(`Semangat! Tinggal ${remaining} order lagi bonus harian! 🎁`, {
      icon: <Gift size={20} style={{ color: '#9C27B0' }} />,
      description: 'Udah deket nih, pasti bisa!',
      duration: 5000,
    });
  },

  deliveryCompleted: () => {
    toast.success('Pengiriman selesai! Good job! 👍', {
      icon: <CheckCircle size={20} style={{ color: '#4CAF50' }} />,
      description: 'Customer pasti seneng nih!',
      duration: 5000,
    });
  },

  // Customer notifications
  customerNew: (name: string) => {
    toast.info(`Pelanggan baru: ${name}! 👋`, {
      icon: <Info size={20} style={{ color: '#2196F3' }} />,
      description: 'Berikan pelayanan terbaik ya!',
      duration: 5000,
    });
  },

  customerLoyal: (name: string, orders: number) => {
    toast.success(`${name} udah ${orders}x order! Pelanggan setia nih! 💚`, {
      icon: <TrendingUp size={20} style={{ color: '#4CAF50' }} />,
      description: 'Jangan lupa kasih special treatment!',
      duration: 5000,
    });
  },

  // Generic success with Bogor flavor
  success: (message: string) => {
    toast.success(message, {
      description: 'Alhamdulillah lancar jaya! ✨',
      duration: 5000,
    });
  },

  // Generic info with Bogor flavor
  info: (message: string, description?: string) => {
    toast.info(message, {
      description: description || 'Info penting nih!',
      duration: 5000,
    });
  },

  // Achievement unlocked
  achievement: (badgeName: string) => {
    toast.success(`🏆 Achievement Unlocked: ${badgeName}!`, {
      icon: <Gift size={20} style={{ color: '#FFB800' }} />,
      description: 'Mantap jiwa! Keep up the good work!',
      duration: 5000,
    });
  }
};

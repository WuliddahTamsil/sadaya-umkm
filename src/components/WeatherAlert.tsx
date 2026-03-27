import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { CloudRain, Umbrella } from 'lucide-react';
import { useWeather } from '../contexts/WeatherContext';
import { useAuth } from '../contexts/AuthContext';

export function WeatherAlert() {
  const { isRaining } = useWeather();
  const { user } = useAuth();
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (isRaining && user && !hasShownRef.current) {
      hasShownRef.current = true;
      
      let title = '';
      let message = '';
      let icon = <CloudRain size={16} />;

      switch (user.role) {
        case 'driver':
          title = 'Cuaca Sedang Hujan! ☔';
          message = 'Mohon berhati-hati di jalan. Jalanan licin, pastikan berkendara dengan aman.';
          icon = <Umbrella size={16} />;
          break;
        case 'user':
          title = 'Hujan Nih! 🌧️';
          message = 'Yuk cobain makanan hangat khas Bogor! Pas banget buat cuaca dingin.';
          break;
        case 'umkm':
          title = 'Hujan Turun! 🌧️';
          message = 'Cuaca dingin, waktu yang tepat untuk promosi menu hangat!';
          break;
        default:
          title = 'Bogor Lagi Hujan! 🌧️';
          message = 'Kota Hujan memang selalu segar. Tetap semangat!';
      }

      toast.info(title, {
        description: message,
        icon,
        duration: 5000,
      });
    }

    // Reset when rain stops
    if (!isRaining) {
      hasShownRef.current = false;
    }
  }, [isRaining, user]);

  return null; // This component doesn't render anything, it just triggers toasts
}

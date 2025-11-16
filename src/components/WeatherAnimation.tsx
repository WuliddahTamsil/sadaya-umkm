import { motion } from 'framer-motion';
import { useWeather } from '../contexts/WeatherContext';
import { Cloud } from 'lucide-react';

export function WeatherAnimation() {
  const { weather, isRaining } = useWeather();

  if (weather === 'sunny') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Rain Animation */}
      {isRaining && (
        <>
          {/* Rain drops */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-blue-200 to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${20 + Math.random() * 30}px`,
                opacity: 0.3 + Math.random() * 0.4
              }}
              animate={{
                y: ['-100%', '100vh'],
                x: [0, Math.random() * 20 - 10]
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'linear'
              }}
            />
          ))}

          {/* Rain overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(135, 206, 235, 0.1) 0%, transparent 100%)'
            }}
          />
        </>
      )}

      {/* Clouds Animation */}
      {(weather === 'cloudy' || isRaining) && (
        <>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`cloud-${i}`}
              className="absolute"
              style={{
                top: `${10 + Math.random() * 30}%`,
                opacity: 0.15
              }}
              animate={{
                x: ['-20%', '120%']
              }}
              transition={{
                duration: 30 + Math.random() * 20,
                repeat: Infinity,
                delay: i * 5,
                ease: 'linear'
              }}
            >
              <Cloud 
                size={80 + Math.random() * 40} 
                style={{ color: isRaining ? '#87CEEB' : '#E0E0E0' }} 
              />
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}

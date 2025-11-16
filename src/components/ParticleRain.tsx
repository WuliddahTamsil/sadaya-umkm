import { motion } from 'framer-motion';

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export function ParticleRain({ count = 20 }: { count?: number }) {
  const particles: Particle[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 2,
    size: Math.random() * 3 + 1
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.left}%`,
            width: particle.size,
            height: particle.size * 8,
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%)',
          }}
          animate={{
            y: ['-10%', '110vh'],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

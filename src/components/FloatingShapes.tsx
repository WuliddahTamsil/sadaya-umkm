import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Shape {
  id: number;
  size: number;
  left: string;
  top: string;
  delay: number;
  duration: number;
  color: string;
}

export function FloatingShapes({ variant = 'default' }: { variant?: 'default' | 'green' | 'orange' }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getColors = () => {
    switch (variant) {
      case 'green':
        return ['#4CAF50', '#2E7D32', '#81C784', '#66BB6A'];
      case 'orange':
        return ['#FF8D28', '#FFB84D', '#FFA726', '#FF9800'];
      default:
        return ['#FF8D28', '#4CAF50', '#2196F3', '#FFB84D'];
    }
  };

  const colors = getColors();

  const shapes: Shape[] = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full opacity-10 blur-3xl"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.left,
            top: shape.top,
            backgroundColor: shape.color,
          }}
          animate={{
            x: [0, mousePosition.x * 0.02, 0],
            y: [0, mousePosition.y * 0.02, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

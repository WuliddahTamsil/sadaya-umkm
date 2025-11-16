import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Sparkles, Wrench, Zap, Rocket } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
  description?: string;
  icon?: 'wrench' | 'rocket' | 'sparkles';
}

export function ComingSoonPage({ 
  title, 
  description = 'Tim kami sedang menyiapkan tampilan dan fungsi terbaik untuk Anda.',
  icon = 'wrench'
}: ComingSoonPageProps) {

  const IconComponent = {
    wrench: Wrench,
    rocket: Rocket,
    sparkles: Sparkles
  }[icon];

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="overflow-hidden relative">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50">
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'linear-gradient(45deg, rgba(255,141,40,0.1) 0%, rgba(255,184,0,0.1) 100%)',
                  'linear-gradient(90deg, rgba(255,184,0,0.1) 0%, rgba(76,175,80,0.1) 100%)',
                  'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(255,141,40,0.1) 100%)',
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            />

            {/* Floating Particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ['#FF8D28', '#FFB800', '#4CAF50', '#2196F3'][Math.floor(Math.random() * 4)],
                  opacity: 0.2,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <CardContent className="p-12 relative z-10">
            <div className="text-center">
              {/* Animated Icon */}
              <motion.div
                className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
                style={{ backgroundColor: '#FF8D2820' }}
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <IconComponent size={48} style={{ color: '#FF8D28' }} />
                </motion.div>
              </motion.div>

              {/* Title with Typing Animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="mb-3" style={{ color: '#2F4858' }}>
                  {title}
                </h2>
              </motion.div>

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <p className="body-2 mb-4" style={{ color: '#858585', maxWidth: '500px', margin: '0 auto' }}>
                  {description}
                </p>

                {/* Status Badge */}
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{ backgroundColor: '#FFB80020', border: '1px solid #FFB800' }}
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(255, 184, 0, 0.4)',
                      '0 0 0 10px rgba(255, 184, 0, 0)',
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Zap size={16} style={{ color: '#FFB800' }} />
                  </motion.div>
                  <span className="body-3" style={{ color: '#FFB800', fontWeight: 600 }}>
                    Dalam Pengembangan
                  </span>
                </motion.div>
              </motion.div>

              {/* Progress Animation */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex justify-center gap-2 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-12 h-2 rounded-full"
                      style={{ backgroundColor: '#E0E0E0' }}
                      animate={{
                        backgroundColor: ['#E0E0E0', '#FF8D28', '#E0E0E0'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
                <p className="body-3" style={{ color: '#CCCCCC', fontSize: '12px' }}>
                  Progress Pengembangan
                </p>
              </motion.div>

              {/* Features Coming */}
              <motion.div
                className="grid md:grid-cols-3 gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                {[
                  { icon: '🎨', label: 'UI Modern' },
                  { icon: '⚡', label: 'Super Cepat' },
                  { icon: '📊', label: 'Data Analytics' },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                    whileHover={{ scale: 1.05 }}
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  >
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                      {feature.label}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <Button
                  onClick={() => window.history.back()}
                  size="lg"
                  style={{ backgroundColor: '#FF8D28' }}
                  className="group"
                >
                  <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ x: -5 }}
                  >
                    <ArrowLeft size={18} />
                    Kembali ke Dashboard
                  </motion.div>
                </Button>
              </motion.div>

              {/* Footer Note */}
              <motion.div
                className="mt-8 pt-6 border-t"
                style={{ borderColor: 'rgba(0,0,0,0.1)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <p className="body-3" style={{ color: '#CCCCCC', fontSize: '11px' }}>
                  💡 Fitur ini akan segera hadir dengan tampilan yang lebih menarik!
                </p>
                <p className="body-3 mt-1" style={{ color: '#CCCCCC', fontSize: '11px' }}>
                  Terima kasih atas kesabaran Anda 🙏
                </p>
              </motion.div>
            </div>
          </CardContent>

          {/* Decorative Elements */}
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,141,40,0.3) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-40 h-40 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(76,175,80,0.3) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: 1,
            }}
          />
        </Card>
      </motion.div>
    </div>
  );
}

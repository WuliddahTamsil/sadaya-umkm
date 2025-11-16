import { motion } from 'framer-motion';

export function MountainSilhouette() {
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 overflow-hidden" style={{ height: '40vh' }}>
      {/* Mountain layers with parallax */}
      <motion.svg
        className="absolute bottom-0 w-full"
        style={{ height: '100%' }}
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Back mountain layer */}
        <motion.path
          d="M0,300 L200,150 L400,200 L600,100 L800,180 L1000,140 L1200,220 L1200,400 L0,400 Z"
          fill="url(#mountain-gradient-1)"
          opacity="0.15"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Middle mountain layer */}
        <motion.path
          d="M0,320 L150,200 L350,240 L550,160 L750,220 L950,180 L1200,260 L1200,400 L0,400 Z"
          fill="url(#mountain-gradient-2)"
          opacity="0.2"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Front mountain layer - Gunung Salak */}
        <motion.path
          d="M0,340 L100,240 L250,280 L450,200 L650,260 L850,220 L1050,280 L1200,300 L1200,400 L0,400 Z"
          fill="url(#mountain-gradient-3)"
          opacity="0.25"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Gradients */}
        <defs>
          <linearGradient id="mountain-gradient-1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#2F4858', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#2F4858', stopOpacity: 0.3 }} />
          </linearGradient>
          <linearGradient id="mountain-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4CAF50', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#4CAF50', stopOpacity: 0.3 }} />
          </linearGradient>
          <linearGradient id="mountain-gradient-3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#2E7D32', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#2E7D32', stopOpacity: 0.3 }} />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Fog effect */}
      <motion.div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '30%',
          background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.3) 0%, transparent 100%)',
        }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

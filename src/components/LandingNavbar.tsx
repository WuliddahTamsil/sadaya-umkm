import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { AsliBogorLogo } from "./ui/asli-bogor-logo";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface LandingNavbarProps {
  onRoleSelect?: (role: 'user' | 'umkm' | 'driver') => void;
}

export function LandingNavbar({ onRoleSelect }: LandingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    // Close mobile menu first
    setMobileMenuOpen(false);
    
    // Small delay to ensure menu closes before scrolling
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        // Calculate offset for fixed navbar (navbar height + some padding)
        const navbarHeight = 80;
        const extraPadding = 20;
        const offset = navbarHeight + extraPadding;
        
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      } else {
        console.warn(`Section with id "${id}" not found`);
      }
    }, 150);
  };

  const handleAuthClick = () => {
    scrollToSection('auth-section');
  };

  const navItems = [
    { id: 'hero', label: 'Beranda' },
    { id: 'direktori', label: 'Direktori' },
    { id: 'tentang', label: 'Tentang' },
    { id: 'fitur', label: 'Fitur' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
          : 'bg-gradient-to-r from-orange-50/95 via-orange-100/95 to-orange-200/95 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center cursor-pointer z-10"
            onClick={() => scrollToSection('hero')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AsliBogorLogo
              variant="primary"
              className={`w-auto transition-all ${
                isScrolled ? 'h-8' : 'h-10'
              }`}
            />
          </motion.div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-orange-100">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative px-6 py-2 rounded-full body-3 transition-all whitespace-nowrap"
                  style={{ 
                    color: '#2F4858',
                    fontWeight: 500
                  }}
                  whileHover={{ 
                    color: '#FF8D28',
                    scale: 1.05
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF8D28] to-[#FFB84D] rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>
              ))}
            </div>
          </nav>

          {/* Desktop Auth Button */}
          <div className="hidden lg:flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleAuthClick}
                className="px-6 py-2.5 text-sm font-semibold whitespace-nowrap shadow-md hover:shadow-lg transition-all"
                style={{
                  background: isScrolled 
                    ? 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)'
                    : 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px'
                }}
              >
                Masuk / Daftar
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button - Burger Icon */}
          <motion.button
            className="lg:hidden z-50 p-2.5 rounded-xl transition-all relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ 
              color: '#2F4858',
              backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(255, 141, 40, 0.2)'
            }}
            whileHover={{ 
              scale: 1.1,
              backgroundColor: 'rgba(255, 141, 40, 0.1)'
            }}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            <motion.div
              initial={false}
              animate={mobileMenuOpen ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu - Slide Down Animation */}
        <motion.div
          className="lg:hidden overflow-hidden"
          initial={false}
          animate={{
            height: mobileMenuOpen ? 'auto' : 0,
            opacity: mobileMenuOpen ? 1 : 0
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut"
          }}
        >
          <div className="pt-4 pb-4 space-y-3">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full text-left px-5 py-3.5 rounded-xl body-3 transition-all shadow-sm"
                style={{ 
                  color: '#2F4858',
                  fontWeight: 600,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(255, 141, 40, 0.15)'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: mobileMenuOpen ? 1 : 0,
                  x: mobileMenuOpen ? 0 : -20
                }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  backgroundColor: 'rgba(255, 141, 40, 0.15)',
                  color: '#FF8D28',
                  paddingLeft: '28px',
                  scale: 1.02,
                  boxShadow: '0 4px 12px rgba(255, 141, 40, 0.2)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
              </motion.button>
            ))}
            <motion.div
              className="pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: mobileMenuOpen ? 1 : 0,
                y: mobileMenuOpen ? 0 : 10
              }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleAuthClick}
                className="w-full py-3.5 text-sm font-bold shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #FF8D28 0%, #FFB84D 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px'
                }}
              >
                Masuk / Daftar
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </nav>
  );
}


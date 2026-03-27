import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { AsliBogorLogo } from "./ui/asli-bogor-logo";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

type LandingPage = "beranda" | "direktori" | "tentang" | "fitur" | "game";

interface LandingNavbarProps {
  onRoleSelect?: (role: "user" | "umkm" | "driver") => void;
  currentPage?: LandingPage;
  onNavigateToPage?: (page: LandingPage) => void;
}

export function LandingNavbar({
  currentPage = "beranda",
  onNavigateToPage,
}: LandingNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (page: LandingPage) => {
    setMobileMenuOpen(false);
    if (onNavigateToPage) {
      onNavigateToPage(page);
    }
  };

  const handleAuthClick = () => {
    if (onNavigateToPage) {
      onNavigateToPage("beranda");
      setTimeout(() => {
        const element = document.getElementById("auth-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const navItems: Array<{ id: LandingPage; label: string }> = [
    { id: "beranda", label: "Beranda" },
    { id: "direktori", label: "Direktori" },
    { id: "tentang", label: "Tentang" },
    { id: "fitur", label: "Fitur" },
    { id: "game", label: "Game" },
  ];

  return (
    <nav
      className={`fixed z-40 top-0 left-0 right-0 h-16 border-b border-slate-300/30 text-slate-900/90 transition-all duration-300 backdrop-blur-md bg-white/95 ${
        isScrolled
          ? "shadow-lg border-slate-300/50 backdrop-brightness-110"
          : "shadow-sm border-slate-300/30"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center cursor-pointer z-10"
            onClick={() => handleNavClick("beranda")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AsliBogorLogo
              variant="primary"
              className={`w-auto transition-all ${isScrolled ? "h-8" : "h-10"}`}
            />
          </motion.div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <div
              className="flex items-center gap-2 border border-slate-200/70 rounded-full bg-white py-2 pl-4 pr-2  shadow-sm"
              style={{ minHeight: 44 }}
            >
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="relative px-6 py-2 rounded-full body-3 transition-all whitespace-nowrap"
                  style={{
                    color: currentPage === item.id ? "#9370DB" : "#2F4858",
                    fontWeight: currentPage === item.id ? 600 : 500,
                  }}
                  whileHover={{
                    color: "#9370DB",
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {currentPage === item.id ? (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#9370DB] to-[#9ACD32] rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  ) : (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#9370DB] to-[#9ACD32] rounded-full"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </nav>

          {/* Desktop Auth Button */}
          <div className="hidden lg:flex items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleAuthClick}
                className="px-6 py-2.5 text-sm font-semibold whitespace-nowrap shadow-md hover:shadow-lg transition-all"
                style={{
                  background: isScrolled
                    ? "linear-gradient(135deg, #9370DB 0%, #B4A7D6 100%)"
                    : "linear-gradient(135deg, #9370DB 0%, #B4A7D6 100%)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "12px",
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
              color: "#2F4858",
              backgroundColor: isScrolled
                ? "rgba(255, 255, 255, 0.9)"
                : "rgba(255, 255, 255, 0.8)",
              border: "1px solid rgba(255, 141, 40, 0.2)",
            }}
            whileHover={{
              scale: 1.1,
              backgroundColor: "rgba(255, 141, 40, 0.1)",
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
            height: mobileMenuOpen ? "auto" : 0,
            opacity: mobileMenuOpen ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          <div className="pt-4 pb-4 space-y-3">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="w-full text-left px-5 py-3.5 rounded-xl body-3 transition-all shadow-sm"
                style={{
                  color: currentPage === item.id ? "#9370DB" : "#2F4858",
                  fontWeight: currentPage === item.id ? 700 : 600,
                  backgroundColor:
                    currentPage === item.id
                      ? "rgba(147, 112, 219, 0.15)"
                      : "rgba(255, 255, 255, 0.95)",
                  border: `1px solid ${currentPage === item.id ? "rgba(147, 112, 219, 0.3)" : "rgba(147, 112, 219, 0.15)"}`,
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: mobileMenuOpen ? 1 : 0,
                  x: mobileMenuOpen ? 0 : -20,
                }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  backgroundColor: "rgba(147, 112, 219, 0.15)",
                  color: "#9370DB",
                  paddingLeft: "28px",
                  scale: 1.02,
                  boxShadow: "0 4px 12px rgba(147, 112, 219, 0.2)",
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
                y: mobileMenuOpen ? 0 : 10,
              }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleAuthClick}
                className="w-full py-3.5 text-sm font-bold shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #9370DB 0%, #B4A7D6 100%)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "12px",
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

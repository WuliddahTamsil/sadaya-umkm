import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

import { AsliBogorLogo } from "./ui/asli-bogor-logo";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a
              href="#hero"
              className="flex items-center"
              aria-label="Asli Bogor beranda"
            >
              <AsliBogorLogo
                variant="primary"
                className="h-10 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button onClick={() => scrollToSection('hero')} className="body-3" style={{ color: '#2F4858' }}>
              Beranda
            </button>
            <button onClick={() => scrollToSection('tentang')} className="body-3" style={{ color: '#2F4858' }}>
              Tentang Kami
            </button>
            <button onClick={() => scrollToSection('keunggulan')} className="body-3" style={{ color: '#2F4858' }}>
              Keunggulan
            </button>
            <button onClick={() => scrollToSection('alur')} className="body-3" style={{ color: '#2F4858' }}>
              Alur Daftar
            </button>
            <button onClick={() => scrollToSection('artikel')} className="body-3" style={{ color: '#2F4858' }}>
              Artikel
            </button>
            <button onClick={() => scrollToSection('kontak')} className="body-3" style={{ color: '#2F4858' }}>
              Kontak
            </button>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="outline" style={{ borderColor: '#2F4858', color: '#2F4858' }} className="body-3">
              Login
            </Button>
            <Button style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }} className="body-3">
              Daftar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu style={{ color: '#2F4858' }} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-4">
            <button onClick={() => scrollToSection('hero')} className="block w-full text-left body-3" style={{ color: '#2F4858' }}>
              Beranda
            </button>
            <button onClick={() => scrollToSection('tentang')} className="block w-full text-left body-3" style={{ color: '#2F4858' }}>
              Tentang Kami
            </button>
            <button onClick={() => scrollToSection('keunggulan')} className="block w-full text-left body-3" style={{ color: '#2F4858' }}>
              Keunggulan
            </button>
            <button onClick={() => scrollToSection('alur')} className="block w-full text-left body-3" style={{ color: '#2F4858' }}>
              Alur Daftar
            </button>
            <button onClick={() => scrollToSection('artikel')} className="block w-full text-left body-3" style={{ color: '#2F4858' }}>
              Artikel
            </button>
            <button onClick={() => scrollToSection('kontak')} className="block w-full text-left body-3" style={{ color: '#2F4858' }}>
              Kontak
            </button>
            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="outline" style={{ borderColor: '#2F4858', color: '#2F4858' }} className="body-3">
                Login
              </Button>
              <Button style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }} className="body-3">
                Daftar
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

import { AsliBogorLogo } from "./ui/asli-bogor-logo";

export function HeroSection() {
  const scrollToDirectory = () => {
    const element = document.getElementById('direktori');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="bg-white py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <div className="flex items-center">
              <AsliBogorLogo
                variant="primary"
                className="h-24 w-auto drop-shadow-xl"
              />
            </div>
            <h4 style={{ color: '#4A4A4A' }}>
              UMKM Naik Kelas, Bogor Makin Berkualitas.
            </h4>
            <p style={{ color: '#858585' }}>
              Platform digital yang menghubungkan produk lokal terbaik Bogor dengan pelanggan di seluruh Indonesia. Belanja produk asli, dukung ekonomi lokal!
            </p>
            <Button 
              onClick={scrollToDirectory}
              style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
              className="px-8 py-6"
            >
              Mulai Sekarang
            </Button>
          </div>

          {/* Right: Hero Image */}
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1680345576151-bbc497ba969e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRvbmVzaWFuJTIwdHJhZGl0aW9uYWwlMjBmb29kfGVufDF8fHx8MTc2MjY3MTM2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Produk UMKM Bogor"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ArticlesSection() {
  const articles = [
    {
      id: 1,
      title: "Tips Mengembangkan UMKM di Era Digital",
      excerpt: "Pelajari strategi efektif untuk membawa bisnis UMKM Anda ke level berikutnya dengan memanfaatkan teknologi digital.",
      image: "https://images.unsplash.com/photo-1760992004049-b45d85564e39?w=400",
      date: "5 November 2025",
      category: "Bisnis"
    },
    {
      id: 2,
      title: "Kuliner Khas Bogor yang Wajib Dicoba",
      excerpt: "Jelajahi kekayaan kuliner tradisional Bogor yang terkenal lezat dan menggugah selera.",
      image: "https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=400",
      date: "3 November 2025",
      category: "Kuliner"
    },
    {
      id: 3,
      title: "Kisah Sukses UMKM Lokal Bogor",
      excerpt: "Inspirasi dari perjalanan UMKM lokal yang berhasil berkembang dan menembus pasar yang lebih luas.",
      image: "https://images.unsplash.com/photo-1575277340549-70f2441dee09?w=400",
      date: "1 November 2025",
      category: "Inspirasi"
    }
  ];

  return (
    <section id="artikel" className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 style={{ color: '#2F4858' }} className="mb-4">
            LIHAT ARTIKEL
          </h2>
          <p style={{ color: '#858585' }}>
            Temukan tips, cerita inspiratif, dan informasi menarik seputar UMKM Bogor
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {articles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <ImageWithFallback
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="inline-block px-3 py-1 rounded-full mb-3" style={{ backgroundColor: '#FDE08E' }}>
                  <span className="body-3" style={{ color: '#2F4858' }}>{article.category}</span>
                </div>
                <h4 style={{ color: '#2F4858' }} className="mb-3">
                  {article.title}
                </h4>
                <p className="body-3 mb-4" style={{ color: '#858585' }}>
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-2">
                  <Calendar size={16} style={{ color: '#858585' }} />
                  <span className="body-3" style={{ color: '#858585' }}>{article.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            variant="outline"
            style={{ borderColor: '#FF8D28', color: '#FF8D28' }}
            className="body-3"
          >
            Lihat Semua Artikel
          </Button>
        </div>
      </div>
    </section>
  );
}

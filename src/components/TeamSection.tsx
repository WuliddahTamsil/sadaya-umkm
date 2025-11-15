import { ImageWithFallback } from "./figma/ImageWithFallback";

export function TeamSection() {
  const team = [
    {
      name: "Ahmad Fauzi",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1739298061757-7a3339cee982?w=300"
    },
    {
      name: "Siti Nurhaliza",
      role: "COO",
      image: "https://images.unsplash.com/photo-1739298061757-7a3339cee982?w=300"
    },
    {
      name: "Budi Santoso",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1739298061757-7a3339cee982?w=300"
    },
    {
      name: "Rina Wijaya",
      role: "Co-Founder",
      image: "https://images.unsplash.com/photo-1739298061757-7a3339cee982?w=300"
    }
  ];

  return (
    <section id="tim" className="py-20" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 style={{ color: '#2F4858' }} className="mb-4">
            Tim Kami
          </h2>
          <p style={{ color: '#858585' }}>
            Kenali tim di balik platform Asli Bogor yang berdedikasi untuk UMKM lokal
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <div className="mb-4 mx-auto w-40 h-40 rounded-full overflow-hidden border-4" style={{ borderColor: '#FF8D28' }}>
                <ImageWithFallback
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 style={{ color: '#2F4858' }} className="mb-2">
                {member.name}
              </h4>
              <p className="body-3" style={{ color: '#858585' }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { ImageWithFallback } from "./figma/ImageWithFallback";
import ilhamImage from "../assets/ilham.png";

export function TeamSection() {
  const team = [
    {
      name: "AISYAH",
      role: "Project Manager + Backend Developer",
      description: "Bertanggung jawab dalam manajemen proyek secara keseluruhan dan pengembangan arsitektur server-side yang robust.",
      image: "https://images.unsplash.com/photo-1739298061757-7a3339cee982?w=300",
      color: "#F59E0B",
      icon: "👩‍💻",
      bgGradient: "from-amber-50 to-orange-50"
    },
    {
      name: "GHINA",
      role: "UI Designer",
      description: "Menciptakan desain antarmuka pengguna yang intuitif, estetis, dan memastikan pengalaman visual yang konsisten.",
      image: "https://images.unsplash.com/photo-1739298061757-7a3339cee982?w=300",
      color: "#3B82F6",
      icon: "🎨",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      name: "WULIDDAH",
      role: "UX Designer + Frontend Developer",
      description: "Fokus pada pengalaman pengguna (UX) dan mentransformasikan desain menjadi kode frontend yang responsif dan interaktif.",
      image: "https://images.unsplash.com/photo-1739298061757-7a3339cee982?w=300",
      color: "#10B981",
      icon: "✨",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      name: "ILHAM",
      role: "Backend Developer + Cloud Engineer",
      description: "Mengelola integrasi database, logika bisnis server, serta bertanggung jawab penuh pada proses deployment dan maintenance hosting platform.",
      image: <ilham className="png"></ilham>,
      color: "#EF4444",
      icon: "🚀",
      bgGradient: "from-red-50 to-orange-50"
    }
  ];

  return (
    <section id="tim" className="py-20" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 style={{ color: '#2F4858' }} className="mb-4">
            Tim Pengembang
          </h2>
          <p style={{ color: '#858585' }}>
            Kenali tim di balik platform SADAYA yang berdedikasi untuk UMKM lokal
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div 
              key={index} 
              className={`text-center flex flex-col h-full rounded-lg p-4 bg-gradient-to-br ${member.bgGradient}`}
            >
              {/* Photo Section */}
              <div className="mb-4 mx-auto">
                <div className="w-40 h-52 overflow-hidden rounded-lg shadow-md border-2" style={{ borderColor: member.color }}>
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Name Box with Color Border */}
              <div 
                className="mb-4 px-4 py-3 rounded-lg border-2" 
                style={{ borderColor: member.color, backgroundColor: '#FFFFFF' }}
              >
                <h4 style={{ color: member.color }} className="font-bold text-sm">
                  {member.name}
                </h4>
              </div>
              
              {/* Role */}
              <p className="font-semibold text-sm mb-2" style={{ color: '#2F4858' }}>
                {member.role}
              </p>
              
              {/* Description */}
              <p className="text-xs mb-6 flex-grow" style={{ color: '#858585' }}>
                {member.description}
              </p>
              
              {/* Footer with Icon */}
              <div className="flex items-center gap-2 pt-4 border-t-2" style={{ borderColor: member.color + '30' }}>
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md"
                  style={{ backgroundColor: member.color, color: '#FFFFFF' }}
                >
                  <span className="text-lg">{member.icon}</span>
                </div>
                <div className="text-left flex-1">
                  <p className="text-xs font-semibold" style={{ color: '#858585' }}>
                    Tim SADAYA
                  </p>
                  <p className="text-xs font-bold" style={{ color: member.color }}>
                    {member.role.split(' ')[0]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

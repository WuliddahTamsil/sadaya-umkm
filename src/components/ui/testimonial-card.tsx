import { Star } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
  avatar: string;
}

export function TestimonialCard({ quote, author, role, rating, avatar }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border border-gray-100 group">
      <div className="italic text-lg text-gray-800 mb-6 leading-relaxed ["Nunito",sans-serif]">
        "{quote}"
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <img 
            src={`/assets/${avatar}`} 
            alt={author}
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{author}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <div className="flex gap-1 mt-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={18} fill="#F99912" className="fill-current" />
        ))}
      </div>
    </div>
  );

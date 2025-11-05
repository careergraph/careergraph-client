import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function FeaturedCard ({ item }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    const slug = item.slug || 'bao-cao-thi-truong-lao-dong-q2-2025';
    navigate(`/handbook/${slug}`);
  };
  
  return (
    <article 
      className="relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl"
      onClick={handleClick}
    >
      {item.image && (
        <div className="relative h-52 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <span className="mb-3 inline-block w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
          ✨ Featured
        </span>
        <h3 className="mb-4 text-2xl font-bold leading-tight md:text-3xl">
          {item.title}
        </h3>
        <p className="line-clamp-3 text-base leading-relaxed text-white/90">
          {item.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-white/20 pt-6">
          <span className="text-sm text-white/80">{item.meta}</span>
          <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
            Đọc ngay
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </article>
  );
};
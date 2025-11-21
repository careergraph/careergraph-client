import { Crown, Sparkles, Check } from "lucide-react";
import { useState } from "react";

export default function TemplateCard({ template, onSelect, isSelected = false }) {
  const [isHovered, setIsHovered] = useState(false);

  // Map template ID to image file
  const getTemplateImage = (id) => {
    const imageMap = {
      harvard: "polished",
      minimal: "modern",
      modern: "modern",
      professional: "classic",
      creative: "creative",
      executive: "elegant",
      simple: "temporary",
      elegant: "elegant",
      technical: "timeline",
      graduate: "dublin",
      classic: "classic",
      bold: "vintage",
      academic: "london",
      compact: "legue",
      startup: "moscow",
    };

    const imageName = imageMap[id] || "modern";
    return new URL(`../../../assets/templates/${imageName}.png`, import.meta.url).href;
  };

  return (
    <div
      className="group relative bg-white rounded-2xl border-2 border-slate-200 hover:border-indigo-400 transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 hover:shadow-2xl"
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Template Preview Image */}
      <div className="relative aspect-[1/1.4] bg-white overflow-hidden flex items-center justify-center">
        <img
          src={getTemplateImage(template.id)}
          alt={template.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Premium Badge */}
        {template.tier === "premium" && (
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg">
              <Crown size={14} />
              Premium
            </span>
          </div>
        )}

        {/* Selected Badge */}
        {isSelected && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg">
              <Check size={14} />
              Đã chọn
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center justify-end space-y-3">
            <button
              className="w-full px-5 py-3 bg-white text-slate-900 text-sm font-semibold rounded-xl hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center gap-2 shadow-xl transform"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              <Sparkles size={18} />
              Sử dụng mẫu này
            </button>
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="p-5 space-y-3">
        {/* Title and Tier */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg text-slate-900 leading-tight">
            {template.name}
          </h3>
          {template.tier === "free" && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md whitespace-nowrap">
              Miễn phí
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {template.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md hover:bg-slate-200 transition-colors"
            >
              {tag}
            </span>
          ))}
          {template.tags?.length > 3 && (
            <span className="px-2.5 py-1 text-slate-500 text-xs font-medium">
              +{template.tags.length - 3}
            </span>
          )}
        </div>

        {/* Color Accent Indicator */}
        <div className="flex items-center gap-2 pt-2">
          <div
            className="w-8 h-8 rounded-lg shadow-sm border-2 border-white"
            style={{ backgroundColor: template.accent }}
          />
          <span className="text-xs text-slate-500">Màu chủ đạo</span>
        </div>
      </div>

      {/* Bottom Gradient Effect */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
      />
    </div>
  );
}

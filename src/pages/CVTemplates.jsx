import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Crown, Sparkles } from "lucide-react";
import dotBanner from "../assets/images/hero-section-dot-image.png";
import { cvTemplates } from "../data/templatesConfig";

export default function CVTemplates() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredTemplates = useMemo(() => {
    if (activeFilter === "all") return cvTemplates;
    return cvTemplates.filter((template) => template.tier === activeFilter);
  }, [activeFilter]);

  const handleSelectTemplate = (templateId) => {
    navigate(`/build-cv?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50">
      {/* Hero Section */}
      <div
        className="relative -mt-24 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${dotBanner})` }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-8 h-8 text-indigo-600" />
              <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full">
                20+ TEMPLATES
              </span>
            </div>
            <h1
              className="text-4xl md:text-5xl font-semibold drop-shadow bg-clip-text text-transparent mb-4"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #6a5af9, #7b6cf9, #a78bfa)",
              }}
            >
              Mẫu CV chuyên nghiệp
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Chọn từ bộ sưu tập mẫu CV được thiết kế bởi chuyên gia HR, tối ưu cho ATS và thu hút nhà tuyển dụng
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              {activeFilter === "all"
                ? "Tất cả mẫu CV"
                : activeFilter === "free"
                ? "Mẫu miễn phí"
                : "Mẫu Premium"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {filteredTemplates.length} mẫu có sẵn
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeFilter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setActiveFilter("free")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeFilter === "free"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Miễn phí
            </button>
            <button
              onClick={() => setActiveFilter("premium")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
                activeFilter === "premium"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Crown size={16} />
              Premium
            </button>
          </div>
        </div>

        {/* Templates Grid - 5 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all overflow-hidden cursor-pointer"
              onClick={() => handleSelectTemplate(template.id)}
            >
              {/* Template Preview */}
              <div className="relative aspect-[3/4] bg-slate-50 overflow-hidden">
                {/* Placeholder for template preview image */}
                <div
                  className="w-full h-full flex items-center justify-center text-white text-6xl font-bold"
                  style={{ backgroundColor: template.accent }}
                >
                  {template.name[0]}
                </div>

                {/* Premium Badge */}
                {template.tier === "premium" && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-yellow-400 text-slate-900 text-xs font-semibold rounded flex items-center gap-1">
                      <Crown size={12} />
                      Premium
                    </span>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="px-4 py-2 bg-white text-slate-900 text-sm font-medium rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition flex items-center gap-2">
                    <Sparkles size={16} />
                    Sử dụng mẫu này
                  </button>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 mb-1">
                  {template.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                  {template.description}
                </p>
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {template.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">
              Không tìm thấy mẫu CV phù hợp
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useLocation, useNavigate } from "react-router-dom";
import { FileText, Crown } from "lucide-react";
import dotBanner from "../assets/images/hero-section-dot-image.png";
import { cvTemplates } from "../data/templatesConfig";
import TemplateCard from "../sections/CVBuilder/components/TemplateCard";

export default function CVTemplates() {
  const navigate = useNavigate();
  const location = useLocation();
  const filteredTemplates = cvTemplates;

  const handleSelectTemplate = (templateId) => {
    navigate(`/build-cv?template=${templateId}`, {
      state: location.state || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50">
      {/* Hero Section */}
      <div
        className="relative -mt-24 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${dotBanner})` }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="max-w-3xl">
            <h1
              className="text-4xl mt-8 md:text-4xl font-semibold drop-shadow bg-clip-text text-transparent mb-4"
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-6 py-4">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Tất cả mẫu CV
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {filteredTemplates.length} mẫu có sẵn
            </p>
          </div>
        </div>

        {/* Templates Grid - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={() => handleSelectTemplate(template.id)}
            />
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

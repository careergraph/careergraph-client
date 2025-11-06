import { FileText } from "lucide-react";

const filters = [
  { id: "all", label: "Tất cả" },
  { id: "free", label: "Miễn phí" },
  { id: "premium", label: "Premium" },
];

const TemplateGallery = ({ templates, activeFilter, onFilterChange, selectedId, onSelect }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Bộ sưu tập mẫu</h2>
          <p className="text-sm text-slate-500">Chọn layout phù hợp với phong cách của bạn</p>
        </div>
        <div className="flex rounded-full border border-slate-200 bg-slate-50 px-1 py-1 text-sm font-medium text-slate-600">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onFilterChange(filter.id)}
                className={`rounded-full px-3 py-1 transition ${
                  isActive ? "bg-white text-indigo-600 shadow" : "hover:text-indigo-600"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-2">
        {templates.map((template) => {
          const isSelected = template.id === selectedId;
          return (
            <button
              type="button"
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`group relative overflow-hidden rounded-2xl border transition-all ${
                isSelected
                  ? "border-indigo-500 shadow-lg shadow-indigo-200"
                  : "border-slate-200 hover:border-indigo-300"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/40 to-white/20 opacity-0 transition group-hover:opacity-100" />
              <div className="flex flex-col gap-4 p-5 text-left">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${template.accent}1a`, color: template.accent }}
                  >
                    <FileText size={20} />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-slate-900">{template.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{template.tier}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-slate-500">{template.description}</p>

                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Nhấn để xem chi tiết</span>
                  {isSelected ? <span className="text-indigo-600">Đang chọn</span> : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateGallery;

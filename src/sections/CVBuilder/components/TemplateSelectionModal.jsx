import { X, Loader2, Sparkles } from "lucide-react";
import { cvTemplates } from "~/data/templatesConfig";
import TemplateCard from "./TemplateCard";

function FilterButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "bg-white text-slate-600 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

export default function TemplateSelectionModal({
  open,
  activeFilter,
  onClose,
  onSelectTemplate,
  selectingTemplateId,
  jobTitle,
}) {
  if (!open) {
    return null;
  }

  const filteredTemplates =
    activeFilter === "all"
      ? cvTemplates
      : cvTemplates.filter((template) => template.tier === activeFilter);

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Đóng hộp thoại chọn mẫu CV"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-[#f8f8f4] shadow-2xl">
        <div className="border-b border-slate-200 bg-white px-6 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
                <Sparkles size={14} />
                AI CV Builder
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Chọn template CV cho {jobTitle || "vị trí này"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Chọn mẫu trước, hệ thống sẽ tạo bản nháp CV theo công việc đang xem và
                tự đổ dữ liệu gợi ý từ AI vào editor.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {filteredTemplates.length} template khả dụng trong hệ thống
            </p>
            {selectingTemplateId ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
                <Loader2 size={15} className="animate-spin" />
                Đang chuẩn bị CV...
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="relative">
                <TemplateCard
                  template={template}
                  onSelect={() => onSelectTemplate(template.id)}
                  isSelected={selectingTemplateId === template.id}
                />
                {selectingTemplateId === template.id ? (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-950/45">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg">
                      <Loader2 size={16} className="animate-spin" />
                      Đang tạo bản nháp
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

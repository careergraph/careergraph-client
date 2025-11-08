import { FileText, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CVBuilderPromo() {
  const navigate = useNavigate();

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg transition hover:shadow-xl">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-full bg-white/20 p-3 backdrop-blur-sm">
          <FileText size={24} />
        </div>
        <Sparkles size={20} className="animate-pulse text-yellow-300" />
      </div>

      <h3 className="mb-2 text-xl font-bold">Tạo CV chuyên nghiệp</h3>
      <p className="mb-6 text-sm leading-relaxed text-indigo-100">
        Sử dụng công cụ AI của chúng tôi để tạo CV ấn tượng, tăng cơ hội được tuyển dụng lên 3 lần!
      </p>

      <button
        onClick={() => navigate("/template-cv")}
        className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-50"
      >
        <span>Tạo CV ngay</span>
        <ArrowRight size={18} className="transition group-hover/btn:translate-x-1" />
      </button>

      <div className="mt-4 flex items-center justify-between text-xs text-indigo-100">
        <span>✓ Miễn phí</span>
        <span>✓ 15+ mẫu đẹp</span>
        <span>✓ AI hỗ trợ</span>
      </div>
    </div>
  );
}

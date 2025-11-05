import { Target, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PersonalQuizPromo() {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="bg-gradient-to-r from-emerald-400 to-cyan-500 p-6">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-full bg-white/20 p-2.5 backdrop-blur-sm">
            <Target size={20} className="text-white" />
          </div>
          <Zap size={18} className="animate-pulse text-yellow-300" />
        </div>
        <h3 className="text-lg font-bold text-white">Định vị bản thân</h3>
      </div>

      <div className="p-6">
        <p className="mb-4 text-sm leading-relaxed text-slate-600">
          Làm bài quiz để khám phá điểm mạnh, tính cách và ngành nghề phù hợp với bạn nhất!
        </p>

        <div className="mb-4 space-y-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
            <span>Chỉ mất 5 phút</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
            <span>Dựa trên Big 5 Personality</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
            <span>Kết quả chi tiết & gợi ý nghề</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/personalized")}
          className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg"
        >
          <span>Bắt đầu quiz</span>
          <ArrowRight size={16} className="transition group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

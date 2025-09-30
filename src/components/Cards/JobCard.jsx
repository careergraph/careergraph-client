import { Heart, Zap, MapPin, CircleDollarSign, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function JobCard() {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/job");
  };
  return (
    <div
      className="relative flex gap-4 border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white cursor-pointer"
      onClick={handleNavigate}
    >
      {/* Icon nổi bật */}
      <span className="absolute -top-3 -left-3 bg-indigo-100 text-indigo-600 p-1.5 rounded-full shadow">
        <Zap className="w-4 h-4" />
      </span>

      {/* Logo công ty */}
      <div className="flex-shrink-0">
        <img
          src="/logo-company.png"
          alt="Logo công ty"
          className="w-16 h-16 rounded-lg border border-slate-200 object-cover"
        />
      </div>

      {/* Nội dung + Right column */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-4">
          {/* Left text block */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base md:text-lg text-slate-900 leading-6 truncate">
              Thợ May Đi Làm Ngay
            </h3>
            <p className="text-sm text-slate-600 mb-2 truncate">
              Công Ty TNHH Hoàng Hà Sài Gòn
            </p>

            {/* Tags */}
            <div className="flex  gap-2 mb">
              <span className="px-2.5 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                Phản hồi trong 12 giờ
              </span>
              <span className="px-2.5 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200 rounded-full">
                Không cần CV
              </span>
              <span className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Còn 1 ngày
              </span>
            </div>
          </div>

          {/* Right info block */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
              <CircleDollarSign className="w-4 h-4" />
              <span>7 - 15 triệu</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              <span>TP.HCM</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                className="mt-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200"
                onClick={(e) => { e.stopPropagation(); /* Save logic */ }}
              >
                Lưu
              </button>
              <button
                className="mt-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-200"
                onClick={(e) => { e.stopPropagation(); handleNavigate(); }}
              >
                Chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

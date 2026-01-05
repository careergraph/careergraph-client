import { Megaphone, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { JobService } from "~/services/jobService";
import { toast } from "sonner";

// A richer CTA banner: shows optional company logo, short benefits, and a tiny testimonial
export default function CtaBanner({ job }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const title = job?.title || "vị trí này";
  const companyLogo = job?.companyAvatar || job?.companyLogo || null;

  const handleViewCvTemplate = async () => {
    if (!job?.id) return;

    try {
      setIsLoading(true);
      const response = await JobService.fetchCvSuggestion(job.id);
      
      navigate("/build-cv?template=harvard", { 
        state: { 
          job,
          suggestedCv: response 
        } 
      });
    } catch (error) {
      console.error("Failed to fetch CV suggestion:", error);
      toast.error("Không thể tạo gợi ý CV. Đang chuyển đến trang tạo CV...");
      navigate("/build-cv?template=harvard", { state: { job } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-600 via-sky-500 to-blue-400 text-white p-6 shadow-lg">
        {/* Decorative faint pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-5"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 200"
          aria-hidden
        >
          <defs>
            <linearGradient id="g" x1="0" x2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.06" />
              <stop offset="1" stopColor="#000" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <rect width="800" height="200" fill="url(#g)" />
        </svg>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 font-sans">
          {/* Logo / Icon */}
          <div className="flex-shrink-0">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={job?.companyName || "Logo công ty"}
                className="w-16 h-16 rounded-lg object-cover border border-white/20 bg-white/10"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          {/* Main copy */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight leading-tight">
              Cần hỗ trợ ứng tuyển cho{" "}
              <span className="whitespace-nowrap">{title}</span>?
            </h3>
            <p className="mt-2 text-sm text-white/95 leading-relaxed max-w-prose">
              Chúng tôi cung cấp mẫu CV chuẩn, checklist phỏng vấn và mẹo tối ưu
              hồ sơ theo role để hồ sơ của bạn nổi bật hơn và tăng cơ hội được
              mời phỏng vấn.
            </p>

            <ul className="mt-3 flex flex-wrap gap-3 text-sm">
              <li className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1">
                <strong className="font- text-white">Mẫu CV</strong>
                <span className="opacity-90 text-white/90">theo role</span>
              </li>
              <li className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1">
                <strong className="font-medium text-white">Checklist</strong>
                <span className="opacity-90 text-white/90">kiểm tra nhanh</span>
              </li>
              <li className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1">
                <strong className="font-medium text-white">Tư vấn</strong>
                <span className="opacity-90 text-white/90">1:1 (tùy chọn)</span>
              </li>
            </ul>
          </div>

          {/* CTAs */}
          <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleViewCvTemplate}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-4 py-2 bg-white text-indigo-600 rounded-md font-semibold text-sm shadow-md hover:opacity-95 disabled:opacity-70"
              aria-label={`Xem mẫu CV cho ${title}`}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Xem mẫu CV
            </button>

            <a
              href="/about"
              className="inline-flex items-center justify-center px-4 py-2 border border-white/30 rounded-md text-white text-sm font-medium hover:bg-white/10"
              aria-label="Nhận tư vấn tuyển dụng"
            >
              Nhận tư vấn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

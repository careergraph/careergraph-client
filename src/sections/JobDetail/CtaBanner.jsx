import { Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import TemplateSelectionModal from "~/sections/CVBuilder/components/TemplateSelectionModal";
import { JobService } from "~/services/jobService";
import { useUserStore } from "~/stores/userStore";

export default function CtaBanner({ job }) {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [templateFilter, setTemplateFilter] = useState("all");
  const [selectingTemplateId, setSelectingTemplateId] = useState(null);

  const title = job?.title || "vị trí này";
  const companyLogo = job?.companyAvatar || job?.companyLogo || null;
  const isExpired = job?.isExpired;

  const openTemplateSelection = () => {
    if (!job?.id) {
      return;
    }
    setIsModalOpen(true);
  };

  const closeTemplateSelection = () => {
    if (selectingTemplateId) {
      return;
    }
    setIsModalOpen(false);
  };

  const navigateToBuilder = (templateId, suggestionId = null, suggestedCv = null) => {
    const params = new URLSearchParams({ template: templateId });
    if (suggestionId) {
      params.append("suggestionId", suggestionId);
    }
    navigate(`/build-cv?${params.toString()}`, {
      state: {
        job,
        suggestedCv,
      },
    });
  };

  const handleSelectTemplate = async (templateId) => {
    if (!job?.id || !templateId) {
      return;
    }

    if (!user?.candidateId) {
      toast.info("Đăng nhập với tài khoản Ứng viên để nhận gợi ý CV cá nhân hóa từ AI.");
      setIsModalOpen(false);
      navigateToBuilder(templateId);
      return;
    }

    try {
      setSelectingTemplateId(templateId);
      const response = await JobService.fetchCvSuggestion(job.id);
      setIsModalOpen(false);
      const suggestionId = response.data?.suggestionId || response.suggestionId;
      navigateToBuilder(templateId, suggestionId, response.data || response);
    } catch (error) {
      console.error("Failed to fetch CV suggestion:", error);
      toast.error("Không thể tạo gợi ý CV. Hệ thống sẽ mở editor với dữ liệu hồ sơ hiện có.");
      setIsModalOpen(false);
      navigateToBuilder(templateId);
    } finally {
      setSelectingTemplateId(null);
    }
  };

  return (
    <div className="mt-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-sky-500 to-blue-400 p-6 text-white shadow-lg">
        <svg
          className="absolute inset-0 h-full w-full opacity-5"
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

        <div className="relative z-10 flex flex-col items-center gap-6 font-sans md:flex-row">
          <div className="flex-shrink-0">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={job?.companyName || "Logo công ty"}
                className="h-16 w-16 rounded-lg border border-white/20 bg-white/10 object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white/20">
                <Megaphone className="h-6 w-6 text-white" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-semibold leading-tight tracking-tight md:text-2xl">
              Cần hỗ trợ ứng tuyển cho <span className="whitespace-nowrap">{title}</span>?
            </h3>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-white/95">
              Chọn template CV ngay tại trang việc làm, sau đó hệ thống sẽ dùng AI để tạo
              bản nháp phù hợp với JD này và đổ sẵn dữ liệu vào editor cho bạn chỉnh tiếp.
            </p>

            <ul className="mt-3 flex flex-wrap gap-3 text-sm">
              <li className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1">
                <strong className="text-white">Chọn template</strong>
                <span className="text-white/90">ngay trong modal</span>
              </li>
              <li className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1">
                <strong className="text-white">AI suggestion</strong>
                <span className="text-white/90">theo job đang xem</span>
              </li>
              <li className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1">
                <strong className="text-white">Editor realtime</strong>
                <span className="text-white/90">chỉnh sửa và xuất PDF</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-shrink-0 flex-col items-center gap-3 sm:flex-row">
            {isExpired ? (
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm font-semibold text-white">
                  ❌ Công việc này đã hết hạn ứng tuyển
                </p>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={openTemplateSelection}
                  className="inline-flex items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-md hover:opacity-95"
                  aria-label={`Tạo CV cho ${title}`}
                >
                  Tạo CV
                </button>

                <a
                  href="/about"
                  className="inline-flex items-center justify-center rounded-md border border-white/30 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
                  aria-label="Nhận tư vấn tuyển dụng"
                >
                  Nhận tư vấn
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      <TemplateSelectionModal
        open={isModalOpen}
        activeFilter={templateFilter}
        onFilterChange={setTemplateFilter}
        onClose={closeTemplateSelection}
        onSelectTemplate={handleSelectTemplate}
        selectingTemplateId={selectingTemplateId}
        jobTitle={title}
      />
    </div>
  );
}

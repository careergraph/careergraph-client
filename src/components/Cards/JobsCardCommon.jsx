import { DollarSign, MapPin, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import cardSectionCompanyAccessed from "../../assets/icons/company-accessed.svg";

function JobsCardCommon({ job }) {
  const navigate = useNavigate();
  if (!job) return null;

  const companyLabel = job.department || "Đang cập nhật";
  const expiryLabel = job.expiryDate
    ? new Date(job.expiryDate).toLocaleDateString("vi-VN")
    : "Không thời hạn";
  const summary =
    job.summary || job.description || "Mô tả công việc đang cập nhật.";
  const isNewJob = (() => {
    if (job?.isNew !== undefined) return Boolean(job.isNew);

    const createdAt = job?.createdAt || job?.publishedAt || job?.updatedAt;
    if (createdAt) {
      const date = new Date(createdAt);
      if (!Number.isNaN(date)) {
        const diffInDays =
          (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
        return diffInDays <= 14;
      }
    }

    return false;
  })();

  const isExpired = job.expiryDate
    ? new Date(job.expiryDate).getTime() < Date.now()
    : false;

  const handleViewJob = () => navigate(`/jobs/${job.id}`);

  return (
    <div className={`group relative w-full max-w-[300px] rounded-2xl border border-slate-100 bg-white/90 p-5 pt-6 text-gray-900 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-lg cursor-pointer ${isExpired ? 'opacity-60 grayscale' : ''}`}
    onClick={handleViewJob}>
      <div className="absolute right-5 top-4 flex gap-2 z-10">
        {(job.viewCount > 150 || job.views > 150) && (
          <span className="inline-flex items-center justify-center rounded-full bg-yellow-100 p-1.5 text-yellow-700 shadow-sm" title="Hot Job">
            <Zap className="size-4 fill-current" />
          </span>
        )}
        {isNewJob && !isExpired && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-blue-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
            <Sparkles className="size-3.5" />
            Mới
          </span>
        )}
      </div>

      <div className="flex items-start gap-3">
        <div className="flex size-14 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
          <img
            src={job.companyAvatar || cardSectionCompanyAccessed}
            alt={`Ảnh đại diện ${companyLabel}`}
            className="size-full object-cover cursor-pointer"
            
          />
        </div>

        <div className="flex-1 space-y-2">
          <h2 className="text-base font-semibold text-gray-900 line-clamp-1 cursor-pointer">
            {job.title}
          </h2>
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-500 line-clamp-1">
            {companyLabel}
          </p>
          <p className="text-xs text-slate-500 line-clamp-2">{summary}</p>
        </div>
      </div>

      <div className="mt-4 space-y-1 text-sm">
        {job.salaryRange ? (
          <div className="flex items-center gap-2 text-slate-700">
            <DollarSign className="size-4 text-indigo-500" />
            <span className="font-medium">{job.salaryRange}</span>
          </div>
        ) : null}

        {job.location ? (
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="size-4 text-indigo-500 shrink-0" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
        ) : null}

        <div className="flex items-center gap-2 text-orange-600 mt-1">
          <span className="size-4 flex items-center justify-center shrink-0">⏳</span>
          <span className="text-xs font-medium">{expiryLabel}</span>
        </div>
      </div>
    </div>
  );
}

export default JobsCardCommon;

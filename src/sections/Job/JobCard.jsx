import { Zap, MapPin, CircleDollarSign, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useJobEnums } from "~/hooks/useJobEnums";
import { translateJobTag } from "~/utils/jobEnums";

const limitTags = (input, max = 3) => {
  if (!Array.isArray(input) || !input.length) return [];
  return input.filter(Boolean).slice(0, max);
};

const TAG_COLORS = [
  "bg-blue-50 text-blue-700 border-blue-200",
  "bg-purple-50 text-purple-700 border-purple-200",
  "bg-pink-50 text-pink-700 border-pink-200",
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-cyan-50 text-cyan-700 border-cyan-200",
  "bg-rose-50 text-rose-700 border-rose-200",
  "bg-indigo-50 text-indigo-700 border-indigo-200",
];

export default function JobCard({ job, onDetail }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const { labelMaps } = useJobEnums();

  if (!job) {
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tags = useMemo(() => {
    const rawTags = job.skills?.length
      ? limitTags(job.skills)
      : limitTags(
          [job.experience?.level, job.employmentType, job.jobCategory].filter(Boolean)
        );

    return rawTags
      .map((tag) => translateJobTag(tag, labelMaps))
      .filter(Boolean)
      .filter((tag, index, items) => items.indexOf(tag) === index)
      .slice(0, 3);
  }, [job.employmentType, job.experience?.level, job.jobCategory, job.skills, labelMaps]);

  const handleNavigate = () => {
    if (onDetail) {
      onDetail(job);
      return;
    }

    if (job.detailUrl) {
      window.open(job.detailUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (job.id) {
      navigate(`/jobs/${job.id}`);
    }
  };

  const handleDetail = (event) => {
    event.stopPropagation();
    handleNavigate();
  };

  const handleImageError = (event) => {
    setImgError(true);
    event.currentTarget.src = `https://avatar.oxro.io/avatar.svg?name=${encodeURIComponent(
      job.companyName || job.title || "Company"
    )}`;
  };

  const avatarSrc = imgError
    ? `https://avatar.oxro.io/avatar.svg?name=${encodeURIComponent(
        job.companyName || job.title || "Company"
      )}`
    : job.companyAvatar || "/dist/assets/ai-feature-DH8aVC4K.svg";

  const locationLabel = job.location || "Đang cập nhật";

  const expiryLabel = job.expiryDate
    ? new Date(job.expiryDate).toLocaleDateString("vi-VN")
    : "Không thời hạn";

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-4 md:p-5"
      onClick={handleNavigate}
    >
      {(job.viewCount > 150 || job.views > 150) && (
        <span className="absolute right-4 top-4 inline-flex items-center justify-center rounded-full bg-yellow-100 p-1.5 text-yellow-700 shadow-sm z-10" title="Hot Job">
          <Zap className="size-4 fill-current" />
        </span>
      )}
      <div className="flex flex-col gap-4">
        {/* Top Section */}
        <div className="flex gap-3 sm:gap-4 md:gap-5">
          <div className="flex shrink-0 items-start">
            <img
              src={avatarSrc}
              alt={job.companyName || "Company Logo"}
              className="h-14 w-14 rounded-xl border border-slate-200 object-cover sm:h-16 sm:w-16 md:h-[72px] md:w-[72px]"
              onError={handleImageError}
            />
          </div>

          <div className="min-w-0 flex-1 space-y-2.5 sm:space-y-3">
            <div>
              <h3 className="line-clamp-2 text-[15px] font-semibold leading-6 text-slate-900 sm:text-base md:text-lg">
                {job.title}
              </h3>
              <p className="mt-1 truncate text-sm text-slate-600">
                {job.companyName || "Đang cập nhật"}
              </p>
            </div>

            {tags.length ? (
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide sm:px-3 sm:py-1.5 ${
                      index > 1 ? "hidden sm:inline-flex" : "inline-flex"
                    } ${TAG_COLORS[index % TAG_COLORS.length]}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {job.summary ? (
              <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                {job.summary}
              </p>
            ) : null}
          </div>
        </div>

        {/* Bottom Section (Horizontal) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-1.5 rounded-lg bg-indigo-50/70 px-2.5 py-1.5 text-sm font-semibold text-indigo-700">
              <CircleDollarSign className="h-4 w-4 shrink-0 text-indigo-500" />
              <span>{job.salaryRange || "Thoả thuận"}</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-sm font-medium text-slate-700">
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="truncate max-w-[200px] sm:max-w-[250px]">{locationLabel}</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1.5 text-sm font-medium text-orange-700">
              <Zap className="h-4 w-4 shrink-0 text-orange-500" />
              <span>Hạn nộp: {expiryLabel}</span>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex min-h-10 w-full shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-700 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-100 sm:w-auto"
            onClick={handleDetail}
          >
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}

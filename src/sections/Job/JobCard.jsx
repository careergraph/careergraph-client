import { Zap, MapPin, CircleDollarSign, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default function JobCard({ job, onSave, onDetail }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  if (!job) {
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tags = useMemo(() => {
    if (job.skills?.length) return limitTags(job.skills);
    const fallback = [
      job.experience?.level,
      job.employmentType,
      job.jobCategory,
    ].filter(Boolean);
    return limitTags(fallback);
  }, [job.employmentType, job.experience?.level, job.jobCategory, job.skills]);

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

  const handleSave = (event) => {
    event.stopPropagation();
    onSave?.(job);
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

  const locationLabel =
    typeof job.location === "string" && job.location.length > 0
      ? job.location.split(",").pop()?.trim() || job.location
      : "Đang cập nhật";

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-5"
      onClick={handleNavigate}
    >
      {job.isNew ? (
        <span className="absolute -left-2.5 -top-2.5 rounded-full bg-indigo-100 p-1.5 text-indigo-600 shadow-sm">
          <Sparkles className="h-4 w-4" />
        </span>
      ) : (
        <span className="absolute -left-2.5 -top-2.5 rounded-full bg-green-100 p-1.5 text-green-500 shadow-sm">
          <Zap className="h-4 w-4" />
        </span>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
        <div className="flex-shrink-0">
          <img
            src={avatarSrc}
            alt={job.companyName || "Company Logo"}
            className="h-16 w-16 rounded-xl border border-slate-200 object-cover sm:h-20 sm:w-20"
            onError={handleImageError}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex h-full flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1 space-y-2">
              <div>
                <h3 className="line-clamp-2 text-base font-semibold leading-6 text-slate-900 md:text-lg">
                  {job.title}
                </h3>
                <p className="mt-1 truncate text-sm text-slate-600">
                  {job.companyName || "Đang cập nhật"}
                </p>
              </div>

              {tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={`${tag}-${index}`}
                      className={`rounded-full border px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                        TAG_COLORS[index % TAG_COLORS.length]
                      }`}
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

            <div className="flex flex-col gap-2 text-sm sm:min-w-[220px] sm:items-end">
              <div className="flex items-center gap-2 font-medium text-indigo-600 sm:justify-end">
                <CircleDollarSign className="h-4 w-4 shrink-0" />
                <span className="max-w-full break-words sm:max-w-[220px] sm:text-right">
                  {job.salaryRange || "Thoả thuận"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 sm:justify-end">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="max-w-full truncate sm:max-w-[220px] sm:text-right">
                  {locationLabel}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 sm:justify-end">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-100"
                  onClick={handleSave}
                >
                  Lưu
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-100"
                  onClick={handleDetail}
                >
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    if (onSave) {
      onSave(job);
    }
  };

  const handleDetail = (event) => {
    event.stopPropagation();
    handleNavigate();
  };

  const handleImageError = (e) => {
    setImgError(true);
    // Fallback to generated avatar
    e.target.src = `https://avatar.oxro.io/avatar.svg?name=${encodeURIComponent(job.companyName || job.title || "Company")}`;
  };

  const avatarSrc = imgError
    ? `https://avatar.oxro.io/avatar.svg?name=${encodeURIComponent(job.companyName || job.title || "Company")}`
    : job.companyAvatar || "/dist/assets/ai-feature-DH8aVC4K.svg";

  return (
    <div
      className="relative flex gap-4 border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white cursor-pointer"
      onClick={handleNavigate}
    >
      {/* Icon nổi bật */}
      {job.isNew ? (
        <span className="absolute -top-3 -left-3 bg-indigo-100 text-indigo-600 p-1.5 rounded-full shadow">
          <Sparkles className="w-4 h-4" />
        </span>
      ) : (
        <span className="absolute -top-3 -left-3 bg-green-100 text-green-500 p-1.5 rounded-full shadow">
          <Zap className="w-4 h-4" />
        </span>
      )}

      {/* Logo công ty */}
      <div className="flex-shrink-0">
        <img
          src={avatarSrc}
          alt={job.companyName || "Company Logo"}
          className="w-16 h-16 rounded-lg border border-slate-200 object-cover"
          onError={handleImageError}
        />
      </div>

      {/* Nội dung + Right column */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-4">
          {/* Left text block */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base md:text-lg text-slate-900 leading-6 truncate">
              {job.title}
            </h3>
            <p className="text-sm text-slate-600 mb-2 truncate">
              {job.companyName || "Đang cập nhật"}
            </p>

            {/* Tags */}
            {tags.length ? (
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span
                    key={tag}
                    className={`px-2.5 py-1.5 text-xs font-medium border rounded-full line-clamp-1 ${
                      TAG_COLORS[index % TAG_COLORS.length]
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {job.summary ? (
              <p className="text-sm text-slate-500 line-clamp-2">
                {job.summary}
              </p>
            ) : null}
          </div>

          {/* Right info block */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
              <CircleDollarSign className="w-4 h-4" />
              <span className="max-w-[200px]">
                {job.salaryRange || "Thoả thuận"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1 max-w-[185px]">
                {job.location.split(",").pop()?.trim() || job.location}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                className="mt-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="mt-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-200"
                onClick={handleDetail}
              >
                Detail
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

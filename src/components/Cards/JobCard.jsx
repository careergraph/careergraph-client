import { Zap, MapPin, CircleDollarSign, Clock, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const limitTags = (input, max = 3) => {
  if (!Array.isArray(input) || !input.length) return [];
  return input.filter(Boolean).slice(0, max);
};

export default function JobCard({ job, onSave, onDetail }) {
  const navigate = useNavigate();

  if (!job) {
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tags = useMemo(() => {
    if (job.skills?.length) return limitTags(job.skills);
    const fallback = [job.experience?.level, job.employmentType, job.jobCategory].filter(Boolean);
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
      navigate(`/job/${job.id}`);
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
        <span className="absolute -top-3 -left-3 bg-slate-100 text-yellow-500 p-1.5 rounded-full shadow">
          <Zap className="w-4 h-4" />
        </span>
      )}

      {/* Logo công ty */}
      <div className="flex-shrink-0">
        <img
          src={job.photoUrl || "/logo-company.png"}
          alt={job.company || job.title}
          className="w-16 h-16 rounded-lg border border-slate-200 object-cover"
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
              {job.company || "Đang cập nhật"}
            </p>

            {/* Tags */}
            {tags.length || job.expiryDate ? (
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-full line-clamp-1"
                  >
                    {tag}
                  </span>
                ))}

                {job.expiryDate ? (
                  <span className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {job.expiryDate}
                  </span>
                ) : null}
              </div>
            ) : null}

            {job.summary ? (
              <p className="text-sm text-slate-500 line-clamp-2">{job.summary}</p>
            ) : null}
          </div>

          {/* Right info block */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
              <CircleDollarSign className="w-4 h-4" />
              <span className="max-w-[200px]">{job.salaryRange || "Thoả thuận"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1 max-w-[350px]">{job.location}</span>
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

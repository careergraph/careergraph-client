import React from "react";
import { DollarSign, MapPin, Sparkles } from "lucide-react";

import cardSectionCompanyAccessed from "../../assets/icons/company-accessed.svg";

function JobsCardCommon({ job }) {
  if (!job) return null;

  const extractDistrictProvince = (loc) => {
    if (!loc || typeof loc !== "string") return loc || "";
    const parts = loc
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length >= 2) {
      return parts.slice(-2).join(", ");
    }
    return loc;
  };

  const companyLabel = job.company || "Đang cập nhật";
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

  return (
    <div className="group relative w-full max-w-[300px] rounded-2xl border border-slate-100 bg-white/90 p-5 pt-6 text-gray-900 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:shadow-lg">
      {isNewJob ? (
        <span className="absolute right-5 top-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-blue-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
          <Sparkles className="size-3.5" />
          Mới
        </span>
      ) : (
        <span className="absolute left-5 top-21 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-blue-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm">
          <Sparkles className="size-3.5" />
          Mới
        </span>
      )}

      <div className="flex items-start gap-3">
        <div className="flex size-14 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
          <img
            src={job.photoUrl || cardSectionCompanyAccessed}
            alt={`Ảnh đại diện ${companyLabel}`}
            className="size-full object-cover cursor-pointer"
          />
        </div>

        <div className="flex-1 space-y-2">
          <h2 className="text-base font-semibold text-gray-900 line-clamp-1">
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
            <MapPin className="size-4 text-indigo-500" />
            <span className="line-clamp-1">
              {extractDistrictProvince(job.location)}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default JobsCardCommon;

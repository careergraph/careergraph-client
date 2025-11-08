import { Briefcase, MapPin, DollarSign, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RelatedJobs() {
  const navigate = useNavigate();

  const jobs = [
    {
      id: 1,
      title: "Senior Product Designer",
      company: "Tech Startup",
      location: "Hà Nội",
      salary: "20-30 triệu",
      isHot: true,
    },
    {
      id: 2,
      title: "Marketing Manager",
      company: "VNG Corporation",
      location: "TP.HCM",
      salary: "25-35 triệu",
      isHot: true,
    },
    {
      id: 3,
      title: "Full-stack Developer",
      company: "FPT Software",
      location: "Đà Nẵng",
      salary: "15-25 triệu",
      isHot: false,
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2">
          <Briefcase size={18} className="text-indigo-600" />
          <h3 className="font-semibold text-slate-900">Việc làm phù hợp</h3>
        </div>
        <p className="mt-1 text-xs text-slate-500">Dựa trên nội dung bài viết</p>
      </div>

      <div className="divide-y divide-slate-100 p-4">
        {jobs.map((job) => (
          <div key={job.id} className="group cursor-pointer py-4 first:pt-0 last:pb-0">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h4 className="line-clamp-2 text-sm font-semibold text-slate-900 transition group-hover:text-indigo-600">
                {job.title}
              </h4>
              {job.isHot && (
                <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                  <TrendingUp size={12} />
                  Hot
                </span>
              )}
            </div>

            <p className="mb-2 text-xs font-medium text-slate-600">{job.company}</p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <MapPin size={12} />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign size={12} />
                <span>{job.salary}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 p-4">
        <button
          onClick={() => navigate("/jobs")}
          className="w-full rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
        >
          Xem tất cả việc làm
        </button>
      </div>
    </div>
  );
}

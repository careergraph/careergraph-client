// SavedJobs.jsx
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Heart,
  MapPin,
  BadgeDollarSign,
} from "lucide-react";

/** --- Helpers --- */
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

/** --- Job Card --- */
function JobCard({ job, onToggleSave }) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:shadow-sm">
      {/* Logo */}
      <div className="size-[64px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white flex items-center justify-center">
        {job.logo ? (
          <img src={job.logo} alt={job.company} className="h-full w-full object-contain" />
        ) : (
          <span className="text-xs text-slate-400">No Logo</span>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 grow">
        <a href={job.href || "#"} className="block text-[17px] font-semibold text-slate-800 hover:text-indigo-700 line-clamp-1">
          {job.title}
        </a>
        <div className="mt-1 text-sm text-slate-500 line-clamp-1">{job.company}</div>

        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
          {/* Salary */}
          {job.salary && (
            <span className="inline-flex items-center gap-1 text-indigo-600">
              <BadgeDollarSign size={16} className="opacity-80" />
              <a href={job.salaryLink || "#"} className="hover:underline">{job.salary}</a>
            </span>
          )}

          {/* Locations */}
          {job.locations?.length > 0 && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <MapPin size={16} className="opacity-70" />
              <span className="line-clamp-1">
                {job.locations.join(", ")}
              </span>
            </span>
          )}

          {/* Deadline */}
          {job.deadline && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <CalendarDays size={16} className="opacity-70" />
              <span>{fmtDate(job.deadline)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={() => onToggleSave?.(job)}
        title={job.saved ? "Bỏ lưu" : "Lưu việc làm"}
        className={`ml-auto rounded-full p-2 transition ${
          job.saved ? "text-[#1877f2]" : "text-slate-400 hover:text-[#1877f2]"
        }`}
      >
        <Heart
          size={22}
          className={`${job.saved ? "fill-[#1877f2]" : "fill-transparent"}`}
        />
      </button>
    </div>
  );
}

/** --- Empty State --- */
function EmptySaved() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="mb-6 text-xl font-semibold text-slate-700">
        Bạn chưa có việc làm đã lưu
      </p>
      <img
        src="/images/empty-saved.svg" // đổi thành ảnh của bạn nếu cần
        alt="Empty saved jobs"
        className="w-[360px] max-w-full opacity-95"
      />
    </div>
  );
}

/** --- Main component --- */
export default function SavedJobs({
  userName = "Luong Quang Thinh",
  items: itemsProp,
  onToggleSave, // (job) => void
}) {
  // demo data – thay bằng dữ liệu thật (API)
  const demo = [
    {
      id: "1",
      title: "Chuyên Viên Phòng Chống Gian Lận Miền Bắc - Ise",
      company: "Công ty Tài Chính TNHH HD SAISON",
      logo: "/logos/hdsaison.png",
      salary: "10 - 15 triệu",
      salaryLink: "#",
      locations: ["Phú Thọ", "Quảng Ninh", "Tuyên Quang"],
      deadline: "2025-10-11",
      href: "#",
      saved: true,
    },
    {
      id: "2",
      title: "Kỹ Thuật Vận Hành Máy Ép Nhựa",
      company: "Công Ty TNHH Nhựa Tân Lập Thành",
      logo: "/logos/tanlapthanh.png",
      salary: "Thỏa thuận",
      locations: ["TP.HCM"],
      deadline: "2025-10-31",
      href: "#",
      saved: true,
    },
  ];

  const [items, setItems] = useState(itemsProp ?? demo);

  const handleToggleSave = (job) => {
    setItems((prev) =>
      prev.map((it) => (it.id === job.id ? { ...it, saved: !it.saved } : it))
    );
    onToggleSave?.(job);
  };

  const hasAny = useMemo(() => items?.some((i) => i.saved), [items]);

  return (
    <section className="w-full mx-6">
      {/* greeting */}
      <div className="mb-3 rounded-xl border border-slate-200 bg-white/60 px-5 py-3 ">
        <span className="text-slate-400 font-semibold">Xin Chào, </span>
        <span className="font-extrabold text-slate-800">{userName}</span>
      </div>

      {/* card container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-800">Việc làm đã lưu</h3>
        </div>

        <div className="px-5 py-4 space-y-3">
          {!hasAny ? (
            <EmptySaved />
          ) : (
            items
              .filter((j) => j.saved)
              .map((job) => (
                <JobCard key={job.id} job={job} onToggleSave={handleToggleSave} />
              ))
          )}
        </div>
      </div>
    </section>
  );
}

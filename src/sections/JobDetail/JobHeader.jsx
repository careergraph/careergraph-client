import ApplyBar from "./ApplyBar";
import { Clock, Eye, Users, Calendar, Tag } from "lucide-react";

export default function JobHeader({ title, highlights = [], extra, stats = {}, tags = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header chính */}
      <div className="p-5 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h1>

        {/* Tags nếu có */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100"
              >
                <Tag size={12} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Highlights grid */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 hover:border-indigo-200 hover:bg-indigo-50/30 transition"
            >
              <span className="text-indigo-600 shrink-0">{h.icon}</span>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs text-slate-500">{h.label}</span>
                <span className="font-semibold text-sm truncate">{h.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Extra info */}
        {extra && <div className="mt-4">{extra}</div>}
      </div>

      {/* Stats bar nếu có */}
      {(stats.views > 0 || stats.applicants >= 0 || stats.postedDate) && (
        <div className="px-5 md:px-6 py-3 bg-slate-50 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            {stats.postedDate && (
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" />
                <span>Đăng {stats.postedDate}</span>
              </div>
            )}
            {stats.views >= 0 && (
              <div className="flex items-center gap-1.5">
                <Eye size={14} className="text-slate-400" />
                <span>{stats.views} lượt xem</span>
              </div>
            )}
            {stats.applicants >= 0 && (
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-slate-400" />
                <span>{stats.applicants} ứng viên</span>
              </div>
            )}
            {stats.deadline && (
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-rose-500" />
                <span className="text-rose-600 font-medium">Hết hạn: {stats.deadline}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Apply bar */}
      <ApplyBar />
    </div>
  );
}

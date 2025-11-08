import { Clock, DollarSign, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SimilarJobCard({ item }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (item.id) {
      navigate(`/jobs/${item.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="relative group cursor-pointer rounded-lg border border-slate-200 bg-white p-3 transition hover:border-indigo-300 hover:shadow-sm"
    >
      {/* Icon nổi bật */}
      {item.isNew ? (
        <span className="absolute -top-3 -right-3 bg-indigo-100 text-indigo-600 p-1.5 rounded-full shadow">
          <Sparkles className="w-4 h-4" />
        </span>
      ) : (
        <span className="absolute -top-3 -right-3 bg-green-100 text-green-500 p-1.5 rounded-full shadow">
          <Zap className="w-4 h-4" />
        </span>
      )}
      <div className="flex gap-3">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src={item.companyAvatar}
            alt={item.company}
            className="size-11 rounded-md object-cover border border-slate-200"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="font-medium text-slate-900 line-clamp-2 text-sm group-hover:text-indigo-600 transition-colors">
            {item.title}
          </h4>

          {/* Company */}
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
            {item.companyName}
          </p>

          {/* Meta info */}
          <div className="mt-2 flex flex-col gap-1 text-xs text-slate-600">
            {/* Salary */}
            <span className="flex items-center gap-1 font-medium text-indigo-600 truncate">
              <DollarSign size={12} className="flex-shrink-0" />
              <span className="truncate">{item.salaryRange}</span>
            </span>

            {/* Days */}
            {(item.expiryDate && (
              <span className="flex items-center gap-1 text-slate-500 truncate">
                <Clock size={12} className="flex-shrink-0" />
                <span className="truncate">{item.expiryDate}</span>
              </span>
            )) ||
              "Đang cập nhật"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SimilarJobsList({
  title,
  items = [],
  icon,
  emptyMessage,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header đơn giản */}
      <div className="border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          {icon && <div className="text-slate-600">{icon}</div>}
          <h3 className="font-semibold text-slate-900">{title}</h3>
          {items.length > 0 && (
            <span className="ml-auto text-xs text-slate-500">
              {items.length} việc làm
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <SimilarJobCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400">
            <p className="text-sm">{emptyMessage || "Chưa có việc làm nào"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

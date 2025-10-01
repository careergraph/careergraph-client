import { Clock, MapPin } from "lucide-react";

function SimilarJobCard({ item }) {
  return (
    <a
      href={"#job-" + item.id}
      className="block rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition"
    >
      <div className="flex gap-3">
        <img src={item.logo} alt={item.company} className="size-10 rounded-md object-cover" />
        <div className="min-w-0">
          <div className="font-semibold text-slate-900 line-clamp-1">{item.title}</div>
          <div className="text-sm text-slate-600 line-clamp-1">{item.company}</div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="font-medium text-indigo-600">{item.salary}</span>
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {item.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {item.days}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function SimilarJobsList({ title, items = [] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-3">{title}</h3>
      <div className="space-y-3">
        {items.map((it) => (
          <SimilarJobCard key={it.id} item={it} />
        ))}
      </div>
    </div>
  );
}

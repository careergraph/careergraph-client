import { ExternalLink, MapPin } from "lucide-react";

export default function CompanyCard({ logo, name, address, size, link, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <img src={logo} alt={name} className="size-12 rounded-md object-cover" />
        <div>
          <div className="font-semibold text-slate-900">{name}</div>
          <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            {icon}
            <span>Quy mô: {size}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-700 flex items-start gap-2">
        <MapPin size={16} className="mt-0.5 text-slate-500" />
        <span>{address}</span>
      </div>

      {link && (
        <a
          href={link}
          className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Xem trang công ty <ExternalLink size={16} />
        </a>
      )}
    </div>
  );
}

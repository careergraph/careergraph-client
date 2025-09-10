import ApplyBar from "./ApplyBar";
import { MapPin, Briefcase, GraduationCap, Calendar, Heart, Building2 } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "./Button";

export default function JobHeader({ title, highlights = [], extra }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{title}</h1>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {highlights.map((h, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
          >
            <span className="text-slate-600">{h.icon}</span>
            <div className="flex flex-col gap-1.5 pl-1">
                <span className="text-sm">{h.label}</span>
                <span className="font-medium">{h.value}</span>
            </div>
          </div>
        ))}
      </div>

      {extra && <div className="mt-3">{extra}</div>}
      <ApplyBar/>
    </div>
  );
}

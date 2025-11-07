import { CheckCircle2, Star, Gift, Briefcase } from "lucide-react";

const SECTION_LABELS = {
  desc: "Mô tả công việc",
  responsibilities: "Trách nhiệm công việc",
  requirements: "Yêu cầu công việc",
  qualifications: "Bằng cấp & Kỹ năng",
  benefits: "Quyền lợi"
};

function BulletList({ items = [], sectionKey }) {
  const getBulletColor = (key) => {
    const colors = {
      desc: "text-slate-600",
      responsibilities: "text-indigo-600",
      requirements: "text-purple-600",
      qualifications: "text-purple-600",
      benefits: "text-emerald-600",
    };
    return colors[key] || "text-slate-600";
  };

  return (
    <ul className="space-y-3">
      {items.map((it, i) => {
        if (typeof it === "string") {
          return (
            <li key={i} className="flex items-start gap-3 text-slate-700">
              <span className={`mt-1 ${getBulletColor(sectionKey)}`}>
                <CheckCircle2 size={16} />
              </span>
              <span className="flex-1">{it}</span>
            </li>
          );
        }
        return (
          <li key={i} className="flex items-start gap-3 text-slate-700">
            <span className={`mt-1 ${getBulletColor(sectionKey)}`}>
              <CheckCircle2 size={16} />
            </span>
            <div className="flex-1">
              {it.text}
              {Array.isArray(it.items) && it.items.length > 0 ? (
                <div className="mt-2 ml-5">
                  <BulletList items={it.items} sectionKey={sectionKey} />
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function JobSections({ sections = [] }) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {sections.map((sec, idx) => {
        const title = SECTION_LABELS[sec.key] ?? sec.key;
        
        return (
          <div
            key={sec.key || idx}
            className={idx > 0 ? "border-t border-slate-200" : ""}
          >
            <div className="p-5 md:p-6">
              {/* Section header */}
              <div className="flex items-center gap-2.5 mb-4">
                <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              </div>
              
              {/* Section content */}
              <BulletList items={sec.items} sectionKey={sec.key} />
            </div>
          </div>
        );
      })}
    </section>
  );
}

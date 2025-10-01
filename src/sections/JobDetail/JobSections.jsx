
const SECTION_LABELS = {
  desc: "Mô tả công việc",
  requirements: "Yêu cầu công việc",
  benefits: "Quyền lợi"
};

function BulletList({ items = [] }) {
  return (
    <ul className="list-disc pl-5 space-y-2">
      {items.map((it, i) => {
        if (typeof it === "string") {
          return <li key={i}>{it}</li>;
        }
        return (
          <li key={i}>
            {it.text}
            {Array.isArray(it.items) && it.items.length > 0 ? (
              <div className="mt-2">
                <BulletList items={it.items} />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export default function JobSections({ sections = [] }) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
      {sections.map((sec, idx) => {
        const title = SECTION_LABELS[sec.key] ?? sec.key; // nếu chưa map, fallback = key
        return (
          <div
            key={sec.key || idx}
            className={idx > 0 ? "mt-6 pt-6 border-t border-slate-200" : ""}
          >
            <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
            <BulletList items={sec.items} />
          </div>
        );
      })}
    </section>
  );
}

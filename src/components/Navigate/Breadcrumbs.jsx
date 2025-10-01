import { Link } from "react-router-dom";

export default function Breadcrumbs({ items = [], separator = ">" }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500 mb-4">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-2">
              {it.href && !isLast ? (
                <Link to={it.href} className="hover:text-slate-900">
                  {it.label}
                </Link>
              ) : (
                <span className="text-slate-900 font-medium">{it.label}</span>
              )}
              {!isLast && <span className="opacity-60">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

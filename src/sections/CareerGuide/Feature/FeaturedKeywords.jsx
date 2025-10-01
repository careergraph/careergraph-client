import React from "react";
import Container from "~/components/Containers/Container";


export default function FeaturedKeywords({ title = "Từ khoá nổi bật", keywords = [] }) {

  return (
    <Container>
      <section className="py-6">
      <h2 className="mb-4 text-2xl font-bold text-slate-900">{title}</h2>

      <nav aria-label={title}>
        <ul className="flex flex-wrap gap-x-4 gap-y-3">
          {keywords.map((k, i) => (
            <li key={i}>
              <a
                href={k.href}
                className="text-slate-700 hover:text-indigo-600 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
              >
                {k.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
    </Container>
  );
}

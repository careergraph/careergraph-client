export default function Section({ title, children }) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
      <div className="prose prose-slate max-w-none">{children}</div>
    </section>
  );
}

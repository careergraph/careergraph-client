export default function JobSuggestions({ jobs = [], columns = 1 }) {
  return (
    <aside className="bg-white shadow p-4 rounded-2xl">
      <h3 className="font-semibold text-lg mb-4">Việc làm gợi ý cho bạn</h3>

      <div className={`grid gap-4 ${columns === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
        {jobs.map((job) => (
          <div key={job.id} className="p-3 border rounded-lg hover:shadow-md transition">
            <h4 className="font-medium text-slate-800">{job.title}</h4>
            <p className="text-sm text-slate-600">{job.company}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

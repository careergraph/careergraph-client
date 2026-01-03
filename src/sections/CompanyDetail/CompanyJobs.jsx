import JobsCardCommon from "~/components/Cards/JobsCardCommon";
import { Briefcase } from "lucide-react";

export default function CompanyJobs({ jobs }) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8 text-center">
        <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
          <Briefcase className="text-slate-400" size={24} />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Chưa có tin tuyển dụng</h3>
        <p className="text-slate-500 mt-1">Công ty hiện chưa đăng tin tuyển dụng nào.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="text-indigo-600" size={24} />
          Tuyển dụng ({jobs.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="flex justify-center">
             <JobsCardCommon job={job} />
          </div>
        ))}
      </div>
    </div>
  );
}

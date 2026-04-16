import { cn } from "~/lib/utils";
import { getJobColor } from "~/features/messaging/utils/jobColor";

export function JobFilterBar({ jobs = [], activeFilter = null, onFilter }) {
  if (jobs.length < 2) {
    return null;
  }

  return (
    <div className="job-filter-bar border-b border-slate-200 px-3 py-2 sm:px-4">
      <button
        type="button"
        className={cn("filter-tab", activeFilter === null && "active")}
        onClick={() => onFilter?.(null)}
      >
        Tất cả
      </button>

      {jobs.map((job) => {
        const active = activeFilter === job.jobId;
        const color = getJobColor(job.jobId);

        return (
          <button
            key={job.jobId}
            type="button"
            className={cn("filter-tab", active && "active")}
            style={active ? { borderColor: color } : undefined}
            onClick={() => onFilter?.(job.jobId)}
          >
            <span className="job-tag-dot" style={{ background: color }} />
            <span className="truncate">{job.jobTitle}</span>
            {job.unreadCount > 0 ? (
              <span className="filter-badge">{job.unreadCount > 99 ? "99+" : job.unreadCount}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export default JobFilterBar;

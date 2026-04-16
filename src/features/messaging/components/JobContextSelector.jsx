import { cn } from "~/lib/utils";
import { getJobColor } from "~/features/messaging/utils/jobColor";

export function JobContextSelector({ jobs = [], selectedJobId = null, onSelect }) {
  return (
    <div className="job-ctx-selector border-t border-slate-200 bg-white/95 px-3 py-2 sm:px-4">
      <button
        type="button"
        className={cn("ctx-chip", selectedJobId === null && "active active-general")}
        onClick={() => onSelect?.(null)}
      >
        Chung
      </button>

      {jobs.map((job) => {
        const active = selectedJobId === job.jobId;
        const color = getJobColor(job.jobId);

        return (
          <button
            key={job.jobId}
            type="button"
            className={cn("ctx-chip", active && "active")}
            style={active ? { background: color } : undefined}
            onClick={() => onSelect?.(job.jobId)}
            title={job.jobTitle}
          >
            <span className="job-tag-dot" style={{ background: color }} />
            <span className="truncate">{job.jobTitle}</span>
            {job.unreadCount > 0 ? (
              <span className="ctx-unread">{job.unreadCount > 99 ? "99+" : job.unreadCount}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export default JobContextSelector;

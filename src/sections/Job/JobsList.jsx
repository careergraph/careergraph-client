import React from "react";
import JobCard from "../../components/Cards/JobCard";
import { JobService } from "../../services/jobService";

const JobsList = () => {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadJobs = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await JobService.fetchAllJobs({ signal: controller.signal });
        if (isMounted) {
          setJobs(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!controller.signal.aborted && isMounted) {
          console.error("Không thể tải danh sách việc làm:", err);
          setError("Không thể tải danh sách việc làm. Vui lòng thử lại sau.");
          setJobs([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadJobs();

    return () => {
      isMounted = false;
      controller.abort(); // Ngăn setState sau khi component unmount.
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {loading && !jobs.length ? (
        <p className="text-sm text-slate-500">Đang tải danh sách việc làm...</p>
      ) : null}

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {!loading && !error && !jobs.length ? (
        <p className="text-sm text-slate-500">Hiện chưa có việc làm nào.</p>
      ) : null}

      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobsList;

import React from "react";
import JobCard from "../../components/Cards/JobCard";
import { JobService } from "../../services/jobService";

const DEFAULT_PAGE_SIZE = 10;

const JobsList = () => {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [meta, setMeta] = React.useState({ totalItems: 0, totalPages: 1 });
  const [isPageTransitioning, setIsPageTransitioning] = React.useState(false);
  const [transitionTarget, setTransitionTarget] = React.useState(null);

  const totalPages = meta.totalPages ?? 1;
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  // Trigger a page change while recording the transition target for UI feedback.
  const handlePageChange = (nextPage) => {
    if (nextPage === page) return;
    if (nextPage < 1) return;
    if (totalPages && nextPage > totalPages) return;
    setTransitionTarget({ from: page, to: nextPage });
    setIsPageTransitioning(true);
    setPage(nextPage);
  };

  // Fetch jobs whenever the requested page or page size changes.
  React.useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const { jobs: data, pagination } = await JobService.fetchAllJobs({
          signal: controller.signal,
          page,
          size: pageSize,
        });

        if (!isMounted) return;

        setJobs(Array.isArray(data) ? data : []);

        setMeta({
          totalItems: pagination?.totalItems ?? data.length,
          totalPages: pagination?.totalPages ?? 1,
        });

        if (pagination?.size && pagination.size !== pageSize) {
          setPageSize(pagination.size);
        }

        if (pagination?.page && pagination.page !== page) {
          setPage(pagination.page);
        }

        if (pagination?.page) {
          setTransitionTarget((prev) => {
            if (!prev) return prev;
            return prev.to === pagination.page
              ? prev
              : { ...prev, to: pagination.page };
          });
        }
      } catch (err) {
        if (!controller.signal.aborted && isMounted) {
          console.error("Không thể tải danh sách việc làm:", err);
          setError("Không thể tải danh sách việc làm. Vui lòng thử lại sau.");
          setJobs([]);
          setMeta({ totalItems: 0, totalPages: 1 });
          setIsPageTransitioning(false);
          setTransitionTarget(null);
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
      controller.abort();
    };
  }, [page, pageSize]);

  // Hide the overlay once the new page has finished loading.
  React.useEffect(() => {
    if (!isPageTransitioning) return undefined;
    if (loading) return undefined;

    const timeout = window.setTimeout(() => {
      setIsPageTransitioning(false);
      setTransitionTarget(null);
    }, 240);

    return () => window.clearTimeout(timeout);
  }, [isPageTransitioning, loading]);

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {loading && !jobs.length ? (
        <p className="text-sm text-slate-500">Đang tải danh sách việc làm...</p>
      ) : null}

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {!loading && !error && !jobs.length ? (
        <p className="text-sm text-slate-500">Hiện chưa có việc làm nào.</p>
      ) : null}

      <div className="relative">
        <div
          className={`flex flex-col gap-3 md:gap-4 transition-opacity duration-200 ${
            isPageTransitioning ? "opacity-60" : "opacity-100"
          }`}
        >
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {transitionTarget ? (
          <div
            className={`pointer-events-none absolute left-1/2 top-3 z-10 w-[min(260px,100%)] -translate-x-1/2 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur transition-opacity duration-200 ${
              isPageTransitioning ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Đang chuyển trang
            </p>
            <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-indigo-600">
              <span>{transitionTarget.from}</span>
              <span className="text-slate-300">→</span>
              <span>{transitionTarget.to}</span>
            </div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-indigo-100">
              <div
                className="h-full w-full origin-left bg-indigo-500 transition-transform duration-200 ease-out"
                style={{ transform: `scaleX(${isPageTransitioning ? 1 : 0})` }}
              />
            </div>
          </div>
        ) : null}
      </div>

      {/* Always show pagination when we have jobs, unless it's the initial loading */}
      {jobs.length > 0 && !error ? (
        <div className="mt-4 pt-4 border-t-2 border-slate-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-slate-500">Tổng</span>
              <span className="text-md font-semibold text-indigo-600">
                {meta.totalItems}
              </span>
              <span className="text-sm font-medium text-slate-500">việc làm</span>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-white border-2 border-slate-200 rounded-lg p-1">
              <button
                type="button"
                className="px-3.5 py-1.5 text-sm font-medium rounded-md transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:text-slate-400
                  enabled:text-slate-700 enabled:hover:bg-slate-100 enabled:hover:text-slate-900"
                onClick={() => handlePageChange(page - 1)}
                disabled={!canGoPrev || loading}
              >
                ← Trước
              </button>

              <div className="px-3 py-1.5 mx-1">
                <span className="text-sm font-semibold text-indigo-600">
                  {page}
                </span>
                <span className="text-sm text-slate-400 mx-1">/</span>
                <span className="text-sm font-medium text-slate-600">
                  {totalPages}
                </span>
              </div>

              <button
                type="button"
                className="px-3.5 py-1.5 text-sm font-medium rounded-md transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:text-slate-400
                  enabled:text-slate-700 enabled:hover:bg-slate-100 enabled:hover:text-slate-900"
                onClick={() => handlePageChange(page + 1)}
                disabled={!canGoNext || loading}
              >
                Sau →
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default JobsList;

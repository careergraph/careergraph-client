import { useEffect, useRef, useState } from "react";
import JobCard from "./JobCard";
import { JobService } from "../../services/jobService";

const DEFAULT_PAGE_SIZE = 10;
const JOBS_PAGE_KEY = "jobs_current_page"; // Key để lưu page hiện tại

const JobsList = ({ filters = {}, searchQuery = "", city = "", locationCode = "" }) => {
  // Khởi tạo page từ sessionStorage (nếu có) hoặc mặc định là 1
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(() => {
    // Restore page từ sessionStorage khi quay lại trang
    const savedPage = sessionStorage.getItem(JOBS_PAGE_KEY);
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [meta, setMeta] = useState({ totalItems: 0, totalPages: 1 });
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState(null);

  const totalPages = meta.totalPages ?? 1;
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const initialFiltersSyncRef = useRef(true);

  useEffect(() => {
    if (initialFiltersSyncRef.current) {
      initialFiltersSyncRef.current = false;
      return;
    }

    setPage(1);
    sessionStorage.setItem(JOBS_PAGE_KEY, "1");
  }, [filters, searchQuery, city, locationCode]);

  // Trigger a page change while recording the transition target for UI feedback.
  const handlePageChange = (nextPage) => {
    if (nextPage === page) return;
    if (nextPage < 1) return;
    if (totalPages && nextPage > totalPages) return;
    setTransitionTarget({ from: page, to: nextPage });
    setIsPageTransitioning(true);
    setPage(nextPage);
    // Lưu page mới vào sessionStorage
    sessionStorage.setItem(JOBS_PAGE_KEY, nextPage.toString());
  };

  // Fetch jobs whenever the requested page or page size changes.
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const loadJobs = async () => {
      try {
        setLoading(true);
        setError("");

        // Scroll về đầu danh sách khi chuyển trang (nhưng không scroll khi lần đầu load)
        const savedPage = sessionStorage.getItem(JOBS_PAGE_KEY);
        const isFirstLoad = savedPage && parseInt(savedPage, 10) === page;
        if (!isFirstLoad && page > 1) {
          // Scroll smooth về vị trí danh sách job
          window.scrollTo({ top: 300, behavior: "smooth" });
        }

        const { jobs: data, pagination } = await JobService.searchJobs({
          signal: controller.signal,
          filters,
          keyword: searchQuery,
          city,
          location: locationCode,
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
  }, [page, pageSize, filters, searchQuery, city, locationCode]);

  // Hide the overlay once the new page has finished loading.
  useEffect(() => {
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

import { useEffect, useState } from "react";
import JobCard from "./JobCard";
import { JobService } from "../../services/jobService";
import LoadingSpinner from "../../components/Feedback/LoadingSpinner";

const DEFAULT_PAGE_SIZE = 10;

const JobsList = ({
  filters = {},
  searchQuery = "",
  location = "",
  locationSlug = "",
  provinceCode = "",
  page = 1,
  onPageChange,
}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [meta, setMeta] = useState({ totalItems: 0, totalPages: 1 });
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState(null);

  const totalPages = meta.totalPages ?? 1;
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;
  const canSearch = !locationSlug || Boolean(location);
  const isWaitingForLocation = Boolean(locationSlug && !location);
  const hasJobs = jobs.length > 0;
  const isListBusy = loading || isWaitingForLocation;
  const showInitialLoading = loading && !hasJobs && !isWaitingForLocation;
  const showListOverlay = isListBusy && hasJobs;
  const loadingMessage = isPageTransitioning
    ? "Đang tải trang mới..."
    : isWaitingForLocation
      ? "Đang tải địa điểm..."
      : "Đang tìm việc làm...";

  const handlePageChange = (nextPage) => {
    if (nextPage === page) return;
    if (nextPage < 1) return;
    if (totalPages && nextPage > totalPages) return;
    setTransitionTarget({ from: page, to: nextPage });
    setIsPageTransitioning(true);
    onPageChange?.(nextPage);
  };

  useEffect(() => {
    if (!canSearch) {
      return undefined;
    }

    setLoading(true);
    setError("");

    const controller = new AbortController();
    let isMounted = true;

    const loadJobs = async () => {
      try {
        if (page > 1) {
          window.scrollTo({ top: 280, behavior: "smooth" });
        }

        const { jobs: data, pagination } = await JobService.searchJobs({
          signal: controller.signal,
          filters,
          keyword: searchQuery,
          location,
          locationSlug,
          provinceCode,
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
          onPageChange?.(pagination.page);
        }

        if (pagination?.page) {
          setTransitionTarget((prev) => {
            if (!prev) return prev;
            return prev.to === pagination.page ? prev : { ...prev, to: pagination.page };
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
  }, [
    page,
    pageSize,
    filters,
    searchQuery,
    location,
    locationSlug,
    provinceCode,
    canSearch,
    onPageChange,
  ]);

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
    <div className="flex flex-col gap-4 md:gap-5">
      {showInitialLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-12 shadow-sm">
          <LoadingSpinner
            variant="inline"
            size="md"
            message="Đang tải danh sách việc làm..."
          />
        </div>
      ) : null}

      {isWaitingForLocation && !hasJobs ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-12 shadow-sm">
          <LoadingSpinner
            variant="inline"
            size="md"
            message="Đang tải địa điểm..."
          />
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      {!isListBusy && !error && !jobs.length ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500 shadow-sm">
          Hiện chưa có việc làm nào.
        </div>
      ) : null}

      {hasJobs ? (
        <div
          className={`relative ${showListOverlay ? "min-h-[240px]" : ""}`}
        >
          <div
            className={`flex flex-col gap-4 md:gap-5 transition-opacity duration-200 ${
              showListOverlay ? "pointer-events-none opacity-60" : "opacity-100"
            }`}
          >
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {showListOverlay ? (
            <LoadingSpinner
              variant="overlay"
              size="md"
              message={loadingMessage}
            />
          ) : null}
        </div>
      ) : null}

      {hasJobs && !error ? (
        <div className="mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="font-medium text-slate-500">Tổng</span>
              <span className="font-semibold text-indigo-600">
                {meta.totalItems}
              </span>
              <span className="font-medium text-slate-500">việc làm</span>
            </div>

            <div className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1 sm:w-auto sm:justify-start">
              <button
                type="button"
                className="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:text-slate-400 enabled:text-slate-700 enabled:hover:bg-white enabled:hover:text-slate-900 sm:flex-none"
                onClick={() => handlePageChange(page - 1)}
                disabled={!canGoPrev || isListBusy}
              >
                ← Trước
              </button>

              <div className="flex min-w-[88px] items-center justify-center px-3 py-2">
                <span className="text-sm font-semibold text-indigo-600">
                  {page}
                </span>
                <span className="mx-1 text-sm text-slate-400">/</span>
                <span className="text-sm font-medium text-slate-600">
                  {totalPages}
                </span>
              </div>

              <button
                type="button"
                className="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:text-slate-400 enabled:text-slate-700 enabled:hover:bg-white enabled:hover:text-slate-900 sm:flex-none"
                onClick={() => handlePageChange(page + 1)}
                disabled={!canGoNext || isListBusy}
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

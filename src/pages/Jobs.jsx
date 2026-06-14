import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import JobsSidebar from "~/sections/Job/JobsSidebar";
import dotBanner from "../assets/images/hero-section-dot-image.png";
import SearchBar from "~/components/Search/SearchBar";
import BannerSlider from "~/sections/Job/BannerSlider";
import JobsList from "~/sections/Job/JobsList";
import {
  buildJobSearchParams,
  parseJobSearchParams,
} from "~/utils/jobSearchParams";

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { keyword, locationSlug, page, filters } = useMemo(
    () => parseJobSearchParams(searchParams),
    [searchParams]
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [provinceCode, setProvinceCode] = useState("");

  const updateJobSearchParams = useCallback(
    (updates) => {
      setSearchParams((prev) => buildJobSearchParams(prev, updates), {
        replace: true,
      });
    },
    [setSearchParams]
  );

  const handleFilterChange = useCallback(
    (next) => {
      updateJobSearchParams({ filters: next, page: 1 });
    },
    [updateJobSearchParams]
  );

  const handleSearch = useCallback(
    ({
      keyword: nextKeyword = "",
      location = "",
      locationSlug: nextLocationSlug = "",
      provinceCode: nextProvinceCode = "",
    }) => {
      setLocationName(location);
      setProvinceCode(nextProvinceCode);

      const trimmedKeyword = (nextKeyword || "").trim();
      const hasSearchChange =
        trimmedKeyword !== (keyword || "").trim() ||
        (nextLocationSlug || "") !== (locationSlug || "");

      updateJobSearchParams({
        keyword: nextKeyword,
        locationSlug: nextLocationSlug,
        ...(hasSearchChange ? { page: 1 } : {}),
      });
    },
    [updateJobSearchParams, keyword, locationSlug]
  );

  const handlePageChange = useCallback(
    (nextPage) => {
      updateJobSearchParams({ page: nextPage });
    },
    [updateJobSearchParams]
  );

  useEffect(() => {
    if (!searchParams.has("page")) {
      setSearchParams((prev) => buildJobSearchParams(prev, { page: 1 }), {
        replace: true,
      });
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section
        className="relative -mt-24 overflow-hidden bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${dotBanner})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-10 sm:pb-12">
          <div className="max-w-3xl">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #4f46e5, #6366f1, #8b5cf6)",
              }}
            >
              Tìm việc làm tốt nhất, nhanh nhất
            </h1>
            <p className="mt-3 text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl">
              Hơn 1,000+ tin tuyển dụng được cập nhật hàng ngày
            </p>
          </div>
        </div>
      </section>

      <BannerSlider />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="flex justify-end lg:hidden mb-4">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            Bộ lọc
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:gap-8">
          <aside className="lg:sticky lg:top-24 self-start">
            <JobsSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </aside>

          <section className="space-y-4 sm:space-y-5 lg:space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <SearchBar
                keyword={keyword}
                locationSlug={locationSlug}
                onSearch={handleSearch}
              />
            </div>

            <JobsList
              filters={filters}
              searchQuery={keyword}
              location={locationName}
              locationSlug={locationSlug}
              provinceCode={provinceCode}
              page={page}
              onPageChange={handlePageChange}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

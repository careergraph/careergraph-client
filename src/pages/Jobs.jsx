import JobsSidebar from "~/sections/Job/JobsSidebar";
import dotBanner from "../assets/images/hero-section-dot-image.png";
import JobCard from "~/components/Cards/JobCard";
import SearchBar from "~/components/Search/SearchBar";
import BannerSlider from "~/sections/Job/BannerSlider";

export default function Jobs() {
  return (
    <div className="min-h-screen">
      {/* Hero background with title and search */}
      <div
        className="relative -mt-24 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${dotBanner})` }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-30 pb-10">
          <h1
            className="text-4xl md:text-5xl font-semibold drop-shadow bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to right, #6a5af9, #7b6cf9, #a78bfa)",
            }}
          >
            Tìm việc làm tốt nhất, nhanh nhất
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            Hơn 1,000+ tin tuyển dụng được cập nhật hàng ngày
          </p>

          {/* Search area */}
          <div className="mt-6 flex justify-end">
            <SearchBar
              onSearch={({ keyword }) => {
                // Xử lý tìm kiếm ở đây
                alert(keyword);
              }}
            />
          </div>
        </div>
      </div>

      {/* Row: sidebar (4) + content (8) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 mb-16">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-4">
            <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-auto pr-1 mt-[-100px]">
              <JobsSidebar
                isOpen={true}
                onClose={() => {}}
                onFilterChange={() => {}}
              />
            </div>
          </aside>

          {/* Banner + Job List */}
          <section className="col-span-12 md:col-span-8 space-y-6">
            {/* Banner */}
            <BannerSlider />

            {/* Job List */}
            <div className="space-y-4">
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
              <JobCard />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

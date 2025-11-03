import { useState } from "react";
import JobsSidebar from "~/sections/Job/JobsSidebar";
import dotBanner from "../assets/images/hero-section-dot-image.png";
import SearchBar from "~/components/Search/SearchBar";
import BannerSlider from "~/sections/Job/BannerSlider";
import JobsList from "~/sections/Job/JobsList";

export default function Jobs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen">
      {/* Hero background with title and search */}
      <div
        className="relative -mt-24 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${dotBanner})` }}
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8 pt-28 pb-8">
          <h1
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-semibold drop-shadow bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to right, #6a5af9, #7b6cf9, #a78bfa)",
            }}
          >
            Tìm việc làm tốt nhất, nhanh nhất
          </h1>
          <p className="mt-2 sm:mt-3 text-base sm:text-lg text-slate-400">
            Hơn 1,000+ tin tuyển dụng được cập nhật hàng ngày
          </p>

          {/* Search area */}
          <div className="mt-4 sm:mt-6 flex justify-center sm:justify-end w-full">
            <div className="w-full sm:w-2/3">
              <SearchBar
                onSearch={({ keyword }) => {
                  // Xử lý tìm kiếm ở đây
                  alert(keyword);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row: sidebar (4) + content (8) */}
      <div className="mx-auto max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8 mt-4 mb-10">
        {/* Nút mở sidebar trên mobile */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            Bộ lọc
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Sidebar */}
          <aside className="order-2 md:order-1 col-span-12 md:col-span-4 mb-6 md:mb-0">
            <div className="md:sticky md:top-24 md:max-h-[calc(100vh-120px)] overflow-auto md:pr-1 md:mt-[-100px]">
              <JobsSidebar
                isOpen={sidebarOpen || window.innerWidth >= 768}
                onClose={() => setSidebarOpen(false)}
                onFilterChange={() => {}}
              />
            </div>
          </aside>

          {/* Banner + Job List */}
          <section className="order-1 md:order-2 col-span-12 md:col-span-8 space-y-4 md:space-y-6">
            {/* Banner */}
            <BannerSlider />

            {/* Job List */}
            <JobsList />
          </section>
        </div>
      </div>
    </div>
  );
}

import JobsSidebar from "~/sections/JobsSidebar";
import dotBanner from "../assets/images/hero-section-dot-image.png";
import mainBanner from "../assets/images/main-banner.png";
import JobCard from "~/components/Cards/JobCard";

export default function Jobs() {
  return (
    <div className="min-h-screen">
      {/* Hero background with title and search */}
      <div
        className="relative -mt-24 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${dotBanner})` }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-40 pb-10">
          <h1
            className="text-5xl md:text-6xl font-semibold drop-shadow bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(to right, #6a5af9, #7b6cf9, #a78bfa)",
            }}
          >
            Find the best jobs, faster
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            Over 1,000+ job postings updated daily
          </p>

          {/* Search area */}
          <div className="mt-6 bg-white/95 backdrop-blur rounded-xl shadow p-3 md:p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                className="flex-1 rounded-md border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Job title, company name"
              />
              <input
                type="text"
                className="md:w-64 rounded-md border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Location"
              />
              <button className="md:w-40 rounded-md bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 transition">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row: sidebar (4) + content (8) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 mb-16">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-4">
            <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-auto pr-1">
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
            <div className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm">
              <img
                src={mainBanner}
                alt="Advertisement"
                className="w-full h-48 md:h-60 object-cover"
                loading="lazy"
              />
            </div>

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

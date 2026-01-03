import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CompanyService } from "~/services/companyService";
import LoadingSpinner from "~/components/Feedback/LoadingSpinner";
import CompanyHeader from "~/sections/CompanyDetail/CompanyHeader";
import CompanyInfo from "~/sections/CompanyDetail/CompanyInfo";
import CompanyJobs from "~/sections/CompanyDetail/CompanyJobs";

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await CompanyService.fetchCompanyDetail(id);
        
        if (isMounted) {
          setCompany(data);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error loading company detail:", err);
          setError(err.message || "Không thể tải thông tin công ty");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchCompanyData();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Scroll to top on mount/id change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 mt-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner
            message="Đang tải thông tin công ty..."
            variant="inline"
            size="lg"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 mt-2">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-red-500 mb-4">
              <svg
                className="h-full w-full"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Đã có lỗi xảy ra
            </h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 mt-2">
        <div className="text-center">
          <p className="text-slate-600">Không tìm thấy thông tin công ty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <CompanyHeader company={company} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Jobs List */}
          <div className="lg:col-span-2 space-y-6">
             {/* Description if available (currently not in API response but good to have placeholder) */}
             {/* 
             <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Giới thiệu</h2>
                <div className="prose prose-slate max-w-none">
                  <p>{company.description || "Chưa có mô tả về công ty."}</p>
                </div>
             </div>
             */}

             <CompanyJobs jobs={company.jobs} />
          </div>

          {/* Sidebar - Info */}
          <div className="lg:col-span-1">
            <CompanyInfo company={company} />
          </div>
        </div>
      </div>
    </div>
  );
}

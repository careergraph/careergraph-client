import { useEffect, useMemo, useState } from "react";
import { Heart, Building2, MapPin } from "lucide-react";
import LoadingSpinner from "~/components/Feedback/LoadingSpinner";
import CompanyCard from "~/sections/JobDetail/CompanyCard";
import { CompanyService } from "~/services/companyService";

const formatAddress = (company) => {
  const primaryAddress = company?.addresses?.find((address) => address?.isPrimary) || company?.addresses?.[0];

  if (!primaryAddress) {
    return "Đang cập nhật";
  }

  return [
    primaryAddress.ward,
    primaryAddress.district,
    primaryAddress.province,
    primaryAddress.country,
  ]
    .filter(Boolean)
    .join(", ");
};

export default function FollowingCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await CompanyService.fetchFollowedCompanies();
        if (!alive) return;
        setCompanies(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "Không thể tải danh sách nhà tuyển dụng đang theo dõi");
        setCompanies([]);
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };

    fetchCompanies();

    return () => {
      alive = false;
    };
  }, []);

  const totalFollowing = useMemo(() => companies.length, [companies]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-indigo-600">NTD bạn quan tâm</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Nhà tuyển dụng đang theo dõi</h1>
          <p className="mt-2 text-sm text-slate-600">
            Theo dõi {totalFollowing} nhà tuyển dụng để cập nhật tin tuyển dụng và thông tin công ty mới nhất.
          </p>
        </div>
        <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:block">
          <div className="flex items-center gap-2 text-slate-500">
            <Heart size={16} className="text-rose-500" />
            <span className="text-sm font-medium">Đang theo dõi</span>
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900">{totalFollowing}</div>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
          <LoadingSpinner message="Đang tải danh sách nhà tuyển dụng..." variant="inline" size="lg" />
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
          {error}
        </div>
      ) : companies.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <Building2 size={40} className="mx-auto text-slate-300" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900">Chưa theo dõi nhà tuyển dụng nào</h2>
          <p className="mt-2 text-sm text-slate-600">
            Hãy vào trang công ty để theo dõi những nhà tuyển dụng bạn quan tâm.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <div key={company.companyId || company.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <CompanyCard
                logo={company.avatar || "https://placehold.co/64x64?text=Logo"}
                name={company.name || "Đang cập nhật"}
                address={formatAddress(company)}
                size={company.size || "Đang cập nhật"}
                link={`/companies/${company.companyId || company.id}`}
                icon={<MapPin size={14} />}
              />
              {company.description ? (
                <p className="mt-4 line-clamp-3 text-sm text-slate-600">{company.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
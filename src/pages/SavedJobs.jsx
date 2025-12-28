// SavedJobs.jsx
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Heart,
  MapPin,
  BadgeDollarSign,
  Loader2,
} from "lucide-react";
import { UserAPI } from "~/services/api/user";
import { toast } from "sonner";
import { useUserStore } from "~/stores/userStore";

/** --- Helpers --- */
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

/** --- Job Card --- */
function JobCard({ job }) {

  const { user } = useUserStore();
  const [isSaved, setIsSaved] = useState(job.isSaved);
  const [imgError, setImgError] = useState(false);
  const [isCallAPI, setIsCallAPI] = useState(false);
  const handleImageError = (e) => {
    setImgError(true);
    // Fallback to generated avatar
    e.target.src = `https://avatar.oxro.io/avatar.svg?name=${encodeURIComponent(job.companyName || job.title || "Company")}`;
  };

  const handleSaveClick = async () => {
    if (job.id != null) {
      if(!isSaved){
        try {
              setIsCallAPI(true);
              if(user?.candidateId == null ){
                toast.info("Vui lòng đăng nhập để thực hiện chức năng này");
                return;
              }
              // Gọi API lấy chi tiết job
              const data = await UserAPI.savedJobs(user.candidateId, job.id);
              if (!data) {
                toast.error("Có lỗi xảy ra");
                return;
              }
              toast.success(data?.message);
              setIsSaved(!isSaved);
      
            } catch (err) {
              console.log(err)
              toast.error(err?.response?.data?.message)
              // toast.error("Có lỗi xảy ra");
            }finally {
              setIsCallAPI(false);
            }
            return;
      }else {
          try {
              setIsCallAPI(true);
              if(user?.candidateId == null ){
                toast.info("Vui lòng đăng nhập để thực hiện chức năng này");
                return;
              }
              // Gọi API lấy chi tiết job
              const data = await UserAPI.unSavedJobs(user.candidateId, job.id);
      
              if (!data) {
                toast.error("Có lỗi xảy ra");
                return;
              }
              toast.success(data?.message);
              setIsSaved(!isSaved);
            } catch (err) {
              console.log(err)
              toast.error(err?.response?.data?.message)
              // toast.error("Có lỗi xảy ra"); 
            }finally {
              setIsCallAPI(false);
            }
            return;
      }
    }
  }
  const avatarSrc = imgError
    ? `https://avatar.oxro.io/avatar.svg?name=${encodeURIComponent(job.companyName || job.title || "Company")}`
    : job.companyAvatar || "/dist/assets/ai-feature-DH8aVC4K.svg";


  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:shadow-sm">
      {/* Logo */}
      <div className="size-[64px] shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white flex items-center justify-center">
        <img
          src={avatarSrc}
          alt={job.companyName || "Company Logo"}
          className="w-16 h-16 rounded-lg border border-slate-200 object-cover"
          onError={handleImageError}
        />
      </div>

      {/* Content */}
      <div className="min-w-0 grow">
        <a href={`/jobs/${job.id }`} className="block text-[17px] font-semibold text-slate-800 hover:text-indigo-700 line-clamp-1">
          {job.title}
        </a>
        <div className="mt-1 text-sm text-slate-500 line-clamp-1">{job.companyName}</div>

        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]">
          {/* Salary */}
          {job.salaryRange && (
            <span className="inline-flex items-center gap-1 text-indigo-600">
              <BadgeDollarSign size={16} className="opacity-80" />
              {/* <a href={job.salaryLink || "#"} className="hover:underline">{job.salaryRange}</a> */}
              <div>{job.salaryRange}</div>
            </span>
          )}

          {/* Locations */}
          {/* {job.locations?.length > 0 && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <MapPin size={16} className="opacity-70" />
              <span className="line-clamp-1">
                {job.locations.join(", ")}
              </span>
            </span>
          )} */}
          {job.specific && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <MapPin size={16} className="opacity-70" />
              <span className="line-clamp-1">
                {job.specific}
              </span>
            </span>
          )}

          {/* Deadline */}
          {job.deadline && (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <CalendarDays size={16} className="opacity-70" />
              <span>{fmtDate(job.deadline)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSaveClick}
        title={isSaved ? "Bỏ lưu" : "Lưu việc làm"}
        className={`ml-auto rounded-full p-2 transition ${
          isSaved ? "text-[#1877f2]" : "text-slate-400 hover:text-[#1877f2]"
        }`}
      >
        {isCallAPI ? (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={18} />
        </div>
      ) : (
        <Heart
          size={22}
          className={`${isSaved ? "fill-[#1877f2]" : "fill-transparent"}`}
        />
      )}
      </button>
    </div>
  );
}

/** --- Empty State --- */
function EmptySaved() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="mb-6 text-xl font-semibold text-slate-700">
        Bạn chưa có việc làm đã lưu
      </p>
      <img
        src="/images/empty-saved.svg" // đổi thành ảnh của bạn nếu cần
        alt="Empty saved jobs"
        className="w-[360px] max-w-full opacity-95"
      />
    </div>
  );
}

/** --- Main component --- */
export default function SavedJobs({
  userName = "Luong Quang Thinh",
  items: itemsProp,
  onToggleSave, // (job) => void
}) {
  // demo data – thay bằng dữ liệu thật (API)
  const demo = [
    {
      id: "1",
      title: "Chuyên Viên Phòng Chống Gian Lận Miền Bắc - Ise",
      company: "Công ty Tài Chính TNHH HD SAISON",
      logo: "/logos/hdsaison.png",
      salary: "10 - 15 triệu",
      salaryLink: "#",
      locations: ["Phú Thọ", "Quảng Ninh", "Tuyên Quang"],
      deadline: "2025-10-11",
      href: "#",
      saved: true,
    },
    {
      id: "2",
      title: "Kỹ Thuật Vận Hành Máy Ép Nhựa",
      company: "Công Ty TNHH Nhựa Tân Lập Thành",
      logo: "/logos/tanlapthanh.png",
      salary: "Thỏa thuận",
      locations: ["TP.HCM"],
      deadline: "2025-10-31",
      href: "#",
      saved: true,
    },
  ];


  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  useEffect(() => {
    const fetchListJob = async () => {
      setIsLoading(true);
        try {
          const res =  await UserAPI.getAllSavedJobs();
          console.log(res?.data)
          setItems(res?.data);
          setIsLoading(false);
        }catch (err){
          console.error("Error loading company jobs:", err);
          // 
        }finally {
          setIsLoading(false);
        }
    }

    fetchListJob();
  },[])


  const hasAny = useMemo(() => items?.some((i) => i.saved), [items]);
  return (
    <section className="w-full mx-6">
      {/* greeting */}
      <div className="mb-3 rounded-xl border border-slate-200 bg-white/60 px-5 py-3 ">
        <span className="text-slate-400 font-semibold">Xin Chào, </span>
        <span className="font-extrabold text-slate-800">{userName}</span>
      </div>

      {/* card container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-800">Việc làm đã lưu</h3>
        </div>

        {isLoading ? (<div className="w-full max-w-6xl mx-6 p-8">
      <div className="flex flex-col items-center justify-center gap-4 py-10">
        {/* spinner */}
        <div className="h-10 w-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />

        {/* text */}
        <div className="text-center">
          <p className="text-base font-medium text-slate-800">
            Đang tải danh sách việc đã ứng tuyển...
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Vui lòng đợi trong giây lát.
          </p>
        </div>
      </div>
    </div>): (
      <div className="px-5 py-4 space-y-3">
          {!items ? (
            <EmptySaved />
          ) : (
            items
              .filter((j) => j.saved)
              .map((job) => (
                <JobCard key={job.id} job={job} />
              ))
          )}
        </div>
      )}
      </div>

        
    </section>
  );
}

// AppliedJobs.jsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { UserAPI } from "~/services/api/user";
import aiFeatureLogin from "../assets/icons/ai-feature.svg";
import { useNavigate } from "react-router-dom";
/* ---------- small utils ---------- */
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

const statusStyles = {
  SUCCESS: "bg-violet-100 text-violet-700",
  PENDING: "bg-amber-100 text-amber-800",
  REJECTED: "bg-rose-100 text-rose-700",
};

function StatusBadge({ value }) {
  const label =
    value === "APPLIED" ? "Đã nộp đơn" :
    value === "SCREENING" ? "Đang sàng lọc hồ sơ" :
    value === "INTERVIEW" ? "Phỏng vấn" :
    value === "HR_CONTACTED" ? "Đã liên hệ HR" :
    value === "INTERVIEW_SCHEDULED" ? "Lịch phỏng vấn đã được sắp xếp" :
    value === "INTERVIEW_COMPLETED" ? "Phỏng vấn hoàn tất" :
    value === "TRIAL" ? "Thử việc" :
    value === "OFFER_EXTENDED" ? "Đề nghị làm việc đã gửi" :
    value === "OFFER_ACCEPTED" ? "Đã chấp nhận đề nghị" :
    value === "OFFER_DECLINED" ? "Đã từ chối đề nghị" :
    value === "HIRED" ? "Chính thức nhận việc" :
    value === "REJECTED" ? "Ứng tuyển bị từ chối" :
    value === "WITHDRAWN" ? "Đã rút hồ sơ" :
    "Đang chờ";

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusStyles[value] || statusStyles.PENDING}`}>
      {label}
    </span>
  );
}

export function Select({ value, onChange, placeholder, options, className }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);

  // 🧭 Lấy vị trí để render dropdown ở ngoài body
  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  // 🖱️ Đóng khi click ra ngoài
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      const button = btnRef.current;
      const dropdown = dropdownRef.current;
      if (!button || !dropdown) return;

      if (!button.contains(e.target) && !dropdown.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const current = options.find((o) => o.value === value);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((s) => !s)}
        type="button"
        className={`flex h-10 min-w-[220px] items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 hover:bg-slate-50 ${className || ""}`}
      >
        <span className={current ? "" : "text-slate-400"}>
          {current ? current.label : placeholder || "Chọn"}
        </span>
        <ChevronDown size={16} className="opacity-70" />
      </button>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: coords?.top,
              left: coords?.left,
              width: coords?.width,
              zIndex: 9999,
            }}
            className="rounded-xl border border-slate-200 bg-white shadow-lg animate-in fade-in"
          >
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((o) => (
                <button
                  key={o.value}
                  onClick={() => {
                    onChange?.(o.value);
                    setOpen(false);
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm hover:bg-violet-100 ${
                    o.value === value
                      ? "bg-violet-100 text-violet-700 font-medium"
                      : "text-slate-700"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

/* ---------- main component ---------- */
export default function AppliedJobs() {

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [items, setItems] = useState(null);
  useEffect(()=> {
    setIsLoading(true)
    const fetchAppliedJob = async () => {
      const res = await UserAPI.getAppliedJobs();
      console.log(res)
      setItems(res?.data)
      setIsLoading(false)
    }
    fetchAppliedJob();
  },[])

const [filter, setFilters] = useState("")
const handleViewJobDetail = async (jobId) => {
  if (jobId) {
      navigate(`/jobs/${jobId}`);
    }
}


  const handleFilter = async (status) => {
      try {
        setIsLoading(true);
        setFilters(status)
        const res = await UserAPI.getAppliedJobs(status);
        setItems(res?.data || []);
      } finally {
        setIsLoading(false);
      }
  }
  const options = [
  { value: "", label: "Tất cả" },
  { value: "APPLIED", label: "Đã nộp đơn" },
  { value: "SCREENING", label: "Đang sàng lọc hồ sơ" },
  { value: "INTERVIEW", label: "Phỏng vấn" },
  { value: "HR_CONTACTED", label: "Đã liên hệ HR" },
  { value: "INTERVIEW_SCHEDULED", label: "Lịch phỏng vấn đã được sắp xếp" },
  { value: "INTERVIEW_COMPLETED", label: "Phỏng vấn hoàn tất" },
  { value: "TRIAL", label: "Thử việc" },
  { value: "OFFER_EXTENDED", label: "Đề nghị làm việc đã gửi" },
  { value: "OFFER_ACCEPTED", label: "Đã chấp nhận đề nghị" },
  { value: "OFFER_DECLINED", label: "Đã từ chối đề nghị" },
  { value: "HIRED", label: "Chính thức nhận việc" },
  { value: "REJECTED", label: "Ứng tuyển bị từ chối" },
  { value: "WITHDRAWN", label: "Đã rút hồ sơ" },
];

  // if(isLoading){
  //   return (
  //   <div className="w-full max-w-6xl mx-6 rounded-2xl bg-white shadow-sm border border-slate-200 p-8">
  //     <div className="flex flex-col items-center justify-center gap-4 py-10">
  //       {/* spinner */}
  //       <div className="h-10 w-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />

  //       {/* text */}
  //       <div className="text-center">
  //         <p className="text-base font-medium text-slate-800">
  //           Đang tải danh sách việc đã ứng tuyển...
  //         </p>
  //         <p className="mt-1 text-sm text-slate-500">
  //           Vui lòng đợi trong giây lát.
  //         </p>
  //       </div>
  //     </div>
  //   </div>
  //   )
  // }
  return (
    <div className="w-full max-w-6xl mx-6 rounded-2xl  bg-white shadow-sm border border-slate-200 p-6 ">
      {/* header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Việc làm đã ứng tuyển</h2>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="mr-1">Bộ lọc:</span>
          <Select
            value={filter}
            onChange={handleFilter}
            placeholder="Chọn trạng thái"
            options={options}
            className="min-w-[240px]"
          />
        </div>
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
    </div>) : (
        items?.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <p className="text-2xl font-bold text-slate-950 mb-6">
              Bạn chưa có việc làm đã ứng tuyển
            </p>
            <img
              src={aiFeatureLogin}
              alt="No applied jobs"
              className="w-[260px] h-auto opacity-90"
            />
          </div>
        ):(
          <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-sm text-slate-500">
                <th className="px-4 py-3">Tên việc làm</th>
                <th className="px-4 py-3">CV ứng tuyển</th>
                <th className="px-4 py-3">Ngày nộp</th>
                <th className="px-4 py-3">Hạn Nộp</th>
                <th className="px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {
                items?.map((job) => (
                  <tr key={job.jobId} className="rounded-xl bg-slate-50/70">
                    {/* job title + company */}
                    <td className="px-4 py-4 align-top hover:cursor-pointer">
                      <div className="font-medium text-slate-800"
                        onClick={() => handleViewJobDetail(job.jobId)}
                      >{job.jobName}</div>
                      <div className="mt-1 text-sm text-slate-500 line-clamp-2">{job.companyName}</div>
                    </td>

                    {/* CV */}
                    <td className="px-4 py-4 align-top">
                      <a
                        href={job.linkResume}
                        className="text-sm text-violet-700 hover:underline break-all"
                        title={job.linkResume}
                      >
                        {job?.linkResume?.length > 18
                          ? job.linkResume.slice(0, 9) + "..." + job.linkResume.slice(-9)
                          : job.linkResume}
                      </a>
                    </td>

                    {/* dates */}
                    <td className="px-4 py-4 align-top text-sm text-slate-700">{fmtDate(job.appliedAt)}</td>
                    <td className="px-4 py-4 align-top text-sm text-slate-700">{fmtDate(job.deadline)}</td>

                    {/* status badge */}
                    <td className="px-4 py-4 align-top">
                      <StatusBadge value={job.status} />
                    </td>

                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        )
      )}
    </div>
  );
}

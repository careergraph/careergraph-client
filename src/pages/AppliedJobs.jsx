// AppliedJobs.jsx
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
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
    value === "SUCCESS" ? "Ứng tuyển thành công" :
    value === "REJECTED" ? "Từ chối" :
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
            {options.map((o) => (
              <button
                key={o.value}
                onClick={() => {
                  onChange?.(o.value);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-violet-50 ${
                  o.value === value
                    ? "bg-violet-100 text-violet-700 font-medium"
                    : "text-slate-700"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}

/* ---------- main component ---------- */
export default function AppliedJobs({ items: itemsProp }) {
  // demo data; truyền props `items` từ API của bạn để thay thế
  const sampleItems = [
    {
      id: "1",
      title: "Nhân Viên Lập Trình",
      company: "Công Ty TNHH Tribeco Bình Dương",
      cvName: "javadeveloper_cv_6279.pdf",
      cvUrl: "#",
      appliedAt: "2025-10-06",
      deadline: "2025-10-14",
      status: "SUCCESS", // SUCCESS | PENDING | REJECTED
      feedback: "", // LIKE | NOT_FIT | WAIT
    },
    {
      id: "2",
      title: "Nhân Viên Lập Trình",
      company: "Công Ty TNHH Tribeco Bình Dương",
      cvName: "javadeveloper_cv_6279.pdf",
      cvUrl: "#",
      appliedAt: "2025-10-06",
      deadline: "2025-10-14",
      status: "SUCCESS", // SUCCESS | PENDING | REJECTED
      feedback: "", // LIKE | NOT_FIT | WAIT
    },
  ];
  const items = useMemo(() => itemsProp ?? sampleItems, [itemsProp]);

  const [filter, setFilter] = useState(""); // "", SUCCESS, PENDING, REJECTED
  const [feedbackState, setFeedbackState] = useState(
    Object.fromEntries(items.map((i) => [i.id, i.feedback || ""]))
  );

  const filtered = items.filter((i) => !filter || i.status === filter);

  return (
    <div className="w-full max-w-6xl mx-6 rounded-2xl  bg-white shadow-sm border border-slate-200 p-6 ">
      {/* header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Việc làm đã ứng tuyển</h2>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="mr-1">Bộ lọc:</span>
          <Select
            value={filter}
            onChange={setFilter}
            placeholder="Chọn trạng thái"
            options={[
              { value: "", label: "Tất cả" },
              { value: "SUCCESS", label: "Ứng tuyển thành công" },
              { value: "PENDING", label: "Đang chờ" },
              { value: "REJECTED", label: "Từ chối" },
            ]}
            className="min-w-[240px]"
          />
        </div>
      </div>

      {/* table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <p className="text-lg font-medium text-slate-700 mb-6">
            Bạn chưa có việc làm đã ứng tuyển
          </p>
          <img
            src="/images/empty-state.svg"
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
              <th className="px-4 py-3">Phản hồi về NTD</th>
            </tr>
          </thead>
          <tbody>
            {
              filtered.map((job) => (
                <tr key={job.id} className="rounded-xl bg-slate-50/70">
                  {/* job title + company */}
                  <td className="px-4 py-4 align-top">
                    <div className="font-medium text-slate-800">{job.title}</div>
                    <div className="mt-1 text-sm text-slate-500 line-clamp-2">{job.company}</div>
                  </td>

                  {/* CV */}
                  <td className="px-4 py-4 align-top">
                    <a
                      href={job.cvUrl}
                      className="text-sm text-violet-700 hover:underline break-all"
                      title={job.cvName}
                    >
                      {job.cvName.length > 18
                        ? job.cvName.slice(0, 9) + "..." + job.cvName.slice(-9)
                        : job.cvName}
                    </a>
                  </td>

                  {/* dates */}
                  <td className="px-4 py-4 align-top text-sm text-slate-700">{fmtDate(job.appliedAt)}</td>
                  <td className="px-4 py-4 align-top text-sm text-slate-700">{fmtDate(job.deadline)}</td>

                  {/* status badge */}
                  <td className="px-4 py-4 align-top">
                    <StatusBadge value={job.status} />
                  </td>

                  {/* feedback select */}
                  <td className="px-4 py-4 align-top">
                    <Select
                      value={feedbackState[job.id]}
                      onChange={(v) =>
                        setFeedbackState((s) => ({ ...s, [job.id]: v }))
                      }
                      placeholder="Chọn trạng thái"
                      options={[
                        { value: "", label: "Chưa chọn" },
                        { value: "LIKE", label: "Quan tâm" },
                        { value: "WAIT", label: "Cần theo dõi" },
                        { value: "NOT_FIT", label: "Không phù hợp" },
                      ]}
                    />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}

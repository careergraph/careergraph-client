// JobCriteria.jsx
import { useId, useMemo, useState, useEffect, useRef,useLayoutEffect   } from "react";
import { Pencil, ChevronDown, X } from "lucide-react";
import { createPortal } from "react-dom";
import SimpleSelect from "./SimpleSelect";

/** ---------- Utils ---------- */
const clampInt = (v) => {
  const n = parseInt(String(v).replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : "";
};

function classx(...arr) {
  return arr.filter(Boolean).join(" ");
}

/** ---------- Modal ---------- */
function Modal({ open, title, onClose, children, footer }) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 id={titleId} className="text-xl font-semibold">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-auto p-6">{children}</div>
        <div className="flex justify-end gap-3 border-t bg-white px-6 py-4">
          {footer}
        </div>
      </div>
    </div>
  );
}

/** ---------- Tag (pill) ---------- */
function Tag({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
      {children}
      <button
        className="rounded-full p-1 hover:bg-slate-200"
        onClick={onRemove}
        aria-label="Xóa"
      >
        <X size={14} />
      </button>
    </span>
  );
}



// ---- tiện ích nhỏ:
function useWindowEvents(events = [], handler) {
  useEffect(() => {
    events.forEach((ev) => window.addEventListener(ev, handler, { passive: true }));
    return () => events.forEach((ev) => window.removeEventListener(ev, handler));
  }, [handler, events]);
}

/** ---------- SimpleSelect (dropdown nho nhỏ) ---------- */
// function SimpleSelect({ placeholder, options, onSelect, disabled }) {
//   const [open, setOpen] = useState(false);
//   const [pos, setPos] = useState({
//     top: 0,
//     left: 0,
//     width: 0,
//     placement: "bottom", // 'bottom' | 'top'
//     maxHeight: 240,
//   });
//   const rootRef = useRef(null);     // wrapper chứa nút
//   const btnRef = useRef(null);      // chính là nút bấm
//   const menuRef = useRef(null);

//   // Đóng khi click ngoài
//   useEffect(() => {
//     const onDocClick = (e) => {
//       if (!rootRef.current) return;
//       if (!rootRef.current.contains(e.target) && !menuRef.current?.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", onDocClick);
//     return () => document.removeEventListener("mousedown", onDocClick);
//   }, []);

//   // Tính vị trí khi mở / khi viewport thay đổi / khi scroll
//   const recompute = () => {
//     if (!btnRef.current) return;
//     const r = btnRef.current.getBoundingClientRect();
//     const vwH = window.innerHeight;
//     const spaceBelow = vwH - r.bottom;
//     const spaceAbove = r.top;

//     const idealMenuH = Math.min(320, Math.max(spaceBelow - 12, 240)); // ưu tiên dưới
//     const shouldFlip = spaceBelow < 200 && spaceAbove > spaceBelow;

//     const maxHeight = shouldFlip
//       ? Math.min(280, Math.max(spaceAbove - 12, 160))
//       : Math.min(280, Math.max(spaceBelow - 12, 160));

//     setPos({
//       top: shouldFlip ? r.top - 8 : r.bottom + 8, // 8px offset
//       left: r.left,
//       width: r.width,
//       placement: shouldFlip ? "top" : "bottom",
//       maxHeight,
//     });
//   };

//   useLayoutEffect(() => {
//     if (open) recompute();
//   }, [open]);

//   // Recompute khi resize/scroll (kể cả scroll của modal vì ta render fixed theo viewport)
//   useWindowEvents(["resize", "scroll"], () => {
//     if (open) recompute();
//   });

//   return (
//     <div className="relative" ref={rootRef}>
//       <button
//         ref={btnRef}
//         type="button"
//         disabled={disabled}
//         onClick={() => setOpen((s) => !s)}
//         className={classx(
//           "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-slate-500",
//           "focus:outline-none focus:ring-2 focus:ring-violet-500",
//           disabled && "opacity-60"
//         )}
//       >
//         <span>{placeholder}</span>
//         <ChevronDown size={18} />
//       </button>

//       {open &&
//         createPortal(
//           <div
//             // lớp phủ để nhận click ngoài (không chặn scroll vì pointer-events)
//             className="fixed inset-0 z-[1000] pointer-events-none"
//             aria-hidden
//           >
//             <div
//               ref={menuRef}
//               className={classx(
//                 "pointer-events-auto absolute overflow-hidden rounded-xl border bg-white shadow-lg",
//                 "ring-1 ring-black/5"
//               )}
//               style={{
//                 top: pos.placement === "bottom" ? pos.top : undefined,
//                 bottom: pos.placement === "top" ? window.innerHeight - pos.top : undefined,
//                 left: pos.left,
//                 width: pos.width,
//               }}
//             >

//               <ul className="py-2" style={{ maxHeight: pos.maxHeight, overflow: "auto" }}>
//                 {options.map((op) => (
//                   <li key={op} className="px-3 py-1">
//                     <button
//                       type="button"
//                       onClick={() => {
//                         onSelect?.(op);
//                         setOpen(false);
//                       }}
//                       className="w-full rounded-lg px-2 py-2 text-left hover:bg-slate-100"
//                     >
//                       {op}
//                     </button>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>,
//           document.body
//         )}
//     </div>
//   );
// }


/** ---------- Form trong Modal ---------- */
function CriteriaForm({ defaultValues, onCancel, onSave }) {
  const [title, setTitle] = useState(defaultValues.title || "");
  const [industries, setIndustries] = useState(defaultValues.industries || []);
  const [locations, setLocations] = useState(defaultValues.locations || []);
  const [salaryMin, setSalaryMin] = useState(defaultValues.salaryMin ?? "");
  const [salaryMax, setSalaryMax] = useState(defaultValues.salaryMax ?? "");
  const [workTypes, setWorkTypes] = useState(defaultValues.workTypes || []);

  const industryOptions = useMemo(
    () => [
      "IT Phần mềm",
      "Thiết kế - Sáng tạo nghệ thuật",
      "Kế toán - Kiểm toán",
      "Nhân sự",
      "Kinh doanh - Bán hàng",
      "Kinh doanh - Bán hàng",
      "Kinh doanh - Bán hàng",
      "Kinh doanh - Bán hàng",
      "Kinh doanh - Bán hàng",
      "Kinh doanh - Bán hàng",
      "Kinh doanh - Bán hàng",
      "Kinh doanh - Bán hàng",
      "Kinh doanh - Bán hàng",
    ],
    []
  );
  const locationOptions = useMemo(
    () => ["TP.HCM", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Bình Dương", 
      "Huế",
      "Huế",
      "Huế",
      "Huế",
      "Huế",


    ],
    []
  );
  const workTypeOptions = useMemo(
    () => [
      "Toàn thời gian cố định",
      "Toàn thời gian tạm thời",
      "Bán thời gian",
      "Thực tập",
      "Remote/Hybrid",
    ],
    []
  );

  const canAddIndustry = industries.length < 3;
  const canAddLocation = locations.length < 5;

  const addUniq = (list, v, limitOK) =>
    limitOK && !list.includes(v) ? [...list, v] : list;

  const validate = () => {
    if (!title.trim()) return "Vui lòng nhập vị trí mong muốn.";
    if (industries.length === 0) return "Vui lòng chọn ngành nghề.";
    if (locations.length === 0) return "Vui lòng chọn địa điểm.";
    const min = Number(salaryMin || 0);
    const max = Number(salaryMax || 0);
    if (salaryMin !== "" && salaryMax !== "" && min > max)
      return "Mức lương tối thiểu không được lớn hơn tối đa.";
    return "";
  };

  const error = validate();

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (error) return;
        onSave?.({
          title: title.trim(),
          industries,
          locations,
          salaryMin: salaryMin === "" ? null : Number(salaryMin),
          salaryMax: salaryMax === "" ? null : Number(salaryMax),
          workTypes,
        });
      }}
    >
      {/* Vị trí mong muốn */}
      <div>
        <label className="mb-1 block text-sm font-medium">Vị trí mong muốn *</label>
        <input
          placeholder="Nhập vị trí muốn ứng tuyển"
          className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Ngành nghề (max 3) */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium">Ngành nghề làm việc *</label>
          <span className="text-xs text-slate-500">Tối đa 3 ngành nghề</span>
        </div>
        <SimpleSelect
          placeholder="Chọn ngành nghề"
          options={industryOptions}
          onSelect={(v) => setIndustries((s) => addUniq(s, v, canAddIndustry))}
          disabled={!canAddIndustry}
        />
        {industries.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {industries.map((x) => (
              <Tag key={x} onRemove={() => setIndustries((s) => s.filter((i) => i !== x))}>
                {x}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {/* Địa điểm (max 5) */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium">Địa điểm làm việc mong muốn *</label>
          <span className="text-xs text-slate-500">Tối đa 5 địa điểm</span>
        </div>
        <SimpleSelect
          placeholder="Chọn địa điểm"
          options={locationOptions}
          onSelect={(v) => setLocations((s) => addUniq(s, v, canAddLocation))}
          disabled={!canAddLocation}
        />
        {locations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {locations.map((x) => (
              <Tag key={x} onRemove={() => setLocations((s) => s.filter((i) => i !== x))}>
                {x}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {/* Mức lương */}
      <div>
        <label className="mb-1 block text-sm font-medium">Mức lương mong muốn *</label>
        <div className="grid grid-cols-2 gap-3 sm:max-w-lg">
          <div className="flex items-stretch overflow-hidden rounded-xl border">
            <input
              inputMode="numeric"
              placeholder="Tối thiểu"
              className="w-full px-4 py-3 outline-none"
              value={salaryMin}
              onChange={(e) => setSalaryMin(clampInt(e.target.value))}
            />
            <div className="grid place-items-center bg-slate-50 px-3 text-sm text-slate-500">
              Triệu
            </div>
          </div>
          <div className="flex items-stretch overflow-hidden rounded-xl border">
            <input
              inputMode="numeric"
              placeholder="Tối đa"
              className="w-full px-4 py-3 outline-none"
              value={salaryMax}
              onChange={(e) => setSalaryMax(clampInt(e.target.value))}
            />
            <div className="grid place-items-center bg-slate-50 px-3 text-sm text-slate-500">
              Triệu
            </div>
          </div>
        </div>
        {salaryMin !== "" && salaryMax !== "" && Number(salaryMin) > Number(salaryMax) && (
          <p className="mt-1 text-sm text-red-600">
            Tối thiểu không được lớn hơn tối đa
          </p>
        )}
      </div>

      {/* Hình thức làm việc */}
      <div>
        <label className="mb-1 block text-sm font-medium">Hình thức làm việc</label>
        <SimpleSelect
          placeholder="Chọn hình thức làm việc"
          options={workTypeOptions}
          onSelect={(v) => setWorkTypes((s) => (s.includes(v) ? s : [...s, v]))}
        />
        {workTypes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {workTypes.map((x) => (
              <Tag key={x} onRemove={() => setWorkTypes((s) => s.filter((i) => i !== x))}>
                {x}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {/* Footer buttons */}
      <div className="invisible h-0" />
      <div className="sr-only">
        <button type="submit">Lưu</button>
      </div>

      {/* Modal footer via prop */}
      {/*
        Nút footer thực sự được truyền từ cha (Modal.footer)
      */}
    </form>
  );
}

/** ---------- Card hiển thị + mở popup ---------- */
export default function JobCriteriaCard({
  value,
  onSave, // (data) => void
  className
}) {
  const [open, setOpen] = useState(false);
  const data = value || {
    title: "",
    industries: [],
    locations: [],
    salaryMin: null,
    salaryMax: null,
    workTypes: [],
  };

  const displayOrAdd = (label, text, onClick) => (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <button
        type="button"
        onClick={onClick}
        className={classx(
          "text-[15px]",
          text ? "text-black font-semibold" : "text-violet-700"
        )}
      >
        {text || `Thêm ${label.toLowerCase()}`}
      </button>
    </div>
  );

  const salaryText =
    data.salaryMin == null && data.salaryMax == null
      ? ""
      : `${data.salaryMin ?? "—"} – ${data.salaryMax ?? "—"} Triệu`;

  return (
    <>
      <section className={`rounded-2xl bg-white p-4 shadow-sm sm:p-6 ${className}`}>
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-[18px] font-semibold text-neutral-900">Tiêu chí tìm việc</h3>
          <button
            onClick={() => setOpen(true)}
            className="rounded-full p-2 hover:bg-slate-100"
            aria-label="Chỉnh sửa"
          >
            <Pencil size={18} className="text-slate-600" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {displayOrAdd("Vị trí công việc", data.title, () => setOpen(true))}
          {displayOrAdd("Mức lương mong muốn (triệu/tháng)", salaryText, () => setOpen(true))}
          {displayOrAdd(
            "Ngành nghề",
            data.industries.length ? data.industries.join(", ") : "",
            () => setOpen(true)
          )}
          {displayOrAdd(
            "Hình thức làm việc",
            data.workTypes.length ? data.workTypes.join(", ") : "",
            () => setOpen(true)
          )}
          {displayOrAdd(
            "Địa điểm tìm việc",
            data.locations.length ? data.locations.join(", ") : "",
            () => setOpen(true)
          )}
        </div>
      </section>

      <Modal
        open={open}
        title="Tiêu chí tìm việc"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button
              className="rounded-xl border px-4 py-2"
              onClick={() => setOpen(false)}
            >
              Hủy
            </button>
            {/* Nút Lưu nằm trong CriteriaForm bằng submit ẩn;
                ở đây ta bắn sự kiện 'submit' cho form con */}
            <button
              className="rounded-xl bg-violet-700 px-4 py-2 font-semibold text-white hover:bg-violet-800"
              onClick={() => {
                const btn = document.getElementById("__criteria_hidden_submit");
                btn?.click();
              }}
            >
              Lưu thông tin
            </button>
          </>
        }
      >
        {/* Form */}
        <CriteriaForm
          defaultValues={data}
          onCancel={() => setOpen(false)}
          onSave={(values) => {
            onSave?.(values);
            setOpen(false);
          }}
        />
        {/* Nút submit ẩn để điều khiển từ footer */}
        <button id="__criteria_hidden_submit" type="submit" form="" className="hidden" />
      </Modal>
    </>
  );
}

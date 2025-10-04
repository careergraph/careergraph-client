// GeneralInfoCard.jsx
import { useEffect, useId, useMemo, useState,useRef, useLayoutEffect } from "react";
import { Pencil, ChevronDown, X, Check  } from "lucide-react";

import { createPortal } from "react-dom";

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
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close" />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 id={titleId} className="text-xl font-semibold">
            {title}
          </h3>
          <button className="rounded-full p-2 hover:bg-slate-100" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-auto p-6">{children}</div>
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          {footer}
        </div>
      </div>
    </div>
  );
}
/* ---------- SimpleSelect ----------
   Dropdown tối giản, dựng nhanh cho mock UI */
// function SimpleSelect({ value, onChange, placeholder, options, disabled }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <div className="relative">
//       <button
//         type="button"
//         disabled={disabled}
//         onClick={() => setOpen((s) => !s)}
//         className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left ${
//           value ? "text-slate-800" : "text-slate-500"
//         } ${disabled ? "opacity-60" : ""} focus:outline-none focus:ring-2 focus:ring-violet-500`}
//       >
//         <span>{value || placeholder}</span>
//         <ChevronDown size={18} />
//       </button>
//       {open && !disabled && (
//         <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border bg-white shadow-lg">
//           <ul className="max-h-60 overflow-auto py-2">
//             {options.map((op) => (
//               <li key={op} className="px-2 py-1">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     onChange?.(op);
//                     setOpen(false);
//                   }}
//                   className="w-full rounded-lg px-3 py-2 text-left hover:bg-slate-100"
//                 >
//                   {op}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

function classx(...a) { return a.filter(Boolean).join(" "); }

function useDropdownPosition({ open, anchorRef, listRef, gap = 8 }) {
  const [pos, setPos] = useState({
    ready: false,
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 240,
    flip: false,
  });

  useEffect(() => {
    if (!open) return;

    const update = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const r = anchor.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const spaceBelow = vh - r.bottom;
      const spaceAbove = r.top;

      // Quy tắc lật: nếu bên dưới ít chỗ hơn và bên trên nhiều hơn thì lật lên
      const shouldFlip = spaceBelow < 200 && spaceAbove > spaceBelow;

      // maxHeight: giới hạn trong [160..320], nhưng không vượt quá khoảng trống thực tế trừ đi gap
      const maxH = shouldFlip
        ? Math.min(320, Math.max(spaceAbove - gap, 160))
        : Math.min(320, Math.max(spaceBelow - gap, 160));

      // left & width bám theo anchor
      const left = Math.max(8, Math.min(r.left, vw - r.width - 8));
      const width = r.width;

      // top tạm thời; nếu flip sẽ set theo r.top, ngược lại theo r.bottom
      const top = shouldFlip ? r.top - 4 : r.bottom + 4;

      setPos({
        ready: true,
        top,
        left,
        width,
        maxHeight: Math.max(160, maxH),
        flip: shouldFlip,
      });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);
    if (anchorRef.current) ro.observe(anchorRef.current);

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, anchorRef, listRef, gap]);

  return pos;
}

/** ---------------- Select ---------------- */
export function SimpleSelect({ value, onChange, placeholder, options, disabled }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const listRef = useRef(null);

  const pos = useDropdownPosition({ open, anchorRef: btnRef, listRef });

  
  useEffect(() => {
    if (!open) return;
    const onDocDown = (e) => {
      const b = btnRef.current;
      const l = listRef.current;
      if (!b || !l) return;
      if (b.contains(e.target) || l.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [open]);

  
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((s) => !s)}
        className={classx(
          "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left",
          value ? "text-slate-800" : "text-slate-500",
          disabled ? "opacity-60 cursor-not-allowed" : "hover:border-slate-300",
          "focus:outline-none focus:ring-2 focus:ring-violet-500"
        )}
      >
        <span className={classx(!value && "italic")}>{value || placeholder}</span>
        <ChevronDown size={18} className={classx(open && "rotate-180 transition-transform")} />
      </button>

      {/* Dropdown render ra <body> để tránh bị modal/popup che/clip */}
      {open && !disabled && createPortal(
        <div
          ref={listRef}
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            width: pos.width,
            zIndex: 9999,  // cao hơn modal
          }}
          className={classx(
            "rounded-xl border bg-white shadow-lg",
            "overflow-hidden"
          )}
        >
          {/* Viền mờ theo hướng hiển thị (để cảm giác nổi) */}
          <div
            className={classx(
              "absolute left-0 right-0 h-4 pointer-events-none",
              pos.flip ? "-bottom-4" : "-top-4",
              "bg-gradient-to-b",
              pos.flip ? "from-transparent to-black/5" : "from-black/5 to-transparent"
            )}
          />
          <ul
            className="py-2 overflow-auto"
            style={{ maxHeight: pos.maxHeight }}
          >
            {options.map((op) => {
              const selected = op === value;
              return (
                <li key={op}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange?.(op);
                      setOpen(false);
                    }}
                    className={classx(
                      "flex w-full items-center gap-2 px-3 py-2 text-left",
                      "hover:bg-slate-100 focus:bg-slate-100 focus:outline-none",
                      selected && "bg-violet-50"
                    )}
                  >
                    <span className="flex-1">{op}</span>
                    {selected && <Check size={16} className="shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>,
        document.body
      )}
    </div>
  );
}

/* ---------- Form trong modal ---------- */
function GeneralInfoForm({ defaultValues, onSave, onCancel }) {
  const [hasExp, setHasExp] = useState(defaultValues.hasExp ?? false);
  const [years, setYears] = useState(defaultValues.years || "");
  const [level, setLevel] = useState(defaultValues.level || "");
  const [education, setEducation] = useState(defaultValues.education || "");
  const [error, setError] = useState("");

  const yearOptions = useMemo(
    () => ["< 1 năm", "1 năm", "2 năm", "3 năm", "4 năm", "5+ năm"],
    []
  );
  const levelOptions = useMemo(
    () => ["Thực tập", "Nhân viên", "Trưởng nhóm/Leader", "Quản lý", "Giám đốc"],
    []
  );
  const eduOptions = useMemo(
    () => ["Trung cấp", "Cao đẳng", "Đại học", "Sau đại học", "Khác"],
    []
  );

  useEffect(() => {
    // reset years nếu chọn "Chưa có kinh nghiệm"
    if (!hasExp) setYears("");
  }, [hasExp]);

  const submit = (e) => {
    e.preventDefault();
    if (hasExp && !years) {
      setError("Vui lòng chọn số năm kinh nghiệm.");
      return;
    }
    setError("");
    onSave?.({ hasExp, years: hasExp ? years : null, level, education });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Kinh nghiệm làm việc */}
      <div>
        <p className="mb-2 text-sm font-medium">Kinh nghiệm làm việc</p>
        <div className="flex flex-wrap gap-6">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="exp"
              className="accent-violet-700"
              checked={!hasExp}
              onChange={() => setHasExp(false)}
            />
            Chưa có kinh nghiệm
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="exp"
              className="accent-violet-700"
              checked={hasExp}
              onChange={() => setHasExp(true)}
            />
            Đã có kinh nghiệm
          </label>
        </div>
      </div>

      {/* Số năm kinh nghiệm */}
      {hasExp &&
        <div className={`${hasExp ? "opacity-100" : "opacity-60"}`}>
        <p className="mb-2 text-sm font-medium">Số năm kinh nghiệm {hasExp && <span className="text-red-600">*</span>}</p>
        <SimpleSelect
          value={years}
          onChange={setYears}
          placeholder="Chọn số năm kinh nghiệm"
          options={yearOptions}
          disabled={!hasExp}
        />
        {error && hasExp && !years && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>}

      {/* Cấp bậc hiện tại */}
      <div>
        <p className="mb-2 text-sm font-medium">Cấp bậc hiện tại</p>
        <SimpleSelect
          value={level}
          onChange={setLevel}
          placeholder="Chọn cấp bậc hiện tại"
          options={levelOptions}
        />
      </div>

      {/* Trình độ học vấn cao nhất */}
      <div>
        <p className="mb-2 text-sm font-medium">Trình độ học vấn cao nhất</p>
        <SimpleSelect
          value={education}
          onChange={setEducation}
          placeholder="Chọn trình độ học vấn cao nhất"
          options={eduOptions}
        />
      </div>

      {/* Footer nằm ở ngoài (trong Modal), nhưng thêm submit ẩn cho tiện điều khiển */}
      <button type="submit" id="__general_info_submit" className="hidden" />
    </form>
  );
}

/* ---------- Card hiển thị + mở popup ---------- */
export default function GeneralInfoCard({ value, onSave, className }) {
  const [open, setOpen] = useState(false);
  const data = value || { hasExp: false, years: null, level: "", education: "" };

  const expText = data.hasExp
    ? data.years || "—"
    : "Chưa có kinh nghiệm";

  const renderItem = (label, text, onClick) => (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <button
        type="button"
        onClick={onClick}
        className={`${text ? "text-black font-semibold" : "text-violet-700"} text-[15px]`}
      >
        {text || `Thêm ${label.toLowerCase()}`}
      </button>
    </div>
  );

  return (
    <>
      <section className={`rounded-2xl bg-white p-4 shadow-sm sm:p-6 ${className}`}>
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-[18px] font-semibold text-neutral-900">Thông tin chung</h3>
          <button
            onClick={() => setOpen(true)}
            className="rounded-full p-2 hover:bg-slate-100"
            aria-label="Chỉnh sửa"
          >
            <Pencil size={18} className="text-slate-600" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {renderItem("Số năm kinh nghiệm", data.hasExp ? expText : "", () => setOpen(true))}
          {renderItem("Trình độ học vấn cao nhất", data.education || "", () => setOpen(true))}
          {renderItem("Cấp bậc hiện tại", data.level || "", () => setOpen(true))}
        </div>
      </section>

      {/* Popup */}
      <Modal
        open={open}
        title="Thông tin chung"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button className="rounded-xl border px-4 py-2" onClick={() => setOpen(false)}>
              Hủy
            </button>
            <button
              className="rounded-xl bg-violet-700 px-4 py-2 font-semibold text-white hover:bg-violet-800"
              onClick={() => document.getElementById("__general_info_submit")?.click()}
            >
              Lưu thông tin
            </button>
          </>
        }
      >
        <GeneralInfoForm
          defaultValues={data}
          onCancel={() => setOpen(false)}
          onSave={(values) => {
            onSave?.(values);
            setOpen(false);
          }}
        />
      </Modal>
    </>
  );
}

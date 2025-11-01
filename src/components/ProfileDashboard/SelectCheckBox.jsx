import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { createPortal } from "react-dom";

/* --------- utils --------- */
function classx(...arr) {
  return arr.filter(Boolean).join(" ");
}

function useWindowEvents(events = [], handler) {
  useEffect(() => {
    events.forEach((ev) => window.addEventListener(ev, handler, { passive: true }));
    return () => events.forEach((ev) => window.removeEventListener(ev, handler));
  }, [handler, events]);
}

/**
 * props:
 * - placeholder: string
 * - options: Array<string | {value, label}>
 * - values: Array<string>  (mảng value đã chọn)
 * - onChange: (newValues) => void
 * - maxCount?: number
 * - disabled?: boolean
 */
export default function SelectCheckBox({
  placeholder,
  options,
  values = [],
  onChange,
  maxCount,
  disabled,
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({
    top: 0,
    left: 0,
    width: 0,
    placement: "bottom",
    maxHeight: 240,
  });

  const rootRef = useRef(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const prevFocusRef = useRef(null);

  // Chuẩn hóa options -> [{value,label}]
  const normOptions = useMemo(() => {
    const arr = Array.isArray(options) ? options : [];
    return arr.map((op) => (typeof op === "string" ? { value: op, label: op } : op));
  }, [options]);

  const selectedSet = useMemo(() => new Set(values || []), [values]);
  const selectedCount = values?.length || 0;
  const limit = Number.isFinite(maxCount) ? maxCount : Infinity;
  const isMaxed = selectedCount >= limit;

  // Đóng khi click ngoài (khi không dùng backdrop)
  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (!rootRef.current) return;
      const inRoot = rootRef.current.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (!inRoot && !inMenu) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // A11y: quản lý focus khi mở/đóng; Esc để đóng
  useEffect(() => {
    if (open) {
      prevFocusRef.current = document.activeElement;
      // chờ portal mount xong rồi focus vào menu
      requestAnimationFrame(() => {
        menuRef.current?.focus();
      });
    } else {
      // trả focus lại nút mở
      if (prevFocusRef.current && typeof prevFocusRef.current.focus === "function") {
        prevFocusRef.current.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Tính vị trí
  const recompute = () => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const vwH = window.innerHeight;
    const spaceBelow = vwH - r.bottom;
    const spaceAbove = r.top;
    const shouldFlip = spaceBelow < 300 && spaceAbove > spaceBelow;

    const maxHeight = shouldFlip
      ? Math.min(240, Math.max(spaceAbove - 12, 160))
      : Math.min(240, Math.max(spaceBelow - 12, 160));

    setPos({
      top: shouldFlip ? r.top - 8 : r.bottom + 8,
      left: r.left,
      width: r.width,
      placement: shouldFlip ? "top" : "bottom",
      maxHeight,
    });
  };

  useLayoutEffect(() => {
    if (open) recompute();
  }, [open]);

  useWindowEvents(["resize", "scroll"], () => {
    if (open) recompute();
  });

  const toggleValue = (v) => {
    const isSelected = selectedSet.has(v);
    if (!isSelected && isMaxed) return; // chặn chọn thêm khi đã max
    const next = isSelected ? values.filter((x) => x !== v) : [...values, v];
    onChange?.(next);
  };

  // Text hiển thị trên nút
  const buttonText =
    selectedCount > 0
      ? `${selectedCount}/${Number.isFinite(maxCount) ? maxCount : "∞"} đã chọn`
      : placeholder || "Chọn";

  const popupId = "scb-popup";

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((s) => !s)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={popupId}
        className={classx(
          "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left",
          selectedCount ? "text-slate-900" : "text-slate-500",
          "focus:outline-none focus:ring-2 focus:ring-violet-500",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <span className="truncate">{buttonText}</span>
        <ChevronDown size={18} />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[1000]">
            {/* Backdrop trong suốt: click ra ngoài để đóng */}
            <button
              type="button"
              aria-label="Đóng"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-transparent"
              tabIndex={-1}
            />

            {/* Popup */}
            <div
              ref={menuRef}
              id={popupId}
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              className={classx(
                "absolute overflow-hidden rounded-xl border bg-white shadow-lg ring-1 ring-black/5"
              )}
              style={{
                top: pos.placement === "bottom" ? pos.top : undefined,
                bottom: pos.placement === "top" ? window.innerHeight - pos.top : undefined,
                left: pos.left,
                width: pos.width,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2 border-b bg-slate-50">
                <div className="text-xs text-slate-600">
                  Đã chọn <b>{selectedCount}</b> / {Number.isFinite(maxCount) ? maxCount : "∞"}
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-slate-200"
                  onClick={() => setOpen(false)}
                >
                  <X size={14} /> Xong
                </button>
              </div>

              {/* Danh sách */}
              <ul
                role="listbox"
                aria-multiselectable="true"
                className="py-2"
                style={{ maxHeight: pos.maxHeight, overflow: "auto" }}
              >
                {normOptions.map((op) => {
                  const checked = selectedSet.has(op.value);
                  const shouldDim = isMaxed && !checked; // đã max và mục này chưa chọn
                  return (
                    <li key={op.value} role="option" aria-selected={checked}>
                      <button
                        type="button"
                        onClick={() => toggleValue(op.value)}
                        className={classx(
                          "w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-100",
                          shouldDim && "opacity-40 cursor-not-allowed"
                        )}
                        disabled={shouldDim}
                      >
                        <input type="checkbox" readOnly checked={checked} className="h-4 w-4" />
                        <span className="truncate">{op.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

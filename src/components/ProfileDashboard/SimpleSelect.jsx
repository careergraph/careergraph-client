
import { useEffect, useState,useRef, useLayoutEffect } from "react";
import { Pencil, ChevronDown, X } from "lucide-react";

import { createPortal } from "react-dom";

function classx(...arr) {
  return arr.filter(Boolean).join(" ");
}

function useWindowEvents(events = [], handler) {
  useEffect(() => {
    events.forEach((ev) => window.addEventListener(ev, handler, { passive: true }));
    return () => events.forEach((ev) => window.removeEventListener(ev, handler));
  }, [handler, events]);
}

export default function SimpleSelect({ placeholder, options, onSelect, disabled }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({
    top: 0,
    left: 0,
    width: 0,
    placement: "bottom", // 'bottom' | 'top'
    maxHeight: 240,
  });
  const rootRef = useRef(null);     // wrapper chứa nút
  const btnRef = useRef(null);      // chính là nút bấm
  const menuRef = useRef(null);

  // Đóng khi click ngoài
  useEffect(() => {
    const onDocClick = (e) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target) && !menuRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Tính vị trí khi mở / khi viewport thay đổi / khi scroll
  const recompute = () => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const vwH = window.innerHeight;
    const spaceBelow = vwH - r.bottom;
    const spaceAbove = r.top;

    const idealMenuH = Math.min(320, Math.max(spaceBelow - 12, 240)); // ưu tiên dưới
    const shouldFlip = spaceBelow < 200 && spaceAbove > spaceBelow;

    const maxHeight = shouldFlip
      ? Math.min(280, Math.max(spaceAbove - 12, 160))
      : Math.min(280, Math.max(spaceBelow - 12, 160));

    setPos({
      top: shouldFlip ? r.top - 8 : r.bottom + 8, // 8px offset
      left: r.left,
      width: r.width,
      placement: shouldFlip ? "top" : "bottom",
      maxHeight,
    });
  };

  useLayoutEffect(() => {
    if (open) recompute();
  }, [open]);

  // Recompute khi resize/scroll (kể cả scroll của modal vì ta render fixed theo viewport)
  useWindowEvents(["resize", "scroll"], () => {
    if (open) recompute();
  });

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((s) => !s)}
        className={classx(
          "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-slate-500",
          "focus:outline-none focus:ring-2 focus:ring-violet-500",
          disabled && "opacity-60"
        )}
      >
        <span>{placeholder}</span>
        <ChevronDown size={18} />
      </button>

      {open &&
        createPortal(
          <div
            // lớp phủ để nhận click ngoài (không chặn scroll vì pointer-events)
            className="fixed inset-0 z-[1000] pointer-events-none"
            aria-hidden
          >
            <div
              ref={menuRef}
              className={classx(
                "pointer-events-auto absolute overflow-hidden rounded-xl border bg-white shadow-lg",
                "ring-1 ring-black/5"
              )}
              style={{
                top: pos.placement === "bottom" ? pos.top : undefined,
                bottom: pos.placement === "top" ? window.innerHeight - pos.top : undefined,
                left: pos.left,
                width: pos.width,
              }}
            >

              <ul className="py-2" style={{ maxHeight: pos.maxHeight, overflow: "auto" }}>
                {options.map((op) => (
                  <li key={op} className="px-3 py-1">
                    <button
                      type="button"
                      onClick={() => {
                        onSelect?.(op);
                        setOpen(false);
                      }}
                      className="w-full rounded-lg px-2 py-2 text-left hover:bg-slate-100"
                    >
                      {op}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import { ChevronDown, X } from "lucide-react";
import { createPortal } from "react-dom";

function classx(...arr) {
  return arr.filter(Boolean).join(" ");
}

// hook tiện lợi: listen nhiều event global
function useWindowEvents(events = [], handler) {
  useEffect(() => {
    events.forEach((ev) =>
      window.addEventListener(ev, handler, { passive: true })
    );
    return () =>
      events.forEach((ev) => window.removeEventListener(ev, handler));
  }, [handler, events]);
}

/**
 * props:
 * - value: any (giá trị đang chọn, ví dụ "79" là mã tỉnh)
 * - onChange: (newValue:any)=>void
 * - options: Array<{value:any,label:string,disabled?:boolean}>
 * - placeholder: string
 * - disabled?: boolean
 * - clearable?: boolean (có nút X xoá chọn hay không)
 * - maxHeight?: number (px) giới hạn chiều cao menu
 */
export default function SimpleSelect({
  value,
  onChange,
  options,
  placeholder = "Chọn...",
  disabled = false,
  clearable = false,
  maxHeight = 240,
}) {
  const [open, setOpen] = useState(false);

  const [pos, setPos] = useState({
    top: 0,
    left: 0,
    width: 0,
    placement: "bottom", // or "top"
    maxHeight: 200,
  });

  const rootRef = useRef(null); // wrapper của button
  const btnRef = useRef(null); // chính nút select
  const menuRef = useRef(null); // dropdown panel

  // lấy option đang chọn để render label
  const selectedOption = options.find((op) => op.value === value);

  // --- đóng khi click ra ngoài
  useEffect(() => {
    const handleDocClick = (e) => {
      if (!open) return;
      const rootEl = rootRef.current;
      const menuEl = menuRef.current;
      if (!rootEl || !menuEl) return;

      // nếu click không nằm trong button + không nằm trong dropdown
      if (
        !rootEl.contains(e.target) &&
        !menuEl.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    const handleKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleDocClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  // --- tính toán vị trí dropdown
  const recomputePos = useCallback(() => {
    if (!btnRef.current) return;

    const r = btnRef.current.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const spaceBelow = viewportH - r.bottom;
    const spaceAbove = r.top;

    // khi nào lật lên trên?
    const shouldOpenUp = spaceBelow < 200 && spaceAbove > spaceBelow;

    // tính maxHeight thực tế
    const computedMaxH = shouldOpenUp
      ? Math.min(maxHeight, Math.max(spaceAbove - 12, 120))
      : Math.min(maxHeight, Math.max(spaceBelow - 12, 120));

    setPos({
      top: shouldOpenUp ? r.top - 8 : r.bottom + 8, // offset 8px
      left: r.left,
      width: r.width,
      placement: shouldOpenUp ? "top" : "bottom",
      maxHeight: computedMaxH,
    });
  }, [maxHeight]);

  useLayoutEffect(() => {
    if (open) {
      recomputePos();
    }
  }, [open, recomputePos]);

  // Cập nhật vị trí khi scroll / resize
  useWindowEvents(["scroll", "resize"], () => {
    if (open) {
      recomputePos();
    }
  });

  // handler chọn option
  const handleSelect = (val) => {
    if (onChange) onChange(val);
    setOpen(false);
  };

  // handler clear
  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    onChange?.(null);
  };

  return (
    <div
      className="relative inline-block w-full"
      ref={rootRef}
    >
      {/* Trigger button */}
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((s) => !s);
        }}
        className={classx(
          "flex w-full min-h-[44px] items-center justify-between rounded-xl border px-3 py-2 text-left text-slate-700 bg-white",
          "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500",
          disabled && "opacity-60 cursor-not-allowed bg-slate-100 text-slate-400"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate text-[14px] leading-[20px]">
          {selectedOption ? selectedOption.label : (
            <span className="text-slate-400">{placeholder}</span>
          )}
        </span>

        <div className="ml-2 flex items-center gap-1 shrink-0">
          {clearable && !!selectedOption && !disabled && (
            <X
              size={14}
              className="text-slate-400 hover:text-slate-600"
              onClick={handleClear}
            />
          )}
          <ChevronDown
            size={16}
            className={classx(
              "text-slate-500 transition-transform duration-150",
              open && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Dropdown menu (Portal to body) */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] pointer-events-none"
            aria-hidden={!open}
          >
            <div
              ref={menuRef}
              className={classx(
                "pointer-events-auto absolute rounded-xl border bg-white shadow-lg ring-1 ring-black/5",
                "overflow-hidden"
              )}
              style={{
                top:
                  pos.placement === "bottom" ? pos.top : undefined,
                bottom:
                  pos.placement === "top"
                    ? window.innerHeight - pos.top
                    : undefined,
                left: pos.left,
                width: pos.width,
              }}
            >
              <ul
                className="max-h-[300px] py-1 text-[14px] leading-[20px]"
                style={{
                  maxHeight: pos.maxHeight,
                  overflowY: "auto",
                }}
                role="listbox"
              >
                {options.length === 0 ? (
                  <li className="px-3 py-2 text-slate-400 select-none">
                    Không có dữ liệu
                  </li>
                ) : (
                  options.map((op) => {
                    const isActive = op.value === value;
                    return (
                      <li key={op.value}>
                        <button
                          type="button"
                          disabled={op.disabled}
                          onMouseDown={(e) => {
                            // dùng onMouseDown để chọn trước khi blur
                            e.preventDefault();
                            if (op.disabled) return;
                            handleSelect(op.value);
                          }}
                          className={classx(
                            "w-full text-left px-3 py-2 flex items-center justify-between",
                            "hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed",
                            isActive
                              ? "bg-violet-50 text-violet-600 font-medium"
                              : "text-slate-700"
                          )}
                          role="option"
                          aria-selected={isActive}
                        >
                          <span className="truncate">{op.label}</span>
                          {isActive && (
                            <span className="text-[12px] text-violet-600">
                              ✓
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

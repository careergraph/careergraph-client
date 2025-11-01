// Modal.jsx
import { useEffect, useId } from "react";
import { X } from "lucide-react";

export default function Modal({ open, title, children, footer, onCloseRequest }) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onCloseRequest?.("esc");
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onCloseRequest]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <button className="absolute inset-0 bg-black/40" onClick={() => onCloseRequest?.("backdrop")} />
      <div className="relative w-full rounded-t-2xl bg-white shadow-xl sm:w-[720px] sm:rounded-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 id={titleId} className="text-xl font-semibold">{title}</h3>
          <button className="rounded-full p-2 hover:bg-slate-100" onClick={() => onCloseRequest?.("x")}>
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-auto p-6">{children}</div>
        <div className="flex items-center justify-between gap-3 border-t px-6 py-4">
          {footer}
        </div>
      </div>
    </div>
  );
}

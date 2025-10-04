// LanguageCard.jsx
import { useEffect, useId, useMemo, useState } from "react";
import { Plus, Pencil, X, Trash2, ChevronDown } from "lucide-react";

/* ---------- constants ---------- */
const LANGS = [
  "Tiếng Anh",
  "Tiếng Nhật",
  "Tiếng Hàn",
  "Tiếng Trung",
  "Tiếng Pháp",
  "Tiếng Đức",
  "Tiếng Tây Ban Nha",
  "Khác",
];
const LEVELS = ["Sơ cấp", "Trung cấp", "Cao cấp"];

/* ---------- small helpers ---------- */
const classx = (...a) => a.filter(Boolean).join(" ");
const emptyRow = () => ({ id: crypto.randomUUID(), name: "", level: "Sơ cấp" });

/* ---------- Modal ---------- */
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close" />
      <div className="relative w-full rounded-t-2xl bg-white shadow-xl sm:w-[760px] sm:rounded-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 id={titleId} className="text-xl font-semibold">{title}</h3>
          <button className="rounded-full p-2 hover:bg-slate-100" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-auto p-6">{children}</div>
        <div className="flex items-center justify-between gap-3 border-t px-6 py-4">{footer}</div>
      </div>
    </div>
  );
}

/* ---------- Row editor ---------- */
function LangRow({ row, onChange, onRemove, showDivider, canRemove  }) {
  return (
    <div className={classx("pb-5", showDivider && "mb-5 border-b")}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Tên ngoại ngữ */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Tên ngoại ngữ <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <select
              value={row.name}
              onChange={(e) => onChange({ ...row, name: e.target.value })}
              className="w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-violet-600"
            >
              <option value="">Chọn ngoại ngữ</option>
              {LANGS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
          </div>
        </div>

        {/* Mức độ */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Mức độ <span className="text-red-600">*</span>
          </label>
          <div className="flex gap-2">
            {LEVELS.map((lv) => {
              const active = row.level === lv;
              return (
                <button
                  type="button"
                  key={lv}
                  onClick={() => onChange({ ...row, level: lv })}
                  className={classx(
                    "rounded-full px-4 py-2 text-sm",
                    active
                      ? "bg-violet-50 font-semibold text-violet-700 ring-1 ring-violet-600"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {lv}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Remove row */}
      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove(row.id)}
          className="mt-4 inline-flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          <Trash2 size={16} /> Xoá
        </button>
      )}
    </div>
  );
}

/* ---------- Form ---------- */
function LanguagesForm({ initialValue = [], onSubmit }) {
  const [rows, setRows] = useState(
    initialValue.length ? initialValue.map((r) => ({ id: crypto.randomUUID(), ...r })) : [emptyRow()]
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialValue.length) {
      setRows(initialValue.map((r) => ({ id: crypto.randomUUID(), ...r })));
    }
  }, [initialValue]);

  const updateRow = (next) => setRows((arr) => arr.map((r) => (r.id === next.id ? next : r)));
  const removeRow = (id) => setRows((arr) => (arr.length > 1 ? arr.filter((r) => r.id !== id) : arr));
  const addRow = () => setRows((arr) => [...arr, emptyRow()]);

  const submit = (e) => {
    e?.preventDefault?.();
    // validate
    for (const r of rows) {
      if (!r.name || !r.level) {
        setError("Vui lòng chọn đầy đủ Tên ngoại ngữ và Mức độ.");
        return;
      }
    }
    setError("");
    // chuẩn hoá data trước khi trả ra
    onSubmit?.(rows.map(({ id, ...rest }) => rest));
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {rows.map((r, i) => (
        <LangRow
          key={r.id}
          row={r}
          onChange={updateRow}
          onRemove={removeRow}
          showDivider={i !== rows.length - 1}
          canRemove={rows.length >= 2}
        />
      ))}

      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-2 text-violet-700 hover:text-violet-800"
      >
        <Plus size={18} /> Thêm ngoại ngữ
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* submit ẩn để bấm từ footer */}
      <button id="__langs_submit" type="submit" className="hidden" />
    </form>
  );
}

/* ---------- Card chính ---------- */
export default function LanguageCard({ value = [], onChange }) {
  const [items, setItems] = useState(value);
  const [open, setOpen] = useState(false);
  // const canDelete = modal.mode === "edit" && items.length >= 2;

  useEffect(() => setItems(value), [value]);
  const setAndEmit = (next) => { setItems(next); onChange?.(next); };

  const save = (next) => { setAndEmit(next); setOpen(false); };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-neutral-900">Ngoại ngữ</h3>
          {items.length === 0 && (
            <p className="mt-2 text-sm text-slate-500">
              Thêm thông tin khả năng ngoại ngữ để tăng tỷ lệ cạnh tranh
            </p>
          )}
        </div>
        {items.length === 0 ? (
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 text-violet-700 hover:text-violet-800"
          >
            <Plus size={18} /> Thêm
          </button>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="opacity-70 transition hover:opacity-100"
            aria-label="Sửa"
          >
            <Pencil size={18} />
          </button>
        )}
      </div>

      {/* list summary */}
      {items.length > 0 && (
        <div className="mt-4 space-y-2">
          {items.map((it, idx) => (
            <p key={idx} className="text-[15px]">
              <span className="font-medium">{it.name}</span>
              <span className="text-slate-500"> • {it.level}</span>
            </p>
          ))}
        </div>
      )}

      {/* Popup */}
      <Modal
        open={open}
        title="Ngoại ngữ"
        onClose={() => setOpen(false)}
        footer={
          <>
            <span />
            <div className="ml-auto flex gap-3">
              <button className="rounded-xl border px-4 py-2" onClick={() => setOpen(false)}>
                Hủy
              </button>
              <button
                className="rounded-xl bg-violet-700 px-4 py-2 font-semibold text-white hover:bg-violet-800"
                onClick={() => document.getElementById("__langs_submit")?.click()}
              >
                Lưu thông tin
              </button>
            </div>
          </>
        }
      >
        <LanguagesForm initialValue={items} onSubmit={save} />
      </Modal>
    </section>
  );
}

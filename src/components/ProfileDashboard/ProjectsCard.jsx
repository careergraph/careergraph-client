// ProjectsCard.jsx
import { useEffect, useId, useState } from "react";
import { Plus, Pencil, X, Calendar } from "lucide-react";

/* ---------- Utils ---------- */
const pad2 = (n) => String(n).padStart(2, "0");
const fmtMonth = (yyyyMM) => {
  if (!yyyyMM) return "";
  const [y, m] = yyyyMM.split("-");
  return `${pad2(+m)}/${y}`;
};
const validRange = (s, e) => !!s && !!e && s <= e;

/* ---------- Modal (onClose) ---------- */
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
      <div className="relative w-full rounded-t-2xl bg-white shadow-xl sm:w-[720px] sm:rounded-2xl">
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

/* ---------- Form trong popup ---------- */
function ProjectForm({ initialValue, onSubmit }) {
  const [name, setName] = useState(initialValue?.name || "");
  const [start, setStart] = useState(initialValue?.start || "");
  const [end, setEnd] = useState(initialValue?.end || "");
  const [desc, setDesc] = useState(initialValue?.desc || "");
  const [error, setError] = useState("");

  const submit = (e) => {
    e?.preventDefault?.();
    if (!name.trim() || !start || !end) {
      setError("Vui lòng nhập đủ các trường bắt buộc (*)");
      return;
    }
    if (!validRange(start, end)) {
      setError("Thời gian kết thúc phải ≥ thời gian bắt đầu.");
      return;
    }
    setError("");
    onSubmit?.({
      ...initialValue,
      name: name.trim(),
      start,
      end,
      desc: desc.trim(),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Tên dự án/thành tựu */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Tên dự án/thành tựu <span className="text-red-600">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên dự án/thành tựu"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-600"
        />
      </div>

      {/* Thời gian */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Thời gian bắt đầu <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <Calendar size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              type="month"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="MM/YYYY"
              className="w-full rounded-xl border px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-violet-600"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Thời gian kết thúc <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <Calendar size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              type="month"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              placeholder="MM/YYYY"
              className="w-full rounded-xl border px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-violet-600"
            />
          </div>
        </div>
      </div>

      {/* Mô tả */}
      <div>
        <label className="mb-1 block text-sm font-medium">Mô tả chi tiết</label>
        <textarea
          rows={5}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Mô tả chi tiết các dự án/thành tựu"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-600"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button id="__project_submit" type="submit" className="hidden" />
    </form>
  );
}

/* ---------- Card chính ---------- */
export default function ProjectsCard({ value = [], onChange }) {
  const [items, setItems] = useState(value);
  const [modal, setModal] = useState({ open: false, mode: "create", editing: null });
  const [confirm, setConfirm] = useState({ open: false, id: null });

  useEffect(() => setItems(value), [value]);

  const setAndEmit = (next) => { setItems(next); onChange?.(next); };

  const openCreate = () => setModal({ open: true, mode: "create", editing: null });
  const openEdit = (it) => setModal({ open: true, mode: "edit", editing: it });
  const closeModal = () => setModal({ open: false, mode: "create", editing: null });

  const upsert = (payload) => {
    if (modal.mode === "create") {
      setAndEmit([{ ...payload, id: crypto.randomUUID() }, ...items]);
    } else {
      setAndEmit(items.map((it) => (it.id === payload.id ? payload : it)));
    }
    closeModal();
  };

  const removeById = (id) => setAndEmit(items.filter((it) => it.id !== id));

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-neutral-900">Dự án/thành tựu</h3>
          {items.length === 0 && (
            <p className="mt-2 text-sm text-slate-500">
              Nổi bật hơn trong mắt nhà tuyển dụng với các dự án, thành tựu
            </p>
          )}
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 text-violet-700 hover:text-violet-800"
        >
          <Plus size={18} /> Thêm
        </button>
      </div>

      {/* List */}
      {items.length > 0 && (
        <div className="mt-4 space-y-5">
          {items.map((it) => (
            <article key={it.id} className="group">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="font-semibold">{it.name}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {fmtMonth(it.start)} - {fmtMonth(it.end)}
                  </p>
                  {it.desc && <p className="mt-2 whitespace-pre-wrap text-[15px]">{it.desc}</p>}
                </div>
                <button
                  onClick={() => openEdit(it)}
                  className="opacity-60 transition group-hover:opacity-100"
                  aria-label="Sửa"
                >
                  <Pencil size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Modal Thêm/Sửa */}
      <Modal
        open={modal.open}
        title="Dự án/thành tựu"
        onClose={closeModal}
        footer={
          <>
            {/* Xoá chỉ xuất hiện khi edit */}
            {modal.mode === "edit" ? (
              <button
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-red-700 hover:bg-red-100"
                onClick={() => {
                  closeModal(); // ẩn form trước
                  setConfirm({ open: true, id: modal.editing.id }); // mở confirm
                }}
              >
                Xoá dự án/thành tựu
              </button>
            ) : (
              <span />
            )}
            <div className="ml-auto flex gap-3">
              <button className="rounded-xl border px-4 py-2" onClick={closeModal}>
                Hủy
              </button>
              <button
                className="rounded-xl bg-violet-700 px-4 py-2 font-semibold text-white hover:bg-violet-800"
                onClick={() => document.getElementById("__project_submit")?.click()}
              >
                Lưu thông tin
              </button>
            </div>
          </>
        }
      >
        <ProjectForm
          key={modal.mode + (modal.editing?.id || "")}
          initialValue={modal.editing}
          onSubmit={upsert}
        />
      </Modal>

      {/* Modal xác nhận xoá */}
      <Modal
        open={confirm.open}
        title="Xác nhận xóa"
        onClose={() => setConfirm({ open: false, id: null })}
        footer={
          <>
            <span />
            <div className="ml-auto flex gap-3">
              <button
                className="rounded-xl border px-4 py-2"
                onClick={() => setConfirm({ open: false, id: null })}
              >
                Hủy
              </button>
              <button
                className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                onClick={() => {
                  if (confirm.id) removeById(confirm.id);
                  setConfirm({ open: false, id: null });
                }}
              >
                Xóa
              </button>
            </div>
          </>
        }
      >
        <p className="text-[15px] text-slate-700">
          Bạn có chắc muốn xóa mục này? Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </section>
  );
}

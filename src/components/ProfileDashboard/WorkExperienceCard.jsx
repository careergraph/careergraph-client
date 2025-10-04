// WorkExperienceCard.jsx
import { useId, useMemo, useState, useEffect } from "react";
import { Plus, Pencil, X, Trash2, Calendar } from "lucide-react";

/* ------------- utils ------------- */
const pad2 = (n) => String(n).padStart(2, "0");
const fmtMonth = (s /* "2025-02" or "" */) => {
  if (!s) return "";
  const [y, m] = s.split("-");
  return `${pad2(+m)}/${y}`;
};
// đảm bảo start <= end (nếu không current)
const validRange = ({ start, end, isCurrent }) => {
  if (!start) return false;
  if (isCurrent) return true;
  if (!end) return false;
  return start <= end;
};

/* ------------- Modal ------------- */
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
      <div className="relative w-full rounded-t-2xl bg-white shadow-xl sm:rounded-2xl sm:w-[720px]">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 id={titleId} className="text-xl font-semibold">{title}</h3>
          <button className="rounded-full p-2 hover:bg-slate-100" onClick={onClose} aria-label="Đóng">
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

/* ------------- Form trong popup ------------- */
function WorkExpForm({ mode, initialValue, onSubmit, onCancel, onDelete }) {
  const [company, setCompany] = useState(initialValue?.company || "");
  const [title, setTitle] = useState(initialValue?.title || "");
  const [isCurrent, setIsCurrent] = useState(initialValue?.isCurrent || false);
  const [start, setStart] = useState(initialValue?.start || ""); // type="month" -> "YYYY-MM"
  const [end, setEnd] = useState(initialValue?.end || "");
  const [desc, setDesc] = useState(initialValue?.desc || "");
  const [error, setError] = useState("");
  

  useEffect(() => {
    if (isCurrent) setEnd("");
  }, [isCurrent]);

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    // validate cơ bản
    if (!company.trim() || !title.trim() || !start || (!isCurrent && !end)) {
      setError("Vui lòng nhập đủ các trường bắt buộc (*)");
      return;
    }
    if (!validRange({ start, end, isCurrent })) {
      setError("Khoảng thời gian không hợp lệ (Thời gian kết thúc phải ≥ thời gian bắt đầu).");
      return;
    }
    setError("");
    onSubmit?.({
      ...initialValue,
      company: company.trim(),
      title: title.trim(),
      isCurrent,
      start,
      end: isCurrent ? "" : end,
      desc: desc.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Tên công ty */}
      <div>
        <label className="mb-1 block text-sm font-medium">Tên công ty <span className="text-red-600">*</span></label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Nhập tên công ty"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-600"
        />
      </div>

      {/* Vị trí */}
      <div>
        <label className="mb-1 block text-sm font-medium">Vị trí công việc <span className="text-red-600">*</span></label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập vị trí công việc"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-600"
        />
      </div>

      {/* hiện đang làm */}
      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          className="accent-violet-700"
          checked={isCurrent}
          onChange={(e) => setIsCurrent(e.target.checked)}
        />
        Tôi đang làm việc ở đây
      </label>

      {/* Thời gian */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Thời gian bắt đầu <span className="text-red-600">*</span></label>
          <div className="relative">
            <Calendar size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              type="month"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-violet-600"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Thời gian kết thúc <span className="text-red-600">*</span>
          </label>

          {/* Nếu đang làm việc: KHÔNG render input, chỉ render chữ "Hiện tại" */}
          {isCurrent ? (
            <div
              className="w-full rounded-xl border px-4 py-3 bg-slate-100 text-slate-600 select-none"
              aria-label="Thời gian kết thúc"
            >
              Hiện tại
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Mô tả */}
      <div>
        <label className="mb-1 block text-sm font-medium">Mô tả trách nhiệm công việc <span className="text-red-600">*</span></label>
        <textarea
          rows={4}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Mô tả các công việc đã thực hiện trong khi làm việc tại công ty"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-600"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Footer của modal truyền từ ngoài: ở đây chỉ render nút 'Xóa' khi edit */}
      <div className="hidden" /> {/* giữ layout */}
    </form>
  );
}

/* ------------- Card + List + Popup ------------- */
export default function WorkExperienceCard({ value = [], onChange, className }) {
  // mock data mẫu; đổi sang dữ liệu thực từ props/API tùy bạn
  const [items, setItems] = useState([
    {
      id: crypto.randomUUID(),
      company: "Công ty B",
      title: "BE",
      isCurrent: false,
      start: "2023-02",
      end: "2025-01",
      desc: "phát triển",
    },
  ]);
  useEffect(() => {
    setItems(value);
  }, [value]);

  const [modal, setModal] = useState({ open: false, mode: "create", editing: null });

  const openCreate = () => setModal({ open: true, mode: "create", editing: null });
  const openEdit = (it) => setModal({ open: true, mode: "edit", editing: it });
  const closeModal = () => setModal({ open: false, mode: "create", editing: null });
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const upsert = (payload) => {
    let next;
    if (items.some((it) => it.id === payload.id)) {
      next = items.map((it) => (it.id === payload.id ? payload : it));
    } else {
      next = [{ ...payload, id: crypto.randomUUID() }, ...items];
    }
    setItems(next);
    onChange?.(next);
  };

  const remove = (id) => {
    const next = items.filter((it) => it.id !== id);
    setItems(next);
    onChange?.(next);
  };

  return (
    <section className={`rounded-2xl bg-white p-4 shadow-sm sm:p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-neutral-900">Kinh nghiệm làm việc</h3>
          {items.length === 0 && (
            <p className="mt-2 text-sm text-slate-500">Giúp nhà tuyển dụng hiểu về kinh nghiệm làm việc của bạn</p>
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
                  <p className="font-semibold">{it.title}</p>
                  <p className="text-slate-600">{it.company}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {fmtMonth(it.start)} - {it.isCurrent ? "Hiện tại" : fmtMonth(it.end)}
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

      {/* Modal */}
      <Modal
        open={modal.open}
        title="Kinh nghiệm làm việc"
        onClose={closeModal}
        footer={
          <>
            {/* Nút Xóa chỉ hiển thị khi chỉnh sửa */}
            {modal.mode === "edit" ? (
              <button
                onClick={() => {
                  // 1) đóng popup điền/sửa
                  // closeModal();
                  // 2) mở popup xác nhận & nhớ id cần xóa
                  setConfirm({ open: true, id: modal.editing.id });
                }}
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-red-700 hover:bg-red-100"
              >
                Xóa kinh nghiệm
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
                onClick={() => {
                  const formEl = document.querySelector("#__workexp_form_submit");
                  formEl?.click();
                }}
              >
                Lưu thông tin
              </button>
            </div>
          </>
        }
      >
        {/* “key” để reset form khi đổi mode */}
        <InnerFormShell
          key={modal.mode + (modal.editing?.id || "")}
          mode={modal.mode}
          initialValue={modal.editing}
          onSubmit={upsert}
        />
      </Modal>

      {/* Modal xác nhận xóa */}
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
                  if (confirm.id) remove(confirm.id);
                  setConfirm({ open: false, id: null });
                  closeModal();
                }}
              >
                Xóa
              </button>
            </div>
          </>
        }
      >
        <p className="text-[15px] text-slate-700">
          Bạn có chắc muốn xóa mục kinh nghiệm này? Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </section>
  );
}

/* ------------- Shell để dùng submit ẩn (điều khiển từ footer) ------------- */
function InnerFormShell({ mode, initialValue, onSubmit }) {
  const handleSubmit = (payload) => onSubmit(payload);
  return (
    <>
      <WorkExpForm
        mode={mode}
        initialValue={initialValue}
        onSubmit={handleSubmit}
      />
      {/* nút submit ẩn để footer “Lưu thông tin” click tới */}
      <button id="__workexp_form_submit" type="button" className="hidden" onClick={() => {
        const el = document.querySelector("form"); // form hiện tại trong modal
        el?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }} />
    </>
  );
}

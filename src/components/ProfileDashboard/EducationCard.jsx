// EducationCard.jsx
import { useEffect, useId, useState } from "react";
import { Plus, Pencil, X, Trash2, Calendar, ChevronDown } from "lucide-react";


/* ---------- utils ---------- */
const pad2 = (n) => String(n).padStart(2, "0");
const fmtYear = (y) => (y ? String(y) : "");
const validRange = (s, e) => !!s && !!e && Number(s) <= Number(e);
const DEGREE_OPTIONS = ["Trung cấp", "Cao đẳng", "Đại học", "Sau đại học", "Khác"];

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

/* ---------- Form ---------- */
function EducationForm({ mode, initialValue, onSubmit }) {
  const [school, setSchool] = useState(initialValue?.school || "");
  const [startYear, setStartYear] = useState(initialValue?.startYear || "");
  const [endYear, setEndYear] = useState(initialValue?.endYear || "");
  const [major, setMajor] = useState(initialValue?.major || "");
  const [degree, setDegree] = useState(initialValue?.degree || "");
  const [desc, setDesc] = useState(initialValue?.desc || "");
  const [error, setError] = useState("");



  const submit = (e) => {
    e?.preventDefault?.();
    if (!school.trim() || !startYear || !endYear) {
      setError("Vui lòng nhập đủ các trường bắt buộc (*)");
      return;
    }
    if (!validRange(startYear, endYear)) {
      setError("Năm kết thúc phải lớn hơn hoặc bằng năm bắt đầu.");
      return;
    }
    setError("");
    onSubmit?.({
      ...initialValue,
      school: school.trim(),
      startYear: String(startYear),
      endYear: String(endYear),
      major: major.trim(),
      degree: degree.trim(),
      desc: desc.trim(),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Tên trường */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Tên trường <span className="text-red-600">*</span>
        </label>
        <input
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          placeholder="Nhập tên trường của bạn"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-600"
        />
      </div>

      {/* Năm bắt đầu - kết thúc */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Năm bắt đầu <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <Calendar size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              type="number"
              inputMode="numeric"
              min="1900"
              max="2100"
              placeholder="YYYY"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
              className="w-full rounded-xl border px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-violet-600"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Năm kết thúc <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <Calendar size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              type="number"
              inputMode="numeric"
              min="1900"
              max="2100"
              placeholder="YYYY"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
              className="w-full rounded-xl border px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-violet-600"
            />
          </div>
        </div>
      </div>

      {/* Major - Degree */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Chuyên ngành đào tạo</label>
          <input
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            placeholder="Nhập chuyên ngành đào tạo"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-600"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Bằng cấp</label>
          <div className="relative">
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-violet-600"
            >
              <option value="">Chọn loại bằng cấp</option>
              {DEGREE_OPTIONS.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60" />
          </div>
        </div>
      </div>

      {/* Mô tả */}
      <div>
        <label className="mb-1 block text-sm font-medium">Mô tả chi tiết</label>
        <textarea
          rows={4}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Mô tả chi tiết quá trình học tập"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-600"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* submit ẩn để bấm từ footer */}
      <button id="__edu_submit" type="submit" className="hidden" />
    </form>
  );
}

/* ---------- Card chính ---------- */
export default function EducationCard({ value = [], onChange }) {
  const [items, setItems] = useState(value);
  const [modal, setModal] = useState({ open: false, mode: "create", editing: null });
  const [confirm, setConfirm] = useState({ open: false, id: null });

  useEffect(() => setItems(value), [value]);

  const openCreate = () => setModal({ open: true, mode: "create", editing: null });
  const openEdit = (it) => setModal({ open: true, mode: "edit", editing: it });
  const closeModal = () => setModal({ open: false, mode: "create", editing: null });

  const setAndEmit = (next) => {
    setItems(next);
    onChange?.(next);
  };

  const upsert = (payload) => {
    if (modal.mode === "create") {
      const next = [{ ...payload, id: crypto.randomUUID() }, ...items];
      setAndEmit(next);
    } else {
      const next = items.map((it) => (it.id === payload.id ? payload : it));
      setAndEmit(next);
    }
    closeModal();
  };

  const removeById = (id) => {
    const next = items.filter((it) => it.id !== id);
    setAndEmit(next);
  };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-neutral-900">Học vấn</h3>
          {items.length === 0 && (
            <p className="mt-2 text-sm text-slate-500">Giúp nhà tuyển dụng biết được trình độ học vấn của bạn</p>
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
                  <p className="text-[16px] font-semibold">{it.school}</p>
                  {it.major && <p className="text-slate-600">{it.major}</p>}
                  <p className="mt-1 text-sm text-slate-500">
                    {it.degree ? `${it.degree} • ` : ""}{fmtYear(it.startYear)} - {fmtYear(it.endYear)}
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

      {/* Modal form Thêm/Sửa */}
      <Modal
        open={modal.open}
        title="Học vấn"
        onClose={closeModal}
        footer={
          <>
            {/* Nút Xóa chỉ xuất hiện khi edit */}
            {modal.mode === "edit" ? (
              <button
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-red-700 hover:bg-red-100"
                onClick={() => {
                  // đóng form & mở confirm
                  closeModal();
                  setConfirm({ open: true, id: modal.editing.id });
                }}
              >
                Xoá học vấn
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
                onClick={() => document.getElementById("__edu_submit")?.click()}
              >
                Lưu thông tin
              </button>
            </div>
          </>
        }
      >
        <EducationForm
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
                  if (confirm.id) removeById(confirm.id);
                  setConfirm({ open: false, id: null });
                  // đảm bảo form (nếu còn mở) cũng đóng
                }}
              >
                Xóa
              </button>
            </div>
          </>
        }
      >
        <p className="text-[15px] text-slate-700">
          Bạn có chắc muốn xóa mục học vấn này? Hành động này không thể hoàn tác.
        </p>
      </Modal>
    </section>
  );
}

// EducationCard.jsx
import { useEffect, useId, useRef, useState } from "react";
import { Plus, Pencil, X, Trash2, Calendar, ChevronDown } from "lucide-react";
import { useUserStore } from "~/stores/userStore";
import { EducationAPI } from "~/services/api/education";
import { UserAPI } from "~/services/api/user";

/* ---------- utils ---------- */
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
function EducationForm({initialValue, onSubmit }) {
  const [officialName, setOfficialName] = useState(initialValue?.officialName || "");
  const [universityId, setUniversityId] = useState(initialValue?.universityId || "")
  const [startDate, setStartDate] = useState(initialValue?.startDate || "");
  const [endDate,setEndDate] = useState(initialValue?.endDate || "");
  const [major, setMajor] = useState(initialValue?.major || "");
  const [degreeTitle, setDegree] = useState(initialValue?.degreeTitle || "");
  const [description, setDescription] = useState(initialValue?.description || "");
  const [error, setError] = useState("");   




  const [options, setOptions] = useState([]);        // [{id, name}]
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);    // điều hướng bằng keyboard
  const debounceRef = useRef(null);

  const formRef = useRef(null);
  const dropdownWrapRef = useRef(null);

  const lastReqIdRef = useRef(0);


  useEffect(() => {
    const onClickOutside = (e) => {
      if (!dropdownWrapRef.current) return;
      if (!dropdownWrapRef.current.contains(e.target)) {
        setOpen(false);
        setHighlight(-1);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);


  const fetchUniversities = async (q) => {
      const query = q?.trim() || "";
      if (!query) {
        setOptions([]);
        setOpen(false);
        return;
      } 
  
      // (tuỳ chọn) chỉ tìm khi đủ 2 ký tự:
      if (query.length < 2) {
        setOptions([]);
        setOpen(false);
        return;
      }
  
      const reqId = ++lastReqIdRef.current;
      try {
        setLoading(true);
        const res = await EducationAPI.getLookupUniversities(query);
        const map = res?.data ?? {};
        // chỉ mở dropdown khi vẫn là request mới nhất và có kết quả
        if (reqId === lastReqIdRef.current) {
          setOptions(map);
          setOpen(map.length > 0); 
        }
      } catch {
        if (reqId === lastReqIdRef.current) {
          setOptions([]);
          setOpen(false);
        }
      } finally {
        if (reqId === lastReqIdRef.current) setLoading(false);
      }
    };

  const pickOption = (opt) => {
    setOfficialName(opt?.name || "");
    setUniversityId(opt?.id ?? null);
    setOpen(false);
    setHighlight(-1);
  };

  const onUniversityKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (highlight >= 0 && options[highlight]) {
        e.preventDefault();
        pickOption(options[highlight]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlight(-1);
    }
  };

  const submit = (e) => {
    e?.preventDefault?.();
    if (!officialName.trim() || !startDate || !endDate) {
      setError("Vui lòng nhập đủ các trường bắt buộc (*)");
      return;
    }
    if (!validRange(startDate, endDate)) {
      setError("Năm kết thúc phải lớn hơn hoặc bằng năm bắt đầu.");
      return;
    }

    setError("");
    onSubmit?.({
      ...initialValue,
      universityId: universityId ?? null,
      officialName: officialName.trim(),
      startDate: String(startDate),
      endDate: String(endDate),
      major: major.trim(),
      degreeTitle: degreeTitle.trim(),
      description: description.trim(),
    });
  };


  const onUniversityInputChange = (value) => {
    setOfficialName(value);
    setUniversityId(null); // người dùng gõ => coi như đang chỉnh tên mới cho đến khi chọn lại 1 gợi ý
    setOpen(false);
    setHighlight(-1);

    // debounce 300ms
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchUniversities(value), 1500);
  };

  useEffect(() => {
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, []);


  return (
    <form onSubmit={submit} className="space-y-5" ref={formRef}>
      {/* Tên trường */}
      <div className="relative" ref={dropdownWrapRef}>
        <label className="mb-1 block text-sm font-medium">
          Tên trường <span className="text-red-600">*</span>
        </label>
        <input
          value={officialName}
          onChange={(e) => onUniversityInputChange(e.target.value)}
          onKeyDown={onUniversityKeyDown}
          placeholder="Nhập tên trường của bạn"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-600"
          aria-autocomplete="list"
          aria-expanded={open}
          autoComplete="off"
        />

        {open && options.length > 0 && (
        <div
          className="absolute left-0 right-0 z-20 -mt-px max-h-64 w-full overflow-auto
                    rounded-xl border bg-white shadow-lg border-violet-500"
        >
          {options.map((opt, idx) => (
            <button
              key={opt.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pickOption(opt)}
              className={
                "block w-full cursor-pointer px-4 py-2 text-left text-sm hover:bg-violet-50 " +
                (idx === highlight ? "bg-violet-50" : "")
              }
            >
              {opt.name}
            </button>
          ))}
        </div>
      )}
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
              value={startDate}
              onChange={(e) => setStartDate(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
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
              value={endDate}
              onChange={(e) => setEndDate(e.target.value.replace(/[^\d]/g, "").slice(0, 4))}
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
              value={degreeTitle}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
export default function EducationCard() {

  const educations = useUserStore((state) => state?.user?.educations)

  // const [items, setItems] = useState(value);
  const [modal, setModal] = useState({ open: false, mode: "create", editing: null });
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const openCreate = () => setModal({ open: true, mode: "create", editing: null });
  const openEdit = (it) => setModal({ open: true, mode: "edit", editing: it });
  const closeModal = () => setModal({ open: false, mode: "create", editing: null });


  const upsert = async(payload) => {
    if (modal.mode === "create") {
      const res = await UserAPI.addEducation(payload)
      useUserStore.getState().updateUserPart({ educations: res?.data })
    } else {
      const res = await UserAPI.updateEducation({educationId: payload.id, payload:payload})
      useUserStore.getState().updateUserPart({ educations: res?.data })
      
    }
    closeModal();
  };

  const removeById = async (id) => {
    const res = await UserAPI.removeEducation(id)
    useUserStore.getState().updateUserPart({ educations: res?.data })
  };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-neutral-900">Học vấn</h3>
          {educations?.length === 0 && (
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
      {educations?.length > 0 && (
        <div className="mt-4 space-y-5">
          {educations?.map((it) => (
            <article key={it.id} className="group">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-[16px] font-semibold">{it.officialName}</p>
                  {it.major && <p className="text-slate-600">{it.major}</p>}
                  <p className="mt-1 text-sm text-slate-500">
                    {it.degreeTitle ? `${it.degreeTitle} • ` : ""}{fmtYear(it.startDate)} - {fmtYear(it.endDate)}
                  </p>
                  {it.description && <p className="mt-2 whitespace-pre-wrap text-[15px]">{it.description}</p>}
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

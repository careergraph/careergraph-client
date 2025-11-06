import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
import RightDrawer from "./RightDrawer";
import { useUserStore } from "~/store/userStore";
import { UserAPI } from "~/services/api/user";
import { CompanyAPI } from "~/services/api/company";
import { shallow } from "zustand/shallow";

/* ---------------- utils ---------------- */
const pad2 = (n) => String(n).padStart(2, "0");
const fmtMonth = (s /* "2025-02" or "" */) => {
  if (!s) return "";
  const [y, m] = s.split("-");
  return `${pad2(+m)}/${y}`;
};
const validRange = ({ startDate, endDate, isCurrent }) => {
  if (!startDate) return false;
  if (isCurrent) return true;
  if (!endDate) return false;
  return startDate <= endDate;
};

/* ---------------- Form ---------------- */
function WorkExpForm({ mode, initialValue, onSubmit, onCancel, onDelete }) {
  const [companyName, setCompanyName] = useState(initialValue?.companyName || "");
  const [companyId, setCompanyId] = useState(initialValue?.companyId ?? null); // <== thêm
  const [jobTitle, setJobTitle] = useState(initialValue?.jobTitle || "");
  const [isCurrent, setIsCurrent] = useState(initialValue?.isCurrent || false);
  const [startDate, setStartDate] = useState(initialValue?.startDate || ""); // "YYYY-MM"
  const [endDate, setEndDate] = useState(initialValue?.endDate || "");
  const [description, setDescription] = useState(initialValue?.description || "");
  const [error, setError] = useState("");
  

  // gợi ý công ty
  const [options, setOptions] = useState([]);        // [{id, name}]
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);    // điều hướng bằng keyboard
  const debounceRef = useRef(null);
  const formRef = useRef(null);
  const dropdownWrapRef = useRef(null);

  const lastReqIdRef = useRef(0);

  useEffect(() => {
    if (isCurrent) setEndDate("");
  }, [isCurrent]);

  // đóng dropdown khi click ra ngoài
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

  const fetchCompanies = async (q) => {
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
      const res = await CompanyAPI.getLookupCompany(query);
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

  const onCompanyInputChange = (value) => {
    setCompanyName(value);
    setCompanyId(null); // người dùng gõ => coi như đang chỉnh tên mới cho đến khi chọn lại 1 gợi ý
    setOpen(false);
    setHighlight(-1);

    // debounce 300ms
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchCompanies(value), 1500);
  };

  useEffect(() => {
    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, []);

  const pickOption = (opt) => {
    setCompanyName(opt?.name || "");
    setCompanyId(opt?.id ?? null);
    setOpen(false);
    setHighlight(-1);
  };

  const onCompanyKeyDown = (e) => {
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

  const handleSubmit = (e) => {
    e?.preventDefault?.();

    if (!companyName.trim() || !jobTitle.trim() || !startDate || (!isCurrent && !endDate)) {
      setError("Vui lòng nhập đủ các trường bắt buộc (*)");
      return;
    }
    if (!validRange({ startDate, endDate, isCurrent })) {
      setError("Khoảng thời gian không hợp lệ (Thời gian kết thúc phải ≥ thời gian bắt đầu).");
      return;
    }

    setError("");
    onSubmit?.({
      ...initialValue,
      // YÊU CẦU: nếu người dùng chọn từ gợi ý -> gửi id + name
      // nếu là tên mới -> id = null, name = companyName
      companyId: companyId ?? null,
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      isCurrent,
      startDate,
      endDate: isCurrent ? "" : endDate,
      description: description.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" ref={formRef}>
      {/* Tên công ty (kèm dropdown gợi ý) */}
      <div className="relative" ref={dropdownWrapRef}>
      <label className="mb-1 block text-sm font-medium">
        Tên công ty <span className="text-red-600">*</span>
      </label>

      <input
        value={companyName}
        onChange={(e) => onCompanyInputChange(e.target.value)}
        onKeyDown={onCompanyKeyDown}
        placeholder="Nhập tên công ty"
        className={
          "w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-600 " +
          (open ? "rounded-b-none border-b-0" : "")
        }
        aria-autocomplete="list"
        aria-expanded={open}
        autoComplete="off"
      />

      {/* CHỈ render dropdown khi có kết quả */}
      {open && options.length > 0 && (
        <div
          className="absolute left-0 right-0 z-20 -mt-px max-h-64 w-full overflow-auto
                    rounded-xl border bg-white shadow-lg mt-2 border-violet-500"
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

      {/* Vị trí */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Vị trí công việc <span className="text-red-600">*</span>
        </label>
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
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
          <label className="mb-1 block text-sm font-medium">
            Thời gian bắt đầu <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <Calendar
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60"
            />
            <input
              type="month"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-violet-600"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Thời gian kết thúc {!isCurrent && <span className="text-red-600">*</span>}
          </label>
          {isCurrent ? (
            <div
              className="w-full select-none rounded-xl border bg-slate-100 px-4 py-3 text-slate-600"
              aria-label="Thời gian kết thúc"
            >
              Hiện tại
            </div>
          ) : (
            <div className="relative">
              <Calendar
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 opacity-60"
              />
              <input
                type="month"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="MM/YYYY"
                className="w-full rounded-xl border px-4 py-3 pr-10 outline-none focus:ring-2 focus:ring-violet-600"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mô tả */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Mô tả trách nhiệm công việc <span className="text-red-600">*</span>
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả các công việc đã thực hiện trong khi làm việc tại công ty"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-600"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between gap-3 pt-2">
        {mode === "edit" ? (
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-red-700 hover:bg-red-100"
          >
            <Trash2 size={16} /> Xóa kinh nghiệm
          </button>
        ) : (
          <span />
        )}

        <div className="ml-auto flex gap-3">
          <button type="button" className="rounded-xl border px-4 py-2" onClick={onCancel}>
            Hủy
          </button>
          <button
            type="submit"
            className="rounded-xl bg-violet-700 px-4 py-2 font-semibold text-white hover:bg-violet-800"
          >
            Lưu thông tin
          </button>
        </div>
      </div>
    </form>
  );
}

/* ------------- Card + List + Popup ------------- */
export default function WorkExperienceCard({className }) {

  const experiences = useUserStore((s) => s.user?.experiences ?? [], shallow);

  const [modal, setModal] = useState({ open: false, mode: "create", editing: null });
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const openCreate = () => setModal({ open: true, mode: "create", editing: null });
  const openEdit = (it) => setModal({ open: true, mode: "edit", editing: it });
  const closeModal = () => setModal({ open: false, mode: "create", editing: null });

  const upsert = async (payload) => {
    if (payload?.id && experiences.some((it) => it.id === payload?.id)) {
      const res = await UserAPI.updateExperience({experienceId: payload.id, payload:payload})
      
      useUserStore.getState().updateUserPart({ experiences: res?.data })
    } else {
      const res = await UserAPI.addExperience(payload)
      useUserStore.getState().updateUserPart({ experiences: res?.data })
    }
    closeModal();
  };

  const remove = async (id) => {
    const res = await UserAPI.removeExperience(id)
    useUserStore.getState().updateUserPart({ experiences: res?.data })
  };


  return (
    <section className={`rounded-2xl bg-white p-4 shadow-sm sm:p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-neutral-900">Kinh nghiệm làm việc</h3>
          {experiences?.length === 0 && (
            <p className="mt-2 text-sm text-slate-500">
              Giúp nhà tuyển dụng hiểu về kinh nghiệm làm việc của bạn
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
      {experiences?.length > 0 && (
        <div className="mt-4 space-y-5">
          {experiences.map((it) => (
            <article key={it.id} className="group">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="font-semibold">{it.jobTitle}</p>
                  <p className="text-slate-600">{it.companyName}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {fmtMonth(it.startDate)} - {it.isCurrent ? "Hiện tại" : fmtMonth(it.endDate)}
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

      {/* Drawer nhập liệu (footer nằm trong form) */}
      <RightDrawer
        open={modal.open}
        onClose={closeModal}
        title="Kinh nghiệm làm việc"
      >
        <WorkExpForm
          mode={modal.mode}
          initialValue={modal.editing}
          onSubmit={upsert}
          onCancel={closeModal}
          onDelete={() => {
            setConfirm({ open: true, id: modal.editing?.id || null });
          }}
        />
      </RightDrawer>

      {/* Drawer xác nhận xóa */}
      <RightDrawer
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        title="Xác nhận xóa"
      >
        <p className="text-[15px] text-slate-700 mb-4">
          Bạn có chắc muốn xóa mục kinh nghiệm này? Hành động này không thể hoàn tác.
        </p>
        <div className="flex items-center justify-end gap-3">
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
      </RightDrawer>
    </section>
  );
}

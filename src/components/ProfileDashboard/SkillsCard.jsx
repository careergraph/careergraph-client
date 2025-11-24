"use client";
import { Pencil, Plus, X as XIcon } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import useDebounce from "~/hooks/useDebounce";
import useDirty from "~/hooks/useDirty";
import { SkillAPI } from "~/services/api/skill";
import { UserAPI } from "~/services/api/user";
import { convertStringSkills } from "~/services/mapper/profileMapper";
import { useUserStore } from "~/stores/userStore";

/* ---------- Modal ---------- */
function Modal({ open, title, onCloseRequest, children, footer }) {
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
      {/* PANEL: thêm max-h / min-h và flex-col */}
      <div
        className="
          relative flex w-full flex-col rounded-t-2xl bg-white shadow-xl
          sm:w-[720px] sm:rounded-2xl
          max-h-[calc(100vh-2rem)] sm:max-h-[90vh]   /* không vượt quá màn hình */
          min-h-[40vh] sm:min-h-[65vh]               /* CHÍNH LÀM PANEL CAO HƠN */
        "
      >
        {/* Header cố định */}
        <div className="flex flex-shrink-0 items-center justify-between border-b px-6 py-4">
          <h3 id={titleId} className="text-xl font-semibold">{title}</h3>
          <button className="rounded-full p-2 hover:bg-slate-100" onClick={() => onCloseRequest?.("x")}><XIcon size={18} /></button>
        </div>

        {/* Body chiếm toàn bộ khoảng trống giữa header & footer */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>

        {/* Footer cố định */}
        <div className="flex flex-shrink-0 items-center justify-between gap-3 border-t px-6 py-4">
          {footer}
        </div>
      </div>
    </div>
  );
}

function ConfirmLeaveModal({ open, onStay, onLeave }) {
  const titleId = useId();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onStay}></div>
      <div className="relative z-10 w-[520px] max-w-[92vw] rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 id={titleId} className="text-lg font-semibold">Bạn muốn thoát mà không lưu thông tin</h3>
          <button type="button" className="rounded-full p-2 hover:bg-slate-100" onClick={onStay}><XIcon size={18} /></button>
        </div>
        <div className="px-6 py-4 text-slate-600">Toàn bộ thông tin đã thay đổi sẽ không được lưu lại</div>
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button type="button" className="rounded-xl bg-violet-50 px-4 py-2 font-medium text-violet-700 hover:bg-violet-100" onClick={onStay}>Tiếp tục chỉnh sửa</button>
          <button type="button" className="rounded-xl bg-violet-700 px-4 py-2 font-semibold text-white hover:bg-violet-800" onClick={onLeave}>Thoát</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Form ---------- */
function SkillsForm({
  initialSkills = [],
  onSubmit,
  onChange,
  max = 20,
  placeholder = "Nhập kỹ năng",
}) {
  // ---------------- state ----------------
  const [input, setInput] = useState("");
  const [skills, setSkills] = useState([]);          // dạng [{ skillName }]
  const [error, setError] = useState("");
  const [suggests, setSuggests] = useState([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);

  // ---------------- helpers ----------------
  const toLabel = (s) =>
    typeof s === "string" ? s : (s && (s.skillName || s.name || "")) || "";
  const toObj = (s) => ({ skillName: toLabel(s) });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const normalizeInit = useCallback((arr) => {
    return (arr || [])
      .map(toObj)
      .map((o) => ({ skillName: String(o.skillName || "").trim() }))
      .filter((o) => !!o.skillName);
  }, []);

  // so trùng (case-insensitive)
  const exists = (name) =>
    skills.some((x) => (x?.skillName || "").toLowerCase() === String(name).toLowerCase());

  // ---------------- effects ----------------
  // nhận initialSkills -> chuẩn hoá về [{skillName}]
  useEffect(() => {
    setSkills(normalizeInit(initialSkills));
  }, [initialSkills, normalizeInit]);

  // callback ra ngoài khi thay đổi
  useEffect(() => {
    onChange?.(skills);
  }, [skills, onChange]);

  // ---------------- lookup with debounce ----------------
  const debounced = useDebounce(input, 300);
  useEffect(() => {
    const q = debounced.trim();
    if (!q) {
      setSuggests([]);
      return;
    }

    const ac = new AbortController();
    (async () => {
      try {
        const rs = await SkillAPI.getLookupSkills(q, { signal: ac.signal });
        const data = Array.isArray(rs)
          ? rs
          : Array.isArray(rs?.data)
          ? rs.data
          : Array.isArray(rs?.items)
          ? rs.items
          : Array.isArray(rs?.results)
          ? rs.results
          : [];
        setSuggests(data);
        setOpen(true); // có data thì mở dropdown
      } catch (e) {
        if (e?.name !== "AbortError") {
          console.error("lookup skills failed:", e);
          setSuggests([]);
        }
      }
    })();

    return () => ac.abort();
  }, [debounced]);

  // ---------------- handlers ----------------
  const addOne = (raw) => {
    const v = String(toLabel(raw)).trim();
    if (!v) return;
    if (exists(v)){
      setInput("");
      setOpen(false);
      return;
    }
    if (skills.length >= max) {
      setError(`Tối đa ${max} kỹ năng.`);
      return;
    }
    setSkills((s) => [...s, { skillName: v }]);
    setInput("");
    setError("");
    setSuggests([]);
    setOpen(false);
    setHighlight(-1);
  };

  const pick = (itemOrName) => {
    const name = typeof itemOrName === "string" ? itemOrName : itemOrName?.name || "";
    addOne(name);
  };

  const removeAt = (i) => setSkills((s) => s.filter((_, idx) => idx !== i));

  const onKeyDown = (e) => {
    if (["Enter", ",", ";"].includes(e.key)) {
      e.preventDefault();
      if (open && suggests.length && highlight >= 0) {
        pick(suggests[highlight]);
      } else {
        addOne(input);
      }
    } else if (e.key === "Backspace" && !input && skills.length) {
      setSkills((s) => s.slice(0, -1));
    } else if (e.key === "ArrowDown" && (open || suggests.length)) {
      e.preventDefault();
      if (!open && suggests.length) setOpen(true);
      setHighlight((h) => ((h + 1) % Math.max(suggests.length, 1)));
    } else if (e.key === "ArrowUp" && open && suggests.length) {
      e.preventDefault();
      setHighlight((h) => (h <= 0 ? suggests.length - 1 : h - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlight(-1);
    }
  };

  const submit = (e) => {
    e?.preventDefault?.();
    if (!skills.length) {
      setError("Vui lòng nhập ít nhất 1 kỹ năng.");
      return;
    }
    onSubmit?.(skills);
  };

  // ---------------- render ----------------
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-end justify-between">
        <label className="block text-sm font-medium">
          Kỹ năng <span className="text-red-600">*</span>
        </label>
        <span className="text-xs text-slate-500">
          {skills.length}/{max}
        </span>
      </div>

      <div className="relative">
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
            setHighlight(-1);
          }}
          onFocus={() => setOpen(!!(input.trim() || suggests.length))}
          onBlur={() => setTimeout(() => setOpen(false), 120)} // cho click được
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-600"
        />

        {open && suggests.length > 0 && (
          <div className="absolute left-0 right-0 z-20 -mt-px max-h-50 w-full overflow-auto
                    rounded-xl border border-violet-500 bg-white shadow-lg">
            {suggests.map((opt, idx) => (
              <button
                key={opt.id ?? opt.name ?? idx}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => pick(opt)}
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

        {open && !suggests.length > 0 && (
          <div
          className="absolute left-0 right-0 z-20 -mt-px max-h-64 w-full overflow-auto
                    rounded-xl border bg-white shadow-lg border-violet-500"
        >
          <div className="p-2"> <span className="font-medium">Nhấn "Enter" để thêm:</span> {input} </div>
          </div>
      )}
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((s, i) => (
            <span
              key={`${s?.skillName ?? ""}-${i}`}
              className="inline-flex items-center gap-2 rounded-full bg-violet-200 px-3 py-1 text-sm text-violet-800"
            >
              {s?.skillName}
              <button
                type="button"
                className="rounded-full p-1 hover:bg-violet-100"
                onClick={() => removeAt(i)}
              >
                <XIcon size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button id="__skills_submit" type="submit" className="hidden" />
    </form>
  );
}

/* ---------- Card chính ---------- */
export default function SkillsCard() {
  const storeSkills = useUserStore((s) => s?.user?.skills ?? []);
  // const patchUser = useUserStore((s) => s?.patchUser);
  const [skills, setSkills] = useState(storeSkills);
  const [open, setOpen] = useState(false);

  const [snapshot, setSnapshot] = useState([]);
  const [formSkills, setFormSkills] = useState([]);
  const isDirty = useDirty(snapshot, formSkills);
  const [askLeave, setAskLeave] = useState(false);

  useEffect(() => setSkills(storeSkills), [storeSkills]);

  const requestClose = () => { isDirty ? setAskLeave(true) : setOpen(false); };
  const openEditor = () => { setSnapshot(skills); setFormSkills(skills); setOpen(true); };

  const save = async (next) => {
    const prev = skills;
    setSkills(next);

    setOpen(false);
    try {
      const saved = await UserAPI.replaceSkillsForUser({skills:convertStringSkills(next)});
      useUserStore.getState().updateUserPart({ skills: saved?.data })
    } catch (e) {
      console.error("Save skills failed:", e);
      setSkills(prev);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-neutral-900">Kỹ năng</h3>
          {skills.length === 0 && <p className="mt-2 text-sm text-slate-500">Thêm kỹ năng để gây ấn tượng với nhà tuyển dụng</p>}
        </div>
        {skills.length === 0 ? (
          <button onClick={openEditor} className="inline-flex items-center gap-2 text-violet-700 hover:text-violet-800"><Plus size={18} /> Thêm</button>
        ) : (
          <button onClick={openEditor} className="opacity-70 transition hover:opacity-100"><Pencil size={18} /></button>
        )}
      </div>

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((s, i) => <span key={`${s}-${i}`} className="rounded-full border px-3 py-1 text-sm text-slate-700">{s?.skillName}</span>)}
        </div>
      )}

      <Modal
        open={open}
        title="Kỹ năng"
        onCloseRequest={requestClose}
        footer={
          <>
            <span />
            <div className="ml-auto flex gap-3">
              <button className="rounded-xl border px-4 py-2" onClick={requestClose}>Hủy</button>
              <button className="rounded-xl bg-violet-700 px-4 py-2 font-semibold text-white hover:bg-violet-800"
                onClick={() => document.getElementById("__skills_submit")?.click()}>
                Lưu thông tin
              </button>
            </div>
          </>
        }
      >
        <SkillsForm initialSkills={skills} onSubmit={save} onChange={setFormSkills} />
      </Modal>

      <ConfirmLeaveModal
        open={askLeave}
        onStay={() => setAskLeave(false)}
        onLeave={() => { setAskLeave(false); setOpen(false); }}
      />
    </section>
  );
}

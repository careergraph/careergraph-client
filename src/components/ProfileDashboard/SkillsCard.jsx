import { useEffect, useId, useMemo, useState } from "react";
import { Plus, Pencil, X as XIcon } from "lucide-react";
import useDirty from "../../hooks/useDirty";

function Modal({ open, title, onCloseRequest, children, footer }) {
  const titleId = useId();
  useEffect(()=>{ if(!open) return; const onEsc=(e)=>e.key==="Escape"&&onCloseRequest?.("esc");
    window.addEventListener("keydown",onEsc); return()=>window.removeEventListener("keydown",onEsc);
  },[open,onCloseRequest]);
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <button className="absolute inset-0 bg-black/40" onClick={()=>onCloseRequest?.("backdrop")} />
      <div className="relative w-full rounded-t-2xl bg-white shadow-xl sm:w-[720px] sm:rounded-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 id={titleId} className="text-xl font-semibold">{title}</h3>
          <button className="rounded-full p-2 hover:bg-slate-100" onClick={()=>onCloseRequest?.("x")}><XIcon size={18}/></button>
        </div>
        <div className="max-h-[70vh] overflow-auto p-6">{children}</div>
        <div className="flex items-center justify-between gap-3 border-t px-6 py-4">{footer}</div>
      </div>
    </div>
  );
}
function ConfirmLeaveModal({ open, onStay, onLeave }) {
  const titleId = useId();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onStay}></div>

      {/* modal box */}
      <div className="relative z-10 w-[520px] max-w-[92vw] rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 id={titleId} className="text-lg font-semibold">
            Bạn muốn thoát mà không lưu thông tin
          </h3>
          <button type="button" className="rounded-full p-2 hover:bg-slate-100" onClick={onStay}>
            <XIcon size={18}/>
          </button>
        </div>
        <div className="px-6 py-4 text-slate-600">
          Toàn bộ thông tin đã thay đổi sẽ không được lưu lại
        </div>
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button type="button" className="rounded-xl bg-violet-50 px-4 py-2 font-medium text-violet-700 hover:bg-violet-100" onClick={onStay}>
            Tiếp tục chỉnh sửa
          </button>
          <button type="button" className="rounded-xl bg-violet-700 px-4 py-2 font-semibold text-white hover:bg-violet-800"
            onClick={() => { console.log("Click Thoát"); onLeave?.(); }}>
            Thoát
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Form kỹ năng (chips) ===== */
function SkillsForm({ initialSkills = [], onSubmit, onChange }) {
  const [input, setInput] = useState("");
  const [skills, setSkills] = useState(initialSkills);
  const [error, setError] = useState("");
  const MAX = 20;

  useEffect(()=>{ setSkills(initialSkills); },[initialSkills]);
  useEffect(()=>{ onChange?.(skills); },[skills, onChange]);

  const addOne = (raw) => {
    const v = String(raw).trim();
    if (!v) return;
    if (skills.includes(v)) return;
    if (skills.length >= MAX) { setError(`Tối đa ${MAX} kỹ năng.`); return; }
    setSkills((s)=>[...s,v]); setInput(""); setError("");
  };
  const addMany = (raw) => {
    const parts = String(raw).split(/[;,]+/).map(s=>s.trim()).filter(Boolean);
    if (!parts.length) return;
    let next = [...skills];
    for (const p of parts) {
      if (next.length >= MAX) break;
      if (!next.includes(p)) next.push(p);
    }
    setSkills(next); setInput(""); if (next.length>=MAX) setError(`Tối đa ${MAX} kỹ năng.`);
  };
  const onKeyDown = (e) => {
    if (e.key==="Enter" || e.key==="," || e.key===";") {
      e.preventDefault();
      input.includes(",")||input.includes(";") ? addMany(input) : addOne(input);
    } else if (e.key==="Backspace" && !input && skills.length) {
      setSkills((s)=>s.slice(0,-1));
    }
  };
  const onBlur = ()=>{ if(!input) return; input.includes(",")||input.includes(";") ? addMany(input) : addOne(input); };
  const onPaste = (e)=>{ const t=e.clipboardData.getData("text"); if(t.includes(",")||t.includes(";")){ e.preventDefault(); addMany(t); } };
  const removeAt = (i)=> setSkills((s)=> s.filter((_,idx)=>idx!==i));
  const submit = (e)=>{ e?.preventDefault?.(); if(skills.length===0){ setError("Vui lòng nhập ít nhất 1 kỹ năng."); return; } onSubmit?.(skills); };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-end justify-between">
        <label className="block text-sm font-medium">Kỹ năng <span className="text-red-600">*</span></label>
        <span className="text-xs text-slate-500">{skills.length}/{MAX}</span>
      </div>
      <input
        value={input} onChange={(e)=>setInput(e.target.value)}
        onKeyDown={onKeyDown} onBlur={onBlur} onPaste={onPaste}
        placeholder="Nhập kỹ năng"
        className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-600"
      />
      {skills.length>0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((s,i)=>(
            <span key={`${s}-${i}`} className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-sm text-violet-800">
              {s}
              <button type="button" className="rounded-full p-1 hover:bg-violet-100" aria-label={`Xoá ${s}`} onClick={()=>removeAt(i)}>
                <XIcon size={14}/>
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

/* ===== Card kỹ năng ===== */
export default function SkillsCard({ value = [], onChange }) {
  const [skills, setSkills] = useState(value);
  const [open, setOpen] = useState(false);

  // dirty-leave
  const [snapshot, setSnapshot] = useState([]);
  const [formSkills, setFormSkills] = useState([]);
  const isDirty = useDirty(snapshot, formSkills);
  const [askLeave, setAskLeave] = useState(false);

  useEffect(()=>setSkills(value),[value]);

  const requestClose = () => { isDirty ? setAskLeave(true) : setOpen(false); };

  const openEditor = () => {
    setSnapshot(skills);     // snapshot hiện tại
    setFormSkills(skills);   // form state ban đầu
    setOpen(true);
  };

  const save = (next) => { setSkills(next); onChange?.(next); setOpen(false); };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[18px] font-semibold text-neutral-900">Kỹ năng</h3>
          {skills.length===0 && <p className="mt-2 text-sm text-slate-500">Nổi bật hơn trong mắt nhà tuyển dụng với các kĩ năng quan trọng</p>}
        </div>
        {skills.length===0 ? (
          <button onClick={openEditor} className="inline-flex items-center gap-2 text-violet-700 hover:text-violet-800">
            <Plus size={18}/> Thêm
          </button>
        ) : (
          <button onClick={openEditor} className="opacity-70 transition hover:opacity-100" aria-label="Sửa">
            <Pencil size={18}/>
          </button>
        )}
      </div>

      {skills.length>0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((s,i)=>(<span key={`${s}-${i}`} className="rounded-full border px-3 py-1 text-sm text-slate-700">{s}</span>))}
        </div>
      )}

      <Modal
        open={open}
        title="Kỹ năng"
        onCloseRequest={requestClose}
        footer={
          <>
            <span/>
            <div className="ml-auto flex gap-3">
              <button className="rounded-xl border px-4 py-2" onClick={requestClose}>Hủy</button>
              <button className="rounded-xl bg-violet-700 px-4 py-2 font-semibold text-white hover:bg-violet-800"
                      onClick={()=>document.getElementById("__skills_submit")?.click()}>
                Lưu thông tin
              </button>
            </div>
          </>
        }
      >
        <SkillsForm initialSkills={skills} onSubmit={save} onChange={setFormSkills}/>
      </Modal>

      <ConfirmLeaveModal
        open={askLeave}
        onStay={()=>setAskLeave(false)}
        onLeave={()=>{ 
          console.log("Thoát: setAskLeave(false); setOpen(false)");
          setAskLeave(false);
          setOpen(false);
         }}
      />
    </section>
  );
}

// ConfirmLeaveModal.jsx
import { useId, useEffect } from "react";
import { X } from "lucide-react";

export default function ConfirmLeaveModal({ open, onStay, onLeave }) {
  const titleId = useId();
  useEffect(()=>{ if(!open) return;
    const onEsc=(e)=>e.key==="Escape"&&onStay?.();
    window.addEventListener("keydown",onEsc);
    return()=>window.removeEventListener("keydown",onEsc);
  },[open,onStay]);

  if(!open) return null;

  return (
    // z cao hơn modal cha (z-50) để luôn nổi trên
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* backdrop của confirm để TRONG SUỐT, không thêm lớp tối mới */}
      <button className="absolute inset-0 bg-transparent" onClick={onStay} />
      <div className="w-[520px] max-w-[92vw] rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 id={titleId} className="text-lg font-semibold">
            Bạn muốn thoát mà không lưu thông tin
          </h3>
          <button className="rounded-full p-2 hover:bg-slate-100" onClick={onStay}>
            <XIcon size={18}/>
          </button>
        </div>
        <div className="px-6 py-4 text-slate-600">
          Toàn bộ thông tin đã thay đổi sẽ không được lưu lại
        </div>
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            className="rounded-xl bg-violet-50 px-4 py-2 font-medium text-violet-700 hover:bg-violet-100"
            onClick={onStay}
          >
            Tiếp tục chỉnh sửa
          </button>
          <button
            className="rounded-xl bg-violet-700 px-4 py-2 font-semibold text-white hover:bg-violet-800"
            onClick={onLeave}
          >
            Thoát
          </button>
        </div>
      </div>
    </div>
  );
}

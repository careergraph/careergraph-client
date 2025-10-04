// CertificatesCard.jsx
import { useEffect, useId, useState } from "react";
import { Plus, Pencil, X, Upload, Image as ImageIcon } from "lucide-react";

/* ---------- Modal đơn giản ---------- */
function Modal({ open, title, onClose, children, footer }) {
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
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
function CertificateForm({ initialValue, onSubmit }) {
  const [name, setName] = useState(initialValue?.name || "");
  const [fileName, setFileName] = useState(initialValue?.fileName || "");
  const [previewUrl, setPreviewUrl] = useState(initialValue?.imageUrl || "");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // cleanup blob url khi đổi ảnh
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handlePick = (f) => {
    if (!f) return;
    const okTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!okTypes.includes(f.type)) {
      setError("Chỉ hỗ trợ png, jpg, jpeg.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("Kích thước tối đa 5MB.");
      return;
    }
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    setFileName(f.name);
    setFile(f);
    setError("");
  };

  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    handlePick(f);
  };

  const submit = (e) => {
    e?.preventDefault?.();
    if (!name.trim()) {
      setError("Vui lòng nhập tên chứng chỉ.");
      return;
    }
    setError("");
    // NOTE: Ở môi trường thật bạn upload `file` lên server -> nhận url thực.
    // Ở đây demo dùng blob url để hiển thị ngay.
    onSubmit?.({
      ...initialValue,
      name: name.trim(),
      fileName: fileName || "",
      imageUrl: previewUrl || "",
    });
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Tên chứng chỉ <span className="text-red-600">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên chứng chỉ"
          className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-600"
        />
      </div>

      {/* Upload ảnh */}
      {!previewUrl ? (
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="block cursor-pointer rounded-2xl border border-dashed p-3 sm:p-4"
        >
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={(e) => handlePick(e.target.files?.[0])}
          />
          <div className="flex items-center justify-center rounded-xl bg-violet-50 py-3 text-violet-700">
            <Upload size={18} className="mr-2" /> Tải lên hình ảnh
          </div>
          <p className="mt-2 text-center text-xs text-slate-500">
            Hỗ trợ định dạng: png, jpg, jpeg, tối đa 5MB
          </p>
        </label>
      ) : (
        <div>
          <div className="relative inline-block">
            {/* thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={fileName || "certificate"}
              className="h-28 w-40 rounded-2xl object-cover"
            />
            <button
              type="button"
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
              onClick={() => {
                if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
                setPreviewUrl("");
                setFile(null);
                setFileName("");
              }}
              aria-label="Xoá ảnh"
            >
              <X size={14} />
            </button>
          </div>
          {fileName && <p className="mt-1 text-sm text-slate-600">{fileName}</p>}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button id="__cert_submit" type="submit" className="hidden" />
    </form>
  );
}

/* ---------- Card chính ---------- */
export default function CertificatesCard({ value = [], onChange }) {
  const [items, setItems] = useState(value);
  const [modal, setModal] = useState({ open: false, mode: "create", editing: null });

  useEffect(() => setItems(value), [value]);
  const setAndEmit = (next) => { setItems(next); onChange?.(next); };

  const openCreate = () => setModal({ open: true, mode: "create", editing: null });
  const openEdit = (it) => setModal({ open: true, mode: "edit", editing: it });
  const closeModal = () => setModal({ open: false, mode: "create", editing: null });
  const [confirm, setConfirm] = useState({open:false, id:null});

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
          <h3 className="text-[18px] font-semibold text-neutral-900">Chứng chỉ/bằng cấp</h3>
          {items.length === 0 && (
            <p className="mt-2 text-sm text-slate-500">
              Thêm các chứng chỉ hoặc bằng cấp công việc của bạn
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
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {it.imageUrl ? (
                    <img
                      src={it.imageUrl}
                      alt={it.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                      <ImageIcon size={18} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold">{it.name}</p>
                    {it.fileName && (
                      <p className="truncate text-sm text-slate-500">{it.fileName}</p>
                    )}
                  </div>
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
        title="Chứng chỉ/bằng cấp"
        onClose={closeModal}
        footer={
          <>
            {modal.mode === "edit" ? (
              <button
                className="rounded-xl px-4 py-2 font-medium text-red-600 hover:bg-red-50"
                onClick={() => {
                  setConfirm({open:true,id:modal.editing.id});
                }}
              >
                Xoá chứng chỉ
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
                onClick={() => document.getElementById("__cert_submit")?.click()}
              >
                Lưu thông tin
              </button>
            </div>
          </>
        }
      >
        <CertificateForm
          key={modal.mode + (modal.editing?.id || "")}
          initialValue={modal.editing}
          onSubmit={upsert}
        />
      </Modal>


      <Modal
        open={confirm.open}
        title="Xác nhận xoá"
        onClose={()=>setConfirm({open:false,id:null})}
        footer={
          <>
            <span/>
            <div className="ml-auto flex gap-3">
              <button onClick={()=>setConfirm({open:false,id:null})} className="border rounded-xl px-4 py-2">Hủy</button>
              <button onClick={()=>{
                if(confirm.id) removeById(confirm.id);
                setConfirm({open:false,id:null});
                setModal({open:false,mode:"create",editing:null});
              }} className="rounded-xl bg-red-600 px-4 py-2 text-white">Xoá</button>
            </div>
          </>
        }
      >
        <p className="text-sm text-slate-600">Bạn có chắc chắn muốn xoá chứng chỉ này? Hành động này không thể hoàn tác.</p>
      </Modal>
    </section>
  );
}

// CVCards.jsx
import { useRef, useState, useMemo, useEffect } from "react";
import { Upload, MoreHorizontal, FileText, Trash2, X } from "lucide-react";

const BYTES_5MB = 5 * 1024 * 1024;
const ACCEPTED = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function fmtDate(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} • ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/* --- Popup xác nhận xoá --- */
function ConfirmDialog({ open, title, message, onCancel, onConfirm }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onCancel?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <button className="absolute inset-0 bg-black/40" onClick={onCancel} aria-label="Close"/>
      <div className="relative w-full max-w-sm rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="text-[16px] font-semibold">{title}</h4>
          <button className="p-2 rounded-full hover:bg-slate-100" onClick={onCancel}>
            <X size={18}/>
          </button>
        </div>
        <div className="px-4 py-4 text-[14px] text-slate-700">{message}</div>
        <div className="flex justify-end gap-2 px-4 py-3">
          <button onClick={onCancel} className="rounded-lg border px-3 py-2">Huỷ</button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
          >
            Xoá
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * props:
 * - initialFiles: Array<{ id?, name, url, uploadedAt: Date|string }>
 * - onUpload(file) => Promise|void
 * - onRemove(item) => void
 * - onView(item) => void
 */
export default function CVCards({ initialFiles = [], onUpload, onRemove, onView }) {
  const [files, setFiles] = useState(
    initialFiles.map((f, i) => ({
      id: f.id ?? `${Date.now()}_${i}`,
      name: f.name,
      url: f.url,
      uploadedAt: f.uploadedAt instanceof Date ? f.uploadedAt : new Date(f.uploadedAt),
    }))
  );
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null); // <--- item chờ xoá
  const inputRef = useRef(null);

  const acceptAttr = useMemo(() => ".pdf,.doc,.docx", []);

  function validate(file) {
    if (!ACCEPTED.includes(file.type) && !/\.(pdf|docx?|DOCX?)$/.test(file.name))
      return "Định dạng không hợp lệ. Chỉ hỗ trợ PDF, DOC, DOCX.";
    if (file.size > BYTES_5MB) return "Dung lượng vượt quá 5MB.";
    return "";
  }

  async function handleFiles(fileList) {
    setError("");
    const file = fileList?.[0];
    if (!file) return;
    const err = validate(file);
    if (err) { setError(err); return; }

    try {
      const maybeUrl = await onUpload?.(file);
      const newItem = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        url: maybeUrl ?? undefined,
        uploadedAt: new Date(),
      };
      setFiles((s) => [...s, newItem]); // ADD
    } catch (e) {
      setError(e?.message || "Không thể tải lên. Vui lòng thử lại.");
    }
  }

  return (
    <section className="w-full rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
      <h3 className="text-[18px] font-semibold text-neutral-900">CV của tôi</h3>

      {/* Danh sách CV */}
      <div className="mt-4 space-y-3">
        {files.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-[#EFEFF0] bg-white px-4 py-3"
          >
            {/* Hàng chính: KHÔNG dùng justify-between để tránh kéo giãn */}
            <div className="flex items-start gap-3">
              {/* Khối trái chiếm diện tích, cho phép truncate */}
              <div className="flex-1 min-w-0 flex items-start gap-3">
                <div className="mt-0.5 grid h-8 w-8 place-items-center rounded-md bg-violet-50 shrink-0">
                  <FileText size={18} className="text-violet-600" />
                </div>

                <div className="min-w-0">
                  {/* Tên file: truncate trong giới hạn cha */}
                  <p className="block max-w-full truncate whitespace-nowrap text-[15px] font-medium text-neutral-800">
                    {item.name}
                  </p>
                  <p className="text-[12px] text-slate-500">
                    Đã tải lên {fmtDate(item.uploadedAt)}
                  </p>
                  <button
                    type="button"
                    className="mt-1 text-[13px] font-medium text-violet-600 hover:underline"
                    onClick={() => onView?.(item)}
                  >
                    Xem hồ sơ
                  </button>
                </div>
              </div>

              {/* Khối phải: không cho co giãn */}
              <div className="ml-3 flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  className="rounded-full p-2 hover:bg-slate-100"
                  title="Tùy chọn"
                  onClick={() => {}}
                >
                  <MoreHorizontal size={18} className="text-slate-500" />
                </button>
                <button
                  type="button"
                  className="rounded-full p-2 hover:bg-red-50"
                  title="Xoá"
                  onClick={() => setPendingDelete(item)} // mở confirm
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Khu vực upload */}
      <div
        className={[
          "mt-4 rounded-xl border-2 border-dashed p-4 sm:p-5",
          dragOver ? "border-violet-400 bg-violet-50/40" : "border-[#EFEFF0]",
        ].join(" ")}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-2 text-[14px] font-semibold text-violet-700 hover:bg-violet-100"
          >
            <Upload size={18} />
            Tải lên CV có sẵn
          </button>

          <p className="text-[13px] text-slate-500">
            Hỗ trợ định dạng: <b>doc, docx, pdf</b>, tối đa <b>5MB</b>
          </p>
        </div>

        {error && <p className="mt-2 text-[13px] text-red-600">{error}</p>}
      </div>

      {/* Popup xác nhận xoá */}
      <ConfirmDialog
        open={!!pendingDelete}
        title="Xóa CV"
        message={
          <>
            Bạn có chắc muốn xoá CV khỏi hệ thống
          </>
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          const item = pendingDelete;
          setPendingDelete(null);
          setFiles((s) => s.filter((x) => x.id !== item.id));
          onRemove?.(item);
        }}
      />
    </section>
  );
}

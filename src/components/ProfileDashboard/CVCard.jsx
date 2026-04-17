// CVCards.jsx
import { useRef, useState, useMemo, useEffect } from "react";
import { Upload, MoreHorizontal, FileText, Trash2, X, Share2, Loader, Pencil } from "lucide-react";
import { toast } from "sonner";
import { MediaService } from "~/services/mediaService";
import resolveResumeLabel from "~/utils/formatName";
import LoadingSpinner from "../Feedback/LoadingSpinner";
import { useUserStore } from "~/stores/userStore";

const BYTES_5MB = 5 * 1024 * 1024;
const ACCEPTED = [
  ".pdf",
  ".doc",
  ".docx",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];


function fmtDate(input) {
  if (!input) return "";

  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");

  // 21/11/2025 • 14:23
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} • ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}


/* --- Popup menu tùy chọn CV --- */
function CVOptionsMenu({ open, onClose, onRename, onDelete, onShareWithRecruiter }) {
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    const handleEsc = (e) => e.key === "Escape" && onClose?.();
    
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEsc);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-slate-200 bg-white shadow-lg z-50"
    >
      <button
        type="button"
        onClick={onRename}
        className="w-full px-4 py-3 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b"
      >
        <Pencil size={16} className="text-indigo-600" />
        Đổi tên CV
      </button>
      <button
        type="button"
        onClick={onShareWithRecruiter}
        className="w-full px-4 py-3 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-b"
      >
        <Share2 size={16} className="text-violet-600" />
        Cho phép tìm kiếm CV
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="w-full px-4 py-3 text-left text-[13px] font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
      >
        <Trash2 size={16} />
        Xóa CV
      </button>
    </div>
  );
}

/* --- Popup xác nhận xoá --- */
function ConfirmDialog({ open, title, message, onCancel, onConfirm, loading = false }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && !loading && onCancel?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onCancel, loading]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <button className="absolute inset-0 bg-black/40" onClick={onCancel} aria-label="Close" disabled={loading}/>
      <div className="relative w-full max-w-sm rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="text-[16px] font-semibold">{title}</h4>
          <button className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-50" onClick={onCancel} disabled={loading}>
            <X size={18}/>
          </button>
        </div>
        <div className="px-4 py-4 text-[14px] text-slate-700">{message}</div>
        <div className="flex justify-end gap-2 px-4 py-3">
          <button 
            onClick={onCancel} 
            className="rounded-lg border px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-3 py-2 text-white font-medium transition-all flex items-center gap-2 ${
              loading 
                ? "bg-red-400 cursor-not-allowed" 
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Đang xóa...
              </>
            ) : (
              "Xoá"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function RenameDialog({ open, title, value, onChange, onCancel, onConfirm, loading = false }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (event) => event.key === "Escape" && !loading && onCancel?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onCancel, loading]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center px-4">
      <button className="absolute inset-0 bg-black/40" onClick={onCancel} aria-label="Close" disabled={loading} />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h4 className="text-[16px] font-semibold text-slate-900">{title}</h4>
          <button className="rounded-full p-2 hover:bg-slate-100 disabled:opacity-50" onClick={onCancel} disabled={loading}>
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-5">
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="renameCvInput">
            Tên CV mới
          </label>
          <input
            id="renameCvInput"
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            maxLength={255}
            autoFocus
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            placeholder="Ví dụ: Nguyễn Văn A - CV ứng tuyển"
          />
          <p className="mt-2 text-xs text-slate-500">
            Hỗ trợ tiếng Việt đầy đủ. Không đổi file gốc, chỉ đổi tên hiển thị.
          </p>
        </div>
        <div className="flex justify-end gap-2 border-t px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${
              loading ? "cursor-not-allowed bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Đang lưu..." : "Lưu tên mới"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- Component hiệu ứng loading xóa --- */
function DeleteLoadingOverlay({ open }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/20">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner message="Đang xóa CV..." variant="inline" size="sm" />
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
export default function CVCards() {
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // Track đang xóa CV nào
  const [openMenuId, setOpenMenuId] = useState(null); // Quản lý menu nào đang mở
  const [renameTarget, setRenameTarget] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const inputRef = useRef(null);

  const acceptAttr = useMemo(() => ".pdf,.doc,.docx", []);
  const user = useUserStore((state) => state?.user);
  const candidateId = user?.candidateId;
  const [uploading, setUploading] = useState(false);
  const [existingResumes, setExistingResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);


  useEffect(() => {
    if (!candidateId) {
      setExistingResumes([]);
      return;
    }

    const loadResumes = async () => {
      try {
        setLoadingResumes(true);
        const resumes = await MediaService.listResumes({ candidateId });
        setExistingResumes(resumes);
      } catch (error) {
        console.error("Không thể tải danh sách CV:", error);
        toast.error("Không thể tải danh sách CV đã lưu.");
      } finally {
        setLoadingResumes(false);
      }
    };

    loadResumes();
  }, [candidateId]);

  function validate(file) {
    if (!ACCEPTED.includes(file.type) && !/\.(pdf|docx?|DOCX?)$/.test(file.name))
      return "Định dạng không hợp lệ. Chỉ hỗ trợ PDF, DOC, DOCX.";
    if (file.size > BYTES_5MB) return "Dung lượng vượt quá 5MB.";
    return "";
  }

  // async function handleFiles(fileList) {
  //   setError("");
  //   const file = fileList?.[0];
  //   if (!file) return;
  //   const err = validate(file);
  //   if (err) { setError(err); return; }

  //   try {
  //     const maybeUrl = await onUpload?.(file);
  //     const newItem = {
  //       id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  //       name: file.name,
  //       url: maybeUrl ?? undefined,
  //       uploadedAt: new Date(),
  //     };
  //     setFiles((s) => [...s, newItem]); // ADD
  //   } catch (e) {
  //     setError(e?.message || "Không thể tải lên. Vui lòng thử lại.");
  //   }
  // }

  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    
    const message = validate(file);
    if (message) {
      toast.error(message);
      return;
    }

    if (!candidateId) {
      toast.error("Không tìm thấy mã ứng viên, vui lòng đăng nhập lại.");
      return;
    }

    try {
      setUploading(true);
      const data = await MediaService.uploadResume({ file, candidateId });
      setExistingResumes((prev) => [data, ...prev]);
      toast.success("Đã tải CV thành công.");
    } catch (error) {
      console.error("Upload CV thất bại:", error);
      toast.error(error?.message || "Không thể tải CV lên máy chủ.");
    } finally {
      setUploading(false);
    }
  };

  const handlePreviewResume = (resume) => {
    if (!resume?.url) return;
    window.open(resume.url, "_blank", "noopener,noreferrer");
  };

  const handleOpenRename = (resume) => {
    setOpenMenuId(null);
    setRenameTarget(resume);
    setRenameValue(resume?.fileName || resume?.name || "");
  };

  const handleRenameResume = async () => {
    if (!renameTarget?.id) {
      toast.error("Không tìm thấy CV cần đổi tên.");
      return;
    }

    const nextName = renameValue.trim();
    if (!nextName) {
      toast.error("Tên CV không được để trống.");
      return;
    }

    try {
      setRenamingId(renameTarget.id);
      const updated = await MediaService.renameResume({ fileId: renameTarget.id, newName: nextName });
      setExistingResumes((prev) => prev.map((item) => (item.id === renameTarget.id ? { ...item, ...updated } : item)));
      toast.success("Đã đổi tên CV.");
      setRenameTarget(null);
      setRenameValue("");
    } catch (error) {
      console.error("Đổi tên CV thất bại:", error);
      toast.error(error?.message || "Không thể đổi tên CV. Vui lòng thử lại.");
    } finally {
      setRenamingId(null);
    }
  };


  async function handleDeleteResume(resume) {
    try {
      setDeletingId(resume.id);
      setPendingDelete(null);
      await MediaService.deleteResume({ publicId: resume.publicId });
      setExistingResumes((prev) => prev.filter((r) => r.id !== resume.id));
      toast.success("Đã xóa CV thành công.");
    } catch (err) {
      console.error("Xóa CV thất bại:", err);
      toast.error("Không thể xóa CV. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="w-full rounded-2xl bg-white p-4 sm:p-6 shadow-sm">
      <h3 className="text-[18px] font-semibold text-neutral-900">CV của tôi</h3>

      {/* Danh sách CV */}

      {loadingResumes ? (
          <div className="flex items-center justify-center rounded-xl border border-slate-200 p-4">
                <LoadingSpinner message="Đang tải danh sách CV đã lưu..." variant="inline" size="sm" />
          </div>
      ) : (
      <div className="mt-4 space-y-3">
        {existingResumes.map((item) => (
          <div
            key={item?.id}
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
                    {resolveResumeLabel(item)}
                  </p>
                  <p className="text-[12px] text-slate-500">
                    Đã tải lên {fmtDate(item?.uploadedAt)}
                  </p>
                  <button
                    type="button"
                    className="mt-1 text-[13px] font-medium text-violet-600 hover:underline"
                    onClick={() => handlePreviewResume(item)}
                  >
                    Xem hồ sơ
                  </button>
                </div>
              </div>

              {/* Khối phải: không cho co giãn */}
              <div className="ml-3 flex shrink-0 items-center gap-1 relative">
                <button
                  type="button"
                  className="rounded-full p-2 hover:bg-slate-100 relative"
                  title="Tùy chọn"
                  onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                >
                  <MoreHorizontal size={18} className="text-slate-500" />
                </button>
                <CVOptionsMenu
                  open={openMenuId === item.id}
                  onClose={() => setOpenMenuId(null)}
                  onRename={() => handleOpenRename(item)}
                  onDelete={() => {
                    setOpenMenuId(null);
                    setPendingDelete(item);
                  }}
                  onShareWithRecruiter={() => {
                    setOpenMenuId(null);
                    toast.success("CV đã được cho phép nhà tuyển dụng tìm kiếm.");
                    // TODO: Gọi API để cập nhật trạng thái CV
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Khu vực upload */}
      <div
        className={[
          "mt-4 rounded-xl border-2 border-dashed p-4 sm:p-5",
          dragOver ? "border-violet-400 bg-violet-50/40" : "border-[#EFEFF0]",
        ].join(" ")}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          className="hidden"
          onChange={handleFileSelected}
        />

        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[14px] font-semibold transition-all ${
              uploading
                ? "bg-violet-100 text-violet-600 cursor-not-allowed"
                : "bg-violet-50 text-violet-700 hover:bg-violet-200"
            }`}
          >
            {uploading ? (
              <Loader size={18} className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            {uploading ? "Đang tải lên..." : "Tải lên CV có sẵn"}
          </button>

          <p className="text-[13px] text-slate-500">
            Hỗ trợ định dạng: <b>doc, docx, pdf</b>, tối đa <b>5MB</b>
          </p>
        </div>

        {error && <p className="mt-2 text-[13px] text-red-600">{error}</p>}
      </div>

      {/* Popup xác nhận xoá */}
      <ConfirmDialog
        open={!!pendingDelete && !deletingId}
        loading={false}
        title="Xóa CV"
        message={
          <>
            Bạn có chắc muốn xoá CV khỏi hệ thống
          </>
        }
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          const item = pendingDelete;
          handleDeleteResume(item);
        }}
      />

      {/* Hiệu ứng loading xóa CV */}
      <DeleteLoadingOverlay open={!!deletingId} />

      <RenameDialog
        open={!!renameTarget}
        title="Đổi tên CV"
        value={renameValue}
        loading={!!renamingId}
        onChange={setRenameValue}
        onCancel={() => {
          if (renamingId) return;
          setRenameTarget(null);
          setRenameValue("");
        }}
        onConfirm={handleRenameResume}
      />
    </section>
  );
}

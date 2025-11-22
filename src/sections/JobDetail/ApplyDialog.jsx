import { useEffect, useMemo, useRef, useState } from "react";
import LoadingSpinner from "~/components/Feedback/LoadingSpinner";
import { MediaService } from "~/services/mediaService";
import { JobService } from "~/services/jobService";
import { useUserStore } from "~/store/userStore";
import { toast } from "sonner";
import { X } from "lucide-react";
import resolveResumeLabel from "~/utils/formatName";

// Giới hạn dung lượng file theo yêu cầu BE (5MB, giống vùng quản lý CV trong dashboard).
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Định dạng dung lượng tệp cho UI thân thiện (B/KB/MB).
const formatBytes = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Dựng chuỗi MIME types và đuôi file cho thuộc tính accept của input.
const buildAcceptAttribute = () => [
  ".pdf",
  ".doc",
  ".docx",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
].join(",");

// ApplyDialog chịu trách nhiệm hiển thị form ứng tuyển ngay trên trang chi tiết job.
// Dialog này gom đủ luồng: lấy CV đã lưu, upload CV mới, nhập cover letter và submit ứng tuyển.
export default function ApplyDialog({
  open,
  onClose,
  jobId,
  jobTitle,
  coverLetterRequired = false,
}) {
  const user = useUserStore((state) => state.user);
  const candidateId = user?.candidateId;

  // Quản lý nội dung cover letter và trạng thái đã chạm (phục vụ hiển thị lỗi bắt buộc).
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLetterTouched, setCoverLetterTouched] = useState(false);

  // Dữ liệu danh sách CV đã lưu và trạng thái loading tương ứng.
  const [existingResumes, setExistingResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  // CV đang được chọn để gửi, cờ process upload và submit apply.
  const [selectedResume, setSelectedResume] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tham chiếu input file ẩn để tái sử dụng nút UI tùy chỉnh.
  const fileInputRef = useRef(null);

  // Ghi nhớ danh sách mime types nhằm tránh tạo lại chuỗi chấp nhận mỗi lần render.
  const acceptAttr = useMemo(buildAcceptAttribute, []);

  // Khi dialog mở: reset state về mặc định và tải danh sách CV của ứng viên.
  useEffect(() => {
    if (!open) return;

    setCoverLetter("");
    setCoverLetterTouched(false);
    setSelectedResume(null);
    setExistingResumes([]);

    const loadResumes = async () => {
      if (!candidateId) {
        toast.error("Bạn cần đăng nhập để ứng tuyển công việc.");
        return;
      }

      try {
        setLoadingResumes(true);
        const resumes = await MediaService.listResumes({ candidateId });
        console.log(resumes)
        setExistingResumes(resumes);
        if (resumes.length > 0) {
          setSelectedResume(resumes[0]);
        }
      } catch (error) {
        console.error("Không thể tải danh sách CV:", error);
        toast.error("Không thể tải danh sách CV đã lưu.");
      } finally {
        setLoadingResumes(false);
      }
    };

    loadResumes();
  }, [open, candidateId]);

  // Kiểm tra tệp trước khi upload để tránh gửi request lỗi.
  const validateFile = (file) => {
    if (!file) return "Chưa chọn tệp CV";
    if (!MediaService.ACCEPTED_MIME_TYPES.includes(file.type) && !file.name.match(/\.(pdf|docx?)$/i)) {
      return "Chỉ hỗ trợ tệp PDF, DOC, DOCX.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "Dung lượng CV vượt quá 5MB.";
    }
    return "";
  };

  // Trigger input file ẩn mỗi khi người dùng bấm "Tải CV mới".
  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  // Upload CV mới và gắn vào danh sách lựa chọn hiện tại.
  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    const message = validateFile(file);
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
      setSelectedResume(data);
      toast.success("Đã tải CV thành công.");
    } catch (error) {
      console.error("Upload CV thất bại:", error);
      toast.error(error?.message || "Không thể tải CV lên máy chủ.");
    } finally {
      setUploading(false);
    }
  };

  const handleSelectExisting = (resume) => {
    setSelectedResume(resume);
  };

  // Tiện ích giúp rút gọn tên hiển thị nhưng vẫn giữ tooltip đầy đủ.
  


  const coverLetterError =
    coverLetterRequired && coverLetterTouched && !coverLetter.trim()
      ? "Vui lòng nhập Cover Letter để hoàn tất ứng tuyển."
      : "";

  // Submit đơn ứng tuyển với payload chuẩn BE yêu cầu.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setCoverLetterTouched(true);

    if (!candidateId) {
      toast.error("Bạn cần đăng nhập trước khi ứng tuyển.");
      return;
    }

    if (!selectedResume?.url) {
      toast.error("Vui lòng chọn hoặc tải lên CV trước khi ứng tuyển.");
      return;
    }

    if (coverLetterRequired && !coverLetter.trim()) {
      return;
    }

    const payload = {
      jobId,
      resumeUrl: selectedResume.url,
      coverLetter: coverLetter.trim() || null,
      appliedDate: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);
      await JobService.applyToJob(jobId, payload);
      toast.success("Đã gửi đơn ứng tuyển. Chúc bạn may mắn!");
      onClose?.();
    } catch (error) {
      console.error("Gửi đơn ứng tuyển thất bại:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể gửi đơn ứng tuyển. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-3 py-6">
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-[81] w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Ứng tuyển công việc</h2>
            <p className="mt-1 text-sm text-slate-500">
              {jobTitle ? `Bạn đang ứng tuyển vị trí ${jobTitle}.` : "Hoàn thiện thông tin để gửi đơn ứng tuyển."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <span className="sr-only">Đóng</span>
            <X size={20} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex max-h-[70vh] flex-col"
        >
          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
          {/* Cảnh báo đăng nhập: luôn hiển thị đầu form để tránh trường hợp apply khi thiếu token. */}
          {!candidateId && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Vui lòng đăng nhập tài khoản ứng viên trước khi gửi CV.
            </div>
          )}

          {/* Khối CV: cho phép tải CV mới hoặc chọn CV đã lưu với experience consistent. */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-slate-900">CV của bạn</h3>
              <button
                type="button"
                onClick={handlePickFile}
                className="rounded-lg bg-indigo-50 px-3.5 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
              >
                Tải CV mới
              </button>
            </div>

            <div className="relative rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-5">
              {uploading && (
                <LoadingSpinner message="Đang tải CV..." variant="overlay" size="sm" />
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept={acceptAttr}
                onChange={handleFileSelected}
                className="hidden"
              />

              <p className="text-sm text-slate-600">
                Chỉ hỗ trợ PDF, DOC, DOCX. Kích thước tối đa {formatBytes(MAX_FILE_SIZE)}.
              </p>

              {selectedResume?.url ? (
                <div className="mt-3 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-100 text-indigo-600">
                    CV
                  </div>
                  <div className="min-w-0">
                    <p
                      className="truncate text-sm font-semibold text-slate-900"
                      title={selectedResume.name || selectedResume.url}
                    >
                      {resolveResumeLabel(selectedResume)}
                    </p>
                    <a
                      href={selectedResume.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium text-indigo-600 hover:underline"
                    >
                      Xem CV
                    </a>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  Bạn chưa chọn CV. Vui lòng tải lên hoặc chọn từ danh sách bên dưới.
                </p>
              )}
            </div>

            {loadingResumes ? (
              <div className="flex items-center justify-center rounded-xl border border-slate-200 p-4">
                <LoadingSpinner message="Đang tải danh sách CV đã lưu..." variant="inline" size="sm" />
              </div>
            ) : existingResumes.length > 0 ? (
              <div className="space-y-2">
                <p className="text-base font-semibold text-slate-900">CV đã lưu gần đây</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {existingResumes.map((resume) => {
                    const isActive = selectedResume?.id === resume.id;
                    return (
                      <button
                        key={resume.id}
                        type="button"
                        onClick={() => handleSelectExisting(resume)}
                        title={resume.name || resume.url}
                        className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition ${
                          isActive
                            ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-200"
                        }`}
                      >
                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-[11px] font-semibold uppercase text-slate-600">
                          CV
                        </div>
                        <div className="min-w-0">
                          <span className="block truncate font-medium">
                            {resolveResumeLabel(resume)}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </section>

          {/* Khối cover letter: nhập tự do, tùy thuộc job yêu cầu sẽ enforce validation. */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="coverLetter" className="text-base font-semibold text-slate-900">
                Cover Letter
              </label>
              <span className="text-xs text-slate-500">
                {coverLetter.length}/2000 ký tự
              </span>
            </div>
            <textarea
              id="coverLetter"
              name="coverLetter"
              maxLength={2000}
              rows={5}
              value={coverLetter}
              onChange={(event) => setCoverLetter(event.target.value)}
              onBlur={() => setCoverLetterTouched(true)}
              className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 ${
                coverLetterError ? "border-red-300" : "border-slate-200"
              }`}
              placeholder={
                coverLetterRequired
                  ? "Vui lòng giới thiệu bản thân, kinh nghiệm và mong muốn của bạn đối với vị trí này."
                  : "Bạn có thể chia sẻ thêm thông tin nổi bật để gây ấn tượng với nhà tuyển dụng (không bắt buộc)."
              }
            />
            <div className="flex items-center justify-between text-xs">
              <span className={coverLetterRequired ? "text-red-500" : "text-slate-500"}>
                {coverLetterRequired ? "Bắt buộc cung cấp cover letter" : "Tùy chọn"}
              </span>
              {coverLetterError && <span className="text-red-500">{coverLetterError}</span>}
            </div>
          </section>
          </div>

          <footer className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition ${
                isSubmitting || uploading
                  ? "cursor-not-allowed bg-indigo-300"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi đơn ứng tuyển"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

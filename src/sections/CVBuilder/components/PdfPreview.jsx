import { useMemo, useState, useEffect, useRef } from "react";
import { BlobProvider, PDFViewer } from "@react-pdf/renderer";
import { Download, Sparkles, X, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import LoadingSpinner from "~/components/Feedback/LoadingSpinner";
import { http } from "~/services/http/request";

const PdfPreview = ({ TemplateComponent, data, fileName, job, cvData }) => {
  const [debouncedData, setDebouncedData] = useState(data);
  const fileInputRef = useRef(null);
  const lastTemplateRef = useRef(TemplateComponent);
  const [viewerVersion, setViewerVersion] = useState(0);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewData, setReviewData] = useState(null);

  const documentNode = useMemo(() => {
    if (!TemplateComponent || !debouncedData) {
      return null;
    }

    try {
      // Deep validation to ensure no undefined/null in critical fields
      const validatedData = {
        ...debouncedData,
        skills: Array.isArray(debouncedData.skills) 
          ? debouncedData.skills.filter(s => s && (s.id || s.name))
          : [],
        languages: Array.isArray(debouncedData.languages)
          ? debouncedData.languages.filter(l => l && l.id)
          : [],
        awards: Array.isArray(debouncedData.awards)
          ? debouncedData.awards.filter(a => a && a.id)
          : [],
        experience: Array.isArray(debouncedData.experience)
          ? debouncedData.experience.filter(e => e && e.id)
          : [],
        education: Array.isArray(debouncedData.education)
          ? debouncedData.education.filter(e => e && e.id)
          : [],
      };

      return <TemplateComponent data={validatedData} />;
    } catch (error) {
      console.error("Error rendering template:", error);
      console.error("Data causing error:", JSON.stringify(debouncedData, null, 2));
      return null;
    }
  }, [TemplateComponent, debouncedData]);

  useEffect(() => {
    if (TemplateComponent !== lastTemplateRef.current) {
      lastTemplateRef.current = TemplateComponent;
      setDebouncedData(data);
      setViewerVersion((version) => version + 1);
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedData(data);
      setViewerVersion((version) => version + 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [data, TemplateComponent]);

  const isGenerating = debouncedData !== data;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        toast.success(`Đã tải lên: ${file.name}`);
        // TODO: Parse PDF and populate data
      } else {
        toast.error("Vui lòng chọn file PDF");
      }
    }
  };

  const handleAIReview = async () => {
    if (!cvData) {
      toast.error("Không có dữ liệu CV để đánh giá");
      return;
    }

    setReviewLoading(true);
    try {
      const endpoint = job
        ? `/jobs/${job.id}/cv-review`
        : `/candidates/cv-review`;

      const response = await http(endpoint, {
        method: "POST",
        body: { cvData },
      });

      const review = response.data || response;
      setReviewData(review);
      setIsReviewOpen(true);
      toast.success("Đánh giá CV thành công!");
    } catch (error) {
      console.error("CV Review Error:", error);
      toast.error(`Lỗi đánh giá CV: ${error.message}`);
    } finally {
      setReviewLoading(false);
    }
  };

  if (!TemplateComponent) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center text-slate-500 p-6 shadow-sm">
        <AlertCircle size={28} className="text-slate-400 mb-2" />
        <p className="text-xs font-semibold">
          Hãy chọn một mẫu template ở trên để xem trước CV
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-250 bg-white shadow-sm">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-4 py-3">
        <div>
          <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
            Bản xem trước PDF
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {/* AI Review Button */}
          <button
            type="button"
            onClick={handleAIReview}
            disabled={reviewLoading}
            className="inline-flex items-center gap-1 rounded border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 hover:bg-purple-100/50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={12} className={reviewLoading ? "animate-spin" : ""} />
            {reviewLoading ? "Đang xử lý..." : "Đánh giá bằng AI"}
          </button>

          {/* Download Button */}
          {documentNode ? (
            <BlobProvider key={viewerVersion} document={documentNode}>
              {({ url, loading }) => (
                <a
                  href={url ?? "#"}
                  download={fileName}
                  className={`inline-flex items-center gap-1 rounded bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800 cursor-pointer ${
                    loading ? "cursor-not-allowed opacity-75" : ""
                  }`}
                >
                  <Download size={12} />
                  {loading ? "Đang tạo..." : "Tải PDF"}
                </a>
              )}
            </BlobProvider>
          ) : (
            <span className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-400">
              <Download size={12} />
              Không khả dụng
            </span>
          )}
        </div>
      </div>

      <div className="relative flex-1 bg-slate-150/50 p-4 overflow-hidden flex items-center justify-center">
        {isGenerating && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <LoadingSpinner message="Đang cập nhật..." variant="overlay" />
          </div>
        )}

        {documentNode ? (
          <div className="w-full h-full rounded border border-slate-200 bg-white shadow-sm overflow-hidden">
            <PDFViewer key={viewerVersion} style={{ width: "100%", height: "100%", border: "none" }} showToolbar={false}>
              {documentNode}
            </PDFViewer>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-500 bg-white rounded border border-dashed border-slate-250 p-6 text-center max-w-sm">
            <div>
              <AlertCircle className="mx-auto text-amber-500 mb-2" size={24} />
              <p className="font-semibold text-slate-800">Không thể hiển thị bản xem trước</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Dữ liệu CV hiện tại chưa đầy đủ để kết xuất PDF.</p>
            </div>
          </div>
        )}
      </div>

      {/* AI Review Modal */}
      {isReviewOpen && reviewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 mt-16">
          <div className="max-h-[85vh] w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-xl flex flex-col border border-slate-200 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles size={14} className="text-purple-600" />
                Kết quả đánh giá CV (AI)
              </h3>
              <button
                onClick={() => setIsReviewOpen(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-700 text-xs">
              {/* Score card */}
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 flex items-center gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-150 text-indigo-700 text-2xl font-bold shadow-2xs">
                  {reviewData.overallScore}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Điểm đánh giá</p>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {reviewData.overallScore >= 80 ? "CV đạt tiêu chuẩn cao! ✨" :
                     reviewData.overallScore >= 60 ? "CV tương đối đầy đủ thông tin 👍" :
                     "CV cần hoàn thiện thêm ✍️"}
                  </p>
                </div>
              </div>

              {/* Summary */}
              {reviewData.summary && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tóm tắt chung</p>
                  <p className="text-slate-600 leading-relaxed bg-slate-50/50 rounded-lg p-3.5 border border-slate-100">
                    {reviewData.summary}
                  </p>
                </div>
              )}

              {/* Strengths */}
              {reviewData.strengths && reviewData.strengths.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Điểm mạnh</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 leading-relaxed">
                    {reviewData.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {reviewData.improvements && reviewData.improvements.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cần cải thiện</p>
                  <div className="space-y-2">
                    {reviewData.improvements.map((item, idx) => (
                      <div key={idx} className="rounded-lg border border-slate-200 p-3 bg-white">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="inline-flex rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-700">
                              {item.section === "personal" ? "Cá nhân" :
                               item.section === "contact" ? "Liên hệ" :
                               item.section === "experience" ? "Kinh nghiệm" :
                               item.section === "education" ? "Học vấn" :
                               item.section === "skills" ? "Kỹ năng" :
                               item.section}
                            </span>
                            <p className="text-slate-600 mt-1">{item.suggestion}</p>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            item.priority === "high" ? "bg-red-50 text-red-700" :
                            item.priority === "medium" ? "bg-amber-50 text-amber-700" :
                            "bg-slate-50 text-slate-500"
                          }`}>
                            {item.priority === "high" ? "Cao" : item.priority === "medium" ? "TB" : "Thấp"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Job Fit (if available) */}
              {reviewData.jobFit && (
                <div className="rounded-lg border border-indigo-100 bg-indigo-50/20 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-indigo-100/50 pb-2">
                    <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Phù hợp công việc</p>
                    <span className="font-extrabold text-indigo-700">{reviewData.jobFit.matchScore}%</span>
                  </div>

                  <div className="space-y-3">
                    {reviewData.jobFit.matchedRequirements && reviewData.jobFit.matchedRequirements.length > 0 && (
                      <div>
                        <p className="text-[9px] font-semibold text-slate-400 uppercase mb-1">Yêu cầu đáp ứng</p>
                        <div className="flex flex-wrap gap-1">
                          {reviewData.jobFit.matchedRequirements.map((req, idx) => (
                            <span key={idx} className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] border border-green-100">
                              ✓ {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {reviewData.jobFit.missingRequirements && reviewData.jobFit.missingRequirements.length > 0 && (
                      <div>
                        <p className="text-[9px] font-semibold text-slate-400 uppercase mb-1">Yêu cầu còn thiếu</p>
                        <div className="flex flex-wrap gap-1">
                          {reviewData.jobFit.missingRequirements.map((req, idx) => (
                            <span key={idx} className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] border border-amber-100">
                              ⚠ {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
              <button
                onClick={() => setIsReviewOpen(false)}
                className="w-full rounded bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition cursor-pointer"
              >
                Đóng kết quả
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfPreview;

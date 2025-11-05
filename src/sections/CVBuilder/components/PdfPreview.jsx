import { useMemo, useState, useEffect, useRef } from "react";
import { BlobProvider, PDFViewer } from "@react-pdf/renderer";
import { Download, Upload, Sparkles } from "lucide-react";
import { toast } from "sonner";

const PdfPreview = ({ TemplateComponent, data, fileName }) => {
  const [debouncedData, setDebouncedData] = useState(data);
  const fileInputRef = useRef(null);
  const lastTemplateRef = useRef(TemplateComponent);
  const [viewerVersion, setViewerVersion] = useState(0);

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

  const handleUploadCV = () => {
    fileInputRef.current?.click();
  };

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

  const handleAIReview = () => {
    toast.info("Tính năng AI đánh giá CV đang được phát triển! 🚀");
    // TODO: Implement AI review logic
  };

  if (!TemplateComponent) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 text-center text-slate-500">
        <p className="text-sm font-medium">
          Hãy chọn một template để xem trước CV
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-lg">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-5 py-3">
        <div>
          <p className="text-sm font-medium text-slate-900">Xem trước PDF</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Upload CV Button */}
          <button
            type="button"
            onClick={handleUploadCV}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 text-sm font-medium flex items-center gap-1.5"
          >
            <Upload size={14} />
            Tải lên
          </button>

          {/* AI Review Button */}
          <button
            type="button"
            onClick={handleAIReview}
            className="rounded-full border border-purple-200 bg-purple-50 px-3 py-2 text-purple-600 transition hover:border-purple-300 hover:bg-purple-100 text-sm font-medium flex items-center gap-1.5"
          >
            <Sparkles size={14} />
            Đánh giá CV
          </button>

          {/* Download Button */}
          {documentNode ? (
            <BlobProvider key={viewerVersion} document={documentNode}>
              {({ url, loading }) => (
                <a
                  href={url ?? "#"}
                  download={fileName}
                  className={`inline-flex items-center gap-2 rounded-full border border-indigo-200 px-4 py-2 text-sm font-medium transition ${
                    loading
                      ? "cursor-not-allowed bg-indigo-100 text-indigo-400"
                      : "bg-indigo-50 text-indigo-600 hover:border-indigo-300 hover:bg-white"
                  }`}
                >
                  <Download size={14} />
                  {loading ? "Đang chuẩn bị" : "Tải về PDF"}
                </a>
              )}
            </BlobProvider>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400">
              <Download size={14} />
              Không thể tải PDF
            </span>
          )}
        </div>
      </div>

      <div className="relative flex-1 bg-slate-100">
        {isGenerating && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/95 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-3 h-3 bg-pink-600 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-700 font-semibold">
                  Đang cập nhật CV...
                </p>
              </div>
            </div>
          </div>
        )}

        {documentNode ? (
          <PDFViewer key={viewerVersion} style={{ width: "100%", height: "100%" }} showToolbar={false}>
            {documentNode}
          </PDFViewer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Không thể hiển thị PDF với dữ liệu hiện tại.
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfPreview;

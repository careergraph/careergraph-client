// /src/components/job-detail/AdminFormatSection.jsx
import Section from "~/components/job-detail/Section";
import DOMPurify from "dompurify";

export default function AdminFormatSection({
  title = "Thông tin công việc",
  html,           // string HTML lấy từ Admin (đã format sẵn: h3, ul/li, p,...)
  isLoading = false,
  className = "",
}) {
  if (isLoading) {
    return (
      <Section title={title}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-1/3 bg-slate-200 rounded" />
          <div className="h-4 w-2/3 bg-slate-200 rounded" />
          <div className="h-4 w-1/2 bg-slate-200 rounded" />
        </div>
      </Section>
    );
  }

  if (!html) {
    return (
      <Section title={title}>
        <div className="text-slate-500">Chưa có nội dung từ Admin.</div>
      </Section>
    );
  }

  // Sanitize rồi render HTML
  const safe = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

  return (
    <Section title={title}>
      <div
        className={`prose prose-slate max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    </Section>
  );
}

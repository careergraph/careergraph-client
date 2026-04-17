export default function resolveResumeLabel (resume) {
  const raw = resume?.fileName || resume?.name || resume?.originalFileName || resume?.url;
    if (!raw) return "CV";

  const cleaned = String(raw).split("/").pop() || String(raw);
  return cleaned.length > 60 ? `${cleaned.slice(0, 57)}...` : cleaned;
  };
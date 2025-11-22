export default function resolveResumeLabel (resume) {
    const raw = resume?.name || resume?.url;
    console.log(raw)
    if (!raw) return "CV";

    const cleaned = raw.split("/").pop()?.split("_").slice(1).join("_") || raw;
    return cleaned.length > 40 ? `${cleaned.slice(0, 37)}...` : cleaned;
  };
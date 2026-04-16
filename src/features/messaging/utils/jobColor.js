const JOB_COLORS = ["#378ADD", "#534AB7", "#1D9E75", "#D85A30", "#D4537E"];

const cache = new Map();
let colorIndex = 0;

export function getJobColor(jobId) {
  const normalized = (jobId || "").trim();
  if (!normalized) {
    return "#64748b";
  }

  if (!cache.has(normalized)) {
    const color = JOB_COLORS[colorIndex % JOB_COLORS.length];
    cache.set(normalized, color);
    colorIndex += 1;
  }

  return cache.get(normalized) || "#64748b";
}

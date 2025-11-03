const safeText = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string") return value.trim();
  return "";
};

const parseOptionalNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const toCleanArray = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map(safeText).filter(Boolean);
  }

  const single = safeText(input);
  return single ? [single] : [];
};

const unwrapJobList = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  const guesses = [
    payload?.data,
    payload?.content,
    payload?.items,
    payload?.results,
    payload?.data?.data,
    payload?.data?.content,
    payload?.data?.items,
    payload?.data?.results,
    payload?.data?.list,
    payload?.data?.rows,
  ];

  for (const candidate of guesses) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  const visited = new Set();
  const stack = [payload];

  while (stack.length && visited.size < 50) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;
    if (visited.has(current)) continue;
    visited.add(current);

    for (const value of Object.values(current)) {
      if (Array.isArray(value)) {
        return value;
      }
      if (value && typeof value === "object" && !visited.has(value)) {
        stack.push(value);
      }
    }
  }

  return [];
};

const unwrapJobDetail = (payload) => {
  if (!payload) return null;

  const candidates = [payload.job, payload.data, payload.content, payload.item, payload];
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (Array.isArray(candidate)) {
      return candidate[0] ?? null;
    }
    if (typeof candidate === "object") {
      return candidate;
    }
  }

  return null;
};

const formatLocation = (job) => {
  const specific = safeText(job?.specific || job?.address || job?.addressLine || job?.meta?.raw?.address);
  if (specific) return specific;

  const district = safeText(
    job?.districtName || job?.districtLabel || job?.district || job?.meta?.raw?.district
  );
  const city = safeText(job?.cityName || job?.cityLabel || job?.city || job?.meta?.raw?.city);
  const state = safeText(job?.stateName || job?.stateLabel || job?.state || job?.meta?.raw?.state);

  const parts = [district, city, state].filter(Boolean);
  if (parts.length) return parts.join(", ");

  const fallback = safeText(job?.location || job?.meta?.raw?.location);
  return fallback || "Địa điểm chưa cập nhật";
};

const formatSalary = (job) => {
  const candidates = [
    job?.salaryRange,
    job?.salary,
    job?.compensation,
    job?.meta?.raw?.salaryRange,
    job?.meta?.raw?.salary,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }

    if (typeof candidate === "object") {
      const minValue = parseOptionalNumber(candidate.min ?? candidate.minimum);
      const maxValue = parseOptionalNumber(candidate.max ?? candidate.maximum);
      const currency = candidate.currency || candidate.unit;

      if (minValue !== null || maxValue !== null) {
        const formatNumber = (value) => value.toLocaleString("vi-VN");

        const unique = [minValue, maxValue]
          .filter((value, index, arr) => value !== null && arr.indexOf(value) === index)
          .map(formatNumber)
          .join(" - ");

        const label = unique || safeText(candidate.label);
        if (label) {
          return currency ? `${label} ${currency}`.trim() : label;
        }
      }

      const label = safeText(candidate.label || candidate.text);
      if (label) return label;
    }
  }

  return "Thoả thuận";
};

const resolvePhotoUrl = (job, fallbackLabel) => {
  const candidates = [
    job?.photo,
    job?.photoUrl,
    job?.thumbnail,
    job?.image,
    job?.logo,
    job?.logoUrl,
    job?.companyLogo,
    job?.meta?.raw?.photo,
    job?.meta?.raw?.logo,
    job?.meta?.raw?.companyLogo,
  ]
    .map(safeText)
    .filter(Boolean);

  if (candidates.length) {
    return candidates[0];
  }

  const label = fallbackLabel || "CareerGraph";
  return `https://avatar.oxro.io/avatar.svg?name=${encodeURIComponent(label)}`;
};

const normalizeLikes = (job) => {
  const candidates = [
    job?.likes,
    job?.likesCount,
    job?.likeCount,
    job?.metrics?.likes,
    job?.stats?.likes,
    job?.meta?.raw?.likes,
    job?.meta?.raw?.likeCount,
  ];

  for (const candidate of candidates) {
    const numeric = Number(candidate);
    if (Number.isFinite(numeric) && numeric > 0) {
      return Math.round(Math.max(0, numeric));
    }
  }

  return 0;
};

const normalizeId = (job) => {
  const candidates = [job?.id, job?.jobId, job?.uuid, job?.slug];
  for (const candidate of candidates) {
    const text = safeText(candidate);
    if (text) return text;
  }
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `job-${Math.random().toString(36).slice(2, 10)}`;
};

const normalizeExperience = (job) => {
  const min =
    parseOptionalNumber(job?.minExperience) ??
    parseOptionalNumber(job?.experience?.min) ??
    parseOptionalNumber(job?.experienceMin) ??
    parseOptionalNumber(job?.meta?.raw?.minExperience);

  const max =
    parseOptionalNumber(job?.maxExperience) ??
    parseOptionalNumber(job?.experience?.max) ??
    parseOptionalNumber(job?.experienceMax) ??
    parseOptionalNumber(job?.meta?.raw?.maxExperience);

  const level = safeText(job?.experienceLevel || job?.level || job?.experience?.label);

  return {
    min,
    max,
    level,
  };
};

const buildSummary = (job) => {
  const candidates = [
    job?.summary,
    job?.shortDescription,
    job?.description,
    job?.meta?.raw?.description,
    job?.responsibilities?.[0],
    job?.qualifications?.[0],
    job?.minimumQualifications?.[0],
  ];

  for (const candidate of candidates) {
    const text = safeText(candidate);
    if (text) {
      return text;
    }
  }

  return "Mô tả công việc đang được cập nhật.";
};

const normalizeTags = (job, limit = 3) => {
  const result = [];

  const addCandidate = (value) => {
    const text = safeText(value);
    if (text && !result.includes(text) && result.length < limit) {
      result.push(text);
    }
  };

  const addFrom = (values) => {
    toCleanArray(values).forEach(addCandidate);
  };

  addFrom(job?.skills);
  addFrom(job?.techStack);
  addFrom(job?.keywords);

  if (!result.length) {
    [job?.experienceLevel, job?.employmentType, job?.jobCategory, job?.department].forEach(
      addCandidate
    );
  }

  return result.slice(0, limit);
};

const normalizeJob = (job = {}) => {
  const title = safeText(job.title || job.name) || "Đang cập nhật";
  const department = safeText(job.department || job.departmentName);
  const company =
    safeText(job.company || job.companyName || job.employerName) ||
    department ||
    safeText(job.jobCategory) ||
    "Đang cập nhật";

  return {
    id: normalizeId(job),
    title,
    company,
    department,
    jobCategory: safeText(job.jobCategory),
    description: safeText(job.description),
    summary: buildSummary(job),
    location: formatLocation(job),
    address: safeText(job.specific || job.address || job.addressLine),
    salaryRange: formatSalary(job),
    photoUrl: resolvePhotoUrl(job, company || title),
    likes: normalizeLikes(job),
    isLiked: Boolean(job.isLiked || job.liked || job.userLiked),
    detailUrl:
      safeText(job.detailUrl || job.url || job.jobUrl || job.applyUrl || job.meta?.raw?.url) || "",
    employmentType: safeText(job.employmentType || job.type),
    remoteJob: Boolean(job.remoteJob || job.isRemote),
    experience: normalizeExperience(job),
    postedDate: safeText(job.postedDate || job.createdAt),
    expiryDate: safeText(job.expiryDate || job.deadline),
    numberOfPositions: parseOptionalNumber(
      job?.numberOfPositions ?? job?.vacancies ?? job?.meta?.raw?.numberOfPositions
    ),
    contact: {
      email: safeText(job.contactEmail || job.email || job.meta?.raw?.contactEmail),
      phone: safeText(job.contactPhone || job.phone || job.meta?.raw?.contactPhone),
    },
    skills: normalizeTags(job),
    responsibilities: toCleanArray(job.responsibilities),
    qualifications: toCleanArray(job.qualifications),
    minimumQualifications: toCleanArray(job.minimumQualifications),
  };
};

export {
  unwrapJobList,
  unwrapJobDetail,
  normalizeJob,
  safeText,
  parseOptionalNumber,
  toCleanArray,
  formatLocation,
  formatSalary,
  resolvePhotoUrl,
  normalizeLikes,
  normalizeId,
  normalizeExperience,
  buildSummary,
  normalizeTags,
};

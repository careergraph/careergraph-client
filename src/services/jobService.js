// src/services/jobService.js
import { JobAPI } from "./api/job";

/**
 * Giải nén danh sách công việc từ mọi kiểu response phổ biến (array trực tiếp, data/content/items...).
 */
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

/**
 * Chuyển giá trị bất kỳ sang chuỗi đã được trim; trả chuỗi rỗng nếu không hợp lệ.
 */
const safeText = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string") return value.trim();
  return "";
};

/**
 * Ép kiểu dữ liệu bất kỳ sang số nếu hợp lệ, ngược lại trả về null.
 */
const parseOptionalNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

/**
 * Chuẩn hoá input về mảng string, đồng thời loại bỏ giá trị rỗng.
 */
const toCleanArray = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) {
    return input.map(safeText).filter(Boolean);
  }

  const single = safeText(input);
  return single ? [single] : [];
};

/**
 * Giải nén dữ liệu chi tiết của một job (nhiều API trả về trong các field job/data/content...).
 */
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

/**
 * Định dạng địa điểm hiển thị ưu tiên địa chỉ cụ thể rồi tới quận/thành phố/tỉnh.
 */
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

/**
 * Chuyển thông tin lương về chuỗi dễ đọc, hỗ trợ cả dạng object {min, max, currency}.
 */
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

/**
 * Tạo ảnh đại diện cho công việc (ưu tiên logo từ API, fallback avatar động theo tên công ty/công việc).
 */
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

/**
 * Đảm bảo thống kê lượt thích luôn là số nguyên không âm.
 */
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

/**
 * Gom id duy nhất (backend đôi khi trả về jobId/uuid/slug).
 */
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

/**
 * Chuẩn hoá thông tin số năm kinh nghiệm.
 */
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

/**
 * Tạo mô tả ngắn gọn cho job, ưu tiên description rồi tới các phần tử đầu của responsibilities/qualifications.
 */
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

/**
 * Chọn tối đa `limit` tag súc tích để hiển thị (ưu tiên skills, fallback các thuộc tính khác).
 */
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

/**
 * Chuẩn hoá một job về interface thống nhất cho UI (danh sách + chi tiết dùng chung).
 */
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

/**
 * Helper chung để gọi API danh sách và trả về job đã chuẩn hoá.
 */
const fetchJobs = async (fetcher, options = {}) => {
  try {
    const response = await fetcher(options);
    return unwrapJobList(response).map(normalizeJob);
  } catch (error) {
    if (error?.code === "ERR_CANCELED") {
      return [];
    }
    console.error("Không thể lấy danh sách việc làm:", error);
    return [];
  }
};

/**
 * Gọi API chi tiết và trả về job đã chuẩn hoá (trả về null nếu lỗi hoặc không tìm thấy dữ liệu).
 */
const fetchJobDetail = async (id, options = {}) => {
  if (!id) return null;

  try {
    const response = await JobAPI.getJobDetail(id, options);
    const rawJob = unwrapJobDetail(response);
    if (!rawJob) return null;
    return normalizeJob(rawJob);
  } catch (error) {
    if (error?.code === "ERR_CANCELED") {
      return null;
    }
    console.error(`Không thể lấy chi tiết việc làm (${id}):`, error);
    return null;
  }
};

export const JobService = {
  /** Lấy toàn bộ danh sách việc làm để hiển thị ở trang Jobs. */
  fetchAllJobs(options) {
    return fetchJobs(JobAPI.getJobs, options);
  },

  /** Lấy danh sách việc làm phổ biến trên hệ thống. */
  fetchPopularJobs(options) {
    return fetchJobs(JobAPI.getPopularJobs, options);
  },

  /** Lấy danh sách việc làm cá nhân hoá cho người dùng hiện tại. */
  fetchPersonalizedJobs(options) {
    return fetchJobs(JobAPI.getPersonalizedJobs, options);
  },

  /** Lấy chi tiết một việc làm cụ thể bằng id. */
  fetchJobDetail(id, options) {
    return fetchJobDetail(id, options);
  },
};

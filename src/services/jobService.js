// src/services/jobService.js
import { JobAPI } from "./api/job";
import {
  normalizeJob,
  parseOptionalNumber,
  unwrapJobDetail,
  unwrapJobList,
} from "~/utils/jobFormat";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 5;

const toPositiveNumber = (value) => {
  const numeric = parseOptionalNumber(value);
  return numeric !== null && numeric > 0 ? numeric : null;
};

const toNonNegativeNumber = (value) => {
  const numeric = parseOptionalNumber(value);
  return numeric !== null && numeric >= 0 ? numeric : null;
};

const trimText = (value) => (typeof value === "string" ? value.trim() : "");

const toUpperSnake = (value) => {
  const input = trimText(value);
  if (!input) {
    return undefined;
  }

  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`]/g, "")
    .replace(/[-\s]+/g, "_")
    .toUpperCase();
};

const normalizeFilterArray = (values) => {
  if (!values) {
    return [];
  }

  const entries = Array.isArray(values) ? values : [values];
  const result = [];

  for (const entry of entries) {
    const normalized = toUpperSnake(entry);
    if (normalized && !result.includes(normalized)) {
      result.push(normalized);
    }
  }

  return result;
};

const mapClientFilters = (filters = {}, city) => {
  const jobCategory =
    filters.jobCategory && filters.jobCategory !== "ALL"
      ? normalizeFilterArray(filters.jobCategory)
      : [];

  const payload = {
    city: trimText(city) || "",
    jobCategories: jobCategory,
    employmentTypes: normalizeFilterArray(filters.employmentTypes),
    experienceLevels: normalizeFilterArray(filters.experienceLevels),
    educationTypes: normalizeFilterArray(filters.educationLevels),
    statuses: normalizeFilterArray(filters.statuses),
  };

  return Object.keys(payload).reduce((result, key) => {
    const value = payload[key];
    if (Array.isArray(value)) {
      result[key] = value;
    } else {
      result[key] = value ?? null;
    }
    return result;
  }, {});
};

const mapSearchRequest = (options = {}) => {
  const page = toPositiveNumber(options.page) ?? DEFAULT_PAGE;
  const size = toPositiveNumber(options.size) ?? DEFAULT_PAGE_SIZE;
  const query = trimText(options.keyword ?? options.query ?? "");
  const filter = mapClientFilters(options.filters, options.city ?? options.location);

  return {
    page,
    size,
    query: query || null,
    filter,
  };
};

/**
 * Normalize pagination numbers and guard against invalid values.
 */
const ensurePagination = ({ page, size, totalItems, totalPages }) => {
  const safeSize = Math.max(1, Math.round(size ?? DEFAULT_PAGE_SIZE));
  const safeTotalItems = Math.max(0, Math.round(totalItems ?? 0));
  const computedPages = Math.max(1, Math.ceil(safeTotalItems / safeSize) || 1);
  const safeTotalPages = Math.max(1, Math.round(totalPages ?? computedPages));
  const boundedPage = Math.min(
    Math.max(DEFAULT_PAGE, Math.round(page ?? DEFAULT_PAGE)),
    safeTotalPages
  );

  return {
    page: boundedPage,
    size: safeSize,
    totalItems: safeTotalItems,
    totalPages: safeTotalPages,
  };
};

/**
 * Translate backend pagination (0-based) into UI-friendly numbers.
 */
const resolvePagination = (payload, request, itemCount) => {
  // API wraps pagination in payload.data, so unwrap it first
  const paginationData = payload?.data ?? payload;

  const zeroBasedPage = toNonNegativeNumber(
    paginationData?.number ?? paginationData?.pageable?.pageNumber
  );
  const sizeCandidate =
    toPositiveNumber(
      paginationData?.size ??
        paginationData?.pageSize ??
        paginationData?.pageable?.pageSize
    ) ??
    request.size ??
    (itemCount || DEFAULT_PAGE_SIZE);
  const totalItemsCandidate =
    toNonNegativeNumber(paginationData?.totalElements) ?? itemCount ?? 0;

  // Read totalPages directly from payload, or calculate as fallback
  const totalPagesFromPayload = toPositiveNumber(paginationData?.totalPages);
  const totalPagesCandidate =
    totalPagesFromPayload ??
    Math.max(1, Math.ceil(totalItemsCandidate / sizeCandidate));

  const result = ensurePagination({
    page: (zeroBasedPage ?? request.page - 1) + 1,
    size: sizeCandidate,
    totalItems: totalItemsCandidate,
    totalPages: totalPagesCandidate,
  });

  return result;
};

/**
 * Build a minimal pagination response when the API does not return one.
 */
const createFallbackPagination = (request, itemCount = 0) =>
  ensurePagination({
    page: request.page,
    size: request.size ?? (itemCount || DEFAULT_PAGE_SIZE),
    totalItems: itemCount,
  });

const fetchJobs = async (fetcher, options = {}) => {
  try {
    const response = await fetcher(options);
    const rawItems = unwrapJobList(response);
    const items = rawItems.map(normalizeJob);
    return { items, response, error: null };
  } catch (error) {
    if (error?.code !== "ERR_CANCELED") {
      console.error("Không thể lấy danh sách việc làm:", error);
    }
    return { items: [], response: null, error };
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
    
    if (!rawJob) {
      return null;
    }

    return normalizeJob(rawJob);;
  } catch (error) {
    console.error(`Lỗi khi lấy chi tiết việc làm (${id}):`, error);
    return null;
  }
};

const fetchJobsByCompany = async (companyId, options = { size: 5 }) => {
  if (!companyId) return { jobs: [], total: 0 };

  try {
    const response = await JobAPI.getJobsByCompany(companyId, options);
    const rawJobs = unwrapJobList(response);

    if (!rawJobs || !Array.isArray(rawJobs)) {
      return { jobs: [], total: 0 };
    }

    const jobs = rawJobs.map(normalizeJob);

    return {
      jobs,
      total: response?.data?.totalElements ?? jobs.length,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách job của công ty:", error);
    return { jobs: [], total: 0 };
  }
};

const fetchSimilarJobs = async (jobId, options = { size: 5 }) => {
  if (!jobId) return { jobs: [], total: 0 };

  try {
    const response = await JobAPI.getSimilarJobs(jobId, options);
    const rawJobs = unwrapJobList(response);

    if (!rawJobs || !Array.isArray(rawJobs)) {
      return { jobs: [], total: 0 };
    }

    const jobs = rawJobs.map(normalizeJob);

    return {
      jobs,
      total: response?.data?.totalElements ?? jobs.length,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách job tương tự:", error);
    return { jobs: [], total: 0 };
  }
};

export const JobService = {
  /** Lấy toàn bộ danh sách việc làm để hiển thị ở trang Jobs. */
  async fetchAllJobs(options = {}) {
    const {
      signal,
      page: requestedPageValue,
      size: requestedSizeValue,
      ...rest
    } = options;

    const requestedPage = toPositiveNumber(requestedPageValue) ?? DEFAULT_PAGE;
    const requestedSize = toPositiveNumber(requestedSizeValue);
    const requestMeta = {
      page: requestedPage,
      size: requestedSize ?? undefined,
    };

    const apiOptions = {
      ...rest,
      page: Math.max(0, requestedPage - 1),
      ...(requestedSize ? { size: requestedSize } : {}),
      ...(signal ? { signal } : {}),
    };

    const { items, response, error } = await fetchJobs(
      JobAPI.getJobs,
      apiOptions
    );

    if (error?.code === "ERR_CANCELED") {
      return {
        jobs: [],
        pagination: createFallbackPagination(requestMeta),
      };
    }

    if (error) {
      return {
        jobs: [],
        pagination: createFallbackPagination(requestMeta),
      };
    }

    const pagination = resolvePagination(response, requestMeta, items.length);

    return {
      jobs: items,
      pagination,
    };
  },

  /** Tìm kiếm việc làm theo từ khoá, địa điểm và bộ lọc. */
  async searchJobs(options = {}) {
    const {
      signal,
      filters,
      keyword,
      query,
      city,
      location,
      page: requestedPageValue,
      size: requestedSizeValue,
      ...rest
    } = options;

    const mapped = mapSearchRequest({
      filters,
      keyword: keyword ?? query,
      city: city ?? location,
      page: requestedPageValue,
      size: requestedSizeValue,
    });

    const requestMeta = {
      page: mapped.page,
      size: mapped.size,
    };

    const apiOptions = {
      ...rest,
      signal,
      page: Math.max(0, mapped.page - 1),
      size: mapped.size,
      query: mapped.query,
      filter: mapped.filter,
    };

    const { items, response, error } = await fetchJobs(
      JobAPI.searchJobs,
      apiOptions
    );

    if (error?.code === "ERR_CANCELED") {
      return {
        jobs: [],
        pagination: createFallbackPagination(requestMeta),
      };
    }

    if (error) {
      return {
        jobs: [],
        pagination: createFallbackPagination(requestMeta),
      };
    }

    const pagination = resolvePagination(response, requestMeta, items.length);

    return {
      jobs: items,
      pagination,
    };
  },

  /** Lấy danh sách việc làm phổ biến trên hệ thống. */
  async fetchPopularJobs(options) {
    const { items } = await fetchJobs(JobAPI.getPopularJobs, options);
    return items;
  },

  /** Lấy danh sách việc làm cá nhân hoá cho người dùng hiện tại. */
  async fetchPersonalizedJobs(options) {
    const { items } = await fetchJobs(JobAPI.getPersonalizedJobs, options);
    return items;
  },

  /** Lấy chi tiết một việc làm cụ thể bằng id. */
  fetchJobDetail(id, options) {
    return fetchJobDetail(id, options);
  },

  /** Lấy danh sách job của một công ty (limit 5). */
  fetchJobsByCompany(companyId, options) {
    return fetchJobsByCompany(companyId, options);
  },

  /** Lấy danh sách job tương tự (limit 5). */
  fetchSimilarJobs(jobId, options) {
    return fetchSimilarJobs(jobId, options);
  },

  /** Gửi đơn ứng tuyển cho job. */
  async applyToJob(jobId, payload) {
    return JobAPI.applyToJob(jobId, payload);
  },
};

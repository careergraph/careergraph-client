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
};

// src/services/api/job.js
import { apiConfig } from "~/config";
import { http } from "../http/request";
import { getToken } from "~/utils/storage";

export const JobAPI = {
  /**
   * Gọi API lấy toàn bộ danh sách việc làm.
   */
  getJobs(params = {}) {
    const { signal, page, size, ...rest } = params || {};

    const searchParams = new URLSearchParams();

    const appendParam = (key, value) => {
      if (value === undefined || value === null || value === "") {
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((entry) => {
          if (entry !== undefined && entry !== null && entry !== "") {
            searchParams.append(key, entry);
          }
        });
        return;
      }
      searchParams.set(key, value);
    };

    appendParam("page", page);
    appendParam("size", size);

    Object.entries(rest).forEach(([key, value]) => {
      appendParam(key, value);
    });

    const path = searchParams.toString()
      ? `${apiConfig.endpoints.jobs.list}?${searchParams.toString()}`
      : apiConfig.endpoints.jobs.list;

    return http(path, {
      method: "GET",
      auth: false,
      signal,
    });
  },

  /**
   * Gọi API tìm kiếm việc làm với bộ lọc nâng cao.
   */
  searchJobs({ signal, page, size, query, filter } = {}) {
    const searchParams = new URLSearchParams();

    const appendParam = (key, value) => {
      if (value === undefined) {
        return;
      }
      searchParams.set(key, value ?? "");
    };

    appendParam("page", page);
    appendParam("size", size);
    appendParam("query", query);

    const path = searchParams.toString()
      ? `${apiConfig.endpoints.jobs.search}?${searchParams.toString()}`
      : apiConfig.endpoints.jobs.search;

    const payload =
      filter && typeof filter === "object" && !Array.isArray(filter)
        ? filter
        : {};

    return http(path, {
      method: "POST",
      auth: false,
      body: payload,
      signal,
    });
  },

  /**
   * Gọi API lấy danh sách việc làm phổ biến (endpoint public nên không cần token).
   */
  getPopularJobs({ signal } = {}) {
    return http(apiConfig.endpoints.jobs.popular, {
      method: "GET",
      auth: false,
      signal,
    });
  },

  /**
   * Gọi API lấy việc làm cá nhân hoá. Nếu đã đăng nhập thì đính kèm token, ngược lại gọi bình thường.
   */
  getPersonalizedJobs({ signal } = {}) {
    const token = getToken();
    return http(apiConfig.endpoints.jobs.personalized, {
      method: "GET",
      auth: false,
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : undefined,
      signal,
    });
  },

  /**
   * Gọi API lấy chi tiết việc làm theo id.
   */
  getJobDetail(id, { signal } = {}) {
    if (!id) {
      return Promise.reject(new Error("Job id is required"));
    }

    const path = apiConfig.endpoints.jobs.detail.replace(":id", id);

    return http(path, {
      method: "GET",
      auth: false,
      signal,
    });
  },

  /**
   * Gọi API lấy danh sasch job của một công ty (size parameter).
   */
  getJobsByCompany(id, { signal, size } = {}) {
    if (!id) {
      return Promise.reject(new Error("Company id is required"));
    }

    const path = apiConfig.endpoints.company.jobs.replace(":id", id);
    const searchParams = new URLSearchParams();
    
    if (size) {
      searchParams.set("size", size);
    }

    const fullPath = searchParams.toString()
      ? `${path}?${searchParams.toString()}`
      : path;

    return http(fullPath, {
      method: "GET",
      auth: false,
      signal,
    });
  },

  /**
   * Gọi API lấy danh sách job tương tự (size parameter).
   */
  getSimilarJobs(id, { signal, size } = {}) {
    if (!id) {
      return Promise.reject(new Error("Job id is required"));
    }

    const path = apiConfig.endpoints.jobs.similar.replace(":id", id);
    const searchParams = new URLSearchParams();
    
    if (size) {
      searchParams.set("size", size);
    }

    const fullPath = searchParams.toString()
      ? `${path}?${searchParams.toString()}`
      : path;

    return http(fullPath, {
      method: "GET",
      auth: false,
      signal,
    });
  },

  /**
   * Gửi đơn ứng tuyển cho một job cụ thể.
   * Lưu ý: cập nhật `apiConfig.endpoints.jobs.apply` nếu BE dùng đường dẫn khác.
   */
  applyToJob(id, payload = {}) {
    if (!id) {
      return Promise.reject(new Error("Job id is required"));
    }

    const path = apiConfig.endpoints.jobs.apply.replace(":id", id);

    return http(path, {
      method: "POST",
      body: payload,
      auth: true,
    });
  },
};

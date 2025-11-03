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
};

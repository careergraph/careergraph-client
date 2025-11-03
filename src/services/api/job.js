// src/services/api/job.js
import { apiConfig } from "~/config";
import { http } from "../http/request";
import { getToken } from "~/utils/storage";

export const JobAPI = {
  /**
   * Gọi API lấy toàn bộ danh sách việc làm.
   */
  getJobs({ signal } = {}) {
    return http(apiConfig.endpoints.jobs.list, {
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

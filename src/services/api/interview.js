// src/services/api/interview.js
import { apiConfig } from "~/config";
import { http } from "../http/request";

export const InterviewAPI = {
  getMyInterviews({ status, signal } = {}) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);

    const qs = params.toString();
    const path = qs
      ? `${apiConfig.endpoints.interviews.me}?${qs}`
      : apiConfig.endpoints.interviews.me;

    return http(path, { method: "GET", auth: true, signal });
  },

  getUpcoming({ signal } = {}) {
    return http(apiConfig.endpoints.interviews.upcoming, {
      method: "GET",
      auth: true,
      signal,
    });
  },

  getById(id, { signal } = {}) {
    const path = apiConfig.endpoints.interviews.detail.replace(":id", id);
    return http(path, { method: "GET", auth: true, signal });
  },

  confirm(id) {
    const path = apiConfig.endpoints.interviews.confirm.replace(":id", id);
    return http(path, { method: "POST", auth: true, body: {} });
  },

  decline(id, reason) {
    const path = apiConfig.endpoints.interviews.decline.replace(":id", id);
    return http(path, { method: "POST", auth: true, body: { reason } });
  },

  propose(id, data) {
    const path = apiConfig.endpoints.interviews.propose.replace(":id", id);
    return http(path, { method: "POST", auth: true, body: data });
  },

  getByRoomCode(roomCode, { signal } = {}) {
    const path = apiConfig.endpoints.interviews.room.replace(":roomCode", roomCode);
    return http(path, { method: "GET", auth: true, signal });
  },
};

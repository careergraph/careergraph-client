// src/stores/interviewStore.js
import { create } from "zustand";
import { InterviewAPI } from "~/services/api/interview";

export const useInterviewStore = create((set, get) => ({
  interviews: [],
  upcoming: [],
  loading: false,
  error: null,

  fetchMyInterviews: async (status) => {
    set({ loading: true, error: null });
    try {
      const res = await InterviewAPI.getMyInterviews({ status });
      set({ interviews: res?.data ?? [], loading: false });
    } catch (err) {
      set({ error: err.message || "Lỗi tải danh sách phỏng vấn", loading: false });
    }
  },

  fetchUpcoming: async () => {
    try {
      const res = await InterviewAPI.getUpcoming();
      set({ upcoming: res?.data ?? [] });
    } catch {
      // silent — widget only
    }
  },

  confirmInterview: async (id) => {
    const res = await InterviewAPI.confirm(id);
    // refresh list
    const { interviews } = get();
    set({
      interviews: interviews.map((i) =>
        i.id === id ? { ...i, interviewStatus: "CONFIRMED" } : i
      ),
    });
    return res;
  },

  declineInterview: async (id, reason) => {
    const res = await InterviewAPI.decline(id, reason);
    const { interviews } = get();
    set({
      interviews: interviews.map((i) =>
        i.id === id ? { ...i, interviewStatus: "CANCELLED" } : i
      ),
    });
    return res;
  },

  proposeAlternativeTimes: async (id, data) => {
    const res = await InterviewAPI.propose(id, data);
    const { interviews } = get();
    set({
      interviews: interviews.map((i) =>
        i.id === id ? { ...i, interviewStatus: "PENDING_RESCHEDULE" } : i
      ),
    });
    return res;
  },
}));

// src/store/authStore.js
import { create } from "zustand";
import { toast } from "sonner";
import { http, refreshAccessToken } from "~/services/http/request";
import { getToken, setToken, removeToken } from "~/utils/storage";
import { UserAPI } from "~/services/api/user";
import { useUserStore } from "./userStore";
import {
  normalizeAddress,
  normalizeContact,
} from "~/services/domain/candidate/profile.mapper";

export const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  authInitializing: true, // thay cho isLoading của init
  authSubmitting: false, // loading của nút Login
  registerSubmitting: false,
  isLoading: false,

  // Lấy thông tin người dùng hiện tại
  fetchMe: async () => {
    try {
      const data = await UserAPI.me();
      const userData = data.data;
      userData.primaryAddress = normalizeAddress(userData.addresses);
      userData.primaryContact = normalizeContact(userData.contacts);
      useUserStore.getState().setUser(userData);
      set({ isAuthenticated: true });
      return true;
    } catch (e) {
      removeToken();
      useUserStore.getState().clearUser();
      set({ isAuthenticated: false });
      return false;
    }
  },

  // Refresh token khi hết hạn
  tryRefresh: async () => {
    try {
      const newAccess = await refreshAccessToken();
      if (newAccess) {
        setToken(newAccess);
        await useAuthStore.getState().fetchMe();
        set({ isAuthenticated: true });
      } else {
        removeToken();
        useUserStore.getState().clearUser();
        set({ isAuthenticated: false });
      }
    } catch (e) {
      console.warn("Refresh token invalid:", e);
      removeToken();
      useUserStore.getState().clearUser();
      set({ isAuthenticated: false });
    }
  },

  // Đăng nhập
  login: async (email, password) => {
    set({ authSubmitting: true });
    try {
      const data = await http("/auth/login", {
        method: "POST",
        body: { email, password },
        auth: false,
      });
      const access = data?.data?.accessToken || data?.accessToken || data;
      if (!access) throw new Error("Thiếu accessToken");

      setToken(access);
      await get().fetchMe();
      set({ isAuthenticated: true });
      toast.success("Đăng nhập thành công!");
      return { success: true };
    } catch (e) {
      removeToken();
      useUserStore.getState().clearUser();
      set({ isAuthenticated: false });
      return { success: false, message: e?.message, error: e || "Đăng nhập thất bại" };
    } finally {
      set({ authSubmitting: false });
    }
  },

  // Đăng ký
  register: async (fullName, email, password) => {
    set({ registerSubmitting: true, isLoading: true });
    try {
      const payload = { fullName, email, password };
      const data = await http("/auth/register/candidate", {
        method: "POST",
        body: payload,
        auth: false,
      });
      const message = data?.message || "Đăng ký thành công!";
      toast.success(message);
      return { success: true, message };
    } catch (e) {
      console.error("Lỗi đăng ký:", e);
      const message =
        e?.response?.data?.message || e?.message || "Đăng ký thất bại";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ registerSubmitting: false, isLoading: false });
    }
  },

  initAuth: async () => {
    set({ authInitializing: true });
    try {
      const hasToken = !!getToken();
      if (hasToken) {
        const ok = await get().fetchMe();
        if (!ok) await get().tryRefresh();
      } else {
        await get().tryRefresh(); // giống logic của Context
      }
    } finally {
      set({ authInitializing: false });
    }
  },

  // Đăng xuất
  logout: async () => {
    try {
      const token = getToken();
      if (token) {
        await http("/auth/logout", { method: "POST", auth: true });
      }
    } catch {
      // ignore
    } finally {
      removeToken();
      useUserStore.getState().clearUser();
      set({ isAuthenticated: false });
    }
  },
}));

/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { apiConfig } from "~/config";

// Tạo instance axios
const axiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: tự động gắn token nếu có
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tạo AuthContext
const AuthContext = createContext();

// Hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Kiểm tra trạng thái đăng nhập
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const { data } = await axiosInstance.get("/auth/verify");
        setUser(data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
      localStorage.removeItem("authToken");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng nhập
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("authToken", data.data.accessToken);
      setIsAuthenticated(true);

      // Có thể gọi API user info ở đây
      // setUser(data.user);

      return { success: true, message: "Đăng nhập thành công!" };
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Đăng nhập thất bại!",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng ký
  const register = async (fullName, email, password) => {
    try {
      setIsLoading(true);
      await axiosInstance.post("/auth/register", {
        fullName,
        email,
        password,
      });

      return {
        success: true,
        message: "Đăng ký thành công! Vui lòng đăng nhập.",
      };
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Đăng ký thất bại!",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng xuất
  const logout = async () => {
    const token = localStorage.getItem("authToken");
    try {
      if (token) {
        await axiosInstance.post("/auth/logout");
      }
    } catch (error) {
      console.error("Lỗi khi logout:", error);
    } finally {
      localStorage.removeItem("authToken");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

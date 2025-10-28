/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { apiConfig } from "~/config";
import { normalizeInfoFromResponse } from "~/domain/candidate/profile.mapper";
import { http } from "~/services/http/request";
import { getToken,removeToken, setToken } from "~/utils/storage";



// Tạo AuthContext
const AuthContext = createContext();

// Hook để sử dụng AuthContext dễ dàng hơn
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

// AuthProvider component - cung cấp authentication cho toàn bộ app
export const AuthProvider = ({ children }) => {
  // State để lưu thông tin user và trạng thái đăng nhập
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Lấy thông tin người dùng đang đăng nhập
  const fetchMe = useCallback( async () => {
    try {
      if(!getToken()){
        setUser(null)
        setIsAuthenticated(false);
        return;
      }
      const data  = await http("/candidates/me", { method: "GET", auth: true});
      setUser(normalizeInfoFromResponse(data.data));
      setIsAuthenticated(true);
    }catch {
      setUser(null);
      setIsAuthenticated(false)
    }
  }, [])

   const tryRefresh = useCallback(async () => {
    try {
      // const res = await fetch(`${apiConfig.baseURL}/auth/refresh`, {
      //   method: "POST",
      //   credentials: "include", // Gửi cookie HttpOnly
      // });
      // const data = await res.json();
      const data = await http("/auth/refresh", {
        method: "POST",
        auth: false,                          // <-- QUAN TRỌNG
      });
      const newAccess = data?.data?.accessToken || data?.accessToken;

      if (newAccess) {
        setToken(newAccess);
        await fetchMe();
      } else {
        removeToken();
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.warn("Refresh token invalid:", e);
      removeToken();
      setIsAuthenticated(false);
    }
  }, [fetchMe]);

  useEffect(()=> {
    (async () => {
      try{
        if (getToken()) {
          await fetchMe();
        } else {
          await tryRefresh(); // <-- gọi refresh tự động
        }
      }finally{
        setIsLoading(false)
      }
    })();
  }, [fetchMe, tryRefresh])
  // Hàm đăng nhập
  const login = async (email, password) => {
    try {
      setIsLoading(true);

      const data = await http("/auth/login", {
        method: "POST",
        body: { email, password },
        auth: false,                          // <-- QUAN TRỌNG
      });
      console.log("data:" + data)
      // if (!data?.data?.status.ok) {
      //   throw new Error(data?.message || "Đăng nhập thất bại");
      // }

        const access = data?.data?.accessToken || data?.accessToken|| data;
        console.log(access)
        if (!access) throw new Error("Thiếu accessToken");
        console.log(access);
        setToken(access);
        await fetchMe(); 
        return { success: true, message: "Đăng nhập thành công!" };

    } catch (error) {
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
      console.error("Lỗi khi đăng nhập:", error);
      return { success: false, message: "Có lỗi xảy ra khi đăng nhập!" };
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm đăng ký
  const register = async (fullName, email, password) => {
    try {
      setIsLoading(true);

      const response = await http("/auth/register", {
        method: "POST",
        body: { fullName, email, password },
        auth: false,
      })

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: "Đăng ký thành công! Vui lòng đăng nhập.",
        };
      } else {
        return { success: false, message: data.message || "Đăng ký thất bại!" };
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      return { success: false, message: "Có lỗi xảy ra khi đăng ký!" };
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm đăng xuất: Truyền token xuống để đưa vào blacklist
   const logout = async () => {
    const token = getToken();
    if (token) {
      try {
        await http("/auth/logout", {
            method: "POST",
            auth: true,
        })
      }catch {
        //
      }finally {
        // Xóa token sau khi đăng xuất
        removeToken();
        setUser(null);
        setIsAuthenticated(false);
      }
      
    }
    removeToken()
    
  };

  // Giá trị được cung cấp cho các component con
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
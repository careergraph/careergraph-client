import { createContext, useContext, useState, useEffect } from 'react';

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

  // Kiểm tra xem user đã đăng nhập chưa khi app khởi động
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Hàm kiểm tra trạng thái đăng nhập
  const checkAuthStatus = async () => {
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // Gọi API để verify token và lấy thông tin user
        const response = await fetch('http://localhost:8080/careergraph/api/v1/auth/verify', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token không hợp lệ, xóa khỏi localStorage
          localStorage.removeItem('authToken');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
      // Xóa token nếu có lỗi
      localStorage.removeItem('authToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm đăng nhập
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:8080/careergraph/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Lưu token vào localStorage
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, message: 'Đăng nhập thành công!' };
      } else {
        return { success: false, message: data.message || 'Đăng nhập thất bại!' };
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      return { success: false, message: 'Có lỗi xảy ra khi đăng nhập!' };
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm đăng ký
  const register = async (fullName, email, password) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:8080/careergraph/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: 'Đăng ký thành công! Vui lòng đăng nhập.' };
      } else {
        return { success: false, message: data.message || 'Đăng ký thất bại!' };
      }
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      return { success: false, message: 'Có lỗi xảy ra khi đăng ký!' };
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Giá trị được cung cấp cho các component con
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

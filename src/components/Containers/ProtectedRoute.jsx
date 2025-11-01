import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '~/store/authStore';


// Component để bảo vệ các trang cần đăng nhập
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authInitializing } = useAuthStore();
  const loc = useLocation();

  // Hiển thị loading khi đang kiểm tra trạng thái đăng nhập
  if (authInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: { pathname: loc.pathname, search: loc.search, hash: loc.hash } }}
    />
  );
};

export default ProtectedRoute;

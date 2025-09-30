import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Component để bảo vệ các trang cần đăng nhập
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Hiển thị loading khi đang kiểm tra trạng thái đăng nhập
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, chuyển hướng đến trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, hiển thị nội dung trang
  return children;
};

export default ProtectedRoute;

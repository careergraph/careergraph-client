import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation as useLocationR } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Home } from 'lucide-react';
import { useAuthStore } from '~/stores/authStore';
import { toast } from 'sonner';
import { setVerifyCurrent } from '~/utils/storage';
import AuthSplitLayout from '~/components/Auth/AuthSplitLayout';

export default function Login() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const hasGoogleClientId =
    typeof googleClientId === "string" &&
    googleClientId.trim().length > 0 &&
    googleClientId.includes(".apps.googleusercontent.com");

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;
      if (!idToken) {
        toast.error("Không nhận được Google credential");
        return;
      }

      const result = await googleLogin(idToken);
      if (result?.success) {
        navigate(from, { replace: true });
      } else {
        toast.error(result?.message || "Google login thất bại");
      }

    } catch {
      toast.error("Google login thất bại");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login bị lỗi");
  };


  const errorMap = {
    "Invalid password": "Sai mật khẩu.",
    "Account not found": "Tài khoản không tồn tại. Vui lòng đăng ký mới.",
    "Account locked": "Tài khoản đã bị khóa.",
    "Email not verified": "Email chưa xác thực. Vui lòng xác thực",
    "You do not have permission to log in to this account": "Bạn không có quyền để truy cập tài khoản này"
  };
  // State để lưu thông tin form
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // State để hiển thị thông báo lỗi
  const [error, setError] = useState('');

  // Hook để điều hướng và sử dụng authentication
  const navigate = useNavigate();
  const { login, googleLogin, authSubmitting, isAuthenticated } = useAuthStore();


  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const location = useLocationR();

  const from =
    location.state?.from?.pathname
      ? `${location.state.from.pathname}${location.state.from.search || ""}${location.state.from.hash || ""}`
      : "/";


  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra validation cơ bản
    if (!formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // Đăng nhập thành công, chuyển về trang chủ
        navigate(from, { replace: true });
      } else {
        const message = result?.error.response?.data?.message;
        const statusCode = result?.error.response?.status;
        if (statusCode === 403 || statusCode === 505 || message === "Email not verified") {
          //OTPExpiredIn: 300s
          setVerifyCurrent({ email: formData.email.trim().toLowerCase(), purpose: "verify_email", redirectTo: "/login" })
          toast.error(errorMap[message])
          navigate("/verify-otp", {
            replace: true,
            state: {
              purpose: "verify_email",
              redirectTo: "/login",
              // expiresIn: res?.data ?? 120,
            }
          })
        }
        else {
          // Hiển thị lỗi
          setError(errorMap[message] || "Đã xảy ra lỗi, vui lòng thử lại.");
        }

      }
    } catch {
      // 
    }
  };


  return (
    <AuthSplitLayout>
      <form onSubmit={handleSubmit} className="flex w-full flex-col">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
        >
          <Home size={16} />
          Về trang chủ
        </Link>
        <h2 className="text-2xl font-medium text-gray-900 sm:text-3xl">
          Đăng nhập{" "}
          <span className="bg-gradient-to-r from-[#583DF2] to-[#F3359D] bg-clip-text text-transparent font-bold">
            Career Graph
          </span>
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          Chào mừng bạn quay trở lại! Vui lòng đăng nhập để tiếp tục
        </p>

          {/* Hiển thị thông báo lỗi */}
          {error && (
            <div className="mt-5 w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {hasGoogleClientId && (
            <div className="mt-7 flex w-full justify-center sm:justify-start">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                shape="circle"
                size="large"
                width="360"
                text="signin_with"
              />
            </div>
          )}

          <div className="my-6 flex w-full items-center gap-3 sm:my-7 sm:gap-4">
            <div className="h-px w-full bg-slate-200" />
            <p className="text-nowrap text-center text-sm text-slate-500">
              hoặc đăng nhập bằng email
            </p>
            <div className="h-px w-full bg-slate-200" />
          </div>

          <div className="flex h-12 w-full items-center gap-2 rounded-2xl border border-slate-300/80 px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 sm:h-[52px] sm:px-5">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="h-full w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-[15px]"
              required
            />
          </div>

          <div className="mt-4 flex h-12 w-full items-center gap-2 rounded-2xl border border-slate-300/80 px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 sm:mt-5 sm:h-[52px] sm:px-5">
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className="h-full w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-[15px]"
              required
            />
          </div>

          <div className="mt-5 flex w-full flex-col gap-3 text-slate-500 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <input
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label className="text-sm" htmlFor="rememberMe">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <Link className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700" to="/forgot-password">
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            disabled={authSubmitting}
            className="mt-6 h-12 w-full rounded-2xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-7 sm:text-base"
          >
            {authSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          <p className="mt-4 text-sm text-slate-500">
            Chưa có tài khoản?{"  "}
            <Link className="font-medium text-indigo-600 hover:underline" to="/register">
              Đăng ký
            </Link>
          </p>
      </form>
    </AuthSplitLayout>
  );
}

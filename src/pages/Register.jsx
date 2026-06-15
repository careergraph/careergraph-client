import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Home } from 'lucide-react';
import { useAuthStore } from '~/stores/authStore';
import { toast } from 'sonner';
import { setVerifyCurrent } from '~/utils/storage';
import AuthSplitLayout from '~/components/Auth/AuthSplitLayout';

export default function Register() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const hasGoogleClientId =
    typeof googleClientId === "string" &&
    googleClientId.trim().length > 0 &&
    googleClientId.includes(".apps.googleusercontent.com");

  // State để lưu thông tin form
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // State để hiển thị thông báo lỗi và thành công
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Hook để điều hướng và sử dụng authentication
  const navigate = useNavigate();
  const { register, googleLogin, isLoading } = useAuthStore();

  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      toast.error("Không nhận được Google credential");
      return;
    }

    const result = await googleLogin(idToken);
    if (result?.success) {
      navigate('/', { replace: true });
      return;
    }
    toast.error(result?.message || "Google login thất bại");
  };

  const handleGoogleError = () => {
    toast.error("Google login bị lỗi");
  };

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Kiểm tra validation cơ bản
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Kiểm tra mật khẩu có khớp không
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    // Gọi hàm register từ AuthContext
    const normalizedEmail = formData.email.trim().toLowerCase();
    const result = await register(formData.firstName, formData.lastName, normalizedEmail, formData.password);

    if (result.success) {
      toast.success("Đăng ký thành công")
      setVerifyCurrent({
        email: normalizedEmail,
        purpose: "verify_email",
        redirectTo: "/login",
      })
      navigate('/verify-otp', {
        replace: true,
      })
    } else {
      setError(result.message);
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
          Đăng ký{"  "}
          <span className="bg-gradient-to-r from-[#583DF2] to-[#F3359D] bg-clip-text font-bold text-transparent">
            Career Graph
          </span>
        </h2>

          {hasGoogleClientId && (
            <div className="mb-3 mt-6 flex w-full justify-center sm:justify-start">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                shape="pill"
                size="large"
                width="360"
                text="continue_with"
              />
            </div>
          )}

          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Tham gia ngay! Vui lòng điền thông tin để đăng ký tài khoản.
          </p>

          {/* Hiển thị thông báo lỗi */}
          {error && (
            <div className="mt-5 w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Hiển thị thông báo thành công */}
          {success && (
            <div className="mt-5 w-full rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex h-12 w-full items-center gap-2 rounded-2xl border border-slate-300/80 px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 sm:h-[52px] sm:px-5">
              <input
                type="text"
                name="lastName"
                placeholder="Họ"
                value={formData.lastName}
                onChange={handleChange}
                className="h-full w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-[15px]"
                required
              />
            </div>
            <div className="flex h-12 w-full items-center gap-2 rounded-2xl border border-slate-300/80 px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 sm:h-[52px] sm:px-5">
              <input
                type="text"
                name="firstName"
                placeholder="Tên"
                value={formData.firstName}
                onChange={handleChange}
                className="h-full w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-[15px]"
                required
              />
            </div>
          </div>

          <div className="mt-4 flex h-12 w-full items-center gap-2 rounded-2xl border border-slate-300/80 px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 sm:mt-5 sm:h-[52px] sm:px-5">
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

          <div className="mt-4 flex h-12 w-full items-center gap-2 rounded-2xl border border-slate-300/80 px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 sm:mt-5 sm:h-[52px] sm:px-5">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="h-full w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-[15px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 h-12 w-full rounded-2xl bg-pink-500 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-7 sm:text-base"
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
          <p className="mt-4 text-sm text-slate-500">
            Đã có tài khoản?{" "}
            <Link className="font-medium text-indigo-600 hover:underline" to="/login">
              Đăng nhập
            </Link>
          </p>
      </form>
    </AuthSplitLayout>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Home } from 'lucide-react';
import aiFeatureLogin from "../assets/icons/ai-feature.svg";
import { useAuthStore } from '~/stores/authStore';
import { toast } from 'sonner';
import { setVerifyCurrent } from '~/utils/storage';

export default function Register() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const hasGoogleClientId =
    typeof googleClientId === "string" &&
    googleClientId.trim().length > 0 &&
    googleClientId.includes(".apps.googleusercontent.com");

  // State để lưu thông tin form
  const [formData, setFormData] = useState({
    firstName:'',
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
        redirectTo: "/login",})
      navigate('/verify-otp', {
        replace: true,
      })
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex h-[700px] w-full gap-30">
      <div className="w-1/2 hidden md:flex justify-end items-center">
        <img
          className="object-contain max-h-[600px] w-auto"
          src={aiFeatureLogin}
          alt="rightSideImage"
        />
      </div>

      <div className="w-1/2 flex flex-col items-start justify-center">
        <form onSubmit={handleSubmit} className="md:w-96 w-80 flex flex-col">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <Home size={16} />
            Về trang chủ
          </Link>
          <h2 className="text-xl text-gray-900 font-medium">
            Đăng ký{"  "}
            <span className="font-bold text-4xl bg-gradient-to-r from-[#583DF2] to-[#F3359D] bg-clip-text text-transparent">
              Career Graph
            </span>
          </h2>

          {hasGoogleClientId && (
            <div className="w-full mt-6 mb-4 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                shape="pill"
                size="large"
                width="384"
                text="continue_with"
              />
            </div>
          )}

          <p className="text-sm text-gray-500/90 mt-3">
            Tham gia ngay! Vui lòng điền thông tin để đăng ký tài khoản.
          </p>

          {/* Hiển thị thông báo lỗi */}
          {error && (
            <div className="w-full mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Hiển thị thông báo thành công */}
          {success && (
            <div className="w-full mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className='flex gap-2'>
            <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-lg overflow-hidden pl-6 mt-6 gap-2 focus-within:border-indigo-500 transition">
              <input
                type="text"
                name="lastName"
                placeholder="Họ"
                value={formData.lastName}
                onChange={handleChange}
                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>
            <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-lg overflow-hidden pl-6 mt-6 gap-2 focus-within:border-indigo-500 transition">
              <input
                type="text"
                name="firstName"
                placeholder="Tên"
                value={formData.firstName}
                onChange={handleChange}
                className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>
          </div>

          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-lg overflow-hidden pl-6 mt-6 gap-2 focus-within:border-indigo-500 transition">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-lg overflow-hidden pl-6 mt-6 gap-2 focus-within:border-indigo-500 transition">
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-lg overflow-hidden pl-6 mt-6 gap-2 focus-within:border-indigo-500 transition">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-8 w-full h-11 rounded-full font-bold text-white bg-pink-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
          <p className="text-gray-500/90 text-sm mt-4">
            Đã có tài khoản?{" "}
            <Link className="text-indigo-400 hover:underline" to="/login">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

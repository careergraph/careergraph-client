import { useState } from 'react';
import { useNavigate, Link, useLocation as useLocationR } from 'react-router-dom';
import aiFeatureLogin from "../assets/icons/ai-feature.svg";
import { useAuthStore } from '~/store/authStore';
import { toast } from 'sonner';
import { setEmailVerifyCurrent } from '~/utils/storage';

export default function Login() {
  

  const errorMap = {
    "Invalid password": "Sai mật khẩu.",
    "Account not found": "Tài khoản không tồn tại. Vui lòng đăng ký mới.",
    "Account locked": "Tài khoản đã bị khóa.",
    "Email not verified": "Email chưa xác thực. Vui lòng xác thực",
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
  const { login, authSubmitting, isAuthenticated } = useAuthStore();


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
  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Kiểm tra validation cơ bản
    if (!formData.email || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      // Đăng nhập thành công, chuyển về trang chủ
      navigate(from, { replace: true });
    } else {
      const message = result?.error.response?.data?.message;
      const statusCode =  result?.error.response?.status;
      if(statusCode === 505 || message === "Email not verified" ){
        //OTPExpiredIn: 300s
        setEmailVerifyCurrent(formData.email)
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
      else{
        // Hiển thị lỗi
        setError(errorMap[message] || "Đã xảy ra lỗi, vui lòng thử lại.");
      }
      
    }
  };

  if(isAuthenticated){
    navigate(from, { replace: true });
  }

  return (
    <div className="flex h-[700px] w-full gap-30">
      <div className="w-1/2 hidden md:flex justify-end items-center">
        <img
          className="object-contain max-h-[600px] w-auto"
          src={aiFeatureLogin}
          alt="leftSideImage"
        />
      </div>

      <div className="w-1/2 flex flex-col items-start justify-center">
        <form onSubmit={handleSubmit} className="md:w-96 w-80 flex flex-col">
          <h2 className="text-xl text-gray-900 font-medium">
            Sign in with{" "}
            <span className="font-bold text-4xl bg-gradient-to-r from-[#583DF2] to-[#F3359D] bg-clip-text text-transparent">
              Career Graph
            </span>
          </h2>
          <p className="text-sm text-gray-500/90 mt-3">
            Welcome back! Please sign in to continue
          </p>

          {/* Hiển thị thông báo lỗi */}
          {error && (
            <div className="w-full mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="button"
            className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full"
          >
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
              alt="googleLogo"
            />
          </button>

          <div className="flex items-center gap-4 w-full my-5">
            <div className="w-full h-px bg-gray-300/90"></div>
            <p className="w-full text-nowrap text-sm text-gray-500/90">
              or sign in with email
            </p>
            <div className="w-full h-px bg-gray-300/90"></div>
          </div>

          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-indigo-500 transition">
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

          <div className="flex items-center mt-6 w-full border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-indigo-500 transition">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
            <div className="flex items-center gap-2">
              <input 
                className="h-5" 
                type="checkbox" 
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label className="text-sm" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <a className="text-sm underline" href="/forgot-password">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={authSubmitting}
            className="mt-8 w-full h-11 rounded-full font-bold text-white bg-indigo-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {authSubmitting ? "Đang đăng nhập..." : "Login"}
          </button>
          <p className="text-gray-500/90 text-sm mt-4">
            Don't have an account?{"  "}
            <Link className="text-indigo-400 hover:underline" to="/register">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import aiFeatureLogin from "../assets/icons/ai-feature.svg";
import { useAuthStore } from '~/store/authStore';

export default function Register() {
  // State để lưu thông tin form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // State để hiển thị thông báo lỗi và thành công
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Hook để điều hướng và sử dụng authentication
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

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
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
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
    const result = await register(formData.fullName, formData.email, formData.password);
    
    if (result.success) {
      setSuccess(result.message);
      // Sau 2 giây chuyển về trang login
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
          <h2 className="text-xl text-gray-900 font-medium">
            Create your{"  "}
            <span className="font-bold text-4xl bg-gradient-to-r from-[#583DF2] to-[#F3359D] bg-clip-text text-transparent">
              Career Graph
            </span>
          </h2>

          <button
            type="button"
            className="w-full mt-6 mb-4 bg-gray-500/10 flex items-center justify-center h-12 rounded-full"
          >
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
              alt="googleLogo"
            />
          </button>

          <p className="text-sm text-gray-500/90 mt-3">
            Join us today! Please fill in the details to sign up.
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

          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 mt-6 gap-2 focus-within:border-indigo-500 transition">
            <input
              type="text"
              name="fullName"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 mt-6 gap-2 focus-within:border-indigo-500 transition">
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

          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 mt-6 gap-2 focus-within:border-indigo-500 transition">
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

          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 mt-6 gap-2 focus-within:border-indigo-500 transition">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
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
            {isLoading ? 'Đang đăng ký...' : 'Sign up'}
          </button>
          <p className="text-gray-500/90 text-sm mt-4">
            Already have an account?{" "}
            <Link className="text-indigo-400 hover:underline" to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

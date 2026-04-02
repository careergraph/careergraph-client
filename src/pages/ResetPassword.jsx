import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import aiFeatureLogin from "../assets/icons/ai-feature.svg";
import { AuthAPI } from "~/services/api/auth";
import { toast } from "sonner";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  // Ưu tiên lấy từ state do verify-otp chuyển qua; fallback từ query
  const email = state.email;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Nếu không có email, quay về forgot
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  const matched = password === confirm && password.length > 0;
  const canSubmit =
    !submitting &&
    email &&
    password.length >= 6 &&
    matched;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!canSubmit) {
      setError("Mật khẩu tối thiểu 6 ký tự và xác nhận phải khớp.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await AuthAPI.resetPassword({
        newPassword: password,
      });
      if (res?.status === "OK") {

        toast.success("Đặt lại mật khẩu thành công!");
        // Điều hướng sau 1s để UX mượt
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 800);
      } else {
        setError("Không thể đặt lại mật khẩu.");
      }
    } catch {
      setError("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

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
            Đặt lại mật khẩu{" "}
            <span className="font-bold text-4xl bg-gradient-to-r from-[#583DF2] to-[#F3359D] bg-clip-text text-transparent">
              Career Graph
            </span>
          </h2>
          <p className="text-sm text-gray-500/90 mt-3">
            Thiết lập mật khẩu mới cho <span className="font-medium">{email}</span>
          </p>

          {error && (
            <div className="w-full mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="w-full mt-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded-lg text-sm">
              {successMsg}
            </div>
          )}

          {/* New Password */}
          <div className="flex items-center mt-6 w-full border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-indigo-500 transition">
            <input
              type={showPwd ? "text" : "password"}
              name="newPassword"
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="px-4 text-sm text-gray-500/80 hover:text-gray-700"
            >
              {showPwd ? "Ẩn" : "Hiện"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="flex items-center mt-4 w-full border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-indigo-500 transition">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu mới"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="px-4 text-sm text-gray-500/80 hover:text-gray-700"
            >
              {showConfirm ? "Ẩn" : "Hiện"}
            </button>
          </div>

          {!matched && confirm.length > 0 && (
            <div className="mt-2 text-xs text-red-600">Mật khẩu xác nhận không khớp.</div>
          )}

          {password.length > 0 && password.length < 8 && (
            <div className="mt-2 text-xs text-red-600">Mật khẩu tối thiểu 8 ký tự.</div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-6 w-full h-11 rounded-full font-bold text-white bg-indigo-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
          </button>

          <p className="text-gray-500/90 text-sm mt-4">
            Nhớ mật khẩu?{" "}
            <Link className="text-indigo-400 hover:underline" to="/login">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { AuthAPI } from "~/services/api/auth";
import { toast } from "sonner";
import AuthSplitLayout from "~/components/Auth/AuthSplitLayout";

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

  const minimumPasswordLength = 6;
  const matched = password === confirm && password.length > 0;
  const canSubmit =
    !submitting &&
    email &&
    password.length >= minimumPasswordLength &&
    matched;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!canSubmit) {
      setError(`Mật khẩu tối thiểu ${minimumPasswordLength} ký tự và xác nhận phải khớp.`);
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
          Đặt lại mật khẩu{" "}
          <span className="bg-gradient-to-r from-[#583DF2] to-[#F3359D] bg-clip-text font-bold text-transparent">
            Career Graph
          </span>
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          Thiết lập mật khẩu mới cho <span className="font-medium">{email}</span>
        </p>

          {error && (
            <div className="mt-5 w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mt-5 w-full rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              {successMsg}
            </div>
          )}

          {/* New Password */}
          <div className="mt-6 flex h-12 w-full items-center gap-2 rounded-2xl border border-slate-300/80 px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 sm:h-[52px] sm:px-5">
            <input
              type={showPwd ? "text" : "password"}
              name="newPassword"
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-full w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-[15px]"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="shrink-0 text-sm font-medium text-slate-500 transition hover:text-slate-700"
            >
              {showPwd ? "Ẩn" : "Hiện"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="mt-4 flex h-12 w-full items-center gap-2 rounded-2xl border border-slate-300/80 px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 sm:mt-5 sm:h-[52px] sm:px-5">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu mới"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-full w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-[15px]"
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="shrink-0 text-sm font-medium text-slate-500 transition hover:text-slate-700"
            >
              {showConfirm ? "Ẩn" : "Hiện"}
            </button>
          </div>

          {!matched && confirm.length > 0 && (
            <div className="mt-2 text-xs text-red-600">Mật khẩu xác nhận không khớp.</div>
          )}

          {password.length > 0 && password.length < minimumPasswordLength && (
            <div className="mt-2 text-xs text-red-600">
              Mật khẩu tối thiểu {minimumPasswordLength} ký tự.
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-6 h-12 w-full rounded-2xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-7 sm:text-base"
          >
            {submitting ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
          </button>

          <p className="mt-4 text-sm text-slate-500">
            Nhớ mật khẩu?{" "}
            <Link className="font-medium text-indigo-600 hover:underline" to="/login">
              Đăng nhập
            </Link>
          </p>
      </form>
    </AuthSplitLayout>
  );
}

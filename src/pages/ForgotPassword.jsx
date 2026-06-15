import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Home } from "lucide-react";
import { AuthAPI } from "~/services/api/auth";
import { toast } from "sonner";
import { setVerifyCurrent } from "~/utils/storage";
import AuthSplitLayout from "~/components/Auth/AuthSplitLayout";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Vui lòng nhập email!");
      return;
    }
    try {
      setSubmitting(true);
      // const res = await requestOtpApi({ email, purpose: "reset_password" });
      const res = await AuthAPI.forgotPassword({ email, purpose: "reset_password" });
      if (res?.status === "OK") {
        toast.success("Đã gửi mã OTP thành công")
        setVerifyCurrent({ email: email, purpose: "reset_password", redirectTo: "/reset-password" })
        navigate("/verify-otp", {
          replace: true,
        });
      } else {
        setError(res?.message || "Không thể gửi OTP. Vui lòng thử lại!");
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
          Quên mật khẩu?
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          Nhập email để nhận mã xác thực (OTP).
        </p>

          {error && (
            <div className="mt-5 w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex h-12 w-full items-center gap-2 rounded-2xl border border-slate-300/80 px-4 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 sm:h-[52px] sm:px-5">
            <input
              type="email"
              name="email"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-full w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-[15px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 h-12 w-full rounded-2xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-7 sm:text-base"
          >
            {submitting ? "Đang gửi OTP..." : "Gửi mã OTP"}
          </button>

          <p className="mt-4 text-sm text-slate-500">
            Nhớ mật khẩu rồi?{" "}
            <Link className="font-medium text-indigo-600 hover:underline" to="/login">
              Đăng nhập
            </Link>
          </p>
      </form>
    </AuthSplitLayout>
  );
}

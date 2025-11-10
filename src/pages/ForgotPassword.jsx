import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import aiFeatureLogin from "../assets/icons/ai-feature.svg";
// Nếu bạn đã có authStore hoặc service, thay thế cho hàm giả lập dưới
// import { useAuthStore } from "~/store/authStore";
import {AuthAPI} from "~/services/api/auth";
import { toast } from "sonner";
import { setEmailVerifyCurrent } from "~/utils/storage";


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
        setEmailVerifyCurrent(email)
        navigate("/verify-otp", {
          replace: true,
          state: {
            purpose: "reset_password",
            // nơi bạn muốn đưa user đến sau khi verify xong
            redirectTo: "/reset-password", 
          },
        });
      } else {
        setError(res?.message || "Không thể gửi OTP. Vui lòng thử lại!");
      }
    } catch (err) {
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
            Forgot your password?
          </h2>
          <p className="text-sm text-gray-500/90 mt-3">
            Nhập email để nhận mã xác thực (OTP).
          </p>

          {error && (
            <div className="w-full mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-indigo-500 transition mt-6">
            <input
              type="email"
              name="email"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full h-11 rounded-full font-bold text-white bg-indigo-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Đang gửi OTP..." : "Gửi mã OTP"}
          </button>

          <p className="text-gray-500/90 text-sm mt-4">
            Nhớ mật khẩu rồi?{" "}
            <Link className="text-indigo-400 hover:underline" to="/login">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

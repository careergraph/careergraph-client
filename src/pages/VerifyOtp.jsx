import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import aiFeatureLogin from "../assets/icons/ai-feature.svg";
import { AuthAPI } from "~/services/api/auth";
import { toast } from "sonner";
import { getEmailVerifyCurrent, removeEmailVerifyCurrent } from "~/utils/storage";


export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const { email } = getEmailVerifyCurrent();
  const purpose = state.purpose || "reset_password"; 
  // const initialExpiresIn = typeof state.expiresIn === "number" ? state?.expiresIn : 120;
  // const initialExpiresIn = Math.max(0, Math.floor((expiredIn - Date.now()) / 1000));
  const redirectTo = state.redirectTo || "/";

  // Nếu không có email truyền sang, đưa về Forgot Password (hoặc trang phù hợp)
  useEffect(() => {
    if (!email) navigate("/forgot-password", { replace: true });
  }, [email, navigate]);

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() =>  {
    try {
      const fetchOtpTtl  = async () => {
        const res = await AuthAPI.getTtlOtp({email: email})
        setTimeLeft(res?.data)
        }
      fetchOtpTtl();
    }
    catch(err){
      console.error("Lỗi khi lấy TTL OTP:", err);
      setTimeLeft(null);
    }
  }, [email])

  useEffect(() => {
    return () => {
      removeEmailVerifyCurrent();
    };
  }, []);

  // Timer đếm ngược
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const otpValue = useMemo(() => digits.join(""), [digits]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // chỉ nhận 0-9 hoặc rỗng
    const copy = [...digits];
    copy[index] = value;
    setDigits(copy);
    // auto focus sang ô kế tiếp
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData.getData("text") || "").replace(/\D/g, "");
    if (!text) return;
    const arr = text.slice(0, 6).padEnd(6, " ").split("");
    setDigits(arr.map((c) => (/\d/.test(c) ? c : "")));
    // Focus cuối
    const lastIndex = Math.min(text.length, 6) - 1;
    if (lastIndex >= 0) inputsRef.current[lastIndex]?.focus();
  };

  const submit = async (e) => {
    e?.preventDefault?.();
    setError("");
    if (otpValue.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 chữ số!");
      return;
    }
    try {
      setSubmitting(true);
      let res;
      if(purpose=="reset_password"){
        res = await AuthAPI.verifyOTPResetPassword({ email:email, otp: otpValue });
      }else {
        res = await AuthAPI.verifyOTPRegister({ email:email, otp: otpValue });
      }

      if (res?.status === "OK") {
        toast.success("Xác thực thành công")
        // Xác thực thành công → điều hướng
        navigate(redirectTo, { replace: true, state: { email } });
      } else {
        setError(res?.message || "OTP không hợp lệ!");
      }
    } catch (err) {
      setError(err?.response?.data?.message ? "OTP không hợp lệ!" : "Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    if (timeLeft > 0 || resending) return;
    setError("");
    try {
      setResending(true);
      const res = await AuthAPI.resendOTP({ email: email });
      if (res?.status === "OK") {
        toast.success("Đã gửi lại mã OTP thành công")
        setDigits(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();

        setTimeLeft(res?.data);
      } else {
        setError(res?.message || "Không thể gửi lại OTP. Vui lòng thử lại!");
      }
    } catch {
      setError("Có lỗi xảy ra khi gửi lại OTP.");
    } finally {
      setResending(false);
    }
  };

  const titleByPurpose = useMemo(() => {
    if (purpose === "verify_email_on_signup") return "Verify your email";
    return "Verify OTP";
  }, [purpose]);

  const subtitleByPurpose = useMemo(() => {
    if (purpose === "verify_email_on_signup")
      return `Mã xác thực đã được gửi đến ${email}. Vui lòng nhập để hoàn tất đăng ký.`;
    return `Mã xác thực đã được gửi đến ${email}. Vui lòng nhập để tiếp tục.`;
  }, [purpose, email]);

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
        <form onSubmit={submit} className="md:w-96 w-80 flex flex-col">
          <h2 className="text-xl text-gray-900 font-medium">
            {titleByPurpose}{" "}
            <span className="font-bold text-4xl bg-gradient-to-r from-[#583DF2] to-[#F3359D] bg-clip-text text-transparent">
              Career Graph
            </span>
          </h2>
          <p className="text-sm text-gray-500/90 mt-3">{subtitleByPurpose}</p>

          {error && (
            <div className="w-full mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          

          <div
            onPaste={handlePaste}
            className="mt-5 grid grid-cols-6 gap-2"
          >
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-full h-12 text-center border border-gray-500/60 rounded-xl focus:border-indigo-500 outline-none text-lg"
              />
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500/80">
             {timeLeft > 0 ?(
              <div>
                Thời gian còn lại:{" "}
                <span className="font-semibold text-gray-900">
                  0{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
                </span>
                </div>
              ): (<span>OTP đã hết hạn</span>)}
              
            </div>
            <button
              type="button"
              onClick={resend}
              disabled={timeLeft > 0 || resending}
              className="text-sm underline disabled:opacity-50 disabled:no-underline"
            >
              {resending ? "Đang gửi lại..." : "Gửi lại OTP"}
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 w-full h-11 rounded-full font-bold text-white bg-indigo-500 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Đang xác thực..." : "Xác thực"}
          </button>

          {purpose=="reset_password" &&
            <p className="text-gray-500/90 text-sm mt-4">
                Sai email?{" "}
                <Link className="text-indigo-400 hover:underline" to="/forgot-password">
                  Nhập lại email
                </Link>
              </p>  
          }
        </form>
      </div>
    </div>
  );
}

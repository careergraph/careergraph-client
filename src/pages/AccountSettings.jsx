import { useState } from "react";
import { toast } from "sonner";
import { AuthAPI } from "~/services/api/auth";
import { useUserStore } from "~/stores/userStore";

export default function AccountSettings() {
  const { user, updateUserPart } = useUserStore();

  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailStep, setEmailStep] = useState("idle");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordOtp, setPasswordOtp] = useState("");
  const [passwordStep, setPasswordStep] = useState("idle");
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const currentEmail = user?.email || "";

  const resetEmailState = () => {
    setNewEmail("");
    setEmailOtp("");
    setEmailStep("idle");
    setEmailError("");
  };

  const resetPasswordState = () => {
    setCurrentPassword("");
    setNewPassword("");
    setPasswordOtp("");
    setPasswordStep("idle");
    setPasswordError("");
  };

  const closeEmailModal = () => {
    if (loadingEmail) return;
    setOpenEmailModal(false);
    resetEmailState();
  };

  const closePasswordModal = () => {
    if (loadingPassword) return;
    setOpenPasswordModal(false);
    resetPasswordState();
  };

  const handleRequestEmailOtp = async (event) => {
    event.preventDefault();
    setEmailError("");

    if (!newEmail.trim()) {
      toast.error("Vui lòng nhập email mới");
      return;
    }

    if (newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
      setEmailError("Email mới phải khác email hiện tại");
      return;
    }

    try {
      setLoadingEmail(true);
      await AuthAPI.requestEmailChangeOtp({ newEmail: newEmail.trim() });
      setEmailStep("otp");
      toast.success("Đã gửi OTP tới email mới");
    } catch (error) {
      const message = error?.response?.data?.message || "Không thể gửi OTP";
      setEmailError(message);
      toast.error(message);
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleConfirmEmail = async (event) => {
    event.preventDefault();
    setEmailError("");

    if (!emailOtp.trim()) {
      toast.error("Vui lòng nhập OTP");
      return;
    }

    try {
      setLoadingEmail(true);
      await AuthAPI.confirmEmailChange({
        newEmail: newEmail.trim(),
        otp: emailOtp.trim(),
      });
      updateUserPart({ email: newEmail.trim() });
      closeEmailModal();
      toast.success("Cập nhật email thành công");
    } catch (error) {
      const message = error?.response?.data?.message || "OTP không hợp lệ hoặc đã hết hạn";
      setEmailError(message);
      toast.error(message);
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleRequestPasswordOtp = async (event) => {
    event.preventDefault();
    setPasswordError("");

    if (!currentPassword || !newPassword) {
      toast.error("Vui lòng nhập đủ mật khẩu hiện tại và mới");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }

    try {
      setLoadingPassword(true);
      await AuthAPI.requestPasswordChangeOtp({
        currentPassword,
        newPassword,
      });
      setPasswordStep("otp");
      toast.success("Đã gửi OTP xác nhận đổi mật khẩu");
    } catch (error) {
      const message = error?.response?.data?.message || "Không thể gửi OTP";
      setPasswordError(message);
      toast.error(message);
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleConfirmPassword = async (event) => {
    event.preventDefault();
    setPasswordError("");

    if (!passwordOtp.trim()) {
      toast.error("Vui lòng nhập OTP");
      return;
    }

    try {
      setLoadingPassword(true);
      await AuthAPI.confirmPasswordChange({ otp: passwordOtp.trim() });
      closePasswordModal();
      toast.success("Đổi mật khẩu thành công");
    } catch (error) {
      const message = error?.response?.data?.message || "OTP không hợp lệ hoặc đã hết hạn";
      setPasswordError(message);
      toast.error(message);
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex-1 px-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Quản lý tài khoản</h1>
          <p className="mt-1 text-sm text-slate-500">
            Cập nhật thông tin đăng nhập theo từng bước bảo mật OTP.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="divide-y divide-slate-100">
            <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Email đăng nhập</p>
                <p className="text-sm text-slate-500">{currentEmail || "Chưa cập nhật"}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenEmailModal(true)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
              >
                Chỉnh sửa
              </button>
            </div>

            <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Mật khẩu</p>
                <p className="text-sm text-slate-500">Đã thiết lập bảo mật</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenPasswordModal(true)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </section>

        {openEmailModal && (
          <ModalShell title="Cập nhật email" subtitle="Hệ thống sẽ gửi OTP về email mới để xác nhận." onClose={closeEmailModal}>
            <form
              className="space-y-4"
              onSubmit={emailStep === "idle" ? handleRequestEmailOtp : handleConfirmEmail}
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email hiện tại</label>
                <input
                  type="email"
                  value={currentEmail}
                  disabled
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email mới</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(event) => setNewEmail(event.target.value)}
                  disabled={emailStep === "otp" || loadingEmail}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  required
                />
              </div>

              {emailStep === "otp" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Mã OTP</label>
                  <input
                    type="text"
                    value={emailOtp}
                    onChange={(event) => setEmailOtp(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                    placeholder="Nhập 6 chữ số"
                    required
                  />
                </div>
              )}

              {emailError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {emailError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={emailStep === "otp" ? () => {
                    setEmailStep("idle");
                    setEmailOtp("");
                    setEmailError("");
                  } : closeEmailModal}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                  disabled={loadingEmail}
                >
                  {emailStep === "otp" ? "Quay lại" : "Hủy"}
                </button>
                <button
                  type="submit"
                  disabled={loadingEmail}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {loadingEmail ? "Đang xử lý..." : emailStep === "idle" ? "Gửi OTP" : "Xác nhận"}
                </button>
              </div>
            </form>
          </ModalShell>
        )}

        {openPasswordModal && (
          <ModalShell
            title="Đổi mật khẩu"
            subtitle="Nhập mật khẩu hiện tại, mật khẩu mới và xác thực OTP."
            onClose={closePasswordModal}
          >
            <form
              className="space-y-4"
              onSubmit={passwordStep === "idle" ? handleRequestPasswordOtp : handleConfirmPassword}
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  disabled={passwordStep === "otp" || loadingPassword}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Mật khẩu mới</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  disabled={passwordStep === "otp" || loadingPassword}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  minLength={8}
                  required
                />
              </div>

              {passwordStep === "otp" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Mã OTP</label>
                  <input
                    type="text"
                    value={passwordOtp}
                    onChange={(event) => setPasswordOtp(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                    placeholder="Nhập 6 chữ số"
                    required
                  />
                </div>
              )}

              {passwordError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {passwordError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={passwordStep === "otp" ? () => {
                    setPasswordStep("idle");
                    setPasswordOtp("");
                    setPasswordError("");
                  } : closePasswordModal}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                  disabled={loadingPassword}
                >
                  {passwordStep === "otp" ? "Quay lại" : "Hủy"}
                </button>
                <button
                  type="submit"
                  disabled={loadingPassword}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  {loadingPassword ? "Đang xử lý..." : passwordStep === "idle" ? "Gửi OTP" : "Xác nhận"}
                </button>
              </div>
            </form>
          </ModalShell>
        )}
      </div>
    </div>
  );
}

function ModalShell({ title, subtitle, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Đóng"
        className="absolute inset-0 bg-slate-900/50"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-2 py-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              ×
            </button>
          )}
        </div>

        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

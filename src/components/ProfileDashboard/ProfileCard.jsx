// ProfileCard.jsx
import { useState, useId, useEffect } from "react";
import {
  Pencil,            // edit-alt
  Mail,              // envelope
  Smartphone,        // mobile
  User,              // user
  Cake,              // birthday-cake
  HeartHandshake,    // rings-wedding (gần nghĩa)
  Bolt,              // bolt-s
  ChevronDown,       // chevron-down
  UserRound,         // user-s (avatar placeholder)
  Camera
} from "lucide-react";


function RightDrawer({ open, onClose, title, children }) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* overlay */}
      <button
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* modal */}
      <div className="relative w-full max-w-lg bg-white shadow-xl rounded-lg animate-[fadeIn_.2s_ease-out]">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-auto">{children}</div>
      </div>

      {/* keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

function PersonalForm({ defaultValues = {}, onSubmit }) {
  const [form, setForm] = useState({
    fullName: defaultValues.fullName || "",
    email: defaultValues.email || "",
    phone: defaultValues.phone || "",
    province: defaultValues.province || "",
    district: defaultValues.district || "",
    birth: defaultValues.birth || "",
    gender: defaultValues.gender || "",
    marital: defaultValues.marital || "Độc thân"
  });

  const update = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(form);
      }}
    >
      <div>
        <label className="text-sm font-medium">Họ và tên *</label>
        <input
          className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-violet-500"
          value={form.fullName}
          onChange={update("fullName")}
          placeholder="Nhập họ tên"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Email *</label>
        <input
          type="email"
          className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-violet-500"
          value={form.email}
          onChange={update("email")}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Số điện thoại *</label>
        <input
          className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-violet-500"
          value={form.phone}
          onChange={update("phone")}
          placeholder="Nhập số điện thoại"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Tỉnh/Thành *</label>
          <select
            className="mt-1 w-full rounded-lg border p-2"
            value={form.province}
            onChange={update("province")}
            required
          >
            <option value="">Chọn tỉnh thành</option>
            <option>TP. Hồ Chí Minh</option>
            <option>Hà Nội</option>
            <option>Đà Nẵng</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Quận/Huyện *</label>
          <select
            className="mt-1 w-full rounded-lg border p-2"
            value={form.district}
            onChange={update("district")}
            required
          >
            <option value="">Chọn quận huyện</option>
            <option>Thủ Đức</option>
            <option>Quận 1</option>
            <option>Quận 7</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Ngày sinh</label>
          <input
            type="date"
            className="mt-1 w-full rounded-lg border p-2"
            value={form.birth}
            onChange={update("birth")}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Giới tính</label>
          <div className="mt-1 flex gap-3">
            {["Nữ", "Nam"].map((g) => (
              <label
                key={g}
                className={`px-4 py-2 rounded-lg border cursor-pointer ${
                  form.gender === g
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  className="hidden"
                  value={g}
                  checked={form.gender === g}
                  onChange={update("gender")}
                />
                {g}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Tình trạng hôn nhân</label>
        <div className="mt-1 flex gap-3">
          {["Độc thân", "Đã lập gia đình"].map((m) => (
            <label
              key={m}
              className={`px-4 py-2 rounded-lg border cursor-pointer ${
                form.marital === m
                  ? "bg-violet-600 text-white border-violet-600"
                  : "bg-white"
              }`}
            >
              <input
                type="radio"
                name="marital"
                className="hidden"
                value={m}
                checked={form.marital === m}
                onChange={update("marital")}
              />
              {m}
            </label>
          ))}
        </div>
      </div>

      <div className="pt-2 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => onSubmit?.(null)}
          className="px-4 py-2 rounded-lg border"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-700"
        >
          Lưu thông tin
        </button>
      </div>
    </form>
  );
}

export default function ProfileCard() {
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row p-3 rounded-[12px] bg-white shadow-sd-default relative gap-2 lg:gap-8 ">
      {/* Nút bút chỉnh sửa */}
      <button
        data-test-id="user-profile__edit-button"
        onClick={() => setOpenEdit(true)}
        className="flex w-[40px] h-[40px] rounded-full justify-center items-center cursor-pointer bg-transparent hover:bg-[#F9F7FF] transition-all duration-200 ease-in-out absolute top-[12px] right-[12px]"
        aria-label="Chỉnh sửa hồ sơ"
      >
        <Pencil size={18} className="text-se-grey-48" />
      </button>

      {/* Cột trái */}
      <div className="flex flex-1 flex-col gap-2">
        {/* (giữ style block nếu bạn đang crop ảnh ở nơi khác) */}
        <style>{`
          .input-range{-webkit-appearance:none;-moz-appearance:none;height:2px;border-top:1px solid #999;border-bottom:1px solid #999;background:#3f51b5;width:100%}
          .input-range::-moz-range-thumb{border:1px solid #3f51b5;background:#3f51b5;border-radius:50%;width:12px;height:12px;transition:box-shadow .15s cubic-bezier(.4,0,.2,1)}
          .input-range::-webkit-slider-thumb{-webkit-appearance:none;border:1px solid #3f51b5;background:#3f51b5;border-radius:50%;width:12px;height:12px;transition:box-shadow .15s cubic-bezier(.4,0,.2,1)}
          .crop-container{position:relative;width:300px;height:300px;zoom:1}
          .reactEasyCrop_CropArea{color:rgba(255,255,255,.8)!important;box-shadow:0 0 0 9999em rgba(0,0,0,.4)!important}
        `}</style>

        <input type="file" accept="image/jpg,image/jpeg,image/png" className="hidden" />

        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="inline-block rounded-full bg-gray-200" style={{ width: 80, minWidth: 80, height: 80 }}>
            {/* Nếu có ảnh thì dùng <img .../>; tạm hiển thị placeholder icon */}
            <div className="w-full h-full rounded-full grid place-items-center">
              <UserRound size={40} className="text-white/80" />
            </div>
          </div>

          {/* Nút đổi avatar đè lên */}
          <div
            data-test-id="user-profile__edit-avatar"
            className="absolute w-[80px] h-[80px] top-[12px] left-[12px] z-[9] rounded-full cursor-pointer border border-[#EFEFF0] bg-[#EFEFF0]"
            title="Đổi ảnh đại diện"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <UserRound size={40} className="text-white" />
              <span className="absolute bottom-0 right-0 z-10 flex items-center justify-center w-[24px] h-[24px] rounded-full border-[.5px] border-[#E7E7E8] bg-white">
                <Camera size={14} className="text-grey-11" />
              </span>
            </div>
          </div>
        </div>

        {/* Trạng thái tìm việc */}
        <div className="relative" data-test-id="user-profile__job-seeking-status">
          <div className="flex items-center w-max gap-2 rounded-[1024px] p-2 bg-[#F9F7FF] cursor-pointer">
            <Bolt size={14} className="text-purple-4" />
            <span className="text-14 leading-6 text-se-grey-48">Trạng thái tìm việc của bạn?</span>
            <ChevronDown size={16} className="text-se-grey-48" />
          </div>
        </div>

        {/* Tên + địa chỉ */}
        <div className="flex flex-col">
          <h3 className="text-18 leading-7 text-se-neutral-900 font-semibold tracking-[-.16px] break-word">
            Thịnh Lương Quang
          </h3>
          <p className="text-14 leading-6 font-normal text-se-accent-100 cursor-pointer">
            Thêm địa chỉ hiện tại
          </p>
        </div>
      </div>

      {/* Divider khi < lg */}
      <div className="w-full lg:hidden" data-test-id="common__divider">
        <div className="w-full h-[1px] bg-[#EFEFF0]" />
      </div>

      {/* Cột phải */}
      <div className="flex flex-1 flex-col gap-1 justify-end">
        {/* Email */}
        <div className="flex items-center flex-wrap" data-test-id="user-profile__info__email">
          <div className="flex gap-2 items-center">
            <Mail size={16} className="text-grey-11" />
            <span className="text-14 leading-6 break-all line-clamp-1 text-se-grey-48">
              quangthinh06112004@gmail.com
            </span>
          </div>
          {/* verified */}
          <span className="ml-2 inline-block w-2 h-2 rounded-full bg-[#16A34A]" />
        </div>

        {/* Phone */}
        <div className="flex items-center flex-wrap" data-test-id="user-profile__info__mobile">
          <div className="flex gap-2 items-center">
            <Smartphone size={16} className="text-grey-11" />
            <span className="text-14 leading-6 break-all line-clamp-1 text-se-accent-100 cursor-pointer">
              Thêm số điện thoại
            </span>
          </div>
        </div>

        {/* Gender */}
        <div className="flex items-center flex-wrap" data-test-id="user-profile__info__gender">
          <div className="flex gap-2 items-center">
            <User size={16} className="text-grey-11" />
            <span className="text-14 leading-6 break-all line-clamp-1 text-se-accent-100 cursor-pointer">
              Thêm giới tính
            </span>
          </div>
        </div>

        {/* Birthday */}
        <div className="flex items-center flex-wrap" data-test-id="user-profile__info__birthday">
          <div className="flex gap-2 items-center">
            <Cake size={16} className="text-grey-11" />
            <span className="text-14 leading-6 break-all line-clamp-1 text-se-accent-100 cursor-pointer">
              Thêm ngày sinh
            </span>
          </div>
        </div>

        {/* Marital */}
        <div className="flex items-center flex-wrap" data-test-id="user-profile__info__marital_status">
          <div className="flex gap-2 items-center">
            <HeartHandshake size={16} className="text-grey-11" />
            <span className="text-14 leading-6 break-all line-clamp-1 text-se-accent-100 cursor-pointer">
              Thêm tình trạng hôn nhân
            </span>
          </div>
        </div>
      </div>

      {/* Popup chỉnh sửa (drawer) */}
      <RightDrawer
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        title="Thông tin cá nhân"
      >
        <PersonalForm
          defaultValues={{
            fullName: "Thịnh Lương Quang",
            email: "Quang Thinh"
          }}
          onSubmit={(values) => {
            // values === null => Hủy
            setOpenEdit(false);
            if (values) {
              console.log("Save profile:", values);
              // TODO: call API cập nhật
            }
          }}
        />
      </RightDrawer>
    </div>
  );
}
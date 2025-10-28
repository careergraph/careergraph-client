import { useState } from "react";
export default function PersonalForm({ defaultValues = {}, onSubmit }) {
  const [form, setForm] = useState({
    firstName: defaultValues.firstName || "",
    lastName: defaultValues.lastName || "",
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Họ*</label>
          <input
            className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-violet-500"
            value={form.lastName}
            onChange={update("lastName")}
            placeholder="Nhập họ tên"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Tên *</label>
          <input
            className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-violet-500"
            value={form.firstName}
            onChange={update("firstName")}
            placeholder="Nhập họ tên"
            required
          />
        </div>
        
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
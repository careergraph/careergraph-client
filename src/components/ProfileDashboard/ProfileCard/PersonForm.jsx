import { useState, useEffect } from "react";
import { useLocation } from "~/hooks/use-location";
import SimpleSelect from "../SimpleSelect";

function cx(...args) {
  return args.filter(Boolean).join(" ");
} 

export default function PersonalForm({ defaultValues = {}, onSubmit }) {
  // =========================
  // 1. STATE FORM (luôn lưu TÊN)
  // =========================
  const [form, setForm] = useState({
    firstName: defaultValues.firstName || "",
    lastName: defaultValues.lastName || "",
    email: defaultValues.email || "",
    phone: defaultValues.phone || "",
    provinceCode: defaultValues?.provinceCode || "", // <-- code tỉnh
    districtCode: defaultValues?.districtCode || "", // <-- code huyện
    birth: defaultValues.birth || "",
    gender: defaultValues.gender || "",
    marital: defaultValues.marital || "Độc thân",
  });

  // =========================
  // 2. STATE CODE PHỤ (để load huyện)
  // =========================
  // giả sử defaultValuesProvinceCode / DistrictCode có thể KHÔNG có
  // nên ta sẽ cố gắng "map ngược" từ tên -> code sau khi có options
  const [selectedCodes, setSelectedCodes] = useState({
    provinceCode: "", // mã tỉnh hiện chọn
    districtCode: "", // mã huyện hiện chọn
  });

  // =========================
  // 3. GỌI HOOK LOCATION
  // hook này vẫn hoạt động theo code
  // Lưu ý: truyền selectedCodes.provinceCode, selectedCodes.districtCode
  // chứ KHÔNG truyền defaultValues.province (vì đó là tên)
  // =========================
  const {
    provinceOptions, 
    districtOptions,   
    setProvinceCode,
    setDistrictCode,
    loadingProvince,
    loadingDistrict,
  } = useLocation(selectedCodes.provinceCode, selectedCodes.districtCode);

  useEffect(()=> {
    if(defaultValues.provinceCode){
      const pc = String(defaultValues.provinceCode);
      setSelectedCodes((s) => ({...s, provinceCode: pc}));
      setProvinceCode(pc);
    }
  },[defaultValues.provinceCode, setProvinceCode])

  useEffect(()=> {
    if(!defaultValues.districtCode) return;
    const dc = String(defaultValues.districtCode);

    const ok = districtOptions.some((d)=> String(d.value)== dc);
    if(ok){
      setSelectedCodes((s) => ({...s, districtCode: dc}));
      setDistrictCode(dc);
    }
  }, [districtOptions, defaultValues.districtCode, setDistrictCode])
  // =========================
  // 5. Khi user chọn tỉnh mới:
  //    - form.province = tên tỉnh (label)
  //    - selectedCodes.provinceCode = code tỉnh
  //    - reset huyện
  // =========================
  const handleSelectProvince = (provinceVal /* code */) => {
    // tìm option để lấy tên
    setForm((s) => ({
      ...s,
      provinceCode: provinceVal,
      districtCode: "", // reset tên huyện
    }));

    setSelectedCodes({
      provinceCode: provinceVal || "",
      districtCode: "", // reset code huyện
    });

    setProvinceCode(provinceVal || "");
    setDistrictCode("");
  };

  const handleSelectDistrict = (districtVal /* code */) => {

    setForm((s) => ({
      ...s,
      districtCode: districtVal,
    }));

    setSelectedCodes((s) => ({
      ...s,
      districtCode: districtVal || "",
    }));

    setDistrictCode(districtVal || "");
  };

  // =========================
  // 7. Các field text
  // =========================
  const update = (k) => (e) =>
    setForm((s) => ({
      ...s,
      [k]: e.target.value,
    }));

  // =========================
  // 8. Render
  // =========================
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        // submit TÊN, không phải code
        const finalData = {
          ...form,
          // province: form.province (tên) giữ nguyên
          // district: form.district (tên) giữ nguyên
        };
        onSubmit?.(finalData);
      }}
    >
      {/* Họ + Tên */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Họ *</label>
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
            placeholder="Nhập tên"
            required
          />
        </div>
      </div>

      {/* Email */}
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

      {/* Số điện thoại */}
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

      {/* Tỉnh / Huyện */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Province */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2">
            <span>Tỉnh/Thành *</span>
            {loadingProvince && (
              <span className="text-[11px] text-gray-500 italic">
                Đang tải...
              </span>
            )}
          </label>

          <SimpleSelect
            // SimpleSelect lúc này vẫn sẽ nhận value = code
            // => nếu đã chọn rồi thì dùng selectedCodes.provinceCode
            // nếu chưa map được code (lần đầu), tạm map ngược dựa vào tên
            value={
              selectedCodes.provinceCode || form.provinceCode}
            onChange={(val) => {
              handleSelectProvince(val || "");
            }}
            // hiển thị list dựa trên options gốc
            options={loadingProvince ? [] : provinceOptions}
            placeholder={
              loadingProvince ? "Đang tải..." : "Chọn tỉnh / TP"
            }
            disabled={loadingProvince}
            clearable={true}
          />
          {/* Hiển thị tên đang lưu (debug / optional) */}
          {/* <p className="text-[11px] text-gray-500 mt-1">Tên: {form.province}</p> */}
        </div>

        {/* District */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2">
            <span>Quận/Huyện *</span>
            {loadingDistrict && selectedCodes.provinceCode && (
              <span className="text-[11px] text-gray-500 italic">
                Đang tải...
              </span>
            )}
          </label>

          <SimpleSelect
            value={
              selectedCodes.districtCode || form.districtCode }
            onChange={(val) => {
              handleSelectDistrict(val || "");
            }}
            options={loadingDistrict ? [] : districtOptions}
            placeholder={
              selectedCodes.provinceCode || form.provinceCode
                ? loadingDistrict
                  ? "Đang tải..."
                  : districtOptions.length
                  ? "Chọn quận / huyện"
                  : "Không có dữ liệu"
                : "Chọn tỉnh trước"
            }
            disabled={
              !(selectedCodes.provinceCode ||
                form.provinceCode /* có tên tỉnh default */) || loadingDistrict
            }
            clearable={true}
          />
          {/* <p className="text-[11px] text-gray-500 mt-1">Tên: {form.district}</p> */}
        </div>
      </div>

      {/* Ngày sinh + Giới tính */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Ngày sinh */}
        <div>
          <label className="text-sm font-medium">Ngày sinh *</label>
          <input
            type="date"
            className="mt-1 w-full rounded-lg border p-2 outline-none focus:ring-2 focus:ring-violet-500"
            value={form.birth}
            onChange={update("birth")}
            required
          />
        </div>

        {/* Giới tính */}
        <div>
          <label className="text-sm font-medium">Giới tính *</label>
          <div className="mt-1 flex gap-3">
            {["Nữ", "Nam"].map((g) => (
              <label
                key={g}
                className={cx(
                  "px-4 py-2 rounded-lg border cursor-pointer select-none text-sm",
                  form.gender === g
                    ? "bg-white text-violet-600 border-violet-600"
                    : "bg-white"
                )}
              >
                <input
                  type="radio"
                  name="gender"
                  className="hidden"
                  value={g}
                  checked={form.gender === g}
                  onChange={update("gender")}
                  required
                />
                {g}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Hôn nhân */}
      <div>
        <label className="text-sm font-medium">
          Tình trạng hôn nhân *
        </label>
        <div className="mt-1 flex gap-3">
          {["Độc thân", "Đã lập gia đình"].map((m) => (
            <label
              key={m}
              className={cx(
                "px-4 py-2 rounded-lg border cursor-pointer select-none text-sm",
                form.marital === m
                  ? "bg-white text-violet-600 border-violet-600"
                  : "bg-white"
              )}
            >
              <input
                type="radio"
                name="marital"
                className="hidden"
                value={m}
                checked={form.marital === m}
                onChange={update("marital")}
                required
              />
              {m}
            </label>
          ))}
        </div>
      </div>

      {/* Buttons */}
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

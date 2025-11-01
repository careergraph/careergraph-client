import { useMemo, useState} from "react";
import SelectCheckBox from "../SelectCheckBox";
import { useLocation } from "~/hooks/use-location";


/* ---------------- Tag pill ---------------- */
function Tag({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
      {children}
      <button
        className="rounded-full p-1 hover:bg-slate-200"
        onClick={onRemove}
        aria-label="Xóa"
      >
        ✕
      </button>
    </span>
  );
}
 

function classx(...arr) {
  return arr.filter(Boolean).join(" ");
}
/* ---------------- Utils ---------------- */
const clampInt = (v) => {
  const n = parseInt(String(v).replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? String(n) : "";
};

/* ---------------- CriteriaForm ---------------- */
export default function CriteriaForm({ defaultValues, onSubmit }) {
  const safeDefaults = {
    desiredPosition: defaultValues?.desiredPosition || "",
    industries: Array.isArray(defaultValues?.industries)
      ? defaultValues.industries
      : [],
    locations: Array.isArray(defaultValues?.locations)
      ? defaultValues.locations
      : [],
    salaryExpectationMin:
      defaultValues?.salaryExpectationMin ??
      (defaultValues?.salaryExpectationMin === 0
        ? 0
        : ""),
    salaryExpectationMax:
      defaultValues?.salaryExpectationMax ??
      (defaultValues?.salaryExpectationMax === 0
        ? 0
        : ""),
    workTypes: Array.isArray(defaultValues?.workTypes)
      ? defaultValues.workTypes
      : [],
  };

  const initForm = {
    desiredPosition: safeDefaults.desiredPosition,
    industries: safeDefaults.industries,
    locations: safeDefaults.locations,
    salaryMin:
      safeDefaults.salaryExpectationMin === "" ||
      safeDefaults.salaryExpectationMin === null ||
      safeDefaults.salaryExpectationMin === undefined
        ? ""
        : String(safeDefaults.salaryExpectationMin),
    salaryMax:
      safeDefaults.salaryExpectationMax === "" ||
      safeDefaults.salaryExpectationMax === null ||
      safeDefaults.salaryExpectationMax === undefined
        ? ""
        : String(safeDefaults.salaryExpectationMax),
    workTypes: safeDefaults.workTypes,
  };


  const [form, setForm] = useState(initForm);

  const setField = (key, val) =>
    setForm((prev) => ({
      ...prev,
      [key]: val,
    }));

  const industryOptions = [
    "IT Phần mềm",
    "Thiết kế - Sáng tạo nghệ thuật",
    "Kế toán - Kiểm toán",
    "Nhân sự",
    "Kinh doanh - Bán hàng",
  ];

  const {provinceOptions, loadingProvince} = useLocation();
  
  const locationOptions = useMemo(() => {
    if (!Array.isArray(provinceOptions)) return [];
    // provinceOptions từ hook vốn đã là [{value, label}], có thể dùng thẳng:
    return provinceOptions.map(p => p.label).filter(Boolean);
  }, [provinceOptions]);

  
  const workTypeOptions = [
    "Toàn thời gian cố định",
    "Toàn thời gian tạm thời",
    "Bán thời gian cố định",
    "Bán thời gian tạm thời",
    "Theo hợp đồng tư vấn",
    "Thực tập",
    "Remote/Hybrid",
    "Khác",
  ];

  const validate = () => {
    if (!form.desiredPosition.trim()) return "Vui lòng nhập vị trí mong muốn.";
    if (form.industries.length === 0) return "Vui lòng chọn ngành nghề.";
    if (form.locations.length === 0) return "Vui lòng chọn địa điểm.";

    const min = Number(form.salaryMin || 0);
    const max = Number(form.salaryMax || 0);
    if (form.salaryMin !== "" && form.salaryMax !== "" && min > max) {
      return "Mức lương tối thiểu không được lớn hơn tối đa.";
    }
    return "";
  };

  const error = validate();

  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (error) return;
        onSubmit?.(form);
      }}
    >
      {/* Vị trí mong muốn */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Vị trí mong muốn *
        </label>
        <input
          placeholder="Nhập vị trí muốn ứng tuyển"
          className="mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500"
          value={form.desiredPosition}
          onChange={(e) => setField("desiredPosition", e.target.value)}
        />
      </div>

      {/* Ngành nghề */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium">Ngành nghề làm việc *</label>
          <span className="text-xs text-slate-500">Tối đa 3 ngành nghề</span>
        </div>

        <SelectCheckBox
          placeholder="Chọn ngành nghề"
          options={industryOptions}        // ['IT Phần mềm', ...] OK
          values={form.industries}         // <-- controlled
          onChange={(vals) => setField("industries", vals)}
          maxCount={3}
          disabled={false}
        />


        {form.industries.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {form.industries.map((x) => (
              <Tag
                key={x}
                onRemove={() =>
                  setField(
                    "industries",
                    form.industries.filter((i) => i !== x)
                  )
                }
              >
                {x}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {/* Địa điểm */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm font-medium">
            Địa điểm làm việc mong muốn *
          </label>
          <span className="text-xs text-slate-500">Tối đa 5 địa điểm</span>
        </div>

        <SelectCheckBox
          placeholder="Chọn địa điểm"
          options={loadingProvince ? [] : locationOptions} // locationOptions là mảng tên tỉnh
          values={form.locations}
          onChange={(vals) => setField("locations", vals)}
          maxCount={5}
          disabled={loadingProvince}
        />

        {form.locations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {form.locations.map((x) => (
              <Tag
                key={x}
                onRemove={() =>
                  setField(
                    "locations",
                    form.locations.filter((i) => i !== x)
                  )
                }
              >
                {x}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {/* Lương */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Mức lương mong muốn (triệu/tháng)
        </label>
        <div className="grid grid-cols-2 gap-3 sm:max-w-lg">
          <div className="flex items-stretch overflow-hidden rounded-xl border">
            <input
              inputMode="numeric"
              placeholder="Tối thiểu"
              className="w-full px-4 py-3 outline-none"
              value={form.salaryMin}
              onChange={(e) =>
                setField("salaryMin", clampInt(e.target.value))
              }
            />
            <div className="grid place-items-center bg-slate-50 px-3 text-sm text-slate-500">
              Triệu
            </div>
          </div>

          <div className="flex items-stretch overflow-hidden rounded-xl border">
            <input
              inputMode="numeric"
              placeholder="Tối đa"
              className="w-full px-4 py-3 outline-none"
              value={form.salaryMax}
              onChange={(e) =>
                setField("salaryMax", clampInt(e.target.value))
              }
            />
            <div className="grid place-items-center bg-slate-50 px-3 text-sm text-slate-500">
              Triệu
            </div>
          </div>
        </div>

        {form.salaryMin !== "" &&
          form.salaryMax !== "" &&
          Number(form.salaryMin) > Number(form.salaryMax) && (
            <p className="mt-1 text-sm text-red-600">
              Tối thiểu không được lớn hơn tối đa
            </p>
          )}
      </div>

      {/* Hình thức làm việc */}
      <div>
        <label className="mb-1 block text-sm font-medium">
          Hình thức làm việc
        </label>

        <SelectCheckBox
          placeholder="Chọn hình thức làm việc"
          options={workTypeOptions}
          values={form.workTypes}
          onChange={(vals) => setField("workTypes", vals)}
          maxCount={5}
        />

        {form.workTypes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {form.workTypes.map((x) => (
              <Tag
                key={x}
                onRemove={() =>
                  setField(
                    "workTypes",
                    form.workTypes.filter((i) => i !== x)
                  )
                }
              >
                {x}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {/* Error line */}
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}

      {/* Footer buttons */}
      <div className="pt-2 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => onSubmit?.(null)} // cancel
          className="px-4 py-2 rounded-lg border"
        >
          Hủy
        </button>

        <button
          type="submit"
          className={classx(
            "px-4 py-2 rounded-lg text-white",
            error
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-violet-600 hover:bg-violet-700"
          )}
          disabled={!!error}
        >
          Lưu thông tin
        </button>
      </div>
    </form>
  );
}
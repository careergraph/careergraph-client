import { useState, useEffect, useCallback } from "react";
import { Pencil } from "lucide-react";
import RightDrawer from "../RightDrawer";
import { UserAPI } from "~/services/api/user";
import { toast } from "sonner";
import CriteriaForm from "./CriteriaForm";
import { useUserStore } from "~/store/userStore";

function classx(...arr) {
  return arr.filter(Boolean).join(" ");
}

/* ---------------- JobCriteriaCard ---------------- */
export default function JobCriteriaCard({ className }) {
  const { user } = useUserStore();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

   
  // Tiêu chí hiện tại của user
  const [data, setData] = useState({
    desiredPosition: "",
    industries: [],
    locations: [],
    salaryExpectationMin: null,
    salaryExpectationMax: null,
    workTypes: [],
  });

  // Load khi user có
  useEffect(() => {
    if (!user) return;
    console.log(user)
     setData({
        desiredPosition: user?.desiredPosition || "",
        industries: user?.industries || [],
        locations: user?.locations || [],
        salaryExpectationMin:
          user?.salaryExpectationMin ?? null,
        salaryExpectationMax:
          user?.salaryExpectationMax ?? null,
        workTypes: user?.workTypes || [],
    });
    setLoading(false)
  }, [user]);

  // map form -> payload BE
  const toPayload = useCallback((f) => {
    return {
      desiredPosition: f.desiredPosition?.trim() || "",
      industries: f.industries || [],
      locations: f.locations || [],
      salaryExpectationMin:
        f.salaryMin === "" ? null : Number(f.salaryMin),
      salaryExpectationMax:
        f.salaryMax === "" ? null : Number(f.salaryMax),
      workTypes: f.workTypes || [],
    };
  }, []);

  // submit handler
  const handleUpdateJobCriteria = async (formValuesOrNull) => {
    setOpen(false);

    // User bấm Hủy
    if (!formValuesOrNull) return;

    const payload = toPayload(formValuesOrNull);

    try {
      const res = await UserAPI.updateJobCriteria(payload);
      const serverData = res?.data;
      useUserStore.getState().updateUserPart(serverData)
      toast.success("Cập nhật tiêu chí thành công");
    } catch (e) {
      toast.error(e?.message || "Cập nhật tiêu chí thất bại");
    }
  };

  // helper UI
  const displayOrAdd = (label, text) => (
    <div className="flex flex-col justify-items-start justify-start">
      <p className="text-sm text-slate-500">{label}</p>
      <div
        className={classx(
          "text-[15px]",
          text ? "text-black font-medium" : "text-violet-700"
        )}
      >
        {text || `Thêm ${label.toLowerCase()}`}
      </div>
    </div>
  );

  const salaryText =
    data.salaryExpectationMin == null &&
    data.salaryExpectationMax == null
      ? ""
      : `${data.salaryExpectationMin ?? "—"} – ${
          data.salaryExpectationMax ?? "—"
        } Triệu`;

  return (
    <>
      <section
        className={classx(
          "rounded-2xl bg-white p-4 shadow-sm sm:p-6",
          className
        )}
      >
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-[18px] font-semibold text-neutral-900">
            Tiêu chí tìm việc
          </h3>

          <button
            onClick={() => setOpen(true)}
            className="rounded-full p-2 hover:bg-slate-100"
            aria-label="Chỉnh sửa"
            disabled={loading}
          >
            <Pencil size={18} className="text-slate-600" />
          </button>
        </div>

        {/* body */}
        {/* body */}
      <div className="mt-4 flex flex-col gap-8 sm:flex-row sm:gap-10 items-start">
        {/* CỘT TRÁI */}
        <div className="flex-1 space-y-5 text-left">
          {displayOrAdd(
            "Vị trí công việc",
            loading ? "…" : data?.desiredPosition
          )}

          {displayOrAdd(
            "Ngành nghề",
            loading
              ? "…"
              : (data?.industries?.length ? data.industries.join(", ") : "")
          )}

          {displayOrAdd(
            "Địa điểm tìm việc",
            loading
              ? "…"
              : (data.locations?.length ? data.locations.join(", ") : "")
          )}
        </div>

        {/* CỘT PHẢI */}
        <div className="flex-1 space-y-5 text-left">
          {displayOrAdd(
            "Mức lương mong muốn (triệu/tháng)",
            loading ? "…" : salaryText
          )}

          {displayOrAdd(
            "Hình thức làm việc",
            loading
              ? "…"
              : (data?.workTypes?.length ? data.workTypes.join(", ") : "")
          )}
        </div>
      </div>

      </section>

      <RightDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Tiêu chí tìm việc"
      >
        <CriteriaForm
          defaultValues={data}
          onSubmit={handleUpdateJobCriteria}
        />
      </RightDrawer>
    </>
  );
}

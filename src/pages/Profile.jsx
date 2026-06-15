import ProfileCard from "../components/ProfileDashboard/ProfileCard/ProfileCard";
import CVCards from "../components/ProfileDashboard/CVCard";
import JobCriteriaCard from "../components/ProfileDashboard/JobCriteria/JobCriteria";
import WorkExperienceCard from "../components/ProfileDashboard/WorkExperienceCard";
import EducationCard from "../components/ProfileDashboard/EducationCard";
import SkillsCard from "../components/ProfileDashboard/SkillsCard";

export default function Profile({className}) {

  return (
    <div className={`flex w-full ${className}`}>
      <div className="flex-1 pb-20 sm:pb-6">
        <div className="mb-4 px-1 sm:px-0">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Profile
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-900">Hồ sơ của tôi</div>
          <div className="mt-1 text-sm text-slate-500">
            Cập nhật thông tin hồ sơ để tăng chất lượng hiển thị với nhà tuyển dụng.
          </div>
        </div>

        <div className="mx-auto max-w-[980px] space-y-4">
          <ProfileCard />

          <CVCards
            initialFiles={[
              {
                name: "InternJava_LuongQuangThinh_1_1759043935740.pdf",
                url: "#",
                uploadedAt: "2025-09-28T14:18:48+07:00",
              },
            ]}
            onRemove={(item) => console.log("Removed:", item)}
            onView={(item) => window.open(item.url || "#", "_blank")}
          />

          <JobCriteriaCard className="mt-4" />

          <WorkExperienceCard className="mt-4" />

          <EducationCard />

          <SkillsCard />
        </div>
      </div>
    </div>
  );
}

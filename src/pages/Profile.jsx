import ProfileCard from "../components/ProfileDashboard/ProfileCard/ProfileCard";
import CVCards from "../components/ProfileDashboard/CVCard";
import JobCriteriaCard from "../components/ProfileDashboard/JobCriteria/JobCriteria";
import WorkExperienceCard from "../components/ProfileDashboard/WorkExperienceCard";
import EducationCard from "../components/ProfileDashboard/EducationCard";
import SkillsCard from "../components/ProfileDashboard/SkillsCard";

export default function Profile({className}) {

  return (
    <div className={`flex w-full ${className} `}>
      <div className="flex-1 px-6">
        {/* Hồ sơ */}
        <div className="text-lg font-bold text-slate-900 mb-3"> Hồ sơ của tôi</div>
        <div className=" mx-auto mb-4">
          <ProfileCard />
        </div>

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

        <JobCriteriaCard
          className="mt-4"
        />

        <WorkExperienceCard
          className="mt-4"
        />


        <div className="mt-4">
          <EducationCard />
        </div>

        <div className="mt-4">
          <SkillsCard />
        </div>
      </div>

    </div>
  );
}

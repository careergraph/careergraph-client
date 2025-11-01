import { useState } from "react";
import { Pencil } from "lucide-react";
import ProfileCard from "../components/ProfileDashboard/ProfileCard/ProfileCard";
import CVCards from "../components/ProfileDashboard/CVCard";
import JobCriteriaCard from "../components/ProfileDashboard/JobCriteria/JobCriteria";
import WorkExperienceCard from "../components/ProfileDashboard/WorkExperienceCard";
import EducationCard from "../components/ProfileDashboard/EducationCard";
import SkillsCard from "../components/ProfileDashboard/SkillsCard";


export default function Profile({className}) {

  async function uploadToServer(file) {
    // TODO: gọi API, lấy URL… (ví dụ)
    // const url = await api.upload(file)
    // return url
  }

  const [criteria, setCriteria] = useState({
    title: "ssss",
    industries: [],
    locations: [],
    salaryMin: null,
    salaryMax: null,
    workTypes: [],
  });

  const [generalInfo, setGeneralInfo] = useState({
    hasExp: false,   // false -> “Chưa có kinh nghiệm”
    years: null,     // string, vd: "1 năm"
    level: "",       // string, vd: "Nhân viên"
    education: "",   // string, vd: "Đại học"
  });


  const [experiences, setExperiences] = useState([
    {
      id: "1",
      company: "Công ty B",
      title: "BE",
      start: "2023-02",
      end: "2025-01",
      isCurrent: false,
      desc: "phát triển",
    },
  ]);

   const [educationList, setEducationList] = useState([
    {
      id: "1",
      school: "Trường Đại học Sư phạm Kỹ thuật TP. HCM",
      major: "IT phần mềm",
      degree: "Đại học",
      startYear: "2019",
      endYear: "2020",
      desc: "ssssss"
    },
    {
      id: "2",
      school: "Trường Đại học Sư phạm Kỹ thuật TP. HCM",
      major: "IT phần mềm",
      degree: "Đại học",
      startYear: "2019",
      endYear: "2020",
      desc: "ssssss"
    },
  ]);


  const [skills, setSkills] = useState([
    "Java", "Spring Boot", "ReactJS", "NodeJS"
  ]);
  

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
          onUpload={uploadToServer}
          onRemove={(item) => console.log("Removed:", item)}
          onView={(item) => window.open(item.url || "#", "_blank")}
        />

        <JobCriteriaCard
          value={criteria}
          onSave={(v) => setCriteria(v)}
          className="mt-4"
        />




        <WorkExperienceCard
          value={experiences}
          onChange={setExperiences}
          className="mt-4"
        />


        <div className="mt-4">
          <EducationCard value={educationList} onChange={setEducationList} />
        </div>

        <div className="mt-4">
          <SkillsCard value={skills} onChange={setSkills} />
        </div>

    
      </div>

    </div>
  );
}

import JobCardPersonal from "../../components/Cards/JobCardPersonal";
import SectionTitle from "../../components/Sections/SectionTitle";

export default function PersonalJobsSection() {
  return (
    <>
      <SectionTitle
        text1="Việc làm cá nhân"
        text2="Tổng quan việc làm cá nhân"
        text3="Chúng tôi dựa trên CV và thông tin cá nhân bạn đã cung cấp để đề xuất những công việc phù hợp để bạn ứng tuyển."
      />

      <div className="flex flex-wrap items-center justify-center gap-10 mt-16">
        <JobCardPersonal />
        <JobCardPersonal />
        <JobCardPersonal />
        <JobCardPersonal />
        <JobCardPersonal />
        <JobCardPersonal />
      </div>
    </>
  );
}

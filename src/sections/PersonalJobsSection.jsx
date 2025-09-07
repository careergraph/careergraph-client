import JobCardPersonal from "../components/Cards/JobCardPersonal";
import SectionTitle from "../components/Sections/SectionTitle";

export default function PersonalJobsSection() {
  return (
    <>
      <SectionTitle
        text1="Personal Jobs"
        text2="Personal Jobs Overview"
        text3="We base on your CV and personal information you have provided to suggest suitable jobs for you to apply for."
      />

      <div className="flex flex-wrap items-center justify-center gap-10 mt-16">
        <JobCardPersonal />
        <JobCardPersonal />
        <JobCardPersonal />
        <JobCardPersonal />
      </div>
    </>
  );
}

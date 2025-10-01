import JobsCardCommon from "../../components/Cards/JobsCardCommon";
import SectionTitle from "../../components/Sections/SectionTitle";

export default function PopularJobsSection() {
  return (
    <>
      <SectionTitle
        text1="Việc làm phổ biến"
        text2="Tổng quan việc làm phổ biến"
        text3="Những công việc được nhiều ứng viên quan tâm, có thể sẽ hữu ích trong quá trình tìm kiếm việc làm của bạn."
      />

      <div className="flex flex-wrap items-center justify-center gap-10 mt-16">
        <JobsCardCommon />
        <JobsCardCommon />
        <JobsCardCommon />
        <JobsCardCommon />
      </div>
    </>
  );
}

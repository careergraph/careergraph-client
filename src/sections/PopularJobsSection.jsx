import JobsCardCommon from "../components/Cards/JobsCardCommon";
import SectionTitle from "../components/SectionTitle";

export default function PopularJobsSection() {
  return (
    <>
      <SectionTitle
        text1="Popular Jobs"
        text2="Popular Jobs Overview"
        text3="These are jobs that many candidates apply for, maybe it will help you in the job search process."
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

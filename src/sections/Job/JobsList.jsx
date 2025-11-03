import React from "react";
import JobCard from "../../components/Cards/JobsCardCommon";

const JobsList = () => {
  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <JobCard />
      <JobCard />
      <JobCard />
      <JobCard />
      <JobCard />
      <JobCard />
      <JobCard />
    </div>
  );
};

export default JobsList;

import React from "react";

import cardSectionCompanyAccessed from "../../assets/icons/company-accessed.svg";
import JobTag from "../Tags/JobTag";
import ViewJobButton from "../Buttons/ViewJobButton";

function JobsCardCommon() {
  const divRef = React.useRef(null);

  return (
    <div
      ref={divRef}
      className="relative w-full max-w-[450px] h-56 rounded-xl p-px bg-gray-50 backdrop-blur-md text-gray-200 overflow-hidden shadow-sm cursor-pointer"
    >
      <div className="relative z-10 bg-white backdrop-blur-sm p-5 h-full w-full rounded-[11px] flex flex-row items-center space-x-6">
        <div className="flex flex-col items-center justify-between w-1/4 space-y-4 h-80%">
          <img
            src={cardSectionCompanyAccessed}
            alt="Company Logo"
            className="w-20 h-20 rounded-full object-contain"
          />

          <ViewJobButton label="Detail" />
        </div>

        <div className="flex flex-col justify-between w-3/4 h-80%">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Accessed</h2>
            <p className="text-sm text-indigo-500 font-medium mb-2">
              Software Developer
            </p>
            <p className="text-sm text-slate-500 line-clamp-2 mb-3">
              Passionate about clean code, scalable systems, and solving
              real-world problems with elegant software. Always eager to learn
              new technologies and contribute to impactful projects.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <JobTag label="Typescript" />
            <JobTag label="Java" />
            <JobTag label="Golang" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobsCardCommon;

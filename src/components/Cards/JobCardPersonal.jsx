import React from "react";
import cardSectionSaveIcon from "../../assets/icons/card-section-save.svg";
import cardSectionApplyIcon from "../../assets/icons/card-section-apply.svg";
import cardSectionShareIcon from "../../assets/icons/card-section-share.svg";
import cardSectionCompanyAccessed from "../../assets/icons/company-accessed.svg";
import JobTag from "../Tags/JobTag";

function JobCardPersonal() {
  const [visible, setVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const divRef = React.useRef(null);

  const handleMouseMove = (e) => {
    const bounds = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="relative w-72 h-80 rounded-xl p-px bg-gray-50 backdrop-blur-md text-gray-800 overflow-hidden shadow-lg cursor-pointer"
    >
      <div
        className={`pointer-events-none blur-3xl rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-300 size-48 absolute z-0 transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ top: position.y - 96, left: position.x - 96 }}
      />

      <div className="relative z-10 bg-gray-50/90 backdrop-blur-sm p-5 h-full w-full rounded-[11px] flex flex-col items-center justify-center text-center">
        <div className="flex justify-between items-center w-full">
          <img
            src={cardSectionCompanyAccessed}
            alt="Profile Avatar"
            className="w-18 h-18 rounded-full my-3 object-contain"
          />

          <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Accessed</h2>
            <p className="text-sm text-indigo-500 font-medium mb-3">
              Software Developer
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center w-full mb-5">
          <JobTag label="Typescript" />
          <JobTag label="Java" />
          <JobTag label="Golang" />
        </div>

        <p className="text-sm text-slate-500 mb-5 px-3 line-clamp-3">
          Passionate about clean code, scalable systems, and solving real-world
          problems with elegant software. Always eager to learn new technologies
          and contribute to impactful projects.
        </p>
        <div className="flex justify-between items-center w-full px-5 mb-3">
          <button className="hover:-translate-y-0.5 transition text-slate-500 hover:text-indigo-500">
            <img src={cardSectionSaveIcon} alt="Save" className="size-6" />
          </button>
          <button className="hover:-translate-y-0.5 transition text-slate-500 hover:text-indigo-500">
            <img src={cardSectionApplyIcon} alt="Save" className="size-6" />
          </button>
          <button className="hover:-translate-y-0.5 transition text-slate-500 hover:text-indigo-500">
            <img src={cardSectionShareIcon} alt="Save" className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobCardPersonal;

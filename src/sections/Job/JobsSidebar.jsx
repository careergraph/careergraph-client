import React, { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";

const EXPERIENCE_LEVELS = [
  { value: "ENTRY", label: "Mới vào nghề" },
  { value: "INTERN", label: "Thực tập sinh" },
  { value: "MIDDLE", label: "Chuyên viên" },
  { value: "FRESHER", label: "Mới tốt nghiệp" },
  { value: "JUNIOR", label: "Nhân viên Junior" },
  { value: "SENIOR", label: "Nhân viên Senior" },
  { value: "LEADER", label: "Trưởng nhóm" },
  { value: "CTO", label: "Giám đốc công nghệ" },
  { value: "CFO", label: "Giám đốc tài chính" },
];

const EMPLOYMENT_TYPES = [
  { value: "FULL_TIME", label: "Toàn thời gian" },
  { value: "PART_TIME", label: "Bán thời gian" },
  { value: "CONTRACT", label: "Hợp đồng" },
  { value: "INTERNSHIP", label: "Thực tập" },
  { value: "FREELANCE", label: "Làm tự do" },
  { value: "TEMPORARY", label: "Tạm thời" },
];

const JOB_CATEGORIES = [
  {
    value: "ALL",
    label: "Tất cả ngành nghề",
  },
  {
    value: "ENGINEER",
    label: "Kỹ thuật",
  },
  {
    value: "BUSINESS",
    label: "Kinh doanh",
  },
  {
    value: "ART_MUSIC",
    label: "Nghệ thuật & Âm nhạc",
  },
  {
    value: "ADMINISTRATION",
    label: "Hành chính",
  },
  {
    value: "SALES",
    label: "Bán hàng",
  },
  {
    value: "EDUCATION",
    label: "Giáo dục",
  },
];

const EDUCATION_LEVELS = [
  { value: "HIGH_SCHOOL", label: "Trung học phổ thông" },
  { value: "ASSOCIATE_DEGREE", label: "Cao đẳng" },
  { value: "BACHELORS_DEGREE", label: "Đại học" },
  { value: "MASTERS_DEGREE", label: "Thạc sĩ" },
  { value: "DOCTORATE", label: "Tiến sĩ" },
  { value: "OTHER", label: "Khác" },
];

const JobsSidebar = ({ isOpen, onClose, onFilterChange }) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    salary: true,
    experience: true,
    employment: true,
    education: true,
  });

  const [filters, setFilters] = useState({
    jobCategory: "ALL",
    experienceLevels: [],
    employmentTypes: [],
    educationLevels: [],
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilters = (next) => {
    setFilters(next);
    if (onFilterChange) {
      onFilterChange(next);
    }
  };

  const toggleMultiValue = (key, value) => {
    const existing = filters[key] || [];
    const next = existing.includes(value)
      ? existing.filter((item) => item !== value)
      : [...existing, value];
    updateFilters({ ...filters, [key]: next });
  };

  const handleSelectCategory = (value) => {
    updateFilters({ ...filters, jobCategory: value });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      jobCategory: "ALL",
      experienceLevels: [],
      employmentTypes: [],
      educationLevels: [],
    };
    updateFilters(clearedFilters);
  };

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="pb-5 mb-5 border-b border-slate-200 last:border-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full text-left font-semibold text-slate-800 mb-4 hover:text-indigo-600 transition-colors group"
      >
        <span className="flex items-center gap-2">
          {title}
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></span>
        </span>
        {expandedSections[sectionKey] ? (
          <ChevronUp size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
        ) : (
          <ChevronDown size={16} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
        )}
      </button>
      <div
        className={`transition-all duration-200 ${
          expandedSections[sectionKey]
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
          top-0 left-0 h-full w-80 max-w-[95vw]
          bg-white
          lg:border-r-2 lg:border-slate-100
          shadow-xl lg:shadow-none
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-5 border-b-2 border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-50 rounded-lg">
                <Filter size={18} className="text-indigo-600" />
              </div>
              <h3 className="font-bold text-lg text-slate-800">
                Bộ lọc tìm kiếm
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearAllFilters}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Xoá tất cả
              </button>
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-slate-600" />
              </button>
            </div>
          </div>

          {/* Job categories */}
          <FilterSection title="Ngành nghề" sectionKey="category">
            <div className="space-y-2.5">
              {JOB_CATEGORIES.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 w-full py-1">
                    <input
                      type="radio"
                      name="jobCategory"
                      value={value}
                      checked={filters.jobCategory === value}
                      onChange={() => handleSelectCategory(value)}
                      className="w-4 h-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <span className={`text-sm transition-colors ${
                      filters.jobCategory === value 
                        ? "text-indigo-600 font-medium" 
                        : "text-slate-700 group-hover:text-slate-900"
                    }`}>
                      {label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Experience levels */}
          <FilterSection title="Kinh nghiệm làm việc" sectionKey="experience">
            <div className="space-y-2.5">
              {EXPERIENCE_LEVELS.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 w-full py-1">
                    <input
                      type="checkbox"
                      checked={filters.experienceLevels.includes(value)}
                      onChange={() => toggleMultiValue("experienceLevels", value)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <span className={`text-sm transition-colors ${
                      filters.experienceLevels.includes(value)
                        ? "text-indigo-600 font-medium"
                        : "text-slate-700 group-hover:text-slate-900"
                    }`}>
                      {label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Employment types */}
          <FilterSection title="Hình thức làm việc" sectionKey="employment">
            <div className="flex flex-wrap gap-2">
              {EMPLOYMENT_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => toggleMultiValue("employmentTypes", value)}
                  className={`px-3.5 py-2 text-sm rounded-lg border-2 font-medium transition-all
                    ${
                      filters.employmentTypes.includes(value)
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Education levels */}
          <FilterSection title="Trình độ học vấn" sectionKey="education">
            <div className="space-y-2.5">
              {EDUCATION_LEVELS.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 w-full py-1">
                    <input
                      type="checkbox"
                      checked={filters.educationLevels.includes(value)}
                      onChange={() => toggleMultiValue("educationLevels", value)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                    />
                    <span className={`text-sm transition-colors ${
                      filters.educationLevels.includes(value)
                        ? "text-indigo-600 font-medium"
                        : "text-slate-700 group-hover:text-slate-900"
                    }`}>
                      {label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>
      </div>
    </>
  );
};

export default JobsSidebar;

import React, { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { useJobEnums } from "~/hooks/useJobEnums";

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
  { value: "ALL", label: "Tất cả ngành nghề" },
  { value: "ENGINEER", label: "Kỹ thuật" },
  { value: "BUSINESS", label: "Kinh doanh" },
  { value: "ART_MUSIC", label: "Nghệ thuật & Âm nhạc" },
  { value: "ADMINISTRATION", label: "Hành chính" },
  { value: "SALES", label: "Bán hàng" },
  { value: "EDUCATION", label: "Giáo dục" },
];

const EDUCATION_LEVELS = [
  { value: "HIGH_SCHOOL", label: "Trung học phổ thông" },
  { value: "ASSOCIATE", label: "Cao đẳng" },
  { value: "BACHELOR", label: "Đại học" },
  { value: "MASTER", label: "Thạc sĩ" },
  { value: "DOCTORATE", label: "Tiến sĩ" },
  { value: "VOCATIONAL", label: "Đào tạo nghề" },
  { value: "CERTIFICATION", label: "Chứng chỉ chuyên môn" },
  { value: "NONE", label: "Không yêu cầu" },
];

const DEFAULT_FILTERS = {
  jobCategory: "ALL",
  experienceLevels: [],
  employmentTypes: [],
  educationLevels: [],
};

const JobsSidebar = ({ isOpen, onClose, onFilterChange }) => {
  const { experienceLevels, employmentTypes, educationTypes, jobCategories } =
    useJobEnums();
  const experienceOptions = experienceLevels?.length
    ? experienceLevels
    : EXPERIENCE_LEVELS;
  const employmentOptions = employmentTypes?.length
    ? employmentTypes
    : EMPLOYMENT_TYPES;
  const educationOptions = educationTypes?.length
    ? educationTypes
    : EDUCATION_LEVELS;
  const categoryOptions = [
    { value: "ALL", label: "Tất cả ngành nghề" },
    ...((jobCategories?.length ? jobCategories : JOB_CATEGORIES).filter(
      (item) => item.value !== "ALL"
    )),
  ];

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    salary: true,
    experience: true,
    employment: true,
    education: true,
  });

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilters = (next) => {
    setFilters(next);
    onFilterChange?.(next);
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
    updateFilters(DEFAULT_FILTERS);
  };

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="pb-4 mb-4 border-b border-slate-200 last:border-0 last:mb-0 last:pb-0">
      <button
        type="button"
        onClick={() => toggleSection(sectionKey)}
        className="group mb-3 flex w-full items-center justify-between text-left font-semibold text-slate-800 transition-colors hover:text-indigo-600"
      >
        <span className="flex items-center gap-2">
          {title}
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400 opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
        {expandedSections[sectionKey] ? (
          <ChevronUp
            size={16}
            className="text-slate-400 transition-colors group-hover:text-indigo-500"
          />
        ) : (
          <ChevronDown
            size={16}
            className="text-slate-400 transition-colors group-hover:text-indigo-500"
          />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          expandedSections[sectionKey]
            ? "max-h-[720px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );

  return (
    <>
      {isOpen ? (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-[88vw] max-w-sm transform overflow-hidden border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out md:w-[420px] md:max-w-[90vw] md:rounded-2xl md:border md:shadow-sm lg:static lg:z-auto lg:h-auto lg:w-full lg:max-w-none lg:translate-x-0 lg:border lg:shadow-sm ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-5 lg:px-6">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-indigo-50 p-1.5">
                <Filter size={18} className="text-indigo-600" />
              </div>
              <h3 className="text-base font-bold text-slate-800 sm:text-lg">
                Bộ lọc tìm kiếm
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
              >
                Xoá tất cả
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 transition-colors hover:bg-slate-100"
              >
                <X size={18} className="text-slate-600" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 lg:px-6">
            <FilterSection title="Ngành nghề" sectionKey="category">
              <div className="space-y-2.5">
                {categoryOptions.map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center group"
                  >
                    <div className="flex w-full items-center gap-2.5 py-1">
                      <input
                        type="radio"
                        name="jobCategory"
                        value={value}
                        checked={filters.jobCategory === value}
                        onChange={() => handleSelectCategory(value)}
                        className="h-4 w-4 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                      />
                      <span
                        className={`text-sm transition-colors ${
                          filters.jobCategory === value
                            ? "font-medium text-indigo-600"
                            : "text-slate-700 group-hover:text-slate-900"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Kinh nghiệm làm việc" sectionKey="experience">
              <div className="space-y-2.5">
                {experienceOptions.map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center group"
                  >
                    <div className="flex w-full items-center gap-2.5 py-1">
                      <input
                        type="checkbox"
                        checked={filters.experienceLevels.includes(value)}
                        onChange={() => toggleMultiValue("experienceLevels", value)}
                        className="h-4 w-4 rounded text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                      />
                      <span
                        className={`text-sm transition-colors ${
                          filters.experienceLevels.includes(value)
                            ? "font-medium text-indigo-600"
                            : "text-slate-700 group-hover:text-slate-900"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Hình thức làm việc" sectionKey="employment">
              <div className="flex flex-wrap gap-2">
                {employmentOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleMultiValue("employmentTypes", value)}
                    className={`rounded-lg border-2 px-3.5 py-2 text-sm font-medium transition-all ${
                      filters.employmentTypes.includes(value)
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                        : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Trình độ học vấn" sectionKey="education">
              <div className="space-y-2.5">
                {educationOptions.map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center group"
                  >
                    <div className="flex w-full items-center gap-2.5 py-1">
                      <input
                        type="checkbox"
                        checked={filters.educationLevels.includes(value)}
                        onChange={() => toggleMultiValue("educationLevels", value)}
                        className="h-4 w-4 rounded text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0"
                      />
                      <span
                        className={`text-sm transition-colors ${
                          filters.educationLevels.includes(value)
                            ? "font-medium text-indigo-600"
                            : "text-slate-700 group-hover:text-slate-900"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </FilterSection>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobsSidebar;

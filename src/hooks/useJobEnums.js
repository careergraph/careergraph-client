import { useEffect, useMemo, useState } from "react";
import { JobAPI } from "~/services/api/job";

const DEFAULT_ENUMS = {
  experienceLevels: [
    { value: "ENTRY", label: "Entry" },
    { value: "INTERN", label: "Intern" },
    { value: "MIDDLE", label: "Middle" },
    { value: "FRESHER", label: "Fresher" },
    { value: "JUNIOR", label: "Junior" },
    { value: "SENIOR", label: "Senior" },
    { value: "LEADER", label: "Leader" },
    { value: "CTO", label: "CTO" },
    { value: "CFO", label: "CFO" },
  ],
  employmentTypes: [
    { value: "FULL_TIME", label: "Full-time" },
    { value: "PART_TIME", label: "Part-time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "INTERNSHIP", label: "Internship" },
    { value: "FREELANCE", label: "Freelance" },
    { value: "TEMPORARY", label: "Temporary" },
  ],
  educationTypes: [
    { value: "HIGH_SCHOOL", label: "High School Diploma" },
    { value: "ASSOCIATE", label: "Associate Degree" },
    { value: "BACHELOR", label: "Bachelor's Degree" },
    { value: "MASTER", label: "Master's Degree" },
    { value: "DOCTORATE", label: "Doctorate" },
    { value: "VOCATIONAL", label: "Vocational Training" },
    { value: "CERTIFICATION", label: "Professional Certification" },
    { value: "NONE", label: "No Formal Education" },
  ],
  jobCategories: [
    { value: "ENGINEER", label: "Engineer" },
    { value: "BUSINESS", label: "Business" },
    { value: "ART_MUSIC", label: "Art & Music" },
    { value: "ADMINISTRATION", label: "Administration" },
    { value: "SALES", label: "Sales" },
    { value: "EDUCATION", label: "Education" },
    { value: "CUSTOMER_SERVICE", label: "Customer Service" },
    { value: "MANUFACTURING", label: "Manufacturing" },
    { value: "TECHNOLOGY", label: "Technology" },
    { value: "MARKETING", label: "Marketing" },
    { value: "FINANCE", label: "Finance" },
    { value: "HEALTHCARE", label: "Healthcare" },
    { value: "HUMAN_RESOURCES", label: "Human Resources" },
    { value: "DESIGN", label: "Design" },
  ],
};

const toMap = (items) =>
  (items || []).reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {});

export const useJobEnums = () => {
  const [enumOptions, setEnumOptions] = useState(DEFAULT_ENUMS);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const response = await JobAPI.getJobEnums();
        const data = response?.data ?? response;
        if (!mounted || !data) return;

        setEnumOptions((prev) => ({
          experienceLevels:
            data.experienceLevels?.map((x) => ({ value: x.code, label: x.name })) ||
            prev.experienceLevels,
          employmentTypes:
            data.employmentTypes?.map((x) => ({ value: x.code, label: x.name })) ||
            prev.employmentTypes,
          educationTypes:
            data.educationTypes?.map((x) => ({ value: x.code, label: x.name })) ||
            prev.educationTypes,
          jobCategories:
            data.jobCategories?.map((x) => ({ value: x.code, label: x.name })) ||
            prev.jobCategories,
        }));
      } catch (error) {
        console.error("Failed to load job enums:", error);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const labelMaps = useMemo(
    () => ({
      experience: toMap(enumOptions.experienceLevels),
      employment: toMap(enumOptions.employmentTypes),
      education: toMap(enumOptions.educationTypes),
      category: toMap(enumOptions.jobCategories),
    }),
    [enumOptions]
  );

  return {
    ...enumOptions,
    labelMaps,
  };
};

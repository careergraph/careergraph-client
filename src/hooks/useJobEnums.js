import { useEffect, useMemo, useState } from "react";
import { JobAPI } from "~/services/api/job";
import { VI_LABELS, normalizeEnumItems, toMap } from "~/utils/jobEnums";

const DEFAULT_ENUMS = {
  experienceLevels: [
    { value: "ENTRY", label: VI_LABELS.experienceLevels.ENTRY },
    { value: "INTERN", label: VI_LABELS.experienceLevels.INTERN },
    { value: "MIDDLE", label: VI_LABELS.experienceLevels.MIDDLE },
    { value: "FRESHER", label: VI_LABELS.experienceLevels.FRESHER },
    { value: "JUNIOR", label: VI_LABELS.experienceLevels.JUNIOR },
    { value: "SENIOR", label: VI_LABELS.experienceLevels.SENIOR },
    { value: "LEADER", label: VI_LABELS.experienceLevels.LEADER },
    { value: "CTO", label: VI_LABELS.experienceLevels.CTO },
    { value: "CFO", label: VI_LABELS.experienceLevels.CFO },
  ],
  employmentTypes: [
    { value: "FULL_TIME", label: VI_LABELS.employmentTypes.FULL_TIME },
    { value: "PART_TIME", label: VI_LABELS.employmentTypes.PART_TIME },
    { value: "CONTRACT", label: VI_LABELS.employmentTypes.CONTRACT },
    { value: "INTERNSHIP", label: VI_LABELS.employmentTypes.INTERNSHIP },
    { value: "FREELANCE", label: VI_LABELS.employmentTypes.FREELANCE },
    { value: "TEMPORARY", label: VI_LABELS.employmentTypes.TEMPORARY },
  ],
  educationTypes: [
    { value: "HIGH_SCHOOL", label: VI_LABELS.educationTypes.HIGH_SCHOOL },
    { value: "ASSOCIATE", label: VI_LABELS.educationTypes.ASSOCIATE },
    { value: "BACHELOR", label: VI_LABELS.educationTypes.BACHELOR },
    { value: "MASTER", label: VI_LABELS.educationTypes.MASTER },
    { value: "DOCTORATE", label: VI_LABELS.educationTypes.DOCTORATE },
    { value: "VOCATIONAL", label: VI_LABELS.educationTypes.VOCATIONAL },
    { value: "CERTIFICATION", label: VI_LABELS.educationTypes.CERTIFICATION },
    { value: "NONE", label: VI_LABELS.educationTypes.NONE },
  ],
  jobCategories: [
    { value: "ENGINEER", label: VI_LABELS.jobCategories.ENGINEER },
    { value: "BUSINESS", label: VI_LABELS.jobCategories.BUSINESS },
    { value: "ART_MUSIC", label: VI_LABELS.jobCategories.ART_MUSIC },
    { value: "ADMINISTRATION", label: VI_LABELS.jobCategories.ADMINISTRATION },
    { value: "SALES", label: VI_LABELS.jobCategories.SALES },
    { value: "EDUCATION", label: VI_LABELS.jobCategories.EDUCATION },
    { value: "CUSTOMER_SERVICE", label: VI_LABELS.jobCategories.CUSTOMER_SERVICE },
    { value: "MANUFACTURING", label: VI_LABELS.jobCategories.MANUFACTURING },
    { value: "TECHNOLOGY", label: VI_LABELS.jobCategories.TECHNOLOGY },
    { value: "MARKETING", label: VI_LABELS.jobCategories.MARKETING },
    { value: "FINANCE", label: VI_LABELS.jobCategories.FINANCE },
    { value: "HEALTHCARE", label: VI_LABELS.jobCategories.HEALTHCARE },
    { value: "HUMAN_RESOURCES", label: VI_LABELS.jobCategories.HUMAN_RESOURCES },
    { value: "DESIGN", label: VI_LABELS.jobCategories.DESIGN },
  ],
};

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
          experienceLevels: data.experienceLevels?.length
            ? normalizeEnumItems(data.experienceLevels, VI_LABELS.experienceLevels)
            : prev.experienceLevels,
          employmentTypes: data.employmentTypes?.length
            ? normalizeEnumItems(data.employmentTypes, VI_LABELS.employmentTypes)
            : prev.employmentTypes,
          educationTypes: data.educationTypes?.length
            ? normalizeEnumItems(data.educationTypes, VI_LABELS.educationTypes)
            : prev.educationTypes,
          jobCategories: data.jobCategories?.length
            ? normalizeEnumItems(data.jobCategories, VI_LABELS.jobCategories)
            : prev.jobCategories,
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

export const DEFAULT_JOB_FILTERS = {
  jobCategory: "ALL",
  experienceLevels: [],
  employmentTypes: [],
  educationLevels: [],
};

const splitList = (value) => {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const joinList = (values) => (values?.length ? values.join(",") : "");

export const parseJobSearchParams = (searchParams) => {
  const pageRaw = parseInt(searchParams.get("page") || "1", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  return {
    keyword: searchParams.get("q") || "",
    locationSlug: searchParams.get("loc") || "",
    page,
    filters: {
      jobCategory: searchParams.get("category") || DEFAULT_JOB_FILTERS.jobCategory,
      experienceLevels: splitList(searchParams.get("experience")),
      employmentTypes: splitList(searchParams.get("employment")),
      educationLevels: splitList(searchParams.get("education")),
    },
  };
};

export const buildJobSearchParams = (currentParams, updates = {}) => {
  const current = parseJobSearchParams(currentParams);

  const next = {
    keyword: updates.keyword !== undefined ? updates.keyword : current.keyword,
    locationSlug:
      updates.locationSlug !== undefined ? updates.locationSlug : current.locationSlug,
    page: updates.page !== undefined ? updates.page : current.page,
    filters: updates.filters !== undefined ? updates.filters : current.filters,
  };

  const params = new URLSearchParams();
  const trimmedKeyword = (next.keyword || "").trim();

  if (trimmedKeyword) {
    params.set("q", trimmedKeyword);
  }

  if (next.locationSlug) {
    params.set("loc", next.locationSlug);
  }

  params.set("page", String(next.page > 0 ? next.page : 1));

  const { jobCategory, experienceLevels, employmentTypes, educationLevels } =
    next.filters;

  if (jobCategory && jobCategory !== "ALL") {
    params.set("category", jobCategory);
  }

  const experience = joinList(experienceLevels);
  if (experience) {
    params.set("experience", experience);
  }

  const employment = joinList(employmentTypes);
  if (employment) {
    params.set("employment", employment);
  }

  const education = joinList(educationLevels);
  if (education) {
    params.set("education", education);
  }

  return params;
};

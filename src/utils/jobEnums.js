const VI_LABELS = {
  experienceLevels: {
    ENTRY: "Mới vào nghề",
    INTERN: "Thực tập sinh",
    MIDDLE: "Chuyên viên",
    FRESHER: "Mới tốt nghiệp",
    JUNIOR: "Nhân viên Junior",
    SENIOR: "Nhân viên Senior",
    LEADER: "Trưởng nhóm",
    CTO: "Giám đốc công nghệ",
    CFO: "Giám đốc tài chính",
  },
  employmentTypes: {
    FULL_TIME: "Toàn thời gian",
    PART_TIME: "Bán thời gian",
    CONTRACT: "Hợp đồng",
    INTERNSHIP: "Thực tập",
    FREELANCE: "Làm tự do",
    TEMPORARY: "Tạm thời",
  },
  educationTypes: {
    HIGH_SCHOOL: "Trung học phổ thông",
    ASSOCIATE_DEGREE: "Cao đẳng",
    ASSOCIATE: "Cao đẳng",
    BACHELORS_DEGREE: "Đại học",
    BACHELOR: "Đại học",
    MASTERS_DEGREE: "Thạc sĩ",
    MASTER: "Thạc sĩ",
    DOCTORATE: "Tiến sĩ",
    VOCATIONAL: "Đào tạo nghề",
    CERTIFICATION: "Chứng chỉ chuyên môn",
    OTHER: "Không yêu cầu",
    NONE: "Không yêu cầu",
  },
  jobCategories: {
    ENGINEER: "Kỹ thuật",
    BUSINESS: "Kinh doanh",
    ART_MUSIC: "Nghệ thuật & Âm nhạc",
    ADMINISTRATION: "Hành chính",
    SALES: "Bán hàng",
    EDUCATION: "Giáo dục",
    CUSTOMER_SERVICE: "Chăm sóc khách hàng",
    MANUFACTURING: "Sản xuất",
    TECHNOLOGY: "Công nghệ",
    MARKETING: "Marketing",
    FINANCE: "Tài chính",
    HEALTHCARE: "Y tế",
    HUMAN_RESOURCES: "Nhân sự",
    DESIGN: "Thiết kế",
  },
};

const JOB_ENUM_ALIASES = {
  experience: {
    ENTRY: ["ENTRY"],
    INTERN: ["INTERN"],
    MIDDLE: ["MIDDLE"],
    FRESHER: ["FRESHER"],
    JUNIOR: ["JUNIOR"],
    SENIOR: ["SENIOR"],
    LEADER: ["LEADER"],
    CTO: ["CTO"],
    CFO: ["CFO"],
  },
  employment: {
    FULL_TIME: ["FULL_TIME", "FULL TIME"],
    PART_TIME: ["PART_TIME", "PART TIME"],
    CONTRACT: ["CONTRACT"],
    INTERNSHIP: ["INTERNSHIP"],
    FREELANCE: ["FREELANCE"],
    TEMPORARY: ["TEMPORARY"],
  },
  category: {
    ENGINEER: ["ENGINEER", "Engineer", "Ky thuat"],
    BUSINESS: ["BUSINESS", "Business"],
    ART_MUSIC: ["ART_MUSIC", "ART MUSIC", "Art & Music", "Nghe thuat va Am nhac"],
    ADMINISTRATION: ["ADMINISTRATION", "Administration", "Hanh chinh"],
    SALES: ["SALES", "Sales", "Ban hang"],
    EDUCATION: ["EDUCATION", "Education", "Giao duc"],
    CUSTOMER_SERVICE: ["CUSTOMER_SERVICE", "CUSTOMER SERVICE", "Customer Service", "Cham soc khach hang"],
    MANUFACTURING: ["MANUFACTURING", "Manufacturing", "San xuat"],
    TECHNOLOGY: ["TECHNOLOGY", "Technology", "Cong nghe"],
    MARKETING: ["MARKETING", "Marketing"],
    FINANCE: ["FINANCE", "Finance", "Tai chinh"],
    HEALTHCARE: ["HEALTHCARE", "Healthcare", "Y te"],
    HUMAN_RESOURCES: ["HUMAN_RESOURCES", "HUMAN RESOURCES", "Human Resources", "Nhan su"],
    DESIGN: ["DESIGN", "Design", "Thiet ke"],
  },
};

const normalizeLookupValue = (value) =>
  String(value || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();

const LABEL_GROUP_BY_KIND = {
  experience: VI_LABELS.experienceLevels,
  employment: VI_LABELS.employmentTypes,
  education: VI_LABELS.educationTypes,
  category: VI_LABELS.jobCategories,
};

const createLookup = () => {
  const lookup = {};

  Object.entries(LABEL_GROUP_BY_KIND).forEach(([kind, labelGroup]) => {
    lookup[kind] = {};

    Object.entries(labelGroup).forEach(([code, label]) => {
      lookup[kind][normalizeLookupValue(code)] = label;
      lookup[kind][normalizeLookupValue(label)] = label;
    });

    Object.entries(JOB_ENUM_ALIASES[kind] || {}).forEach(([code, aliases]) => {
      const label = labelGroup[code];
      if (!label) return;

      aliases.forEach((alias) => {
        lookup[kind][normalizeLookupValue(alias)] = label;
      });
    });
  });

  return lookup;
};

const JOB_ENUM_LOOKUP = createLookup();

const toMap = (items) =>
  (items || []).reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {});

const normalizeEnumItems = (items, labelMap) =>
  (items || []).map((item) => ({
    value: item.code,
    label: labelMap[item.code] || item.name || item.code,
  }));

const findJobEnumLabel = (kind, value) => {
  const normalized = normalizeLookupValue(value);
  if (!normalized) return "";
  return JOB_ENUM_LOOKUP[kind]?.[normalized] || "";
};

const getJobEnumLabel = (kind, value) => {
  return findJobEnumLabel(kind, value) || String(value || "").trim();
};

const translateJobTag = (value, labelMaps = {}) => {
  if (!value) return "";

  return (
    labelMaps.experience?.[value] ||
    labelMaps.employment?.[value] ||
    labelMaps.category?.[value] ||
    findJobEnumLabel("experience", value) ||
    findJobEnumLabel("employment", value) ||
    findJobEnumLabel("category", value) ||
    String(value).trim()
  );
};

export {
  VI_LABELS,
  toMap,
  normalizeEnumItems,
  getJobEnumLabel,
  translateJobTag,
};

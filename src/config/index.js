// Cấu hình routes cho ứng dụng
export const routes = {
  home: "/",
  homeDefault: "/home",
  jobs: "/jobs",
  handbook: "/handbook",
  handbookDetail: "/handbook/:slug",
  reviews: "/reviews",
  buildCV: "/build-cv",
  templateCV: "/template-cv",
  personalized: "/personalized",
  about: "/about",
  login: "/login",
  register: "/register",
  jobDetail: "/jobs/:id",
  profile: "/profile",
  appliedJobs: "/jobs/applied",
  savedJobs: "/jobs/saved",
  waitingJobs: "/jobs/waiting",
  jobAlerts: "/jobs/alerts",
  employersViews: "/employers/views",
};

// Cấu hình API endpoints
export const apiConfig = {
  baseURL: "http://localhost:8080/careergraph/api/v1",
  endpoints: {
    auth: {
      login: "/auth/login",
      register: "/auth/register/candidate",
      verify: "/auth/verify",
      logout: "/auth/logout",
    },
    jobs: {
      list: "/jobs",
      detail: "/jobs/:id",
      search: "/jobs/search",
      categories: "/jobs/categories",
      popular: "/jobs/popular",
      personalized: "/jobs/personalized",
      similar: "/jobs/:id/similar",
    },
    user: {
      me: "/candidates/me",
      updateInfo: "/candidates/update-information",
      empty: "/candidates",
      updateJobFindCriteria: "/candidates/update-job-find-criteria",
      experience: "/candidates/experiences",
      education: "/candidates/educations",
      skill: "/candidates/skills",
    },
    company: {
      lookup: "/companies/lookup",
      jobs: "/companies/:id/jobs",
    },
    education: {
      lookup: "/educations/lookup",
    },
    skill: {
      lookup: "/skills/lookup",
    },
  },
};

// Cấu hình khác
export const appConfig = {
  name: "Career Graph",
  version: "1.0.0",
  description: "Nền tảng tìm kiếm việc làm hàng đầu Việt Nam",
};

export default {
  routes,
  apiConfig,
  appConfig,
};

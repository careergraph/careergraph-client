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
  forgotPassword: "/forgot-password",
  verifyOtp: "/verify-otp",
  resetPassword: "/reset-password",
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
      forgotPassword: "/auth/forgot-password",
      verifyOtpRegister: "/auth/confirm-otp-register",
      verifyOtpResetPassword: "/auth/confirm-otp-reset-password",
      resetPassword: "auth/reset-password",
      resendOTP: "auth/resend-otp",
      getTtlOtp: "auth/ttl-otp",
    },
    jobs: {
      list: "/jobs",
      detail: "/jobs/:id",
      search: "/jobs/search",
      categories: "/jobs/categories",
      popular: "/jobs/popular",
      personalized: "/jobs/personalized",
      similar: "/jobs/:id/similar",
      apply: "/jobs/:id/application",
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
    media: {
      upload: "/media/file",
      list: "/media",
    },
    applications: {
      list: "/applications",
      detail: "/applications/:id",
      updateStatus: "/applications/:id/status",
    }
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

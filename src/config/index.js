// Cấu hình routes cho ứng dụng

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/careergraph/api/v1";

const RTC_BASE_URL =
  import.meta.env.VITE_RTC_BASE_URL ?? "http://localhost:4000";

const DEFAULT_API_CONTEXT_PATH = "/careergraph/api/v1";

const resolveApiBaseUrl = (rawBaseUrl) => {
  let normalized = rawBaseUrl.trim();

  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    normalized.startsWith("http://")
  ) {
    normalized = `https://${normalized.slice("http://".length)}`;
  }

  try {
    const parsed = new URL(normalized);
    if (parsed.pathname === "/" || parsed.pathname === "") {
      parsed.pathname = DEFAULT_API_CONTEXT_PATH;
    }
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return normalized.replace(/\/$/, "");
  }
};

const RESOLVED_API_BASE_URL = resolveApiBaseUrl(API_BASE_URL);
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
  account: "/account",
  appliedJobs: "/jobs/applied",
  savedJobs: "/jobs/saved",
  waitingJobs: "/jobs/waiting",
  jobAlerts: "/jobs/alerts",
  employersViews: "/employers/views",
  forgotPassword: "/forgot-password",
  verifyOtp: "/verify-otp",
  resetPassword: "/reset-password",
  companyDetail: "/companies/:id",
  interviews: "/interviews",
  messages: "/messages",
};

// Cấu hình API endpoints
export const apiConfig = {
  baseURL: RESOLVED_API_BASE_URL,
  endpoints: {
    auth: {
      login: "/auth/login",
      register: "/auth/register/candidate",
      verify: "/auth/verify",
      logout: "/auth/logout",
      forgotPassword: "/auth/forgot-password",
      verifyOtpRegister: "/auth/confirm-otp-register",
      verifyOtpResetPassword: "/auth/confirm-otp-reset-password",
      resetPassword: "/auth/reset-password",
      resendOTP: "/auth/resend-otp",
      getTtlOtp: "/auth/ttl-otp",
      googleLogin: "/auth/google-login",
      requestEmailChangeOtp: "/auth/email-change/request-otp",
      confirmEmailChange: "/auth/email-change/confirm",
      requestPasswordChangeOtp: "/auth/password-change/request-otp",
      confirmPasswordChange: "/auth/password-change/confirm",
    },
    jobs: {
      list: "/jobs",
      candidate: "/jobs/candidates",
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
      updateInfo: "/candidates/information",
      empty: "/candidates",
      updateJobFindCriteria: "/candidates/job-find-criteria",
      experience: "/candidates/experiences",
      education: "/candidates/educations",
      skill: "/candidates/skills",
      appliedJobs: "/candidates/applied-jobs",
      savedJobs: "/candidates/saved-jobs",
      media: "/candidates/media",
      openWork: "/candidates/job-search-status",
      jobMail: "/candidates/job-mail",
      
    },
    company: {
      lookup: "/companies/lookup",
      jobs: "/companies/:id/jobs",
      detail: "/companies/:id",
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
      base: "/media",
      rename: "/cv"
    },
    applications: {
      list: "/applications",
      detail: "/applications/:id",
      updateStatus: "/applications/:id/status",
    },
    interviews: {
      me: "/interviews/me",
      upcoming: "/interviews/me/upcoming",
      detail: "/interviews/:id",
      confirm: "/interviews/:id/confirm",
      decline: "/interviews/:id/decline",
      propose: "/interviews/:id/propose",
      room: "/interviews/room/:roomCode",
    },
    chat: {
      sendMessage: "/chat/chat",
      conversations: "/chat/conversations",
      lasted: "/chat/lasted",
      history: "/chat/history",
      clear: "/chat/clear",
    },
  },
};

// Cấu hình khác
export const appConfig = {
  name: "Career Graph",
  version: "1.0.0",
  description: "Nền tảng tìm kiếm việc làm hàng đầu Việt Nam",
};

export const rtcConfig = {
  baseURL: RTC_BASE_URL,
};

export default {
  routes,
  apiConfig,
  rtcConfig,
  appConfig,
};

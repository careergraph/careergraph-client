import { routes } from "../config";
import { FooterOnly } from "../layouts";
import ProtectedRoute from "../components/Containers/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import JobDetail from "../pages/JobDetail";
import Jobs from "../pages/Jobs";
import CareerGuide from "../pages/CareerGuide";
import CareerGuideDetail from "../pages/CareerGuideDetail";
import CVBuilder from "../pages/CVBuilder";
import CVTemplates from "../pages/CVTemplates";
import ProfileDashboardLayout from "~/layouts/ProfileDashboardLayout/ProfileDashboardLayout";
import Profile from "~/pages/Profile";
import AppliedJobs from "~/pages/AppliedJobs";
import SavedJobs from "~/pages/SavedJobs";
import TestApi from "~/pages/TestApi";
import ForgotPassword from "~/pages/ForgotPassword";
import VerifyOtp from "~/pages/VerifyOtp";
import ResetPassword from "~/pages/ResetPassword";

const publicRoutes = [
  { path: routes.home, component: Home },
  { path: routes.homeDefault, component: Home },
  { path: routes.jobs, component: Jobs },
  { path: routes.handbook, component: CareerGuide },
  { path: routes.handbookDetail, component: CareerGuideDetail },
  { path: routes.buildCV, component: CVBuilder },
  { path: routes.templateCV, component: CVTemplates },
  { path: routes.personalized, component: NotFound },
  { path: routes.about, component: About },
  { path: routes.login, component: Login, layout: FooterOnly },
  { path: routes.register, component: Register, layout: FooterOnly },
  { path: routes.jobDetail, component: JobDetail },
  { path: "/test-api", component: TestApi }, // ← Test page
  { path: routes.forgotPassword, component: ForgotPassword, layout: FooterOnly},
  { path: routes.verifyOtp, component: VerifyOtp, layout: FooterOnly},
  { path: routes.resetPassword, component: ResetPassword, layout: FooterOnly},
  
  { path: routes.appliedJobs, component: AppliedJobs, layout: ProfileDashboardLayout },
  { path: routes.savedJobs, component: SavedJobs, layout: ProfileDashboardLayout },
  
];

//In addition to diving private routes and public routes, you can also use the protected flag
const privateRoutes = [
  { path: routes.profile, component: Profile, layout: ProfileDashboardLayout },
];

export { publicRoutes, privateRoutes };

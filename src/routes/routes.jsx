import { routes } from "../config";
import { FooterOnly } from "../layouts";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import JobDetail from "../pages/JobDetail";
import Jobs from "../pages/Jobs";
import CareerGuide from "../pages/CareerGuide";
import Profile from "../pages/Profile";

const publicRoutes = [
  { path: routes.home, component: Home },
  { path: routes.homeDefault, component: Home },
  { path: routes.jobs, component: Jobs },
  { path: routes.handbook, component: CareerGuide },
  { path: routes.reviews, component: NotFound },
  { path: routes.about, component: About },
  { path: routes.login, component: Login, layout: FooterOnly },
  { path: routes.register, component: Register, layout: FooterOnly },
  { path: routes.jobDetail, component: JobDetail }
];

const privateRoutes = [
  { 
    path: routes.profile, 
    component: () => (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ) 
  },
];

export { publicRoutes, privateRoutes };

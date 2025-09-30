import config from "../config";
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
  { path: config.routes.home, component: Home },
  { path: config.routes.homeDefault, component: Home },
  { path: config.routes.jobs, component: Jobs },
  { path: config.routes.handbook, component: NotFound },
  { path: config.routes.reviews, component: NotFound },
  { path: config.routes.about, component: About },
  { path: config.routes.login, component: Login, layout: FooterOnly },
  { path: config.routes.register, component: Register, layout: FooterOnly },
  { path: config.routes.jobDetail, component: JobDetail },
  { path: config.routes.camNang, component: CareerGuide },
];

const privateRoutes = [
  { 
    path: "/profile", 
    component: () => (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ) 
  },
];

export { publicRoutes, privateRoutes };

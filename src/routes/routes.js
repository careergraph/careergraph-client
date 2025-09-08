import config from "../config";
import {SubLayout} from "../layouts";

import Home from "../pages/Home";
import Login from "../pages/Login";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
import Register from "../pages/Register";
import JobDetail from "../pages/JobDetail";
const publicRoutes = [
    {path: config.routes.home, component: Home},
    {path: config.routes.jobs, component: NotFound},
    {path: config.routes.handbook, component: NotFound},
    {path: config.routes.reviews, component: NotFound},
    {path: config.routes.about, component: About},
    {path: config.routes.login, component: Login, layout: null},
    {path: config.routes.register, component: Register, layout: null},
    {path: config.routes.viecLam, component: JobDetail},
]

const privateRoutes = [];

export { publicRoutes, privateRoutes };
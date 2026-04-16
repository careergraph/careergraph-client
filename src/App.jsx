import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { publicRoutes, privateRoutes } from "../src/routes";
import DefaultLayout from "../src/layouts";
import ProtectedRoute from "./components/Containers/ProtectedRoute";
import { Toaster } from "sonner";
import { AppInitializer } from "~/components/AppInitializer";
import { NotificationProvider } from "~/features/notifications/context/NotificationContext";
import NotFound from "./pages/NotFound";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const HAS_VALID_GOOGLE_CLIENT_ID =
  GOOGLE_CLIENT_ID.trim().length > 0 && GOOGLE_CLIENT_ID.includes(".apps.googleusercontent.com");

const AppRoutes = () => (
  <Router>
    <AppInitializer>
      <NotificationProvider>
        <Toaster richColors/>
        <div className="App">
          <Routes>
            {/* Public routes */}
            {publicRoutes.map((route, index) => {
              const Page = route.component;
              let Layout = DefaultLayout;
              if (route.layout) {
                Layout = route.layout;
              } else if (route.layout === null) {
                Layout = Fragment;
              }

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}

            {/* Private routes */}
            {privateRoutes.map((route, index) => {
              const Page = route.component;
              let Layout = DefaultLayout
              if(route.layout){
                Layout = route.layout;
              }else if(route.layout === null){
                  Layout = Fragment;
              }
              return (
                <Route
                  key={`private-${index}`}
                  path={route.path}
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Page />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              );
            })}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </NotificationProvider>
    </AppInitializer>
  </Router>
);

export default function App() {
  if (!HAS_VALID_GOOGLE_CLIENT_ID) {
    return <AppRoutes />;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AppRoutes />
    </GoogleOAuthProvider>
  );
}

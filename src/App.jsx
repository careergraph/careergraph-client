import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { publicRoutes, privateRoutes } from "../src/routes";
import DefaultLayout from "../src/layouts";
import { AuthProvider } from "../src/contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
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
              return (
                <Route
                  key={`private-${index}`}
                  path={route.path}
                  element={<Page />}
                />
              );
            })}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

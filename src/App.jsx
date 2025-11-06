import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { publicRoutes, privateRoutes } from "../src/routes";
import DefaultLayout from "../src/layouts";
import ProtectedRoute from "./components/Containers/ProtectedRoute";
import { Toaster } from "sonner";
import { AppInitializer } from "~/components/AppInitializer";

export default function App() {
  return (
    <Router>
      <AppInitializer>
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

                  //Use the protected flag
                  // const element = route.protected ? (
                  //   <ProtectedRoute>
                  //     <Layout>
                  //       <Page />
                  //     </Layout>
                  //   </ProtectedRoute>
                  // ) : (
                  //   <Layout>
                  //     <Page />
                  //   </Layout>
                  // );

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
              </Routes>
            </div>
        </AppInitializer>
      </Router>
  );
}

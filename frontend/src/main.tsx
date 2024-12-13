/* eslint-disable react-refresh/only-export-components */
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./hooks/UseProtectRouteHook.tsx";
import { RingCutLoader } from "./components/Loaders.tsx";
// import { UserPageHome, UserPassPage } from "./pages/UserPage.tsx";

//pages imports

const SolutionsPage = lazy(() => import("./pages/SolutionsPage.tsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.tsx"));
const LoginHome = lazy(() =>
  import("./pages/LoginPage.tsx").then((module) => ({
    default: module.LoginHome,
  }))
);
const SetAvatar = lazy(() =>
  import("./pages/LoginPage.tsx").then((module) => ({
    default: module.SetAvatar,
  }))
);
const SetUserName = lazy(() =>
  import("./pages/LoginPage.tsx").then((module) => ({
    default: module.SetUserName,
  }))
);
const VerifyOtpAndLogin = lazy(() =>
  import("./pages/LoginPage.tsx").then((module) => ({
    default: module.VerifyOtpAndLogin,
  }))
);
const HomePage = lazy(() => import("./pages/HomePage.tsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.tsx"));
const TestsPage = lazy(() => import("./pages/TestsPage.tsx"));
const UserPage = lazy(() => import("./pages/UserPage.tsx"));
const UserPageHome = lazy(() =>
  import("./pages/UserPage.tsx").then((module) => ({
    default: module.UserPageHome,
  }))
);
const UserPassPage = lazy(() =>
  import("./pages/UserPage.tsx").then((module) => ({
    default: module.UserPassPage,
  }))
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense
        fallback={
          <div className="w-screen h-screen flex justify-center items-center">
            <RingCutLoader />
          </div>
        }
      >
        <App />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
        children: [
          { index: true, element: <LoginHome /> },
          { path: "/login/verify-email", element: <VerifyOtpAndLogin /> },
          { path: "/login/set-user-name", element: <SetUserName /> },
          { path: "/login/set-avatar", element: <SetAvatar /> },
        ],
      },

      {
        path: "/tests",
        element: <ProtectedRoute />,
        children: [
          { path: "/tests", element: <TestsPage /> },
          { path: "/tests/solutions/:id", element: <SolutionsPage /> },
        ],
      },
      {
        path: "/user",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/user",
            element: <UserPage />,
            children: [
              { index: true, element: <UserPageHome /> },
              { path: "/user/pass", element: <UserPassPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

const root = createRoot(document.getElementById("root")!);

root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

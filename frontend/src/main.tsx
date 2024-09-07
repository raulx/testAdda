import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.ts";

//pages imports
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import LandingPage from "./pages/LandingPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import ProtectedRoute from "./hooks/ProtectedRoute.tsx";
import MocksPage from "./pages/MocksPage.tsx";
import NewsPage from "./pages/NewsPage.tsx";
import AboutUsPage from "./pages/AboutUsPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignUpPage /> },
      {
        path: "/mocks",
        element: <MocksPage />,
      },
      { path: "/news", element: <NewsPage /> },
      { path: "/about-us", element: <AboutUsPage /> },
      {
        path: "/home",
        element: <ProtectedRoute />,
        children: [{ index: true, element: <HomePage /> }],
      },
    ],
  },
  { path: "/error", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

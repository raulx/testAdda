import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.ts";

//pages imports
import LoginPage, {
  LoginComponent,
  SetUserDetails,
  VerifyEmailComponent,
} from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
// import ProtectedRoute from "./hooks/ProtectedRoute.tsx";
import MocksPage from "./pages/MocksPage.tsx";
import NewsPage from "./pages/NewsPage.tsx";
import AboutUsPage from "./pages/AboutUsPage.tsx";
import QuizesPage from "./pages/QuizesPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
        children: [
          { index: true, element: <LoginComponent /> },
          { path: "/login/verify-email", element: <VerifyEmailComponent /> },
          { path: "/login/set-userdetails", element: <SetUserDetails /> },
        ],
      },
      { path: "/signup", element: <SignUpPage /> },

      { path: "/about-us", element: <AboutUsPage /> },
      { path: "/news", element: <NewsPage /> },

      { path: "/quizes", element: <QuizesPage /> },
      {
        path: "/mocks",
        element: <MocksPage />,
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AddQuestionScreen from "./Screens/QuestionsScreen.tsx";
import { AddNewQuizScreen, QuizScreenHome } from "./Screens/QuizesScreen.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import QuizScreenMain from "./Screens/QuizesScreen.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <AddQuestionScreen /> },
      {
        path: "/quizes",
        element: <QuizScreenMain />,
        children: [
          { index: true, element: <QuizScreenHome /> },
          { path: "/quizes/add/new", element: <AddNewQuizScreen /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <div>
        404 Page not Found{" "}
        <a href="/" className="text-blue-500">
          Home
        </a>
      </div>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AddQuestionScreen from "./Screens/AddQuestionScreen.tsx";
import AddQuizScreen from "./Screens/AddQuizScreen.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <AddQuestionScreen /> },
      { path: "addQuiz", element: <AddQuizScreen /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

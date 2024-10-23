import { FaBuilding, FaRegQuestionCircle } from "react-icons/fa";
import "./App.css";
import Logo from "./components/Logo";
import { Link, Outlet, useLocation } from "react-router-dom";
import { MdOutlineQuiz } from "react-icons/md";
import { Toaster } from "./components/ui/toaster";

function App() {
  const location = useLocation().pathname;

  return (
    <>
      <header className="flex py-2 justify-between items-center border-b border-gray-300 px-12">
        <Logo small />
        <div className="flex justify-center gap-2 py-2 px-4 text-white rounded-3xl bg-lightseagreen items-center">
          <FaBuilding />
          <span>Administration</span>
        </div>
        <div className="rounded-full p-4 border border-gray-300">Admin</div>
      </header>

      <main className="flex min-h-screen">
        <aside className="flex flex-col gap-4 p-4 border-r border-gray-300">
          <Link to={"/"}>
            <div
              className={`text-sm  rounded-lg p-2 cursor-pointer flex items-center gap-2 transition-all duration-300 ${
                location === "/" && " shadow-custom-2"
              }`}
            >
              <FaRegQuestionCircle />
              Add Question
            </div>
          </Link>

          <Link to={"/addQuiz"}>
            <div
              className={`text-sm  rounded-lg p-2 cursor-pointer flex items-center transition-all duration-300 gap-2 ${
                location === "/addQuiz" && " shadow-custom-2"
              }`}
            >
              <MdOutlineQuiz />
              Add Quiz
            </div>
          </Link>
        </aside>
        <div className="bg-slate-50 grow">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </>
  );
}

export default App;

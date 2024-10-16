import { FaLock, FaRocket, FaTimes, FaTrophy } from "react-icons/fa";
import { Button } from "./ui/button";
import { createRoot } from "react-dom/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "./ui/card";
import { QuizData, QuizQuestionsType } from "@/utils/types";
import { IoAnalytics } from "react-icons/io5";
import store, { useGetResultMutation } from "@/store/store";
import { AttemptWindow } from "@/pages/AttemptWindow";
import { Provider } from "react-redux";
import UseGetUserDataHook from "@/hooks/UseGetUserDataHook";
import { TbReportAnalytics } from "react-icons/tb";
import { RxResume } from "react-icons/rx";
import Modal from "react-modal";
import DisplayDate from "./Date";
import { useState } from "react";

Modal.setAppElement("#root");

const openQuizInNewWindow = (title: string, _id: string) => {
  // Get the screen width and height
  const screenWidth = window.screen.width - 20;
  const screenHeight = window.screen.height;

  // Open a new window with full width and height of the screen
  const quizWindow = window.open(
    "",
    "_blank",
    `width=${screenWidth},height=${screenHeight},top=4,left=0`
  );

  if (quizWindow) {
    quizWindow.document.title = title;
    quizWindow.document.body.style.margin = "0";
    quizWindow.document.body.style.overflow = "hidden"; // Remove scrollbars

    // Inject the Tailwind CSS into the new window
    const tailwindLink = quizWindow.document.createElement("link");
    tailwindLink.rel = "stylesheet";
    tailwindLink.href =
      "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
    quizWindow.document.head.appendChild(tailwindLink);

    // Create a div element where React can render the component
    const quizDiv = quizWindow.document.createElement("div");
    quizWindow.document.body.appendChild(quizDiv);

    // Apply CSS to make the div fill the entire window
    quizDiv.style.width = "100%";
    quizDiv.style.height = "100vh";

    // Render the React component into the new window
    const root = createRoot(quizDiv);
    root.render(
      <Provider store={store}>
        <AttemptWindow windowRef={quizWindow} quizId={_id} />
      </Provider>
    );

    // Unmount component when the new window is closed or refreshed
    quizWindow.addEventListener("beforeunload", () => {
      setTimeout(() => {
        root.unmount();
        // window.location.reload();
      }, 0); // Delay the unmount to ensure it's after render cycle
    });
  }
};

const QuizCard = (props: QuizData<string | QuizQuestionsType>) => {
  const user = UseGetUserDataHook();
  const [getResult, { data }] = useGetResultMutation();

  const handleQuizStart = (_id: string, title: string) => {
    openQuizInNewWindow(title, _id);
  };

  const [isOpen, setIsOpen] = useState(false);
  const quizAttempted = user.data.test_attempted.find(
    (test) => test.id === props._id
  );

  const afterOpenModel = () => {
    console.log("model open");
  };
  const handleViewResult = async () => {
    // window.open(`/quizes/result/${_id}`, "_blank", "noopener,noreferrer");
    const res = await getResult({ quizId: props._id, userId: user.data._id });
    console.log(res);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <Card className="w-[400px] min-h-[280px] rounded-2xl  py-2 border border-bordergray flex flex-col justify-between">
        <CardHeader className="flex flex-col gap-4">
          <CardTitle className="text-darkcerulean">{props.title}</CardTitle>
          <CardDescription className="text-darkcerulean">
            {props.description}
          </CardDescription>
        </CardHeader>
        <CardContent>Difficulty Level : {props.difficulty_level}</CardContent>
        <CardFooter>
          <div className="flex justify-between w-full items-center gap-4 text-sm">
            {quizAttempted ? (
              <>
                <div>
                  <span className="font-bold border-b border-black">
                    Attempted On
                  </span>
                  <DisplayDate dateString={quizAttempted.attempted_on} />
                </div>
                <Button
                  className="flex gap-2 text-sm"
                  variant={"lightseagreen"}
                  size={"sm"}
                  onClick={() => handleViewResult()}
                >
                  <TbReportAnalytics />
                  View Report
                </Button>
              </>
            ) : (
              <>
                <p>Questions : {props.questions.length}</p>
                <p>Duration : {Math.floor(props.duration / 60)}min</p>
                {user.data.paused_tests.includes(props._id) ? (
                  <Button
                    variant={"lightseagreen"}
                    className="flex gap-2 items-center justify-center"
                    onClick={() => handleQuizStart(props._id, props.title)}
                  >
                    Resume
                    <RxResume className="text-xl" />
                  </Button>
                ) : (
                  <>
                    {props.access_type === "free" ? (
                      <>
                        <Button
                          variant={"lightseagreen"}
                          className="flex gap-2"
                          onClick={() =>
                            handleQuizStart(props._id, props.title)
                          }
                        >
                          <FaRocket /> Start
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant={"lightseagreen"}
                          className="flex gap-2"
                        >
                          <FaLock /> Unlock
                        </Button>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      <Modal
        isOpen={isOpen}
        onAfterOpen={afterOpenModel}
        onRequestClose={closeModal}
        className="bg-white p-6 rounded-2xl shadow-lg max-w-lg mx-auto my-10 relative flex flex-col gap-6 w-[28rem]"
        overlayClassName="fixed w-screen h-screen inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="text-2xl text-center mb-4 tracking-widest font-montserrat flex items-center justify-center gap-2">
          <span className="uppercase font-semibold border-b border-black">
            Standings
          </span>
          <FaTrophy className="text-[#F7E383] text-4xl" />
        </div>
        <div className="mx-auto p-4 rounded-2xl border border-[#9A4D45] text-2xl">
          <p>
            Rank : {data?.data.standing.current_rank}/
            {data?.data.standing.out_of}
          </p>
          <p>Percentile : {data?.data.percentile_obtained}</p>
        </div>
        <div className="p-4 bg-jetstream text-lg flex flex-col gap-2 rounded-2xl border border-[#555555]">
          <p className="font-semibold text-[#22577A]">
            Attempted :{" "}
            {data?.data.report.length - data?.data.result.unattempted}/
            {data?.data.report.length}
          </p>
          <p className="font-semibold text-[#22577A]">
            Marks Obtained : {data?.data.result.marks_obtained}
          </p>
          <div className="flex gap-4">
            <span className="text-[#3AA074]">
              Correct : {data?.data.result.correct}/{data?.data.report.length}
            </span>
            <span className="text-[#9A4D45]">
              Wrong : {data?.data.result.wrong}/{data?.data.report.length}
            </span>
          </div>
        </div>
        <Button
          className="mx-auto rounded-full text-lg flex gap-2 border border-bordergray bg-[#F5F5F5] text-black hover:bg-slate-100"
          size={"lg"}
        >
          <IoAnalytics />
          Analysis
        </Button>
        <button onClick={closeModal} className="absolute right-2 top-2 ">
          <FaTimes />
        </button>
      </Modal>
    </>
  );
};

export default QuizCard;

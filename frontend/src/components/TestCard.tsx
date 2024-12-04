import {
  FaLightbulb,
  FaLock,
  FaRocket,
  FaSpinner,
  FaTimes,
  FaTrophy,
} from "react-icons/fa";
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
// import { IoAnalytics } from "react-icons/io5";
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

const openTestInNewWindow = (title: string, _id: string) => {
  // Get the screen width and height
  const screenWidth = window.screen.width - 20;
  const screenHeight = window.screen.height;

  // Open a new window with full width and height of the screen
  const testWindow = window.open(
    "",
    "_blank",
    `width=${screenWidth},height=${screenHeight},top=4,left=0`
  );

  if (testWindow) {
    testWindow.document.title = title;
    testWindow.document.body.style.margin = "0";
    testWindow.document.body.style.overflow = "hidden"; // Remove scrollbars

    // Inject the Tailwind CSS into the new window
    const tailwindLink = testWindow.document.createElement("link");
    tailwindLink.rel = "stylesheet";
    tailwindLink.href =
      "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";
    testWindow.document.head.appendChild(tailwindLink);

    // Create a div element where React can render the component
    const testDiv = testWindow.document.createElement("div");
    testWindow.document.body.appendChild(testDiv);

    // Apply CSS to make the div fill the entire window
    testDiv.style.width = "100%";
    testDiv.style.height = "100vh";

    // Render the React component into the new window
    const root = createRoot(testDiv);
    root.render(
      <Provider store={store}>
        <AttemptWindow windowRef={testWindow} testId={_id} />
      </Provider>
    );

    // Unmount component when the new window is closed or refreshed
    testWindow.addEventListener("beforeunload", () => {
      setTimeout(() => {
        root.unmount();
        // window.location.reload();
      }, 0); // Delay the unmount to ensure it's after render cycle
    });
  }
};

const TestCard = (props: QuizData<string | QuizQuestionsType>) => {
  const user = UseGetUserDataHook();
  const [getResult, { data, isLoading }] = useGetResultMutation();

  const handleQuizStart = (_id: string, title: string) => {
    openTestInNewWindow(title, _id);
  };

  const [isReportOpen, setIsReportOpen] = useState(false);
  const testAttempted = user.data.test_attempted.find(
    (test) => test.id === props._id
  );

  const afterOpenReportModel = async () => {
    await getResult({ quizId: props._id, userId: user.data._id });
  };
  const handleViewReport = async () => {
    setIsReportOpen(true);
  };

  const handleViewSolution = async ({ id }: { id: string }) => {
    window.open(`/tests/solutions/${id}`, "_blank", "noopener,noreferrer");
  };
  const closeReportModal = () => setIsReportOpen(false);

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
            {testAttempted ? (
              <>
                <div>
                  <span className="font-bold border-b border-black">
                    Attempted On
                  </span>
                  <DisplayDate dateString={testAttempted.attempted_on} />
                </div>
                <Button
                  className="flex gap-2 text-sm"
                  variant={"lightseagreen"}
                  size={"sm"}
                  onClick={() => handleViewReport()}
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
        isOpen={isReportOpen}
        onAfterOpen={afterOpenReportModel}
        onRequestClose={closeReportModal}
        className="bg-white p-6 rounded-2xl shadow-lg max-w-lg mx-auto my-10 relative flex flex-col gap-6 w-[28rem] border-[#555555] border"
        overlayClassName="fixed w-screen h-screen inset-0 bg-black bg-opacity-30 flex justify-center items-center"
      >
        {isLoading ? (
          <div className="h-96 flex justify-center items-center">
            <FaSpinner className="text-3xl animate-spin" />
          </div>
        ) : (
          <>
            <div className="text-2xl text-center mb-4 tracking-widest font-montserrat flex items-center justify-center gap-2">
              <span className="uppercase font-semibold border-b border-black">
                Standings
              </span>
              <FaTrophy className="text-[#eed03c] text-4xl" />
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
                  Correct : {data?.data.result.correct}/
                  {data?.data.report.length}
                </span>
                <span className="text-[#9A4D45]">
                  Wrong : {data?.data.result.wrong}/{data?.data.report.length}
                </span>
              </div>
            </div>
            <Button
              className="mx-auto rounded-full text-lg flex gap-2 border border-bordergray bg-[#F5F5F5] text-black hover:bg-slate-100"
              size={"lg"}
              onClick={() => handleViewSolution({ id: props._id })}
            >
              Solution
              <FaLightbulb className="text-[#eed03c]" />
            </Button>
            <button
              onClick={closeReportModal}
              className="absolute right-2 top-2 "
            >
              <FaTimes />
            </button>
          </>
        )}
      </Modal>
    </>
  );
};

export default TestCard;

import { FaLock, FaRocket } from "react-icons/fa";
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
import store from "@/store/store";
import { AttemptRoot } from "@/pages/AttemptPage";
import { Provider } from "react-redux";
import UseGetUserDataHook from "@/hooks/UseGetUserDataHook";

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
        <AttemptRoot windowRef={quizWindow} quizId={_id} />
      </Provider>
    );

    // Unmount component when the new window is closed or refreshed
    quizWindow.addEventListener("beforeunload", () => {
      setTimeout(() => {
        root.unmount();
      }, 0); // Delay the unmount to ensure it's after render cycle
    });
  }
};

const QuizCard = (props: QuizData<string | QuizQuestionsType>) => {
  const user = UseGetUserDataHook();
  const handleQuizStart = (_id: string, title: string) => {
    openQuizInNewWindow(title, _id);
  };

  return (
    <>
      <Card className="w-[380px] min-h-[280px]  py-2 border border-bordergray flex flex-col justify-between">
        <CardHeader className="flex flex-col gap-4">
          <CardTitle className="text-darkcerulean">{props.title}</CardTitle>
          <CardDescription className="text-darkcerulean ">
            {props.description}
          </CardDescription>
        </CardHeader>
        <CardContent>Difficulty Level : {props.difficulty_level}</CardContent>
        <CardFooter>
          <div className="flex justify-between w-full items-center gap-4 text-sm">
            {user.data.test_attempted.includes(props._id) ? (
              <Button variant={"outline"}>Show Result</Button>
            ) : (
              <>
                <p>Questions : {props.questions.length}</p>
                <p>Duration : {Math.floor(props.duration / 60)}min</p>
                {user.data.paused_tests.includes(props._id) ? (
                  <Button
                    variant={"celadon"}
                    onClick={() => handleQuizStart(props._id, props.title)}
                  >
                    Continue
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
    </>
  );
};

export default QuizCard;

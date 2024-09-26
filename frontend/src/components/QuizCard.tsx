// import { FaClock } from "react-icons/fa";
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
import { QuizData } from "@/utils/types";
import { useLazyGetQuizQuery } from "@/store/store";
import { RingLoader } from "./Loaders";

const QuizComponent = ({ windowRef }: { windowRef: Window | null }) => {
  return (
    <div>
      <h1>This is the Quiz Component</h1>
      {/* Your quiz content here */}
      <button onClick={() => windowRef?.close()}>Close</button>
    </div>
  );
};

const QuizCard = (props: QuizData) => {
  const [getQuiz, { isLoading }] = useLazyGetQuizQuery();

  const handleQuizStart = async (_id: string) => {
    try {
      const res = await getQuiz(_id);
      if (res.data) {
        const openQuizInNewWindow = () => {
          // Get the screen width and height
          const screenWidth = window.screen.width;
          const screenHeight = window.screen.height;

          // Open a new window with full width and height of the screen
          const quizWindow = window.open(
            "",
            "_blank",
            `width=${screenWidth},height=${screenHeight},top=0,left=0`
          );

          if (quizWindow) {
            quizWindow.document.title = "Quiz";
            quizWindow.document.body.style.margin = "0";
            quizWindow.document.body.style.overflow = "hidden"; // Remove scrollbars

            // Create a div element where React can render the component
            const quizDiv = quizWindow.document.createElement("div");
            quizWindow.document.body.appendChild(quizDiv);

            // Apply CSS to make the div fill the entire window
            quizDiv.style.width = "100%";
            quizDiv.style.height = "100vh";

            // Render the React component into the new window
            const root = createRoot(quizDiv);
            root.render(<QuizComponent windowRef={quizWindow} />);

            // Unmount component when the new window is closed or refreshed
            quizWindow.addEventListener("beforeunload", () => {
              root.unmount();
            });
          }
        };

        openQuizInNewWindow();
      }
    } catch (error) {
      console.error(error);
    }
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
            <p>Questions : {props.questions.length}</p>
            <p>Duration : {Math.floor(props.duration / 60)}min</p>
            {props.access_type === "free" ? (
              <>
                <Button
                  variant={"lightseagreen"}
                  className="flex gap-2"
                  onClick={() => handleQuizStart(props._id)}
                >
                  <FaRocket /> Start
                </Button>
              </>
            ) : (
              <>
                <Button variant={"lightseagreen"} className="flex gap-2">
                  <FaLock /> Unlock
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
      {isLoading && <RingLoader />}
    </>
  );
};

export default QuizCard;

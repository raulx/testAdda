// import { FaClock } from "react-icons/fa";
import { FaLock, FaRocket } from "react-icons/fa";
import { Button } from "./ui/button";
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

const QuizCard = (props: QuizData) => {
  const [getQuiz] = useLazyGetQuizQuery();

  const handleQuizStart = async (_id: string) => {
    try {
      const res = await getQuiz(_id);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
  );
};

export default QuizCard;

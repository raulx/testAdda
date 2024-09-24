import { FaClock } from "react-icons/fa";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "./ui/card";
import { Link } from "react-router-dom";

const QuizCard = ({
  title,
  description,
  questions,
  duration,
  difficulty,
}: {
  title: string;
  description: string;
  questions: string[];
  duration: number;
  difficulty: string;
}) => {
  return (
    <Card className="w-[380px]  py-2 border border-bordergray flex flex-col justify-between">
      <CardHeader className="flex flex-col gap-4">
        <CardTitle className="text-darkcerulean">{title}</CardTitle>
        <CardDescription className="text-darkcerulean ">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>Difficulty Level : {difficulty}</CardContent>
      <CardFooter>
        <div className="flex justify-between w-full items-center gap-4 text-sm">
          <p>Questions : {questions.length}</p>
          <p>Duration : {Math.floor(duration / 60)}min</p>
          <Link to="/quizes">
            <Button variant={"lightseagreen"} className="flex gap-2">
              <FaClock />
              Start
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;

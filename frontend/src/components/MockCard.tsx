import { FaQuestion } from "react-icons/fa";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const MockCard = ({
  exam,
  duration,
  questions,
}: {
  exam: string;
  duration: number;
  questions: number;
}) => {
  return (
    <Card className="w-[340px] py-2 border border-bordergray flex flex-col justify-between my-6">
      <CardHeader>
        <CardTitle className="text-center my-2">{exam}</CardTitle>
        <CardDescription className="text-darkcerulean">
          Details : Full Length <span>{exam}</span> exam mock.
        </CardDescription>
      </CardHeader>
      <CardContent>Duration : {duration} </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full items-centertext-sm">
          <p>Total Questions : {questions}</p>
          <Button variant={"lightseagreen"}>
            <FaQuestion />
            Start
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MockCard;

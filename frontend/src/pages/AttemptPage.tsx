import { TypographyP } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseQuizHook } from "@/hooks/UseSliceHook";
import { QuizQuestionsType } from "@/utils/types";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";

import { FaClock } from "react-icons/fa";

type AttemptType = {
  quiz_id: string | undefined;
  questionsAttempted: {
    [questionId: string]: {
      answerMarked: string | undefined;
      timeTaken: number | undefined;
    };
  };
};
export const AttemptRoot = ({ windowRef }: { windowRef: Window }) => {
  const quiz = UseQuizHook();
  const quizQuestions = quiz.data?.questions;
  const [questionNumber, setQuestionNumber] = useState<number>(0);

  const [attempt, setAttempt] = useState<AttemptType>({
    quiz_id: quiz.data?._id,
    questionsAttempted: {
      questionId: {
        answerMarked: undefined,
        timeTaken: undefined,
      },
    },
  });

  const currentQuestion = quiz.data?.questions[questionNumber];

  const nextQuestion = () => {
    setQuestionNumber((prev) => {
      if (prev + 1 === quizQuestions?.length) {
        return 0;
      } else {
        return (prev += 1);
      }
    });
  };

  const prevQuestion = () => {
    setQuestionNumber((prev) => {
      if (prev === 0) {
        if (quizQuestions?.length != undefined)
          return quizQuestions?.length - 1;
        else return prev;
      } else return (prev -= 1);
    });
  };

  const handleQuestionMarked = (value: string) => {
    setAttempt((prevValue) => {
      return {
        ...prevValue,
        questionsAttempted: {
          ...prevValue.questionsAttempted,
          [currentQuestion?._id]: { answerMarked: value, timeTaken: 0 },
        },
      };
    });
  };

  const handleFinishTest = () => {
    console.log(attempt);
    windowRef?.close();
  };

  const handleClearQuestion = () => {
    setAttempt((prevValue) => {
      return {
        ...prevValue,
        questionsAttempted: {
          ...prevValue.questionsAttempted,
          [currentQuestion?._id]: { answerMarked: "", timeTaken: 0 },
        },
      };
    });
  };

  const handleButtonColor = (ques: QuizQuestionsType): string => {
    if (
      ques._id in attempt.questionsAttempted &&
      attempt.questionsAttempted[ques._id].answerMarked != ""
    )
      return "#358935";
    else return "#BDD5D6";
  };

  return (
    <div className="w-screen h-screen flex bg-white font-semibold">
      <div className=" w-3/4 flex flex-col ">
        <div
          className="flex w-full justify-center items-center p-2"
          style={{ backgroundColor: "#BDD5D6" }}
        >
          <h1>Online Quiz : {quiz.data?.title}</h1>
        </div>
        <div className="flex-1 flex-col bg-white p-4">
          <div className="flex gap-2  items-center mx-4 mb-2">
            <h1 className="" style={{ color: "#22577A" }}>
              Question {questionNumber + 1}
            </h1>
          </div>
          <hr />
          <TypographyP className="mx-6 my-4">
            {currentQuestion?.question}
          </TypographyP>
          <div className="mx-4 mt-10">
            <RadioGroup
              value={`${
                attempt.questionsAttempted[currentQuestion?._id]?.answerMarked
              }`}
              onValueChange={(value) => handleQuestionMarked(value)}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={`a`} id="r1" />
                <Label htmlFor="r1" className="cursor-pointer">
                  {currentQuestion?.options.a}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={`b`} id="r2" />
                <Label htmlFor="r2" className="cursor-pointer">
                  {currentQuestion?.options.b}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={`c`} id="r3" />
                <Label htmlFor="r3" className="cursor-pointer">
                  {currentQuestion?.options.c}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={`d`} id="r4" />
                <Label htmlFor="r4" className="cursor-pointer">
                  {currentQuestion?.options.d}
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div
          style={{ backgroundColor: "#F5F5F5" }}
          className=" border-t-2 border-bordergray"
        >
          <div className="py-8 px-8 flex gap-4 items-end  justify-end">
            <Button
              onClick={handleClearQuestion}
              className="w-24 rounded-full"
              size={"sm"}
              style={{ backgroundColor: "#38A3A5", color: "#fff" }}
            >
              Clear
            </Button>
            <Button
              onClick={prevQuestion}
              className="w-32 rounded-full"
              size={"sm"}
              style={{ backgroundColor: "#22577A", color: "#fff" }}
            >
              Previous
            </Button>
            <Button
              onClick={nextQuestion}
              className="w-24 rounded-full"
              size={"sm"}
              style={{ backgroundColor: "#358935", color: "#fff" }}
            >
              Next
            </Button>
            <Button
              onClick={handleFinishTest}
              className="w-32 rounded-full"
              size={"sm"}
              style={{ backgroundColor: "#FF6F61", color: "#fff" }}
            >
              Finish
            </Button>
          </div>

          <div className="flex gap-8 items-center mx-2 py-8 justify-center">
            <div className="flex items-center gap-2 text-xs">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "#22577A" }}
              />
              <span>Answered & Marked for review</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "#358935" }}
              />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "#FF6F61" }}
              />
              <span>Not Answered</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "#38A3A5" }}
              />
              <span>Not Answered & Marked for Review</span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/4 border-l flex flex-col">
        <div
          className="flex gap-4 justify-center items-center p-2"
          style={{ backgroundColor: "#B7CDCE" }}
        >
          <FaClock />
          Time Left
        </div>
        <div className="flex justify-center items-center p-6 bg-white">
          Time Box
        </div>
        <div
          style={{ backgroundColor: "#B7CDCE" }}
          className="p-6 flex justify-center items-center"
        >
          Attempts
        </div>
        <div className="px-4 py-8 flex flex-wrap gap-2">
          {quizQuestions?.map((ques, index) => {
            return (
              <Button
                variant={"outline"}
                key={index}
                style={{
                  color: "#fff",
                  backgroundColor: handleButtonColor(ques),
                }}
                onClick={() => setQuestionNumber(index)}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

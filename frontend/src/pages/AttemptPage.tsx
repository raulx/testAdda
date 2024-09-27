import { Button } from "@/components/ui/button";
import { UseQuizHook } from "@/hooks/UseSliceHook";
import { useState } from "react";

import { FaClock } from "react-icons/fa";

export const AttemptRoot = ({ windowRef }: { windowRef: Window }) => {
  const quiz = UseQuizHook();
  const quizLength = quiz.data?.questions.length;
  const [questionNumber, setQuestionNumber] = useState<number>(0);

  const nextQuestion = () => {
    setQuestionNumber((prev) => {
      if (prev + 1 === quizLength) {
        return 0;
      } else {
        return (prev += 1);
      }
    });
  };

  const prevQuestion = () => {
    setQuestionNumber((prev) => {
      if (prev === 0) {
        if (quizLength != undefined) return quizLength - 1;
        else return prev;
      } else return (prev -= 1);
    });
  };

  return (
    <div className="w-screen h-screen flex bg-white">
      <div className=" w-2/3 flex flex-col">
        <div
          className="flex w-full justify-center items-center p-2"
          style={{ backgroundColor: "#BDD5D6" }}
        >
          <h1>Online Quiz : {quiz.data?.title}</h1>
        </div>
        <div className="flex-1 bg-white p-4">
          <div>
            Question : {questionNumber + 1}
            {quiz.data?.questions[questionNumber].question}
          </div>
        </div>
        <div className="p-8" style={{ backgroundColor: "#F5F5F5" }}>
          <Button onClick={nextQuestion}>Next</Button>
          <Button onClick={prevQuestion}>Prev</Button>
        </div>
      </div>
      <div className=" w-1/3 flex flex-col">
        <div
          className="flex gap-4 justify-center items-center p-2"
          style={{ backgroundColor: "#B7CDCE" }}
        >
          <FaClock />
          Time Left<button onClick={() => windowRef?.close()}>Close</button>
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
        <div>Attempts Box </div>
      </div>
    </div>
  );
};

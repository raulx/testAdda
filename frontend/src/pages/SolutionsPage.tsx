import { TypographyP } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UseGetUserDataHook from "@/hooks/UseGetUserDataHook";
import { useGetResultMutation } from "@/store/store";
import { useEffect, useState } from "react";
import { FaSpinner, FaTimes } from "react-icons/fa";
import { useParams } from "react-router-dom";
import {
  BsEmojiDizzy,
  BsEmojiExpressionless,
  BsEmojiGrin,
} from "react-icons/bs";
import { MdMenuOpen } from "react-icons/md";
import {
  ResizableHandle,
  ResizablePanelGroup,
  ResizablePanel,
} from "@/components/ui/resizable";

const SolutionsPage = () => {
  const [getResult, { isLoading, data }] = useGetResultMutation();
  const user = UseGetUserDataHook();
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const currentQuestion = data?.data.report[questionNumber];
  const answerCorrect =
    currentQuestion?.correct_answer === currentQuestion?.answer_marked;

  useEffect(() => {
    const getresult = async () => {
      const res = await getResult({ quizId: id, userId: user.data._id });
      console.log(res);
    };
    if (user.data._id) getresult();
  }, [getResult, id, user]);

  const handleNext = () => {
    if (questionNumber >= data?.data.report.length - 1) setQuestionNumber(0);
    else setQuestionNumber((prevValue) => prevValue + 1);
  };

  const handlePrev = () => {
    if (questionNumber <= 0) setQuestionNumber(data?.data.report.length - 1);
    else setQuestionNumber((prevValue) => prevValue - 1);
  };

  const handleColor = ({
    answer_marked,
    correct_answer,
  }: {
    answer_marked: string;
    correct_answer: string;
  }): string => {
    if (correct_answer === answer_marked) return "#358935";
    else if (answer_marked === "unattempted") return "#B7CdCe";
    else return "#ed4e1f";
  };
  return (
    <>
      {isLoading ? (
        <div className="w-screen h-screen flex relative justify-center items-center">
          <FaSpinner className="animate-spin text-3xl" />
        </div>
      ) : (
        <div className="w-screen h-screen flex overflow-hidden relative ">
          <div className="xl:w-3/4 w-full flex flex-col">
            <h1 className="xl:text-center p-4 bg-[#BDD5D6] font-semibold relative">
              Solutions
              <div
                className="absolute top-1/2 text-2xl xl:hidden right-6 -translate-y-1/2"
                onClick={() => setIsOpen(true)}
              >
                <MdMenuOpen />
              </div>
            </h1>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={75}>
                <div className="p-4">
                  <div className="border-b p-2  justify-between xl:text-lg text-sm flex items-center gap-2 font-semibold">
                    Question {questionNumber + 1}
                    <div className="flex justify-center gap-4 items-center xl:text-sm text-xs mr-4">
                      {answerCorrect && (
                        <div className="text-[#358935] flex justify-center items-center gap-2">
                          <BsEmojiGrin />
                          Correct + 1
                        </div>
                      )}
                      {currentQuestion?.answer_marked === "unattempted" && (
                        <div className="text-[#777] flex justify-center items-center gap-2">
                          <BsEmojiExpressionless />
                          Unattempted
                        </div>
                      )}
                      {currentQuestion?.answer_marked != "unattempted" &&
                        !answerCorrect && (
                          <div className="text-[#ed4e1f] flex justify-center items-center gap-2">
                            <BsEmojiDizzy /> Wrong -0.25
                          </div>
                        )}

                      <div className="flex justify-center items-center gap-1">
                        <span>Time</span>{" "}
                        <span className="xl:block hidden">Taken</span>:
                        <span>{currentQuestion?.time_taken}s</span>
                      </div>
                      <div className="flex justify-center items-center gap-1">
                        <span>Avg</span>{" "}
                        <span className="xl:block hidden">Question</span>
                        <span className="xl:block hidden">Time</span>:
                        <span>{currentQuestion?.average_question_time}s</span>
                      </div>
                    </div>
                  </div>
                  <div className=" xl:text-base  text-sm">
                    <TypographyP className="py-2 xl:px-4 px-2 xl:h-16  font-semibold">
                      {currentQuestion?.question}
                    </TypographyP>
                    <div className="xl:my-4 my-2 flex flex-col gap-2 xl:px-4">
                      {["a", "b", "c", "d"].map((opt) => {
                        return (
                          <div
                            key={opt}
                            className={`${
                              currentQuestion?.correct_answer === opt &&
                              "border border-green-600"
                            } ${
                              !answerCorrect &&
                              currentQuestion?.answer_marked === opt &&
                              "border border-red-600"
                            } p-2 rounded font-semibold `}
                          >
                            {opt}) {currentQuestion?.options[opt]}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex xl:py-4 justify-end px-4 gap-4">
                    <Button
                      onClick={handlePrev}
                      className="bg-[#22577A] rounded-full xl:w-32 w-28 hover:bg-[#225679]"
                      size={"sm"}
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="bg-[#38A3A5] rounded-full xl:w-32 w-28 hover:bg-[#389c9e]"
                      size={"sm"}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={25}>
                <div className="my-4 xl:p-4 p-2 text-sm xl:text-base ">
                  <Tabs defaultValue="solution">
                    <TabsList className="bg-white font-semibold ">
                      <TabsTrigger
                        value="solution"
                        className="data-[state=active]:border-b border-bordergray "
                      >
                        Solution
                      </TabsTrigger>
                      <TabsTrigger
                        value="discuss with ai"
                        className="data-[state=active]:border-b border-bordergray"
                      >
                        Discuss with Ai
                      </TabsTrigger>
                      <TabsTrigger
                        value="raise objection"
                        className="data-[state=active]:border-b border-bordergray"
                      >
                        Raise Objection
                      </TabsTrigger>
                    </TabsList>
                    <div className="mt-2 px-4">
                      <TabsContent value="solution">
                        {currentQuestion?.explaination}
                      </TabsContent>
                      <TabsContent value="discuss with ai">
                        Discuss with Ai
                      </TabsContent>
                      <TabsContent value="raise objection">
                        Raise Objection
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
          <div
            className={`xl:w-1/4 w-4/5 border-r border-2 z-10 overflow-hidden right-0 top-0 xl:translate-x-0  flex-col border-l flex xl:static absolute transition-all duration-300 ${
              isOpen ? "translate-x-0" : "translate-x-full"
            } bg-white h-screen`}
          >
            <div className="p-4 bg-[#B7CDCE] font-semibold flex justify-between items-center">
              Attempts{" "}
              <div
                onClick={() => setIsOpen(false)}
                className="cursor-pointer xl:hidden "
              >
                <FaTimes />
              </div>
            </div>
            <div className="px-4 py-8 grow">
              <div className="flex flex-wrap gap-2">
                {data?.data?.report.map(
                  (
                    {
                      questionId,
                      answer_marked,
                      correct_answer,
                    }: {
                      questionId: string;
                      answer_marked: string;
                      correct_answer: string;
                    },
                    index: number
                  ) => {
                    return (
                      <Button
                        key={index}
                        style={{
                          backgroundColor: handleColor({
                            answer_marked,
                            correct_answer,
                          }),
                        }}
                        className="relative"
                        onClick={() => setQuestionNumber(index)}
                      >
                        {index + 1}
                        {questionId === currentQuestion?.questionId && (
                          <div
                            className="rounded-full absolute translate-y-1/2 bottom-1/4 left-1/2 -translate-x-1/2"
                            style={{
                              backgroundColor: "#fff",
                              width: "9px",
                              height: "3px",
                            }}
                          ></div>
                        )}
                      </Button>
                    );
                  }
                )}
              </div>
            </div>
            <div className="border-t p-4 bg-[#E4F5F5] flex justify-center items-center">
              <div>
                <div className="flex justify-center gap-6">
                  <div className="xl:px-6 px-4 py-2 flex gap-2 justify-center items-center border  border-[#358935] rounded-2xl bg-white text-[#358935]">
                    <div className="bg-[#358935] rounded-full xl:h-4 xl:w-4 h-2 w-2" />
                    Correct
                    <span>{data?.data.result.correct}</span>
                  </div>
                  <div className="xl:px-6 px-4 py-2 flex gap-2 border justify-center items-center border-[#ed431f] rounded-2xl bg-white text-[#ed4e1f]">
                    <div className="bg-[#ed431f] h-4 w-4 rounded-full" />
                    Wrong <span>{data?.data.result.wrong}</span>
                  </div>
                </div>
                <div className="mt-4 mx-auto xl:px-6 px-4 py-2 flex gap-2 justify-center items-center border border-[#777] rounded-2xl bg-white text-[#777] w-48">
                  <div className="bg-[#B7cdce] h-4 w-4 rounded-full" />
                  Unattempted <span>{data?.data.result.unattempted}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SolutionsPage;

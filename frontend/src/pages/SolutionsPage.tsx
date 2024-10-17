import { TypographyP } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UseGetUserDataHook from "@/hooks/UseGetUserDataHook";
import { useGetResultMutation } from "@/store/store";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useParams } from "react-router-dom";

const SolutionsPage = () => {
  const [getResult, { isLoading, data }] = useGetResultMutation();
  const user = UseGetUserDataHook();
  const { id } = useParams();
  const [questionNumber, setQuestionNumber] = useState<number>(0);
  const currentQuestion = data?.data.report[questionNumber];

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
        <div className="w-screen h-screen flex justify-center items-center">
          <FaSpinner className="animate-spin text-3xl" />
        </div>
      ) : (
        <div className="w-screen h-screen flex overflow-hidden">
          <div className="w-3/4 flex flex-col">
            <h1 className="text-center p-4 bg-[#BDD5D6]">Solutions</h1>
            <div className="p-4 flex-1 h-3/4">
              <div className="border-b p-2 text-lg flex items-center gap-2">
                Question {questionNumber + 1}
              </div>
              <div>
                <TypographyP className="py-2 px-4">
                  {currentQuestion?.question}
                </TypographyP>
                <div className="my-4 flex flex-col gap-2 px-4">
                  {["a", "b", "c", "d"].map((opt) => {
                    return (
                      <div
                        key={opt}
                        className={`${
                          currentQuestion?.correct_answer === opt &&
                          "border border-green-600"
                        } p-2 rounded `}
                      >
                        {opt}) {currentQuestion?.options[opt]}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end px-4 gap-4">
                <Button
                  onClick={handlePrev}
                  className="bg-[#22577A] rounded-full w-32"
                  size={"sm"}
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-[#38A3A5] rounded-full w-32"
                  size={"sm"}
                >
                  Next
                </Button>
              </div>
            </div>

            <div className="my-4 p-4 border-t border-bordergray flex-1 overflow-y-scroll">
              <Tabs defaultValue="solution">
                <TabsList className="bg-white ">
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
          </div>
          <div className="w-1/4 flex flex-col border-l">
            <div className="p-4 bg-[#B7CDCE]">Attempts</div>
            <div className="px-4 py-8 grow ">
              <div className="flex flex-wrap gap-2">
                {data?.data?.report.map(
                  (
                    {
                      answer_marked,
                      correct_answer,
                    }: { answer_marked: string; correct_answer: string },
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
                        onClick={() => setQuestionNumber(index)}
                      >
                        {index + 1}
                      </Button>
                    );
                  }
                )}
              </div>
            </div>
            <div className="border-t p-4 bg-[#E4F5F5] flex-1 flex justify-center items-center">
              <div>
                <div className="flex justify-center gap-6">
                  <div className="px-6 py-2 flex gap-2 justify-center items-center border  border-[#358935] rounded-lg bg-white text-[#358935]">
                    <div className="bg-[#358935] rounded-full h-4 w-4" />
                    Correct
                    <span>{data?.data.result.correct}</span>
                  </div>
                  <div className="px-6 py-2 flex gap-2 border justify-center items-center border-[#ed431f] rounded-lg bg-white text-[#ed4e1f]">
                    <div className="bg-[#ed431f] h-4 w-4 rounded-full" />
                    Wrong <span>{data?.data.result.wrong}</span>
                  </div>
                </div>
                <div className="mt-4 mx-auto px-6 py-2 flex gap-2 justify-center items-center border border-[#777] rounded-lg bg-white text-[#777] w-48">
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

/* eslint-disable react-hooks/exhaustive-deps */
import CountDownTimer from "@/components/CountDownTimer";
import RingLoader from "@/components/RingLoader";
import { TypographyP } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useGetTestQuery,
  useLazyGetTestProgressQuery,
  useSaveTestMutation,
  useSubmitTestMutation,
} from "@/store/store";
import { TestQuestionsType } from "@/utils/types";
import { Label } from "@radix-ui/react-label";
import { useEffect, useRef, useState } from "react";
import { FaClock, FaTimes } from "react-icons/fa";
import { MdMenuOpen } from "react-icons/md";
import { RiFileMarkedFill } from "react-icons/ri";

export type AttemptProgressType = {
  quizId: string;
  questionsAttempted: {
    questionId: string;
    answerMarked: string;
    timeTaken: number;
    review: boolean;
  }[];
  onQuestionNumber: number;
  timeRemaining: number;
};

export const AttemptWindow = ({
  testId,
  windowRef,
}: {
  testId: string;
  windowRef: Window;
}) => {
  const { data, isLoading, isError } = useGetTestQuery(testId);
  const [isOpen, setIsOpen] = useState(false);
  const [timer, setTimer] = useState<number>(10); // default is 10 before quiz get loaded
  const [lastAttemptAt, setLastAttemptAt] = useState<number>(0);
  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitTestMutation();
  const [getTestProgress, { isFetching: gettingSavedProgress }] =
    useLazyGetTestProgressQuery();

  const [saveQuiz] = useSaveTestMutation();

  const quiz = data?.data[0];

  const [attempt, setAttempt] = useState<AttemptProgressType>({
    quizId: testId,
    questionsAttempted: [
      { questionId: "", answerMarked: "", timeTaken: 0, review: false },
    ],
    onQuestionNumber: 0,
    timeRemaining: 0,
  });

  const [questionNumber, setQuestionNumber] = useState<number>(
    attempt.onQuestionNumber
  );

  const attemptData = useRef(attempt);
  const currentQuestion = quiz?.questions[questionNumber];

  const nextQuestion = () => {
    if (attempt.questionsAttempted[questionNumber].answerMarked === "") {
      setAttempt((prevValue) => {
        return {
          ...prevValue,
          questionsAttempted: prevValue.questionsAttempted.map((ques) => {
            return ques.questionId === currentQuestion?._id
              ? { ...ques, answerMarked: "unattempted" }
              : ques;
          }),
        };
      });
    }
    if (attempt.questionsAttempted[questionNumber].timeTaken === 0) {
      setAttempt((prevValue) => {
        return {
          ...prevValue,
          questionsAttempted: prevValue.questionsAttempted.map((ques) => {
            return ques.questionId === currentQuestion?._id
              ? { ...ques, timeTaken: lastAttemptAt - timer }
              : ques;
          }),
        };
      });
      setLastAttemptAt(timer);
    } else if (attempt.questionsAttempted[questionNumber].timeTaken > 0) {
      setAttempt((prevValue) => {
        return {
          ...prevValue,
          questionsAttempted: prevValue.questionsAttempted.map((ques) => {
            return ques.questionId === currentQuestion?._id
              ? { ...ques, timeTaken: ques.timeTaken + (lastAttemptAt - timer) }
              : ques;
          }),
        };
      });
      setLastAttemptAt(timer);
    }
    setQuestionNumber((prev) => {
      if (prev + 1 === quiz?.questions?.length) {
        return 0;
      } else {
        return (prev += 1);
      }
    });
  };

  const prevQuestion = () => {
    if (attempt.questionsAttempted[questionNumber].answerMarked === "") {
      setAttempt((prevValue) => {
        return {
          ...prevValue,
          questionsAttempted: prevValue.questionsAttempted.map((ques) => {
            return ques.questionId === currentQuestion?._id
              ? { ...ques, answerMarked: "unattempted" }
              : ques;
          }),
        };
      });
    }
    if (attempt.questionsAttempted[questionNumber].timeTaken === 0) {
      setAttempt((prevValue) => {
        return {
          ...prevValue,
          questionsAttempted: prevValue.questionsAttempted.map((ques) => {
            return ques.questionId === currentQuestion?._id
              ? { ...ques, timeTaken: lastAttemptAt - timer }
              : ques;
          }),
        };
      });
      setLastAttemptAt(timer);
    } else if (attempt.questionsAttempted[questionNumber].timeTaken > 0) {
      setAttempt((prevValue) => {
        return {
          ...prevValue,
          questionsAttempted: prevValue.questionsAttempted.map((ques) => {
            return ques.questionId === currentQuestion?._id
              ? { ...ques, timeTaken: ques.timeTaken + (lastAttemptAt - timer) }
              : ques;
          }),
        };
      });
      setLastAttemptAt(timer);
    }
    setQuestionNumber((prev) => {
      if (prev === 0) {
        if (quiz?.questions?.length != undefined)
          return quiz?.questions?.length - 1;
        else return prev;
      } else return (prev -= 1);
    });
  };

  const handleQuestionMarked = (value: string) => {
    setAttempt((prevValue) => {
      return {
        ...prevValue,
        questionsAttempted: prevValue.questionsAttempted.map((ques) => {
          return ques.questionId === currentQuestion?._id
            ? { ...ques, answerMarked: value }
            : ques;
        }),
      };
    });
  };

  const handleFinishTest = async () => {
    const lastQuestionAtBeforeSubmitting =
      attempt.questionsAttempted[questionNumber];
    if (lastQuestionAtBeforeSubmitting.timeTaken > 0) {
      lastQuestionAtBeforeSubmitting.timeTaken += lastAttemptAt - timer;
    } else {
      lastQuestionAtBeforeSubmitting.timeTaken = lastAttemptAt - timer;
    }

    const updatedData = attempt.questionsAttempted.map((ques) => {
      const returnData = {
        questionId: ques.questionId,
        timeTaken: ques.timeTaken,
        answerMarked: ques.answerMarked,
      };

      if (ques.answerMarked === "") {
        returnData.answerMarked = "unattempted";
      }
      return returnData;
    });

    const attemptData = {
      quizId: attempt.quizId,
      questionsAttempted: updatedData,
    };
    try {
      await submitQuiz(attemptData);
    } catch (err) {
      console.log(err);
    }

    windowRef?.close();
    window.location.reload();
  };

  const handleClearQuestion = () => {
    setAttempt((prevValue) => {
      return {
        ...prevValue,
        questionsAttempted: prevValue.questionsAttempted.map((ques) => {
          return ques.questionId === currentQuestion?._id
            ? { ...ques, answerMarked: "unattempted" }
            : ques;
        }),
      };
    });
  };

  const handleButtonColor = (ques: TestQuestionsType): string => {
    const targetQues = attempt.questionsAttempted.find(
      (q) => q.questionId === ques._id
    );

    if (targetQues?.answerMarked === "unattempted") return "#ed4e1f";
    else if (
      targetQues?.answerMarked != undefined &&
      targetQues?.answerMarked != ""
    )
      return "#358935";
    else return "#B7CdCE";
  };

  const handleMarkedForReview = () => {
    setAttempt((prevValue) => {
      return {
        ...prevValue,
        questionsAttempted: prevValue.questionsAttempted.map((ques) => {
          return ques.questionId === currentQuestion?._id
            ? { ...ques, review: true }
            : ques;
        }),
      };
    });

    nextQuestion();
  };

  const handleUnMarkedForReview = () => {
    setAttempt((prevValue) => {
      return {
        ...prevValue,
        questionsAttempted: prevValue.questionsAttempted.map((ques) => {
          return ques.questionId === currentQuestion?._id
            ? { ...ques, review: false }
            : ques;
        }),
      };
    });
    nextQuestion();
  };

  let render;

  useEffect(() => {
    attemptData.current = {
      ...attempt,
      questionsAttempted: attempt.questionsAttempted.map((ques, index) => {
        if (index === questionNumber) {
          return { ...ques, timeTaken: lastAttemptAt - timer };
        } else {
          return { ...ques };
        }
      }),
      onQuestionNumber: questionNumber,
      timeRemaining: timer,
    };
  }, [attempt, timer, questionNumber]);

  useEffect(() => {
    const saveProgress = async () => {
      try {
        await saveQuiz(attemptData.current);
      } catch (error) {
        console.log(error);
      }
    };
    const intervalId = setInterval(saveProgress, 5000); // Sync every 5 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // this useEffect function fetches saved test data if any.
  useEffect(() => {
    const loadAttemtData = async () => {
      try {
        const res = await getTestProgress(testId);

        if (res.data) {
          const progressData = res.data?.data;
          setAttempt((prevValue) => {
            return {
              ...prevValue,
              quizId: progressData.quizId,
              timeRemaining: progressData.timeRemaining,
              onQuestionNumber: progressData.onQuestionNumber,
              questionsAttempted: progressData.questionsAttempted.map((q) => {
                return {
                  questionId: q.questionId,
                  answerMarked: q.answerMarked,
                  timeTaken: q.timeTaken,
                  review: false,
                };
              }),
            };
          });
          setLastAttemptAt(progressData.timeRemaining);
          setQuestionNumber(progressData.onQuestionNumber);
          setTimer(progressData.timeRemaining);
        } else {
          if (quiz) {
            setAttempt((prevValue) => {
              return {
                ...prevValue,
                quizId: quiz?._id,
                questionsAttempted: quiz?.questions.map((q) => {
                  return {
                    questionId: q._id,
                    answerMarked: "",
                    timeTaken: 0,
                    review: false,
                  };
                }),
              };
            });
            setTimer(quiz?.duration);
            setLastAttemptAt(quiz?.duration);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadAttemtData();
  }, [quiz]);

  if (isLoading || gettingSavedProgress)
    render = (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <RingLoader />
      </div>
    );
  else if (isError)
    render = <div className="text-2xl font-bold">Error occured ...</div>;
  else {
    render = (
      <div className="w-screen h-screen  flex bg-white font-semibold">
        <div className="lg:w-3/4 w-full flex flex-col">
          <div
            className="flex w-full justify-center relative items-center p-2"
            style={{ backgroundColor: "#BDD5D6" }}
          >
            <h1>Online Quiz : {quiz?.title}</h1>
            <div
              className="absolute top-1/2 text-2xl lg:hidden right-6 -translate-y-1/2"
              onClick={() => setIsOpen(true)}
            >
              <MdMenuOpen />
            </div>
          </div>
          <div className="flex-1 flex-col bg-white p-4">
            <div className="flex gap-2  items-center mx-4 mb-2">
              <h1 style={{ color: "#22577A" }}>
                Question {questionNumber + 1}
              </h1>
            </div>
            <hr />
            <TypographyP className="mx-6 my-4">
              {currentQuestion?.question}
            </TypographyP>
            <div className="mx-4 mt-10">
              <RadioGroup
                value={`${attempt.questionsAttempted[questionNumber]?.answerMarked}`}
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
            <div className="py-8 px-8 flex flex-wrap gap-4 items-end  justify-end">
              <Button
                onClick={handleClearQuestion}
                className="w-24 rounded-full border-2 border-gray-300"
                size={"sm"}
                variant={"outline"}
                style={{ backgroundColor: "#8C9C9C", color: "#FFF" }}
              >
                Clear
              </Button>

              {attempt.questionsAttempted[questionNumber]?.review === true ? (
                <Button
                  onClick={handleUnMarkedForReview}
                  className="w-36 rounded-full"
                  size={"sm"}
                  style={{ backgroundColor: "#7B7B7B", color: "#fff" }}
                >
                  Unmark
                </Button>
              ) : (
                <Button
                  onClick={handleMarkedForReview}
                  className="w-36 rounded-full"
                  size={"sm"}
                  style={{ backgroundColor: "#7B7B7B", color: "#fff" }}
                >
                  Mark For review
                </Button>
              )}

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
                style={{ backgroundColor: "#38A3A5", color: "#fff" }}
              >
                Next
              </Button>
              <Button
                onClick={handleFinishTest}
                className="w-32 rounded-full"
                size={"sm"}
                style={{ backgroundColor: "#358935", color: "#fff" }}
              >
                Submit
              </Button>
            </div>

            <div className="flex gap-8 items-center mr-10 py-8 justify-end">
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
                  style={{ backgroundColor: "#ed4e1f" }}
                />
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: "#B7CDCE" }}
                />
                <span>Not Visited</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`lg:w-1/4 w-3/4 bg-white z-10 h-full border-l lg:flex lg:static lg:translate-x-0 absolute top-0 right-0 flex-col transition-all duration-200 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div
            className="flex gap-4 justify-center items-center p-2 relative"
            style={{ backgroundColor: "#B7CDCE" }}
          >
            <FaClock />
            Time Left
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden absolute top-1/2 left-2 -translate-y-1/2 text-xl"
            >
              <FaTimes />
            </div>
          </div>
          <div className="flex justify-center items-center p-6 bg-white">
            <CountDownTimer
              className="uppercase text-xl"
              time={timer}
              setTime={setTimer}
              onTimerEnd={handleFinishTest}
            />
          </div>
          <div
            style={{ backgroundColor: "#B7CDCE" }}
            className="p-6 flex justify-center items-center"
          >
            Attempts
          </div>
          <div className="flex justify-start gap-1 px-2 py-4 flex-wrap">
            {quiz?.questions?.map((ques, index) => {
              return (
                <Button
                  variant={"outline"}
                  className="relative"
                  key={index}
                  style={{
                    color: "#fff",
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: handleButtonColor(ques),
                  }}
                  onClick={() => setQuestionNumber(index)}
                >
                  {attempt.questionsAttempted[index]?.review === true && (
                    <div className="absolute right-0 top-0">
                      <RiFileMarkedFill className="text-sm" />
                    </div>
                  )}
                  <div className="relative">
                    <span> {index + 1}</span>
                    {ques._id === currentQuestion?._id && (
                      <div
                        className="rounded-full absolute "
                        style={{
                          backgroundColor: "#fff",
                          width: "9px",
                          height: "3px",
                        }}
                      ></div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
        {isSubmitting && (
          <div className="z-20">
            <RingLoader />
          </div>
        )}
      </div>
    );
  }
  return <>{render}</>;
};

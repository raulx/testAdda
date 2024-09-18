import Footer from "@/components/Footer";
import MockCard from "@/components/MockCard";
import Navbar from "@/components/Navbar";
import QuizCard from "@/components/QuizCard";
import {
  TypographyH1,
  TypographyH4,
  TypographyH2,
} from "@/components/Typography";
import { Button } from "@/components/ui/button";
import {
  AppDispatch,
  logOutUser,
  RootState,
  setUser,
  useLazyGetUserQuery,
} from "@/store/store";
import { useEffect } from "react";
import { FaRocket } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { isFetchBaseQueryError } from "@/utils/helpers";
import { toast } from "react-toastify";
import RingLoader from "@/components/RingLoader";
import { ApiResponseType, UserData } from "@/utils/types";

const mockQuizData: {
  title: string;
  description: string;
  questions: number;
  duration: number;
  difficulty_level: string;
}[] = [
  {
    title: "CAT QUIZ - 01",
    description:
      "combination of reasoning english and mathematics from previous year cat exams",
    questions: 25,
    difficulty_level: "Begginner",
    duration: 25,
  },
  {
    title: "SSC CGL Previous year quiz - 01",
    description:
      "this quiz comprizes of previous years ssc cgl question for you to practice",
    difficulty_level: "Advanced",
    questions: 25,
    duration: 25,
  },
  {
    title: "BANK PO Speed Test - 01",
    description: "Practice more question in less time",
    difficulty_level: "Intermediate",
    questions: 25,
    duration: 25,
  },
];

const mockMockData: { exam: string; duration: number; questions: number }[] = [
  { exam: "CAT-01", duration: 1, questions: 100 },
  { exam: "SSC CGL-01", duration: 1, questions: 100 },
  { exam: "SSC CHSL-01", duration: 1, questions: 100 },
  { exam: "IBPS PO-01", duration: 1, questions: 100 },
  { exam: "SBI PO-01", duration: 1, questions: 100 },
  { exam: "SBI Clerk-01", duration: 1, questions: 100 },
  { exam: "IBPS Clerk-01", duration: 1, questions: 100 },
];

const HomePage = () => {
  const { isLoggedIn } = useSelector((state: RootState) => {
    return state.auth.data;
  });
  const dispatch = useDispatch<AppDispatch>();
  const [fetchUserData, { isLoading }] = useLazyGetUserQuery();

  // load the user if user session is active
  useEffect(() => {
    if (isLoggedIn) {
      const getUser = async () => {
        try {
          const res = await fetchUserData(null);
          // for server side errors
          if (res.error && isFetchBaseQueryError(res.error)) {
            dispatch(logOutUser());
            const serverError = res.error.data as ApiResponseType<UserData>;
            toast.error(`Error : ${serverError.message}`, {
              autoClose: 3000,
              hideProgressBar: true,
            });
          }

          // for client side errors
          if (res.error && !isFetchBaseQueryError(res.error)) {
            return toast.error("Error : Client side Error !");
          }
          if (res.data?.statusCode === 200) dispatch(setUser(res.data?.data));
        } catch (err) {
          console.log(err);
        }
      };
      getUser();
    }
  }, [isLoggedIn, fetchUserData, dispatch]);

  return (
    <>
      <Navbar />
      <section className=" flex sm:flex-row flex-col sm:gap-0 gap-8 justify-center items-center text-center min-h-[32rem] text-darkcerulean">
        <img src="https://res.cloudinary.com/dj5yf27lr/image/upload/v1725810806/testAdda/frontendAssets/wwoaxs3qrdaiypeghlza.png" />
        <div className="flex gap-16 flex-col">
          <div className="flex flex-col gap-4">
            <TypographyH1 className=" tracking-wide font-inter opacity-85 ">
              Practice Point
            </TypographyH1>
            <TypographyH4 className="opacity-85 font-inter sm:w-2/3 sm:px-0 px-4 mx-auto">
              Practice more and more for your upcoming exams and ace your result
              with flying numbers.
            </TypographyH4>
          </div>
          <Button
            variant={"lightseagreen"}
            className="w-[12rem] flex gap-4 mx-auto"
          >
            <FaRocket />
            Try For Free
          </Button>
        </div>
      </section>
      <br />
      <section className="bg-jetstream  py-12 my-6">
        <TypographyH2 className="text-center my-12">
          Practice Quizes
        </TypographyH2>
        <div className="flex justify-center items-center gap-6 sm:flex-row flex-col px-4 flex-wrap">
          {mockQuizData.map((data) => {
            return (
              <QuizCard
                key={data.title}
                title={data.title}
                description={data.description}
                questions={data.questions}
                duration={data.duration}
                difficulty={data.difficulty_level}
              />
            );
          })}
        </div>
      </section>

      <section className="py-6 my-6">
        <TypographyH2 className="text-center my-12">
          Practice Full Length Mocks
        </TypographyH2>
        <div className="flex gap-4 justify-center items-center flex-wrap px-4">
          {mockMockData.map((mock) => {
            return (
              <MockCard
                key={mock.exam}
                exam={mock.exam}
                duration={mock.duration}
                questions={mock.questions}
              />
            );
          })}
        </div>
      </section>
      <Footer />
      {isLoading && <RingLoader />}
    </>
  );
};

export default HomePage;

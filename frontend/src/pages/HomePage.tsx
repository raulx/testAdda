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

import { FaNewspaper, FaRocket } from "react-icons/fa";
import { Link } from "react-router-dom";

const mockQuizData: {
  title: string;
  description: string;
  questions: string[];
  duration: number;
  access_type: "free" | "paid";
  difficulty_level: string;
}[] = [
  {
    title: "CAT QUIZ - 01",
    access_type: "free",
    description:
      "combination of reasoning english and mathematics from previous year cat exams",
    questions: ["2234e", "wesdewew4", "2342sd", "234s32"],
    difficulty_level: "Begginner",
    duration: 25,
  },
  {
    title: "SSC CGL Previous year quiz - 01",
    description:
      "this quiz comprizes of previous years ssc cgl question for you to practice",
    difficulty_level: "Advanced",
    questions: ["232342", "ssaawser", "43sosidufy", "sdwerws"],
    duration: 25,
    access_type: "free",
  },
  {
    title: "BANK PO Speed Test - 01",
    description: "Practice more question in less time",
    difficulty_level: "Intermediate",
    questions: ["2232sdf", "weswww2", "4322sew", "2342ss", "232s234"],
    duration: 25,
    access_type: "paid",
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
  return (
    <>
      <Navbar />
      <main className="flex flex-col gap-12 mb-12">
        {/* Hero section  */}

        <section className=" flex sm:flex-row flex-col sm:gap-0 gap-8 justify-center items-center text-center min-h-[32rem] text-darkcerulean">
          <img src="https://res.cloudinary.com/dj5yf27lr/image/upload/v1725810806/testAdda/frontendAssets/wwoaxs3qrdaiypeghlza.png" />
          <div className="flex gap-16 flex-col">
            <div className="flex flex-col gap-4">
              <TypographyH1 className=" tracking-wide font-inter opacity-85 ">
                Practice Point
              </TypographyH1>
              <TypographyH4 className="opacity-85 font-inter sm:w-2/3 sm:px-0 px-4 mx-auto">
                Practice more and more for your upcoming exams and ace your
                result with flying numbers.
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

        {/* Quizes section  */}
        <section className="bg-jetstream py-12">
          <TypographyH2 className="text-center my-12">
            Practice Quizes
          </TypographyH2>
          <div className="flex justify-center items-center gap-6 sm:flex-row flex-col px-4 flex-wrap">
            {mockQuizData.map((data) => {
              return (
                <QuizCard
                  key={data.title}
                  access_type={data.access_type}
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
        {/* News section */}
        <section className="flex sm:flex-row  flex-col px-8 py-12 sm:gap-0 gap-8 justify-center items-center text-center min-h-[32rem] text-darkcerulean">
          <div className="flex-grow flex items-end justify-end">
            <img
              src="https://res.cloudinary.com/dj5yf27lr/image/upload/v1727253170/testAdda/frontendAssets/axitx457pivndks0bgt6.jpg"
              className="h-96 rounded-2xl w-96  object-cover"
            />
          </div>

          <div className="flex gap-16 flex-col flex-grow">
            <div className="flex flex-col gap-4">
              <TypographyH1 className=" tracking-wide font-inter opacity-85 ">
                Daily News
              </TypographyH1>
              <TypographyH4 className="opacity-85 font-inter sm:w-2/3 sm:px-0 px-4 mx-auto">
                Read Daily Important News And Attempt Quizes Around it
              </TypographyH4>
            </div>
            <Link to={"/news"}>
              <Button
                variant={"lightseagreen"}
                className="w-[8rem] flex gap-4 mx-auto"
              >
                <FaNewspaper />
                Read
              </Button>
            </Link>
          </div>
        </section>
        {/* Mocks section */}
        <section className=" pt-12 bg-jetstream">
          <TypographyH2 className="text-center my-4">
            Practice Full Length Mocks
          </TypographyH2>
          <div className="flex overflow-x-scroll gap-4 px-4 py-8">
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
      </main>

      <Footer />
    </>
  );
};

export default HomePage;

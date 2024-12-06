import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TestCard from "@/components/TestCard";
import {
  TypographyH1,
  TypographyH4,
  TypographyH2,
} from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { TestsResponseType } from "@/utils/types";
import { FaRocket } from "react-icons/fa";
import { Link } from "react-router-dom";

const mockQuizData: TestsResponseType = [
  {
    _id: "dsasdd",
    title: "CAT QUIZ - 01",
    access_type: "free",
    description:
      "combination of reasoning english and mathematics from previous year cat exams",
    questions: ["2234e", "wesdewew4", "2342sd", "234s32"],
    difficulty_level: "Begginner",
    duration: 25,
    number_of_questions: 4,
  },
  {
    _id: "sldkjf",
    title: "SSC CGL Previous year quiz - 01",
    description:
      "this quiz comprizes of previous years ssc cgl question for you to practice",
    difficulty_level: "Advanced",
    questions: ["232342", "ssaawser", "43sosidufy", "sdwerws"],
    duration: 25,
    access_type: "free",
    number_of_questions: 4,
  },
  {
    _id: "sldkjf",
    title: "BANK PO Speed Test - 01",
    description: "Practice more question in less time",
    difficulty_level: "Intermediate",
    questions: ["2232sdf", "weswww2", "4322sew", "2342ss", "232s234"],
    duration: 25,
    access_type: "paid",
    number_of_questions: 5,
  },
];

const mockMockData: TestsResponseType = [
  {
    _id: "1",
    title: "IBPS- Clerk Full Length Mock Test - 01",
    description:
      "full length ssc chsl mock designed to meet real exam questions with latest pattern",
    difficulty_level: "Intermediate",
    questions: ["2232sdf", "weswww2", "4322sew", "2342ss", "232s234"],
    duration: 25,
    access_type: "paid",
    number_of_questions: 5,
  },
  {
    _id: "2",
    title: "SSC CHSL Full Length Mock Test - 01",
    description:
      "full length ssc chsl mock designed to meet real exam questions with latest pattern",
    difficulty_level: "Intermediate",
    questions: ["2232sdf", "weswww2", "4322sew", "2342ss", "232s234"],
    duration: 25,
    access_type: "paid",
    number_of_questions: 5,
  },
  {
    _id: "3",
    title: "SSC-CGL Full Length Mock Test - 01",
    description:
      "full length ssc chsl mock designed to meet real exam questions with latest pattern",
    difficulty_level: "Intermediate",
    questions: ["2232sdf", "weswww2", "4322sew", "2342ss", "232s234"],
    duration: 25,
    access_type: "paid",
    number_of_questions: 5,
  },
  {
    _id: "4",
    title: "IBPS-PO Full Length Mock - 01",
    description:
      "full length ssc chsl mock designed to meet real exam questions with latest pattern",
    difficulty_level: "Intermediate",
    questions: ["2232sdf", "weswww2", "4322sew", "2342ss", "232s234"],
    duration: 25,
    access_type: "paid",
    number_of_questions: 5,
  },
  {
    _id: "5",
    title: "SBI PO Full length Mock - 02",
    description:
      "full length ssc chsl mock designed to meet real exam questions with latest pattern",
    difficulty_level: "Intermediate",
    questions: ["2232sdf", "weswww2", "4322sew", "2342ss", "232s234"],
    duration: 25,
    access_type: "paid",
    number_of_questions: 5,
  },
  {
    _id: "6",
    title: "CAT Full Length Mock - 01",
    description:
      "full length ssc chsl mock designed to meet real exam questions with latest pattern",
    difficulty_level: "Intermediate",
    questions: ["2232sdf", "weswww2", "4322sew", "2342ss", "232s234"],
    duration: 25,
    access_type: "paid",
    number_of_questions: 100,
  },
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
            <Link to={"/tests"}>
              <Button
                variant={"lightseagreen"}
                className="w-[12rem] flex gap-4 mx-auto"
              >
                <FaRocket />
                Try For Free
              </Button>
            </Link>
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
                <TestCard
                  key={data.title}
                  _id={data._id}
                  access_type={data.access_type}
                  title={data.title}
                  description={data.description}
                  questions={data.questions}
                  duration={data.duration}
                  difficulty_level={data.difficulty_level}
                  number_of_questions={data.number_of_questions}
                />
              );
            })}
          </div>
        </section>

        {/* Mocks section */}
        <section className=" pt-12 border-2 border-gray-200">
          <TypographyH2 className="text-center my-4">
            Practice Full Length Mocks
          </TypographyH2>
          <div className="flex overflow-x-scroll gap-4 px-4 py-8 scrollbar-thin">
            {mockMockData.map((data) => {
              return (
                <div>
                  <TestCard
                    key={data.title}
                    _id={data._id}
                    access_type={data.access_type}
                    title={data.title}
                    description={data.description}
                    questions={data.questions}
                    duration={data.duration}
                    difficulty_level={data.difficulty_level}
                    number_of_questions={data.number_of_questions}
                  />
                </div>
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

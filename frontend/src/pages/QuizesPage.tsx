import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import QuizCard from "@/components/QuizCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLazyGetQuizesQuery } from "@/store/store";
import { useEffect, useState } from "react";
import { SiOpensearch } from "react-icons/si";

const QuizesPage = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [getQuizes, { data, isLoading }] = useLazyGetQuizesQuery();

  const handleQuizSearch = () => {
    if (searchText === "") return;
    console.log(searchText);
  };

  useEffect(() => {
    const fetchQuizes = async () => {
      await getQuizes(null);
    };
    fetchQuizes();
  }, [getQuizes]);

  return (
    <>
      <Navbar />
      <div className="flex gap-2 justify-center items-center py-2 sm:px-0 px-2 bg-jetstream">
        <Input
          type="text"
          placeholder="Search Quiz"
          className="sm:w-1/3 h-[32px] rounded-full"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button
          className="rounded-full"
          size={"sm"}
          variant={"mediumseagreen"}
          onClick={handleQuizSearch}
        >
          <SiOpensearch />
        </Button>
      </div>
      <div className="w-screen flex flex-wrap gap-4 justify-center my-6">
        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          <>
            {data?.data?.map((q) => {
              return (
                <QuizCard
                  key={q.title}
                  title={q.title}
                  access_type={q.access_type}
                  description={q.description}
                  duration={q.duration}
                  questions={q.questions}
                  difficulty={q.difficulty_level}
                />
              );
            })}
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default QuizesPage;

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import QuizCard from "@/components/QuizCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppDispatch, setQuizes, useLazyGetQuizesQuery } from "@/store/store";
import { useEffect, useState } from "react";
import { SiOpensearch } from "react-icons/si";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch } from "react-redux";

const QuizesPage = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [getQuizes, { data, isLoading }] = useLazyGetQuizesQuery();
  const dispatch = useDispatch<AppDispatch>();

  const handleQuizSearch = () => {
    if (searchText === "") return;
    console.log(searchText);
  };

  useEffect(() => {
    const fetchQuizes = async () => {
      const res = await getQuizes(null);
      if (res.data) dispatch(setQuizes(res.data?.data));
    };
    fetchQuizes();
  }, [getQuizes, dispatch]);

  return (
    <>
      <Navbar />
      <main className="flex flex-col gap-4">
        <div className="flex gap-2 justify-center w-screen items-center py-2 sm:px-0 px-2 bg-jetstream">
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

        <Tabs defaultValue="free" className="w-screen mx-auto">
          <TabsList className="w-full bg-white">
            <div className=" bg-lightseagreen rounded-xl border-2">
              <TabsTrigger value="free" className="text-white">
                Free
              </TabsTrigger>
              <TabsTrigger value="paid" className="text-white">
                Paid
              </TabsTrigger>
            </div>
          </TabsList>
          <TabsContent value="free">
            <div className=" flex flex-wrap gap-4 justify-center my-6">
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
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </main>

      <Footer />
    </>
  );
};

export default QuizesPage;

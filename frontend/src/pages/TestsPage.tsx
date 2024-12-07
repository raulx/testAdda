import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TestCard from "@/components/TestCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AppDispatch,
  RootState,
  setQuizes,
  useLazyGetTestsQuery,
  useLazySearchTestQuery,
} from "@/store/store";
import { ChangeEvent, useEffect } from "react";
import { SiOpensearch } from "react-icons/si";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { DoubleRingLoader, RingCutLoader } from "@/components/Loaders";

const TestsContainer = ({ accessType }: { accessType: "free" | "paid" }) => {
  const quizes = useSelector((store: RootState) => {
    return store.quizes;
  });
  return (
    <div className="flex flex-wrap gap-8 justify-center my-6 bg-jetstream py-12">
      {quizes.data
        ?.filter((q) => q.access_type === accessType)
        ?.map((q) => {
          return (
            <TestCard
              _id={q._id}
              key={q._id}
              title={q.title}
              access_type={q.access_type}
              description={q.description}
              duration={q.duration}
              questions={q.questions}
              difficulty_level={q.difficulty_level}
              number_of_questions={q.number_of_questions}
            />
          );
        })}
    </div>
  );
};

const TestsPage = () => {
  const [getQuizes, { isLoading }] = useLazyGetTestsQuery();
  const [searchTest, { isFetching: searchingTest }] = useLazySearchTestQuery();
  const dispatch = useDispatch<AppDispatch>();

  const handleTestSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const res = await searchTest(e.target.value);
      if (res.data) {
        dispatch(setQuizes(res.data?.data));
      }
    } catch (error) {
      console.log(error);
    }
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
            onChange={(e) => handleTestSearch(e)}
          />
          <Button
            className="rounded-full"
            size={"sm"}
            variant={"mediumseagreen"}
            onClick={() => console.log("i am useless")}
          >
            <SiOpensearch />
          </Button>
        </div>
        {searchingTest || isLoading ? (
          <div className="w-screen h-[500px] flex justify-center items-center">
            <DoubleRingLoader />
          </div>
        ) : (
          <Tabs defaultValue="free" className="w-screen mx-auto min-h-screen ">
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
              <TestsContainer accessType="free" />
            </TabsContent>
            <TabsContent value="paid">
              <TestsContainer accessType="paid" />
            </TabsContent>
          </Tabs>
        )}
      </main>

      <Footer />
    </>
  );
};

export default TestsPage;

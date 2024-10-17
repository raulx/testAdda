import { TypographyP } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UseGetUserDataHook from "@/hooks/UseGetUserDataHook";
import { useGetResultMutation } from "@/store/store";
import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { useParams } from "react-router-dom";

const SolutionsPage = () => {
  const [getResult, { isLoading }] = useGetResultMutation();
  const user = UseGetUserDataHook();
  const { id } = useParams();

  useEffect(() => {
    const getresult = async () => {
      const res = await getResult({ quizId: id, userId: user.data._id });
      console.log(res);
    };
    if (user.data._id) getresult();
  }, [getResult, id, user]);

  return (
    <>
      {isLoading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <FaSpinner className="animate-spin text-3xl" />
        </div>
      ) : (
        <div className="w-screen h-screen flex">
          <div className="w-3/4 flex flex-col">
            <h1 className="text-center p-4 bg-[#BDD5D6]">Solutions</h1>
            <div className="p-4">
              <div className="border-b border-bordergray text-xl">
                Question 1
              </div>
              <div>
                <TypographyP className="py-2">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Aspernatur veniam libero odio perferendis corrupti? Quasi
                  ducimus ex doloremque dolor ipsam, saepe earum praesentium
                  accusantium! Rerum nemo saepe molestias voluptatem beatae?
                </TypographyP>
                <div className="my-4 flex flex-col gap-2">
                  <div className="border border-green-400 p-2">1. Option 1</div>
                  <div className="p-2 border border-red-400">2. Option 2</div>
                  <div className="p-2">3. Option 3</div>
                  <div className="p-2">4, Option 4</div>
                </div>
              </div>
              <div className="flex justify-end px-4 gap-4">
                <Button>Previous</Button>
                <Button>Next</Button>
              </div>
              <div className="my-4 border-t">
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

                  <TabsContent value="free">free</TabsContent>
                  <TabsContent value="paid">paid</TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
          <div className="w-1/4 flex flex-col">
            <div className="p-4 bg-[#B7CDCE]  border-l">Attempts</div>
            <div className="p-4 h-2/3">
              <Button>1</Button>
              <Button>2</Button>
            </div>
            <div>
              <Button>Correct</Button>
              <Button>Wrong</Button>
              <Button>Unattempted</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SolutionsPage;

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SiOpensearch } from "react-icons/si";

const QuizesPage = () => {
  const [searchText, setSearchText] = useState<string>("");

  const handleQuizSearch = () => {
    if (searchText === "") return;

    console.log(searchText);
  };

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
    </>
  );
};

export default QuizesPage;

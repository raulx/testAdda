import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SiOpensearch } from "react-icons/si";

function LandingPage() {
  const [searchText, setSearchText] = useState<string>("");

  const handleQuizSearch = () => {
    if (searchText === "") return;

    console.log(searchText);
  };
  return (
    <>
      <Navbar />
      <div className="flex gap-4 justify-center items-center py-4 sm:px-0 px-2 bg-jetstream">
        <Input
          type="text"
          placeholder="Search Quiz"
          className="sm:w-1/3 rounded-full"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Button
          className="rounded-full"
          variant={"mediumseagreen"}
          onClick={handleQuizSearch}
        >
          <SiOpensearch />
        </Button>
      </div>
    </>
  );
}

export default LandingPage;

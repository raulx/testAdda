import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-4">
      <h1 className="text-3xl text-red-700">Welcome</h1>
      <div className="flex gap-2 ">
        <Button>
          <Link to={"/login"}>Login</Link>
        </Button>
        <Button>
          <Link to={"/signup"}>Signup</Link>
        </Button>
      </div>
    </div>
  );
}

export default LandingPage;

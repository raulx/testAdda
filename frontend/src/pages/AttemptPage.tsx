import { UseGetSliceHook } from "@/hooks/UseGetSliceHook";
import { FaClock } from "react-icons/fa";

export const AttemptRoot = ({ windowRef }: { windowRef: Window | null }) => {
  const { quiz } = UseGetSliceHook();
  return (
    <div className="w-screen h-screen flex bg-white">
      <div className=" w-2/3 flex flex-col">
        <div
          className="flex w-full justify-center items-center p-2"
          style={{ backgroundColor: "#BDD5D6" }}
        >
          <h1>Online Quiz : {quiz.data?.title}</h1>
        </div>
        <div className="flex-1 bg-white">Question Box</div>
        <div>Nav Box</div>
      </div>
      <div className="bg-red-200 w-1/3 flex flex-col">
        <div
          className="flex gap-4 justify-center items-center p-2"
          style={{ backgroundColor: "#B7CDCE" }}
        >
          <FaClock />
          Time Left<button onClick={() => windowRef?.close()}>Close</button>
        </div>
        <div className="flex justify-center items-center p-6 bg-white">
          Time Box
        </div>
        <div>Attempts</div>
        <div>Attempts Box </div>
      </div>
    </div>
  );
};

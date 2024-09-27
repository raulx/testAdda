import { UseGetSliceHook } from "@/hooks/UseGetSliceHook";

export const AttemptRoot = ({ windowRef }: { windowRef: Window | null }) => {
  const { quiz } = UseGetSliceHook();
  return (
    <div>
      <h1>This is the Quiz Component</h1>
      <h1>{quiz.data?._id}</h1>
      <h1>{quiz.data?.title}</h1>
      <h2>{quiz.data?.description}</h2>
      {/* Your quiz content here */}
      <button onClick={() => windowRef?.close()}>Close</button>
    </div>
  );
};

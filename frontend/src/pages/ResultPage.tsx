import UseGetUserDataHook from "@/hooks/UseGetUserDataHook";
import { useGetResultMutation } from "@/store/store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const ResultPage = () => {
  const [getResult, { data }] = useGetResultMutation();
  const { id } = useParams();
  const user = UseGetUserDataHook();

  useEffect(() => {
    const getresult = async () => {
      const res = await getResult({ quizId: id, userId: user.data._id });
      console.log(res);
    };
    if (user.data._id) getresult();
  }, [getResult, id, user]);
  return (
    <div>
      <h1>Quiz Id : {id} </h1>
      <h1>
        User Id:{user.data._id} {data?.data.result.correct}
      </h1>
    </div>
  );
};

export default ResultPage;

import UseGetUserDataHook from "@/hooks/UseGetUserDataHook";
import { useGetResultMutation } from "@/store/store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const SolutionsPage = () => {
  const [getResult] = useGetResultMutation();
  const user = UseGetUserDataHook();
  const { id } = useParams();

  useEffect(() => {
    const getresult = async () => {
      const res = await getResult({ quizId: id, userId: user.data._id });
      console.log(res);
    };
    if (user.data._id) getresult();
  }, [getResult, id, user]);

  return <div>Solutions Page for Id : {id}</div>;
};

export default SolutionsPage;

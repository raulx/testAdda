import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export const UseUserHook = () => {
  return useSelector((store: RootState) => {
    return store.user;
  });
};

export const UseQuizesHook = () => {
  return useSelector((store: RootState) => {
    return store.quizes;
  });
};
export const UseQuizHook = () => {
  return useSelector((store: RootState) => {
    return store.quiz;
  });
};

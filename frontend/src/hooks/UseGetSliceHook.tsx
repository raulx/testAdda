import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export const UseGetSliceHook = () => {
  return useSelector((store: RootState) => {
    return store;
  });
};

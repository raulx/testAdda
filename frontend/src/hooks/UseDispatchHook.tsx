import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";

export const UseDispatchHook = () => {
  return useDispatch<AppDispatch>();
};

import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";

export const UseAppDispatch = () => {
  return useDispatch<AppDispatch>();
};

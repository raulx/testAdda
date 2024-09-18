import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

function UseGetUserDataHook() {
  return useSelector((store: RootState) => {
    return store.user;
  });
}

export default UseGetUserDataHook;

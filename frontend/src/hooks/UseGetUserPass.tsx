import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const UseGetUserPass = () => {
  return useSelector((store: RootState) => {
    return store.userpass;
  });
};

export default UseGetUserPass;

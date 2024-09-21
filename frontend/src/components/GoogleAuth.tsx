import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLoginMutation, AppDispatch, logInUser } from "@/store/store";
import RingLoader from "./RingLoader";
import { isFetchBaseQueryError } from "@/utils/helpers";
import { toast } from "react-toastify";
import { ApiResponseType, UserData } from "@/utils/types";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const GoogleAuth = () => {
  const [googleLogin, { isLoading }] = useGoogleLoginMutation();

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (tokenResponse) => {
      const res = await googleLogin(tokenResponse.code);

      // for server side errors
      if (res.error && isFetchBaseQueryError(res.error)) {
        const serverError = res.error.data as ApiResponseType<UserData>;
        return toast.error(`Error:${serverError.message}`, {
          hideProgressBar: true,
          autoClose: 3000,
        });
      }

      // for client side errors
      else if (res.error && !isFetchBaseQueryError(res.error)) {
        return toast.error("Error : Client side Error !");
      } else if (!res.data) console.log("no data received ");
      else {
        dispatch(logInUser(res.data?.data._id));
        navigate("/");
      }
    },
    onError: () => {
      console.log("Login Failed");
    },
  });
  return (
    <>
      <Button
        className="w-full flex gap-4 shadow-custom-2 py-6"
        variant={"outline"}
        onClick={() => login()}
      >
        <FcGoogle className="text-3xl" />
        Continue With Google
      </Button>
      {isLoading && <RingLoader />}
    </>
  );
};

export default GoogleAuth;

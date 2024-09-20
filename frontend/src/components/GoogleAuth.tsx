import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";

const GoogleAuth = () => {
  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (tokenResponse) => {
      console.log(tokenResponse);
    },
    onError: () => {
      console.log("Login Failed");
    },
  });
  return (
    <Button
      className="w-full flex gap-4 shadow-custom-2 py-6"
      variant={"outline"}
      onClick={() => login()}
    >
      <FcGoogle className="text-3xl" />
      Continue With Google
    </Button>
  );
};

export default GoogleAuth;

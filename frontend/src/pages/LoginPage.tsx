import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  AppDispatch,
  logInUser,
  useSendEmailOtpMutation,
  useUpdateUserAvatarMutation,
  useUpdateUserNameMutation,
  useVerifyEmailOtpMutation,
} from "@/store/store";

import Logo from "@/components/Logo";
import { FaDiscord } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Link,
  NavigateFunction,
  Outlet,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import {
  TypographyH2,
  TypographyH4,
  TypographyLead,
  TypographyP,
} from "@/components/Typography";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import CountDownTimer from "@/components/CountDownTimer";
import RingLoader from "@/components/RingLoader";
import { isFetchBaseQueryError } from "@/utils/helpers";
import { ApiResponseType, UserData } from "@/utils/types";
import { useDispatch } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleAuth from "@/components/GoogleAuth";
//types
const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
});

const OtpFormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

const UserNameFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const AvatarUploadSchema = z.object({
  file: z
    .any()
    .refine((fileList) => fileList && fileList[0], {
      message: "File is required",
    }) // Ensure a file is selected
    .refine((fileList) => fileList && fileList[0].size <= 2 * 1024 * 1024, {
      message: "File size should be less than 2MB",
    }) // Size limit (2MB)
    .refine(
      (fileList) =>
        fileList && ["image/jpeg", "image/png"].includes(fileList[0].type),
      {
        message: "Only .jpg or .png files are allowed",
      }
    ), // File type validation
});

interface SharedLoginPageContext {
  email: string;
  navigate: NavigateFunction;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

// parent of '/login
const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <Outlet context={{ email, navigate, setEmail }} />
    </div>
  );
};

// children components of '/login
const LoginHome = () => {
  const [sendEmailOtp, { isLoading }] = useSendEmailOtpMutation();

  const { setEmail, navigate } = useOutletContext<SharedLoginPageContext>();

  const [isChecked, setIsChecked] = useState(false);

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  async function handleOtpSending(values: z.infer<typeof LoginFormSchema>) {
    if (!isChecked)
      return toast(
        <div className=" text-darkcerulean">
          Please Read And Accept Our Terms And Conditions
        </div>,
        { autoClose: 3000, hideProgressBar: true }
      );
    try {
      const res = await sendEmailOtp({
        email: values.email,
      });

      if (res.error && isFetchBaseQueryError(res.error)) {
        const serverError = res.error.data as ApiResponseType<object>;
        return toast(`Error:${serverError.message}`);
      }

      toast.success("OTP sent successfully", {
        hideProgressBar: true,
        autoClose: 3000,
      });

      setEmail(values.email);
      navigate("/login/verify-email");
    } catch (err) {
      console.log(err);
      toast.error("SERVER ERROR : Try Again Later ", {
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  }

  return (
    <div className="flex flex-col gap-6 lg:w-2/6 lg:p-8 md:w-3/6 p-6 rounded-lg">
      <Logo large />
      <GoogleOAuthProvider clientId="129545101591-d5fu6ee7cvkb31ipl94ogvgcuckb4kd3.apps.googleusercontent.com">
        <GoogleAuth />
      </GoogleOAuthProvider>

      <Button
        className="w-full flex gap-4 shadow-custom-2 py-6"
        variant={"outline"}
      >
        <FaDiscord className="text-3xl text-[#5865F2]" />
        Continue With Discord
      </Button>

      <div className="flex mt-8 gap-2 justify-center items-center">
        <hr className="h-[2px] w-full bg-gray-300" />
        <p className="text-center text-lg text-gray-500">OR</p>
        <hr className="h-[2px] w-full bg-gray-300" />
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleOtpSending)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="border-2"
                    placeholder="Enter your email address"
                    {...field}
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full py-6"
            variant={"lightseagreen"}
          >
            {isLoading ? <RingLoader /> : <>Continue</>}
          </Button>
        </form>
      </Form>

      <div className="items-top flex space-x-2">
        <Checkbox
          id="terms1"
          checked={isChecked}
          onClick={handleCheckboxChange}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms1"
            className="text-sm text-darkcerulean font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            By signing in to TestMagister , you agree with our
            <Button variant={"link"}>Terms & Conditions</Button> and
            <Button variant={"link"}>Privacy Policy</Button>
          </label>
        </div>
      </div>
    </div>
  );
};

const SetUserName = () => {
  const [updateUserName, { isLoading }] = useUpdateUserNameMutation();
  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = useOutletContext<SharedLoginPageContext>();

  const form = useForm<z.infer<typeof UserNameFormSchema>>({
    resolver: zodResolver(UserNameFormSchema),
    defaultValues: {
      username: "",
    },
  });

  async function handleSetUserName(data: z.infer<typeof UserNameFormSchema>) {
    try {
      const res = await updateUserName({ username: data.username });
      // for server side errors
      if (res.error && isFetchBaseQueryError(res.error)) {
        const serverError = res.error.data as ApiResponseType<UserData>;
        return toast.error(`Error:${serverError.message}`, {
          hideProgressBar: true,
          autoClose: 3000,
        });
      }

      // for client side errors
      if (res.error && !isFetchBaseQueryError(res.error)) {
        return toast.error("Error : Client side Error !");
      }

      // if user avatar is not set
      if (!res.data?.data.avatar_url) navigate("/login/set-avatar");
      else {
        dispatch(logInUser(res.data?.data._id));
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="w-1/3 px-4 py-12 border-2 rounded-lg  flex flex-col gap-4">
      <TypographyH2 className="text-center">Set Your Username</TypographyH2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSetUserName)}
          className="flex flex-col gap-8"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Set Your Username"
                    {...field}
                    type="text"
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant={"lightseagreen"} className="w-1/3">
            Save
          </Button>
        </form>
      </Form>
      {isLoading && <RingLoader />}
    </div>
  );
};

const SetAvatar = () => {
  const [updateUserAvatar, { isLoading }] = useUpdateUserAvatarMutation();
  const { navigate } = useOutletContext<SharedLoginPageContext>();
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<z.infer<typeof AvatarUploadSchema>>({
    resolver: zodResolver(AvatarUploadSchema),
  });

  async function handleSetAvatar(data: z.infer<typeof AvatarUploadSchema>) {
    const formData = new FormData();
    formData.append("file", data.file[0]);
    try {
      const res = await updateUserAvatar(formData);

      if (res.error && isFetchBaseQueryError(res.error)) {
        const serverError = res.error.data as ApiResponseType<UserData>;
        return toast.error(`Error:${serverError.message}`, {
          hideProgressBar: true,
          autoClose: 3000,
        });
      }

      // for client side errors
      if (res.error && !isFetchBaseQueryError(res.error)) {
        return toast.error("Error : Client side Error !");
      }

      if (res.data) {
        dispatch(logInUser(res.data?.data._id));
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="w-1/3 px-4 py-12 border-2 rounded-lg  flex flex-col gap-4">
      <TypographyH2 className="text-center">Set Avatar</TypographyH2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSetAvatar)}
          className="flex flex-col gap-8"
        >
          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Set Your Avatar"
                    {...form.register("file")}
                    required
                    type="file"
                  />
                </FormControl>
                <FormDescription>
                  This is your public display Avatar.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant={"lightseagreen"} className="w-1/3">
            Save
          </Button>
        </form>
      </Form>
      {isLoading && <RingLoader />}
    </div>
  );
};

const VerifyOtpAndLogin = () => {
  const { email, navigate } = useOutletContext<SharedLoginPageContext>();
  const [verifyEmailOtp, { isLoading }] = useVerifyEmailOtpMutation();
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<z.infer<typeof OtpFormSchema>>({
    resolver: zodResolver(OtpFormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof OtpFormSchema>) => {
    if (email === "")
      return toast("Email is required", {
        autoClose: 3000,
        hideProgressBar: true,
      });

    try {
      const res = await verifyEmailOtp({ email, password: data.pin });

      // for server side errors
      if (res.error && isFetchBaseQueryError(res.error)) {
        const serverError = res.error.data as ApiResponseType<UserData>;
        return toast.error(`Error:${serverError.message}`, {
          hideProgressBar: true,
          autoClose: 3000,
        });
      }

      // for client side errors
      if (res.error && !isFetchBaseQueryError(res.error)) {
        return toast.error("Error : Client side Error !");
      }

      // if username or avatar in not present in the response, then send user to the respective routes,
      if (!res.data?.data.username)
        navigate("/login/set-user-name"); //to set the username
      else if (!res.data?.data.avatar_url)
        navigate("/login/set-avatar"); //to set the avatar
      // and if username and avatar is present in the response then loginuser and send to the homepage.
      else {
        dispatch(logInUser(res.data?.data._id));
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onTimerEnd = () => {
    navigate("/login");
    toast.error("OTP Expired", { hideProgressBar: true, autoClose: 3000 });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col text-center gap-2">
        <TypographyH4>
          Please enter the One-Time Password to verify your account
        </TypographyH4>
        <TypographyLead>
          A One-Time Password is sent to <>{email}</>
        </TypographyLead>
      </div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="text-center mx-auto space-y-12 my-4 "
          >
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <div className="w-1/2 mx-auto">
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup className="w-full flex">
                          <InputOTPSlot index={0} className="flex-grow" />
                          <InputOTPSlot index={1} className="flex-grow" />
                          <InputOTPSlot index={2} className="flex-grow" />
                          <InputOTPSlot index={3} className="flex-grow" />
                          <InputOTPSlot index={4} className="flex-grow" />
                          <InputOTPSlot index={5} className="flex-grow" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your Email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" variant={"lightseagreen"}>
              Validate
            </Button>
          </form>
        </Form>
      </div>
      <div className="mx-auto">
        <CountDownTimer
          seconds={600}
          message="OTP Expires In"
          onTimerEnd={onTimerEnd}
        />
      </div>

      <Link to="/login" className="mx-auto">
        <Button variant={"link"} className="text-gray-500 cursor-pointer">
          <TypographyP className="text-muted-foreground">
            Entered Wrong Email
          </TypographyP>
        </Button>
      </Link>
      {isLoading && <RingLoader />}
    </div>
  );
};

export default LoginPage;
export { LoginHome, VerifyOtpAndLogin, SetUserName, SetAvatar };

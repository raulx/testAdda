/* eslint-disable react-refresh/only-export-components */
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
import { useSendEmailOtpMutation } from "@/store/store";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import Logo from "@/components/Logo";
import { FaDiscord } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link, Outlet, useNavigate, useOutletContext } from "react-router-dom";
import {
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

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
});

const otpFormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});
interface SharedEmailContext {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <Outlet context={{ email, setEmail }} />
    </div>
  );
};

const LoginComponent = () => {
  const [sendEmailOtp, results] = useSendEmailOtpMutation();

  const { setEmail } = useOutletContext<SharedEmailContext>();

  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
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

      if (res.error || res.data.statusCode >= 400)
        toast("Error Occured while logging In ! Please try again", {
          hideProgressBar: true,
          autoClose: 3000,
        });
      toast.success("Otp sent successfully", {
        hideProgressBar: true,
        autoClose: 3000,
      });
      setEmail(values.email);
      navigate("/login/verify-email");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <div className="flex flex-col gap-6 w-2/6 p-8 rounded-lg">
        <Logo large />
        <Button
          className="w-full flex gap-4 shadow-custom-2 py-6"
          variant={"outline"}
        >
          <FcGoogle className="text-3xl" />
          Continue With Google
        </Button>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              {results.isLoading ? <>Loading data</> : <>Continue</>}
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
    </div>
  );
};

const VerifyEmailComponent = () => {
  const { email } = useOutletContext<SharedEmailContext>();

  const navigate = useNavigate();
  const form = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      pin: "",
    },
  });

  function onSubmit(data: z.infer<typeof otpFormSchema>) {
    toast(
      <>
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          <code className="text-white">{email}</code>
        </pre>
      </>
    );
  }

  function onTimerEnd() {
    navigate("/login");
    toast("Otp Expired");
  }
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
                    Please enter the one-time password sent to your phone.
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
          seconds={20}
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
    </div>
  );
};

export default LoginPage;
export { LoginComponent, VerifyEmailComponent };

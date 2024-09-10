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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setAuthenticated, useSendEmailOtpMutation } from "@/store/store";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import Logo from "@/components/Logo";
import { FaDiscord } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
});

const LoginPage = () => {
  const [sendEmailOtp, results] = useSendEmailOtpMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      const res = await sendEmailOtp({
        email: values.email,
      });
      if (res.data) {
        dispatch(setAuthenticated());
      }
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-6 w-1/4  p-8 rounded-lg">
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
          <p className="text-center text-sm text-gray-500">OR</p>
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
          <Checkbox id="terms1" />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              By signing in to TestMagister,you agree with our
            </label>
            <p className="text-sm text-muted-foreground">
              <Link to="/terms-&-conditions">Terms & Conditions</Link> and{" "}
              <Link to="/privacy-policy">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;

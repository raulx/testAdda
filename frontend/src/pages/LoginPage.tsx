import { Button } from "@/components/ui/button";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebook } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { TypographyH2 } from "@/components/Typography";
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
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

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
    console.log(values.email);
    try {
      const res = await sendEmailOtp({
        email: values.email,
      });
      console.log(res);
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
                      placeholder="Enter your email address"
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" variant={"lightseagreen"}>
              {results.isLoading ? <>Loading data</> : <>Continue</>}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default LoginPage;

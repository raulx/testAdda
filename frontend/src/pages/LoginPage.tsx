import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TypographyH2 } from "@/components/Typography";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z
    .string()
    .min(6, { message: "Username must be at least 6 characters." }),
});

function LoginPage() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    console.log(values);
  }
  return (
    <div className="flex flex-col py-6 min-h-screen bg-zinc-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://res.cloudinary.com/dj5yf27lr/image/upload/v1725024672/testAdda/frontendAssets/qetoe2ngulol3glcemfx.png"
          alt="Your Company"
        />
        <TypographyH2 className="mt-4 text-center">
          Sign in to your account
        </TypographyH2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-2/6 bg-white  border-2 rounded-lg px-12 py-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>

        <div className="flex mt-8 gap-6 justify-center items-center">
          <hr className="h-[1px] w-full bg-gray-300" />
          <p className="w-full text-center text-sm">Or Continue with</p>
          <hr className="h-[1px] w-full bg-gray-300" />
        </div>
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button variant="outline" className="border-2 w-2/4">
            <FcGoogle className="mr-2 h-6 w-6" />
            Google
          </Button>
          <Button variant="outline" className="border-2 w-2/4">
            <FaFacebook className="mr-2 h-6 w-6 text-blue-700" />
            FaceBook
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

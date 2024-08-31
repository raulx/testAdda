import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { TypographyH1 } from "@/components/Typography";

function LoginPage() {
  return (
    <div className="flex flex-col py-6 min-h-screen bg-zinc-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://res.cloudinary.com/dj5yf27lr/image/upload/v1725024672/testAdda/frontendAssets/qetoe2ngulol3glcemfx.png"
          alt="Your Company"
        />
        <TypographyH1 className="mt-2 text-center">
          Sign in to your account
        </TypographyH1>
        {/* <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2> */}
      </div>

      <div className="mt-10 sm:mx-auto sm:w-2/6 bg-white  border-2 rounded-lg px-12 py-12">
        <form className="space-y-6" action="#" method="POST">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <div className="text-sm flex justify-end items-end mt-4">
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <Button className="w-full">Sign in</Button>
          </div>
        </form>

        <div className="flex mt-10 gap-6 justify-center items-center">
          <hr className="h-[1px] w-full bg-gray-300" />
          <p className="w-full text-center text-sm">Or Continue with</p>
          <hr className="h-[1px] w-full bg-gray-300" />
        </div>
        <div className="flex justify-center items-center gap-2 mt-10">
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
      {/* <p className="mt-10 text-center text-sm text-gray-500">
        Not a member?
        <a
          href="#"
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Start a 14 day free trial
        </a>
      </p> */}
    </div>
  );
}

export default LoginPage;

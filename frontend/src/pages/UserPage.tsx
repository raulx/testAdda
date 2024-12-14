import DisplayDate from "@/components/Date";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import UseGetUserDataHook from "@/hooks/UseGetUserDataHook";
import UseGetUserPass from "@/hooks/UseGetUserPass";
import { FaCircle, FaDotCircle } from "react-icons/fa";
import { RiPassValidFill } from "react-icons/ri";
import { Outlet } from "react-router-dom";

export const UserPageHome = () => {
  return <div>Welcome to user Page Home</div>;
};

export const UserPassPage = () => {
  const userPass = UseGetUserPass();

  const user = UseGetUserDataHook();
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-fit mx-auto mt-6 border-2 p-12 border-gray-200 rounded-lg  shadow-custom-2">
      <div className="flex justify-center items-center gap-4 w-2/4 mx-auto py-4 bg-green-600 text-white rounded-xl font-semibold shadow-custom-1">
        <RiPassValidFill className="text-2xl" />
        <span>Your Test Pass</span>
      </div>
      <div className="border-[2px] border-gray-300 w-full rounded-lg">
        <div className="flex relative w-full justify-center items-center text-xl text-darkcerulean p-4 font-bold">
          Monthly Pass
          <span className="absolute flex gap-2 items-center text-sm top-1/2 right-2 font-normal -translate-y-1/2">
            Status : Active <FaDotCircle className="text-green-400" />
          </span>
        </div>
        <hr className="bg-gray-300 h-[2px]" />
        <div className="min-h-[200px] w-full flex">
          <div className="grow flex justify-center items-center p-4">
            <div className="bg-green-600 text-white p-4 rounded-lg flex flex-col gap-2">
              <div className="text-center p-2 border border-white rounded-lg">
                Pass Holder's Name : {user.data?.username}
              </div>
              <div className="flex flex-col gap-1 items-center justify-center">
                <span>Amount Paid</span>
                <span className="font-bold text-2xl">
                  Rs {userPass.data?.amount_paid}
                </span>
              </div>
            </div>
          </div>
          <div className="grow flex justify-center items-center p-4">
            <div className="border-2 border-gray-400 text-darkcerulean flex flex-col gap-4 font-bold p-4 rounded-lg">
              <div>Payment Id : {userPass.data?.payment_id}</div>
              <div>Email : {userPass.data?.email}</div>
              <div>Pass _id : {userPass.data?._id}</div>
            </div>
          </div>
        </div>
        <hr className="bg-gray-300 h-[2px]" />

        <div className="flex justify-between items-center p-4 mt-4">
          <div className=" text-darkcerulean">
            <span className="font-bold border-b border-gray-400">
              Purchased On :
            </span>

            <span className=" text-sm">
              {DisplayDate({ dateString: userPass.data?.createdAt })}
            </span>
          </div>
          <div className="text-red-600">
            <span className="font-bold border-b border-red-600">
              Expires On :
            </span>

            <span className="text-sm">
              {DisplayDate({ dateString: userPass.data?.expires_in })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserPage = () => {
  return (
    <>
      <Navbar />
      <section className="w-screen min-h-screen">
        <Outlet />
      </section>
      <Footer />
    </>
  );
};

export default UserPage;

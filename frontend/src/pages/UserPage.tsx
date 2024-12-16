import DisplayDate from "@/components/Date";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import UseGetUserDataHook from "@/hooks/UseGetUserDataHook";
import UseGetUserPass from "@/hooks/UseGetUserPass";
import { FaCircle } from "react-icons/fa";
import { Outlet } from "react-router-dom";

export const UserPageHome = () => {
  return <div>Welcome to user Page Home</div>;
};

export const UserPassPage = () => {
  const userPass = UseGetUserPass();
  const user = UseGetUserDataHook();

  const validityStatus = (expiresIn: string): string => {
    const today = new Date();
    const expiryDate = new Date(expiresIn);

    const differenceInMilliSeconds = expiryDate.getTime() - today.getTime();
    const differenceInDays = Math.ceil(
      differenceInMilliSeconds / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays > 0) {
      return "Active";
    } else if (differenceInDays === 0) {
      return "Expires Today";
    } else {
      return "Expired";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-12 lg:w-fit w-full mx-auto mt-6  lg:p-12 p-2 rounded-lg">
      <div className="border-[2px] border-gray-300 w-full rounded-lg">
        <div className="flex relative w-full lg:justify-center justify-start items-center capitalize text-xl text-white rounded-t-lg p-4 font-bold bg-lightseagreen">
          {userPass.data?.validity_type} Pass
          <span className="absolute flex gap-2 font-bold items-center text-sm top-1/2 right-8  -translate-y-1/2">
            Status : {validityStatus(userPass.data.expires_in)}
          </span>
        </div>
        <hr className="bg-gray-300 h-[2px]" />
        <div className="min-h-[200px] w-full flex lg:flex-row flex-col">
          <div className="grow flex justify-center items-center p-4">
            <div className="p-4 rounded-lg flex flex-col gap-2">
              <div className="text-center p-4 border border-white rounded-lg flex justify-center items-center gap-2 flex-col font-bold px-8 text-2xl">
                <span className="text-lg capitalize">
                  Name : {user.data?.username}
                </span>
              </div>
              <div className="flex flex-col gap-1 items-center justify-center">
                <span>Amount Paid</span>
                <span className="font-bold text-3xl">
                  Rs {userPass.data?.amount_paid}
                </span>
              </div>
            </div>
          </div>
          <div className="grow flex justify-center items-center p-4">
            <div className="border-2  flex flex-col gap-4 font-bold p-4 rounded-lg">
              <div>Payment Id : {userPass.data?.payment_id}</div>
              <div>Email : {userPass.data?.email}</div>
              <div>Pass _id : {userPass.data?._id}</div>
            </div>
          </div>
        </div>
        <hr className="bg-gray-300 h-[2px]" />

        <div className="flex justify-between items-center p-4 mt-4">
          <div className="text-darkcerulean">
            <span className="font-bold border-b border-gray-400">
              Purchased On :
            </span>

            <span className="text-sm mt-4">
              {DisplayDate({ dateString: userPass.data?.createdAt })}
            </span>
          </div>
          <div>
            <span className="font-bold border-b border-gray-400">
              Expires On :
            </span>

            <span className="text-sm mt-4">
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

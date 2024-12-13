import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

export const UserPageHome = () => {
  return <div>Welcome to user Page Home</div>;
};

export const UserPassPage = () => {
  const pass = useSelector((store: RootState) => {
    return store.userpass;
  });
  return (
    <div className="flex flex-col gap-4 w-1/3 mx-auto mt-6 border-2 border-gray-200 rounded-lg p-4">
      <span>Id : {pass.data._id}</span>
      <span>paymentId : {pass.data.payment_id}</span>
      <span>Amount paid : {pass.data.amount_paid}</span>
      <span>Email : {pass.data.email}</span>
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

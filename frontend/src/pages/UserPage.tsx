import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export const UserPageHome = () => {
  return <div>Welcome to user Page Home</div>;
};

export const UserPassPage = () => {
  return <div>This is your pass</div>;
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

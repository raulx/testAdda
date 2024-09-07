import { useState } from "react";
import { Button } from "./ui/button";
import { MdQuiz } from "react-icons/md";
import { SiMockserviceworker } from "react-icons/si";
import { IoNewspaper } from "react-icons/io5";
import { RiLoginCircleFill, RiTeamFill } from "react-icons/ri";
import { useLocation } from "react-router-dom";
import Headroom from "react-headroom";
import { FaHamburger, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

const DesktopNav = () => {
  const currentPath = useLocation().pathname.split("/").slice(0, 2).join("/");
  return (
    <nav className=" border-b border-bordergray py-6 px-8 flex justify-between items-center bg-white">
      <div className="flex justify-center items-center gap-4">
        <img
          className="lg:w-[36px] lg:h-[36px] w-[32px] h-[32px]"
          src="https://res.cloudinary.com/dj5yf27lr/image/upload/v1725024672/testAdda/frontendAssets/qetoe2ngulol3glcemfx.png"
          alt="logo"
        />
        <span className="lg:text-xl text-lg tracking-wide font-bold font-montserrat text-lightseagreen">
          TestMagister
        </span>
      </div>
      <ul className="flex gap-10 items-center  text-darkcerulean">
        <li
          className={`cursor-pointer ${
            currentPath === "/" &&
            "font-bold scale-105 border-b border-darkcerulean"
          }`}
        >
          <a href="/" className="flex justify-center items-center gap-2 ">
            <MdQuiz /> <span className="lg:block hidden">Quizes</span>
          </a>
        </li>

        <li
          className={`cursor-pointer ${
            currentPath === "/mocks" &&
            " font-semibold scale-105 border-b border-darkcerulean"
          }`}
        >
          <a href="/mocks" className="flex justify-center items-center gap-2 ">
            <SiMockserviceworker />
            <span className="lg:block hidden">Mocks</span>
          </a>
        </li>

        <li
          className={`cursor-pointer ${
            currentPath === "/news" &&
            " font-semibold scale-105 border-b border-darkcerulean"
          }`}
        >
          <a href="/news" className="flex justify-center items-center gap-2 ">
            <IoNewspaper />
            <span className="lg:block hidden">News</span>
          </a>
        </li>
        <li
          className={`cursor-pointer ${
            currentPath === "/about-us" &&
            " font-semibold scale-105 border-b border-darkcerulean"
          }`}
        >
          <a
            href="/about-us"
            className="flex justify-center items-center gap-2 "
          >
            <RiTeamFill />
            <span className="lg:block hidden">About Us</span>
          </a>
        </li>
      </ul>
      <Button
        className="lg:w-[128px] lg:h-[32px] w-[120px] h-[30px] flex justify-center items-center gap-2"
        variant={"lightseagreen"}
      >
        <RiLoginCircleFill />
        Login
      </Button>
    </nav>
  );
};

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="w-screen  h-[56px] px-6 fixed bg-white border-b border-bordergray flex justify-between items-center">
        <div
          className=" text-darkcerulean text-xl"
          onClick={() => setIsOpen(true)}
        >
          <FaHamburger />
        </div>

        <Button
          className=" w-[120px] h-[30px] flex justify-center items-center gap-2"
          variant={"lightseagreen"}
        >
          <RiLoginCircleFill />
          Login
        </Button>
      </div>

      {/* Sidebar  */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "-5%" : "-100%" }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
        className={`w-3/4 bg-white absolute top-0 left-0 h-screen  flex flex-col items-center py-6`}
      >
        <div
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-8"
        >
          <FaTimes />
        </div>
        <div className="flex items-center gap-2 self-center border border-bordergray p-4 rounded-md my-6 border-opacity-60">
          <img
            src="https://res.cloudinary.com/dj5yf27lr/image/upload/v1725024672/testAdda/frontendAssets/qetoe2ngulol3glcemfx.png"
            className="w-[36px] h-[36px]"
          />
          <span className="tracking-wide text-lg font-bold font-montserrat text-lightseagreen">
            TestMagister
          </span>
        </div>
      </motion.div>
      <div className="w-screen h-[56px]" />
    </>
  );
};
const Navbar = () => {
  return (
    <>
      <Headroom>
        <div className="sm:block hidden">
          <DesktopNav />
        </div>
      </Headroom>
      <div className="sm:hidden block">
        <MobileNav />
      </div>
    </>
  );
};

export default Navbar;

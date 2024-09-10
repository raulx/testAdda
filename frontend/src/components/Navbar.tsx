import { ReactElement, useState } from "react";
import { Button } from "./ui/button";
import { MdQuiz } from "react-icons/md";
import { SiMockserviceworker } from "react-icons/si";
import { IoNewspaper } from "react-icons/io5";
import { RiLoginCircleFill, RiTeamFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import Headroom from "react-headroom";
import { FaHamburger, FaHome } from "react-icons/fa";
import { motion } from "framer-motion";
import Logo from "./Logo";

const navLinks: { name: string; url: string; icon: ReactElement }[] = [
  { name: "Home", url: "/", icon: <FaHome /> },
  { name: "Quizes", url: "/quizes", icon: <MdQuiz /> },
  { name: "Mocks", url: "/mocks", icon: <SiMockserviceworker /> },
  { name: "News", url: "/news", icon: <IoNewspaper /> },
  { name: "About Us", url: "/about-us", icon: <RiTeamFill /> },
];

const DesktopNav = ({ currentPath }: { currentPath: string }) => {
  return (
    <nav className="border-b border-bordergray py-4 px-8 flex justify-between items-center bg-white">
      <Logo />
      <ul className="flex gap-10 items-center  text-darkcerulean">
        {navLinks.map((link) => {
          return (
            <li
              key={link.name}
              className={`cursor-pointer ${
                currentPath === link.url &&
                "font-bold scale-105 border-b border-darkcerulean"
              }`}
            >
              <a
                href={link.url}
                className="flex justify-center items-center gap-2 "
              >
                {link.icon} <span className="lg:block hidden">{link.name}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <Link to="/login">
        <Button
          className="lg:w-[128px] lg:h-[32px] w-[120px] h-[30px] flex justify-center items-center gap-2"
          variant={"lightseagreen"}
        >
          <RiLoginCircleFill />
          Login
        </Button>
      </Link>
    </nav>
  );
};

const MobileNav = ({ currentPath }: { currentPath: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-screen z-10 cursor-pointer h-[56px] px-6 fixed bg-white border-b border-bordergray flex justify-between items-center">
        <div
          className=" text-darkcerulean text-xl"
          onClick={() => setIsOpen(true)}
        >
          <FaHamburger />
        </div>

        <Link to={"/login"}>
          <Button
            className=" w-[120px] h-[30px] flex justify-center items-center gap-2"
            variant={"lightseagreen"}
          >
            <RiLoginCircleFill />
            Login
          </Button>
        </Link>
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
        className={`w-3/4 bg-white top-0 left-0 h-screen fixed  flex flex-col py-2 items-center  z-10`}
      >
        {/* <div className="flex items-center gap-2 px-4 py-2 border border-bordergray rounded-xl shadow-md  border-opacity-60">
          <img
            src="https://res.cloudinary.com/dj5yf27lr/image/upload/v1725024672/testAdda/frontendAssets/qetoe2ngulol3glcemfx.png"
            className="w-[28px] h-[28px]"
          />
          <span className="tracking-wide  font-bold font-montserrat text-lightseagreen">
            TestMagister
          </span>
        </div> */}
        <Logo medium isBordered />
        <hr className="w-full my-2" />

        <ul className="flex flex-col my-6 gap-12 items-center  text-darkcerulean">
          {navLinks.map((link) => {
            return (
              <li
                key={link.name}
                className={`cursor-pointer ${
                  currentPath === link.url &&
                  "font-bold scale-105 border-b border-darkcerulean"
                }`}
              >
                <a
                  href={link.url}
                  className="flex justify-center items-center gap-2 "
                >
                  {link.icon} <span>{link.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </motion.div>

      {isOpen && (
        <div
          className="w-screen h-screen fixed left-0 top-0 bg-black opacity-25"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className="w-screen h-[56px]" />
    </>
  );
};

const Navbar = () => {
  const location = useLocation().pathname.split("/").slice(0, 2).join("/");
  return (
    <>
      <Headroom>
        <div className="sm:block hidden">
          <DesktopNav currentPath={location} />
        </div>
      </Headroom>
      <div className="sm:hidden block">
        <MobileNav currentPath={location} />
      </div>
    </>
  );
};

export default Navbar;

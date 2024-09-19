import { ReactElement, useState } from "react";
import { Button } from "./ui/button";
import { MdQuiz } from "react-icons/md";
import { SiMockserviceworker } from "react-icons/si";
import { IoNewspaper } from "react-icons/io5";
import { RiLoginCircleFill, RiTeamFill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import Headroom from "react-headroom";
import {
  FaCaretDown,
  FaCaretRight,
  FaChartLine,
  FaEdit,
  FaHamburger,
  FaHome,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { useDispatch } from "react-redux";
import { AppDispatch, logOutUser, useLogOutUserMutation } from "@/store/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { TbLogout, TbReport } from "react-icons/tb";
import RingLoader from "./RingLoader";
import UseGetUserDataHook from "@/hooks/UseGetUserDataHook";

const navLinks: { name: string; url: string; icon: ReactElement }[] = [
  { name: "Home", url: "/", icon: <FaHome /> },
  { name: "Quizes", url: "/quizes", icon: <MdQuiz /> },
  { name: "Mocks", url: "/mocks", icon: <SiMockserviceworker /> },
  { name: "News", url: "/news", icon: <IoNewspaper /> },
  { name: "About Us", url: "/about-us", icon: <RiTeamFill /> },
];

const ProfileMenu = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const user = UseGetUserDataHook();

  const [logoutUser, { isLoading }] = useLogOutUserMutation();

  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      const res = await logoutUser(null);
      if (res.data?.statusCode === 200) {
        dispatch(logOutUser());
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="sm:mr-8 mr-2">
        <DropdownMenu
          onOpenChange={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        >
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer  flex justify-center items-center gap-2">
              <Avatar>
                <AvatarImage src={user.data.avatar_url} />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <span className="text-darkcerulean hidden sm:block">Profile</span>
              {isProfileMenuOpen ? (
                <FaCaretDown className="text-sm" />
              ) : (
                <FaCaretRight className="text-sm" />
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-xl  text-darkcerulean p-2">
            <DropdownMenuGroup className="flex flex-col gap-2">
              <DropdownMenuItem className="flex gap-2">
                <TbReport className="text-xl" /> <span>My Attempts</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-2">
                <FaChartLine className="text-xl" />
                <span>Analysis</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-2">
                <FaEdit className="text-xl" />
                <span>Edit Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className=" flex gap-2 text-orange-600"
                onClick={handleLogout}
              >
                <TbLogout className="text-xl" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isLoading && <RingLoader />}
    </>
  );
};

const DesktopNav = ({ currentPath }: { currentPath: string }) => {
  const user = UseGetUserDataHook();
  return (
    <nav className="border-b w-screen border-bordergray py-4 px-8 flex justify-between items-center bg-white">
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
      {user.data._id ? (
        <ProfileMenu />
      ) : (
        <Link to="/login">
          <Button
            className="lg:w-[128px] lg:h-[32px] w-[120px] h-[30px] flex justify-center items-center gap-2"
            variant={"lightseagreen"}
          >
            <RiLoginCircleFill />
            Login
          </Button>
        </Link>
      )}
    </nav>
  );
};

const MobileNav = ({ currentPath }: { currentPath: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const user = UseGetUserDataHook();

  return (
    <>
      <div className="w-screen z-10 cursor-pointer h-[56px] px-6 fixed bg-white border-b border-bordergray flex justify-between items-center">
        <div
          className=" text-darkcerulean text-xl"
          onClick={() => setIsOpen(true)}
        >
          <FaHamburger />
        </div>
        {user.data._id ? (
          <ProfileMenu />
        ) : (
          <Link to={"/login"}>
            <Button
              className=" w-[120px] h-[30px] flex justify-center items-center gap-2"
              variant={"lightseagreen"}
            >
              <RiLoginCircleFill />
              Login
            </Button>
          </Link>
        )}
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

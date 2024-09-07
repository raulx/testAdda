import { Button } from "./ui/button";
import { MdQuiz } from "react-icons/md";
import { SiMockserviceworker } from "react-icons/si";
import { IoNewspaper } from "react-icons/io5";
import { RiLoginCircleFill, RiTeamFill } from "react-icons/ri";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const currentPath = useLocation().pathname.split("/").slice(0, 2).join("/");

  return (
    <nav className="position-fixed border-b border-bordergray py-4 px-8 flex justify-between items-center bg-white">
      <div className="flex justify-center items-center gap-4">
        <img
          className="w-[36px] h-[36px]"
          src="https://res.cloudinary.com/dj5yf27lr/image/upload/v1725024672/testAdda/frontendAssets/qetoe2ngulol3glcemfx.png"
          alt="logo"
        />
        <span className="text-xl tracking-wide font-bold font-montserrat text-lightseagreen">
          TestMagister
        </span>
      </div>
      <ul className="flex gap-8 items-center  text-darkcerulean">
        <li
          className={`cursor-pointer ${
            currentPath === "/" &&
            "font-bold scale-105 border-b border-darkcerulean"
          }`}
        >
          <a href="/" className="flex justify-center items-center gap-2 ">
            <MdQuiz /> Quizes
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
            Mocks
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
            News
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
            About Us
          </a>
        </li>
      </ul>
      <Button
        className="w-[128px] h-[32px] flex justify-center items-center gap-2"
        variant={"lightseagreen"}
      >
        <RiLoginCircleFill />
        Login
      </Button>
    </nav>
  );
};

export default Navbar;

import classNames from "classnames";

const Logo = ({
  small,
  medium,
  large,
  isBordered,
}: {
  small?: boolean;
  medium?: boolean;
  large?: boolean;
  isBordered?: boolean;
}) => {
  const logoClasses = classNames("lg:w-[36px] lg:h-[36px] w-[32px] h-[32px]", {
    "lg:w-[24px] lg:h-[24px] w-[20px] h-[20px]": small,
    "lg:w-[30px] lg:h-[30px] w-[26px] h-[26px]": medium,
    "lg:w-[48px] lg:h-[48px] w-[38px] h-[38px]": large,
  });

  const textClasses = classNames(
    "lg:text-xl text-lg tracking-wide font-bold font-montserrat text-lightseagreen",
    {
      " lg:text-base text-sm": small,
      "lg:text-lg text-base": medium,
      "lg:text-2xl text-xl": large,
    }
  );

  return (
    <div
      className={`flex justify-center items-center gap-4 ${
        isBordered &&
        "px-4 py-2 border border-bordergray rounded-xl shadow-md  border-opacity-60"
      }`}
    >
      <img
        className={logoClasses}
        src="https://res.cloudinary.com/dj5yf27lr/image/upload/v1725024672/testAdda/frontendAssets/qetoe2ngulol3glcemfx.png"
        alt="logo"
      />
      <span className={textClasses}>TestMagister</span>
    </div>
  );
};

export default Logo;

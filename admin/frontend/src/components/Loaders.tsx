import { ClassAttributes, HTMLAttributes } from "react";
import { JSX } from "react/jsx-runtime";

const Loader1 = (
  props: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLSpanElement> &
    HTMLAttributes<HTMLSpanElement>
) => {
  return <span {...props}></span>;
};

export { Loader1 };

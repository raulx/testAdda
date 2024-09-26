import { ColorRing } from "react-loader-spinner";

export const DoubleRingLoader = () => {
  return <span className="double-ring-loader"></span>;
};

export const RingCutLoader = () => {
  return <div className="ring-cut-loader"></div>;
};

export const RingLoader = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-900 opacity-50 absolute top-0 left-0">
      <ColorRing />
    </div>
  );
};

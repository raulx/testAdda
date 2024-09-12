import { ColorRing } from "react-loader-spinner";

function RingLoader() {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-900 opacity-50 absolute top-0 left-0">
      <ColorRing />
    </div>
  );
}

export default RingLoader;

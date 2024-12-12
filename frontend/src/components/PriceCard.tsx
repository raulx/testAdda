import { PriceCardType } from "@/utils/types";

interface PriceCardPropType extends PriceCardType {
  paymentHandlerFunction: (amount: number) => void;
}

const PriceCard = (props: PriceCardPropType) => {
  return (
    <div className="border-2  border-gray-200 rounded-3xl w-72 shadow-sm flex flex-col gap-8 shadow-gray-200">
      <div
        className="flex text-xl justify-center items-center py-4 rounded-t-3xl"
        style={{
          color: `${props.foreground}`,
          backgroundColor: `${props.background}`,
        }}
      >
        {props.plan} Plan
      </div>
      <div className="flex flex-col w-2/3 mx-auto gap-4 items-center">
        <div className="text-5xl" style={{ color: `${props.foreground}` }}>
          {props.icon}
        </div>

        <span className="text-gray-400">From</span>
        <p className="text-4xl" style={{ color: `${props.foreground}` }}>
          Rs {props.amount}/<span className="text-sm">{props.per}</span>
        </p>
        <span className=" text-gray-400">Per Account</span>
      </div>
      <button
        onClick={() => props.paymentHandlerFunction(props.amount)}
        className="w-2/3 mx-auto px-6 py-4 rounded-xl mb-4 text-lg"
        style={{
          color: `${props.foreground}`,
          backgroundColor: `${props.background}`,
        }}
      >
        Get It Now
      </button>
    </div>
  );
};

export default PriceCard;

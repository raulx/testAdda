import {
  FaLightbulb,
  FaLock,
  FaRocket,
  FaSpinner,
  FaTimes,
  FaTrophy,
} from "react-icons/fa";
import { Button } from "./ui/button";
import { createRoot } from "react-dom/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "./ui/card";
import { PriceCardType, TestData, TestQuestionsType } from "@/utils/types";
import store, {
  useCreateOrderMutation,
  useGetResultMutation,
  useVerifyAndSettlePaymentMutation,
} from "@/store/store";
import { AttemptWindow } from "@/pages/AttemptWindow";
import { Provider } from "react-redux";
import UseGetUserDataHook from "@/hooks/UseGetUserDataHook";
import { TbReportAnalytics } from "react-icons/tb";
import { RxResume } from "react-icons/rx";
import Modal from "react-modal";
import DisplayDate from "./Date";
import { useState } from "react";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { PaymentResponseType } from "@/store/store";
import { RiPassPendingFill } from "react-icons/ri";
import PriceCard from "./PriceCard";
import { MdDiamond } from "react-icons/md";
import { BsDropletHalf, BsRocketTakeoff } from "react-icons/bs";

Modal.setAppElement("#root");

const priceCards: PriceCardType[] = [
  {
    icon: <BsRocketTakeoff />,
    background: "#CAF7F0",
    foreground: "#5BBFAA",
    plan: "Monthly",
    per: "month",
    amount: 79,
  },
  {
    icon: <BsDropletHalf />,
    background: "#FCCECB",
    foreground: "#BD381C",
    plan: "Half Yearly",
    per: "6 month",
    amount: 349,
  },
  {
    icon: <MdDiamond />,
    background: "#D6F1FF",
    foreground: "#0368DC",
    plan: "Yearly",
    per: "year",
    amount: 599,
  },
];

const openTestInNewWindow = (title: string, _id: string) => {
  // Get the screen width and height
  const screenWidth = window.screen.width - 20;
  const screenHeight = window.screen.height;

  // Open a new window with full width and height of the screen
  const testWindow = window.open(
    "",
    "_blank",
    `width=${screenWidth},height=${screenHeight},top=4,left=0`
  );

  if (testWindow) {
    testWindow.document.title = title;
    testWindow.document.body.style.margin = "0";
    testWindow.document.body.style.overflow = "hidden"; // Remove scrollbars

    // Inject the Tailwind CSS into the new window

    const tailwindLink = testWindow.document.createElement("link");
    tailwindLink.rel = "stylesheet";
    tailwindLink.href = "/tailwind.css";
    testWindow.document.head.appendChild(tailwindLink);

    // Create a div element where React can render the component
    const testDiv = testWindow.document.createElement("div");
    testWindow.document.body.appendChild(testDiv);

    // Apply CSS to make the div fill the entire window
    testDiv.style.width = "100%";
    testDiv.style.height = "100vh";

    // Render the React component into the new window
    const root = createRoot(testDiv);
    root.render(
      <Provider store={store}>
        <AttemptWindow windowRef={testWindow} testId={_id} />
      </Provider>
    );

    // Unmount component when the new window is closed or refreshed
    testWindow.addEventListener("beforeunload", () => {
      setTimeout(() => {
        root.unmount();
        // window.location.reload();
      }, 0); // Delay the unmount to ensure it's after render cycle
    });
  }
};

const TestCard = (props: TestData<string | TestQuestionsType>) => {
  const user = UseGetUserDataHook();

  const [getResult, { data, isLoading: fetchingResult }] =
    useGetResultMutation();

  const { Razorpay } = useRazorpay();

  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();

  const [verifyAndSettlePayment, { isLoading: settlingPayment }] =
    useVerifyAndSettlePaymentMutation();

  const handleQuizStart = (_id: string, title: string) => {
    openTestInNewWindow(title, _id);
  };

  const [isReportOpen, setIsReportOpen] = useState(false);

  const [subscriptionModel, setSubscriptionModal] = useState(false);

  const testAttempted = user.data.test_attempted.find(
    (test) => test.id === props._id
  );

  const afterOpenReportModel = async () => {
    await getResult({ quizId: props._id, userId: user.data._id });
  };

  const handlePaymentSettlement = async (
    response: PaymentResponseType,
    amount: number
  ) => {
    try {
      const res = await verifyAndSettlePayment({ ...response, amount });
      console.log(res);
      if (res.data) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaymentInitiate = async (amount: number) => {
    try {
      const order = await createOrder(amount);

      if (order.data?.data.id) {
        const options: RazorpayOrderOptions = {
          key: "rzp_test_zyjprUgnuGfIch",
          amount: order.data?.data.amount, // Amount in paise
          currency: "INR",
          name: "TestMagister",
          description: "Subscription",
          order_id: order.data?.data.id, // Generate order_id on server
          handler: (response) => {
            handlePaymentSettlement(response, amount);
          },
          prefill: {
            name: user.data.username,
            email: user.data.email,
          },
          theme: {
            color: "#38A3A5",
          },
        };
        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Card className="w-[400px] min-h-[280px] rounded-2xl  py-2 border border-bordergray flex flex-col justify-between">
        <CardHeader className="flex flex-col gap-4">
          <CardTitle className="text-darkcerulean">{props.title}</CardTitle>
          <CardDescription className="text-darkcerulean">
            {props.description}
          </CardDescription>
        </CardHeader>
        <CardContent>Difficulty Level : {props.difficulty_level}</CardContent>
        <CardFooter>
          <div className="flex justify-between w-full items-center gap-4 text-sm">
            {testAttempted ? (
              <>
                <div>
                  <span className="font-bold border-b border-black">
                    Attempted On
                  </span>
                  <DisplayDate dateString={testAttempted.attempted_on} />
                </div>
                <Button
                  className="flex gap-2 text-sm"
                  variant={"lightseagreen"}
                  size={"sm"}
                  onClick={() => setIsReportOpen(true)}
                >
                  <TbReportAnalytics />
                  View Report
                </Button>
              </>
            ) : (
              <>
                <p>Questions : {props.questions.length}</p>
                <p>Duration : {Math.floor(props.duration / 60)}min</p>
                {user.data.paused_tests.includes(props._id) ? (
                  <Button
                    variant={"lightseagreen"}
                    className="flex gap-2 items-center justify-center"
                    onClick={() => handleQuizStart(props._id, props.title)}
                  >
                    Resume
                    <RxResume className="text-xl" />
                  </Button>
                ) : (
                  <>
                    {props.access_type === "paid" &&
                    !user.data?.is_subscribed ? (
                      <>
                        <Button
                          variant={"lightseagreen"}
                          className="flex gap-2"
                          onClick={() => setSubscriptionModal(true)}
                        >
                          <FaLock /> Unlock
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant={"lightseagreen"}
                          className="flex gap-2"
                          onClick={() =>
                            handleQuizStart(props._id, props.title)
                          }
                        >
                          <FaRocket /> Start
                        </Button>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Report Modal  */}
      <Modal
        isOpen={isReportOpen}
        onAfterOpen={afterOpenReportModel}
        onRequestClose={() => setIsReportOpen(false)}
        className="bg-white p-6 rounded-2xl shadow-lg max-w-lg mx-auto my-10 relative flex flex-col gap-6 w-[28rem] border-[#555555] border"
        overlayClassName="fixed w-screen h-screen inset-0 bg-black bg-opacity-30 flex justify-center items-center"
      >
        {fetchingResult ? (
          <div className="h-96 flex justify-center items-center">
            <FaSpinner className="text-3xl animate-spin" />
          </div>
        ) : (
          <>
            <div className="text-2xl text-center mb-4 tracking-widest font-montserrat flex items-center justify-center gap-2">
              <span className="uppercase font-semibold border-b border-black">
                Standings
              </span>
              <FaTrophy className="text-[#eed03c] text-4xl" />
            </div>
            <div className="mx-auto p-4 rounded-2xl border border-[#9A4D45] text-2xl">
              <p>
                Rank : {data?.data.standing.current_rank}/
                {data?.data.standing.out_of}
              </p>
              <p>Percentile : {data?.data.percentile_obtained}</p>
            </div>
            <div className="p-4 bg-jetstream text-lg flex flex-col gap-2 rounded-2xl border border-[#555555]">
              <p className="font-semibold text-[#22577A]">
                Attempted :
                {data?.data.report.length - data?.data.result.unattempted}/
                {data?.data.report.length}
              </p>
              <p className="font-semibold text-[#22577A]">
                Marks Obtained : {data?.data.result.marks_obtained}
              </p>
              <div className="flex gap-4">
                <span className="text-[#3AA074]">
                  Correct : {data?.data.result.correct}/
                  {data?.data.report.length}
                </span>
                <span className="text-[#9A4D45]">
                  Wrong : {data?.data.result.wrong}/{data?.data.report.length}
                </span>
              </div>
            </div>
            <Button
              className="mx-auto rounded-full text-lg flex gap-2 border border-bordergray bg-[#F5F5F5] text-black hover:bg-slate-100"
              size={"lg"}
              onClick={() => {
                window.open(
                  `/tests/solutions/${props._id}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              Solution
              <FaLightbulb className="text-[#eed03c]" />
            </Button>
            <button
              onClick={() => setIsReportOpen(false)}
              className="absolute right-2 top-2 "
            >
              <FaTimes />
            </button>
          </>
        )}
      </Modal>

      {/* Subscription Modal  */}
      <Modal
        isOpen={subscriptionModel}
        onRequestClose={() => setSubscriptionModal(false)}
        className="bg-white rounded-lg  lg:w-auto lg:h-auto h-[80%]  w-11/12 mx-auto lg:overflow-hidden overflow-y-scroll overflow-x-hidden scrollbar-thin"
        overlayClassName="fixed w-screen h-screen bg-black inset-0  bg-opacity-30 flex justify-center items-center"
      >
        <div className="relative p-12 flex flex-col gap-4">
          <div className="max-w-fit mx-auto flex items-center gap-2 text-xl text-lightseagreen justify-center border-b border-gray-300 p-2">
            <span>Get Pass</span> <RiPassPendingFill className="text-4xl" />
          </div>
          <hr className="h-[1px] bg-gray-400 " />
          <div className="flex gap-8 m-4 flex-wrap justify-center">
            {priceCards.map((d) => {
              return (
                <PriceCard
                  key={d.plan}
                  amount={d.amount}
                  background={d.background}
                  foreground={d.foreground}
                  paymentHandlerFunction={handlePaymentInitiate}
                  icon={d.icon}
                  plan={d.plan}
                  per={d.per}
                />
              );
            })}
          </div>

          <button
            onClick={() => setSubscriptionModal(false)}
            className="absolute right-2 top-2 "
          >
            <FaTimes />
          </button>
          {creatingOrder || settlingPayment ? (
            <div className="absolute  h-full w-full left-0 top-0 flex justify-center items-center">
              {/* <FaSpinner className="animate-spin text-3xl " /> */}
              <div className="z-20 opacity-100 text-white text-2xl p-4 bg-lightseagreen flex flex-col gap-4 justify-center items-center rounded-full">
                <FaSpinner className="animate-spin text-3xl text-white " />
              </div>
              <div className="h-full w-full bg-black opacity-10 absolute left-0 top-0 z-10" />
            </div>
          ) : null}
        </div>
      </Modal>
    </>
  );
};

export default TestCard;

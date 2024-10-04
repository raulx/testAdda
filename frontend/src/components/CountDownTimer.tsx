import { SetStateAction, useEffect } from "react";

const CountDownTimer = ({
  message,
  className,
  onTimerEnd,
  time,
  setTime,
}: {
  message?: string;
  // seconds: number;
  className?: string;
  time: number;
  setTime: React.Dispatch<SetStateAction<number>>;
  onTimerEnd: () => void;
}) => {
  // const [time, setTime] = useState(seconds);
  const timerEnded = time === 0;

  useEffect(() => {
    if (timerEnded) {
      onTimerEnd();
    }
  }, [timerEnded]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : prevTime));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [setTime]);

  return (
    <div className={className}>
      <p>
        {message} {message && <>:</>} {`${Math.floor(time / 60)}`}:
        {time % 60 < 10 ? `0${time % 60}` : `${time % 60}`}
      </p>
    </div>
  );
};

export default CountDownTimer;

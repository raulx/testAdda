import { useEffect, useState } from "react";

const CountDownTimer = ({
  message,
  seconds,
  className,
  onTimerEnd,
}: {
  message: string;
  seconds: number;
  className?: string;
  onTimerEnd: () => void;
}) => {
  const [time, setTime] = useState(seconds);
  const timerEnded = time === 0;

  useEffect(() => {
    if (timerEnded) {
      onTimerEnd();
    }
  }, [timerEnded, onTimerEnd]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : prevTime));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={className}>
      <p>
        {message}: {`${Math.floor(time / 60)}`}:{`${time % 60}`}
      </p>
    </div>
  );
};

export default CountDownTimer;

import { useEffect, useState } from "react";

const CountDownTimer = ({
  message,
  seconds,
  onTimerEnd,
}: {
  message: string;
  seconds: number;
  onTimerEnd: () => void;
}) => {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((time) => {
        if (time === 0) {
          onTimerEnd();
          clearInterval(timer);
          return 0;
        } else return time - 1;
      });
    }, 1000);
  }, [onTimerEnd]);

  return (
    <div className="App">
      <p>
        {message}: {`${Math.floor(time / 60)}`}:{`${time % 60}`}
      </p>
    </div>
  );
};

export default CountDownTimer;

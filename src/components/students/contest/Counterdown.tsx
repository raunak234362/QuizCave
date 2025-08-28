/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

interface CounterdownProps {
  duration: number; // Duration in minutes
  onCountdownEnd: () => void;
}

export const Counterdown: React.FC<CounterdownProps> = ({
  duration,
  onCountdownEnd,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onCountdownEnd();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onCountdownEnd]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  const isLessThanTwoMinutes = timeLeft < 120;

  return (
    <div
      className={`countdown font-mono text-2xl p-4 rounded-lg flex justify-center items-center gap-2 ${
        isLessThanTwoMinutes
          ? "bg-red-600 text-white"
          : "bg-gray-800 text-green-300"
      }`}
    >
      <span className={`${isLessThanTwoMinutes ? "animate-pulse" : ""}`}>
        {hours.toString().padStart(2, "0")}
      </span>
      :
      <span className={`${isLessThanTwoMinutes ? "animate-pulse" : ""}`}>
        {minutes.toString().padStart(2, "0")}
      </span>
      :
      <span className={`${isLessThanTwoMinutes ? "animate-pulse" : ""}`}>
        {seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};

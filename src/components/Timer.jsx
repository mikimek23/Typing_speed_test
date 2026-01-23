import React, { useEffect, useState } from 'react'

export const Timer = ({ isRunning, mode = "Timed(60s)",onTimeChange}) => {
  const [time, setTime] = useState(
    mode === "Timed(60s)" ? 60 : 0
  );

  // Reset timer when mode or duration changes
  useEffect(() => {
    const initial = mode === "Timed(60s)" ? 60 : 0;
    setTime(initial)
  }, [mode]);

  useEffect(() => {
    if (!isRunning) return;

    // Stop countdown at 0
    if (mode === "Timed(60s)" && time === 0) return;

    const interval = setInterval(() => {
      setTime(prev => {
        const next =
          mode === "Timed(60s)" ? prev - 1 : prev + 1;

        onTimeChange?.(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="font-sora font-bold">
      {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
};

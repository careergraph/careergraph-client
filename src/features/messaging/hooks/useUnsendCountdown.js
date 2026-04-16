import { useEffect, useMemo, useState } from "react";

const UNSEND_WINDOW_SECONDS = 60;

const computeSecondsLeft = (createdAt) => {
  const createdTime = new Date(createdAt).getTime();
  if (Number.isNaN(createdTime)) {
    return 0;
  }

  const elapsed = Math.floor((Date.now() - createdTime) / 1000);
  return Math.max(0, UNSEND_WINDOW_SECONDS - elapsed);
};

export const useUnsendCountdown = (createdAt) => {
  const [secondsLeft, setSecondsLeft] = useState(() => computeSecondsLeft(createdAt));

  useEffect(() => {
    setSecondsLeft(computeSecondsLeft(createdAt));
  }, [createdAt]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [secondsLeft]);

  return useMemo(
    () => ({
      secondsLeft,
      canUnsend: secondsLeft > 0,
      urgent: secondsLeft > 0 && secondsLeft < 10,
    }),
    [secondsLeft]
  );
};

export default useUnsendCountdown;

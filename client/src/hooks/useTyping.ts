import { useEffect, useState } from 'react';

export const useTyping = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [pressedKey, setPressedKey] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const startTyping = () => {
    setPressedKey(true);
    setCountdown(5);
    setIsTyping(true);
  };

  const stopTyping = () => {
    setPressedKey(false);
  };

  const cancelTyping = () => {
    setCountdown(0);
  };

  useEffect(() => {
    let interval: any;
    if (!pressedKey) {
      interval = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (pressedKey || countdown === 0) {
      clearInterval(interval);
    }

    if (countdown === 0) {
      setIsTyping(false);
    }

    return () => clearInterval(interval);
  }, [pressedKey, countdown]);

  return { isTyping, startTyping, stopTyping, cancelTyping };
};

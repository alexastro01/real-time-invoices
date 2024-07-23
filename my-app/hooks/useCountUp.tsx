import { useState, useEffect } from 'react';

const useCountUp = (start: number, end: number, duration: number) => {
  const [current, setCurrent] = useState(start);

  useEffect(() => {
    const step = (end - start) / (duration / 10); // Update every 10ms
    let value = start;
    const timer = setInterval(() => {
      value += step;
      if (value >= end) {
        clearInterval(timer);
        setCurrent(end);
      } else {
        setCurrent(value);
      }
    }, 10);

    return () => clearInterval(timer);
  }, [start, end, duration]);

  return current;
};

export default useCountUp;
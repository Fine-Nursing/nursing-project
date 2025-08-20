import { useState, useEffect } from 'react';

export function useAutoRotate(maxIndex: number, interval: number) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (maxIndex === 0) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % maxIndex);
    }, interval);
    
    return () => clearInterval(timer);
  }, [maxIndex, interval]);

  return currentIndex;
}
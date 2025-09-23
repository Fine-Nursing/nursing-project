import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint: number = 768) => {
  // Check if window is defined (client side) and get initial state
  const getInitialState = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < breakpoint;
    }
    return false;
  };

  const [isMobile, setIsMobile] = useState(getInitialState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true
    setMounted(true);

    const checkIsMobile = () => {
      const mobile = window.innerWidth < breakpoint;
      setIsMobile(mobile);
    };

    // Initial check after mount
    checkIsMobile();

    // Add resize event listener
    const handleResize = () => {
      checkIsMobile();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  // During SSR or before mount, return false to avoid hydration mismatch
  // But after mount, return the actual state
  return mounted ? isMobile : false;
};

export default useIsMobile;
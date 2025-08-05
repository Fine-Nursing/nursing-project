import { useState, useEffect } from 'react';

const useIsMobile = (breakpoint: number = 768) => {
  // 초기값은 항상 false로 설정하여 서버와 클라이언트가 동일하게 시작
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkIsMobile = () => {
      const mobile = window.innerWidth < breakpoint;
      // eslint-disable-next-line no-console
      console.log(`useIsMobile: width=${window.innerWidth}, breakpoint=${breakpoint}, isMobile=${mobile}`);
      setIsMobile(mobile);
    };

    // 초기 체크
    checkIsMobile();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [breakpoint]);

  // 마운트되지 않았을 때는 false 반환 (SSR 대응)
  if (!mounted) {
    return false;
  }

  return isMobile;
};

export default useIsMobile;
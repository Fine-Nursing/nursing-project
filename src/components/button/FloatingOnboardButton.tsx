import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Rocket, User } from 'lucide-react';

interface FloatingOnboardButtonProps {
  onClick?: () => void; // 선택적 onClick 함수 타입 정의
  isCompleted?: boolean; // 온보딩 완료 여부
}

function FloatingOnboardButton({ onClick, isCompleted = false }: FloatingOnboardButtonProps) {
  const { scrollY } = useScroll();
  const [buttonRect, setButtonRect] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      const button = document.getElementById('onboarding-button');
      if (button) {
        const rect = button.getBoundingClientRect();
        // 모바일에서는 더 오른쪽으로 (16px), 데스크톱에서는 24px
        const rightMargin = window.innerWidth < 768 ? 16 : 24;
        const endX = window.innerWidth - rect.width - rightMargin;
        const endY = Math.min(
          window.innerHeight - rect.height - 24, // 24px from bottom
          window.innerHeight * 0.9 // max 90% of viewport height
        );
        setButtonRect({
          x: endX - rect.left,
          y: endY - rect.top,
        });
      }
    };

    // Initial position calculation
    updatePosition();

    // Update position on resize
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  const yRange = [0, 200];

  // Size and shape transitions
  const width = useTransform(scrollY, yRange, [200, 56]);
  const height = useTransform(scrollY, yRange, [48, 56]);
  const borderRadius = useTransform(scrollY, yRange, [8, 28]);

  // Position transitions
  const x = useTransform(scrollY, yRange, [0, buttonRect.x]);
  const y = useTransform(scrollY, yRange, [0, buttonRect.y]);

  // Content transitions
  const textOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const iconOpacity = useTransform(scrollY, [100, 200], [0, 1]);

  return (
    <motion.button
      id="onboarding-button"
      style={{
        width,
        height,
        borderRadius,
        x,
        y,
      }}
      className="
        fixed
        bg-purple-600 hover:bg-purple-700 
        text-white font-medium 
        shadow-lg hover:shadow-xl
        z-50
      "
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick} // onClick prop 추가
    >
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute inset-0 flex items-center justify-center gap-2 whitespace-nowrap"
      >
        <span>{isCompleted ? 'View My Profile' : 'Start Onboarding'}</span>
        <ArrowRight className="w-4 h-4" />
      </motion.div>

      <motion.div
        style={{ opacity: iconOpacity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {isCompleted ? <User className="w-6 h-6" /> : <Rocket className="w-6 h-6" />}
      </motion.div>
    </motion.button>
  );
}

export default FloatingOnboardButton;

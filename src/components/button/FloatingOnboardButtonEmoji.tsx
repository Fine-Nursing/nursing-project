import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FloatingOnboardButtonProps {
  onClick?: () => void;
  isCompleted?: boolean;
}

function FloatingOnboardButtonEmoji({ onClick, isCompleted = false }: FloatingOnboardButtonProps) {
  const { scrollY } = useScroll();
  const [buttonRect, setButtonRect] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasScrolledDown, setHasScrolledDown] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      const button = document.getElementById('onboarding-button');
      if (button) {
        const rect = button.getBoundingClientRect();
        const rightMargin = window.innerWidth < 768 ? 16 : 24;
        const endX = window.innerWidth - rect.width - rightMargin;
        const endY = Math.min(
          window.innerHeight - rect.height - 24,
          window.innerHeight * 0.9
        );
        setButtonRect({
          x: endX - rect.left,
          y: endY - rect.top,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  // Track scroll to show tooltip after first scroll
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      if (latest > 150 && !hasScrolledDown) {
        setHasScrolledDown(true);
        // Show tooltip after animation completes
        setTimeout(() => setShowTooltip(true), 500);
        // Hide tooltip after 5 seconds
        setTimeout(() => setShowTooltip(false), 5500);
      }
    });
    return () => unsubscribe();
  }, [scrollY, hasScrolledDown]);

  const yRange = [0, 200];

  // Size and shape transitions
  const width = useTransform(scrollY, yRange, [240, 64]);
  const height = useTransform(scrollY, yRange, [56, 64]);
  const borderRadius = useTransform(scrollY, yRange, [8, 32]);

  // Position transitions
  const x = useTransform(scrollY, yRange, [0, buttonRect.x]);
  const y = useTransform(scrollY, yRange, [0, buttonRect.y]);

  // Content transitions
  const textOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const iconOpacity = useTransform(scrollY, [100, 200], [0, 1]);

  return (
    <>
      <motion.button
        id="onboarding-button"
        style={{
          width,
          height,
          borderRadius,
          x,
          y,
        }}
        className={`
          fixed
          bg-gradient-to-br from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500
          text-white font-medium 
          shadow-lg hover:shadow-xl
          z-50
          transition-all duration-300
          overflow-hidden
        `}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        animate={hasScrolledDown ? {
          boxShadow: [
            '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
            '0 10px 25px -3px rgba(16, 185, 129, 0.5)',
            '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
          ],
        } : {}}
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            repeatType: 'loop',
          },
        }}
      >
        {/* Original text content */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute inset-0 flex items-center justify-center gap-2 whitespace-nowrap px-4"
        >
          <span className="text-lg font-semibold">
            {isCompleted ? 'View My Profile' : 'Start Your Journey'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </motion.div>

        {/* Emoji face when scrolled */}
        <motion.div
          style={{ opacity: iconOpacity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div 
            className="text-3xl"
            animate={hasScrolledDown ? {
              rotate: [0, -10, 10, -10, 0],
            } : {}}
            transition={{
              duration: 0.5,
              delay: 0.5,
            }}
          >
            {isCompleted ? '😊' : '👋'}
          </motion.div>
          
          {/* Notification dot */}
          {!isCompleted && hasScrolledDown && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
            >
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-red-500 rounded-full opacity-75"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Sparkle effects when floating */}
        {hasScrolledDown && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-1 -left-1"
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
            </motion.div>
          </>
        )}
      </motion.button>

      {/* Tooltip/Speech bubble */}
      <AnimatePresence>
        {showTooltip && hasScrolledDown && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            style={{
              position: 'fixed',
              right: window.innerWidth < 768 ? 85 : 105,
              bottom: window.innerHeight * 0.1 + 35,
              zIndex: 49,
            }}
            className="pointer-events-none"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-white rounded-2xl shadow-lg px-4 py-3 max-w-[200px] border border-emerald-100"
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">💬</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {isCompleted 
                        ? "Hey! Check your progress 📊" 
                        : "Hi there! Need help? 🌟"}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {isCompleted 
                        ? "See how far you've come!"
                        : "I'll guide you step by step"}
                    </p>
                  </div>
                </div>
                {/* Speech bubble tail */}
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-emerald-100 transform rotate-45" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FloatingOnboardButtonEmoji;
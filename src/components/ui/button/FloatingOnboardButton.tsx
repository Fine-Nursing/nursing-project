import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Bot, Sparkles, Star, Zap } from 'lucide-react';

interface FloatingOnboardButtonProps {
  onClick?: () => void;
  isCompleted?: boolean;
}

function FloatingOnboardButton({ onClick, isCompleted = false }: FloatingOnboardButtonProps) {
  const { scrollY } = useScroll();
  const [buttonRect, setButtonRect] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [isButtonFloating, setIsButtonFloating] = useState(false);
  const [tooltipTimer, setTooltipTimer] = useState<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [messageRotationTimer, setMessageRotationTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Messages for onboarding
  const onboardingMessages = [
    { title: "Welcome to Your Journey", subtitle: "Start your onboarding process" },
    { title: "Ready to Begin", subtitle: "Let's set up your profile" },
    { title: "Get Started", subtitle: "Click to start onboarding" },
  ];
  
  // Messages for completed users
  const completedMessages = [
    { title: "Welcome Back", subtitle: "Review your journey progress" },
    { title: "Hello Again", subtitle: "Check your achievements" },
    { title: "Good to See You", subtitle: "Explore new opportunities" },
  ];
  
  const messages = isCompleted ? completedMessages : onboardingMessages;
  const currentMessage = messages[messageIndex];

  useEffect(() => {
    const updatePosition = () => {
      const button = document.getElementById('onboarding-button');
      if (button) {
        const rect = button.getBoundingClientRect();
        const isMobile = window.innerWidth < 768;
        
        // Mobile: position higher and more to the left for thumb reach
        // Desktop: bottom right corner
        const rightMargin = isMobile ? 170 : 180;  // 10px to the right
        const bottomMargin = isMobile ? 190 : 190; // 10px down
        
        // Calculate floating button size
        const floatingSize = isMobile ? 60 : 72;
        
        // Calculate the end position (bottom-right corner)
        const endX = window.innerWidth - floatingSize - rightMargin;
        const endY = window.innerHeight - floatingSize - bottomMargin;
        
        // Calculate the movement distance from initial position
        // Initial button position is at the center of the container
        const initialButtonWidth = isMobile ? 200 : 240;
        const initialX = (window.innerWidth - initialButtonWidth) / 2;
        
        // For Y position, we need to get the initial position from HeroSection
        // This is approximate since we can't know the exact position without the parent
        const initialY = 200; // Approximate Y position in HeroSection
        
        setButtonRect({
          x: endX - initialX,
          y: endY - initialY,
        });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []); // Only run on mount and resize

  // Track scroll position and manage tooltip
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      const isFloating = latest > 150;
      
      // Button is now floating
      if (isFloating && !isButtonFloating) {
        setIsButtonFloating(true);
        
        // Clear any existing timers
        if (tooltipTimer) {
          clearTimeout(tooltipTimer);
        }
        if (messageRotationTimer) {
          clearTimeout(messageRotationTimer);
        }
        
        // Function to show messages in rotation
        const showMessageRotation = () => {
          // Show first message
          setMessageIndex(0);
          setShowTooltip(true);
          
          // Hide after 4 seconds
          setTimeout(() => {
            setShowTooltip(false);
            
            // Show next message after 2 seconds
            const rotationTimer = setTimeout(() => {
              setMessageIndex(1);
              setShowTooltip(true);
              
              // Hide second message after 4 seconds
              setTimeout(() => {
                setShowTooltip(false);
                
                // Show third message after 2 seconds
                setTimeout(() => {
                  setMessageIndex(2);
                  setShowTooltip(true);
                  
                  // Hide after 4 seconds
                  setTimeout(() => setShowTooltip(false), 4000);
                }, 2000);
              }, 4000);
            }, 2000);
            
            setMessageRotationTimer(rotationTimer);
          }, 4000);
        };
        
        // Start message rotation after initial delay
        const timer = setTimeout(showMessageRotation, 500);
        setTooltipTimer(timer);
      }
      
      // Button returned to original position
      else if (!isFloating && isButtonFloating) {
        setIsButtonFloating(false);
        setShowTooltip(false);
        setMessageIndex(0);
        
        // Clear all timers
        if (tooltipTimer) {
          clearTimeout(tooltipTimer);
          setTooltipTimer(null);
        }
        if (messageRotationTimer) {
          clearTimeout(messageRotationTimer);
          setMessageRotationTimer(null);
        }
      }
    });

    return () => {
      unsubscribe();
      if (tooltipTimer) {
        clearTimeout(tooltipTimer);
      }
      if (messageRotationTimer) {
        clearTimeout(messageRotationTimer);
      }
    };
  }, [scrollY, isButtonFloating, tooltipTimer, messageRotationTimer]);

  const yRange = [0, 200];
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Size and shape transitions - Responsive sizing
  const floatingSize = isMobile ? 60 : 72; // Smaller on mobile
  const initialWidth = isMobile ? 200 : 240; // Narrower on mobile
  const width = useTransform(scrollY, yRange, [initialWidth, floatingSize]);
  const height = useTransform(scrollY, yRange, [56, floatingSize]);
  const borderRadius = useTransform(scrollY, yRange, [8, floatingSize / 2]);

  // Position transitions - smooth animation from center to corner
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
        `}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={isButtonFloating ? {
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

        {/* Chatbot icon when scrolled */}
        <motion.div
          style={{ opacity: iconOpacity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div 
            className="relative"
            animate={isButtonFloating ? {
              rotate: [0, -5, 5, -5, 0],
            } : {}}
            transition={{
              duration: 2,
              delay: 0.5,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <Bot className={isMobile ? "w-6 h-6" : "w-8 h-8"} />
          </motion.div>
        </motion.div>

        {/* Sparkle effects when floating */}
        {isButtonFloating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </motion.div>
        )}
      </motion.button>

      {/* Tooltip/Speech bubble - Show on hover or after scroll */}
      <AnimatePresence>
        {((showTooltip || isHovered) && isButtonFloating) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            style={{
              position: 'fixed',
              // Mobile: show above button, Desktop: show to the left
              right: isMobile ? 20 : 100,
              bottom: isMobile ? 150 : 160,
              zIndex: 49,
            }}
            className="pointer-events-none"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-3 border border-emerald-100/50 ${
                  isMobile ? 'max-w-[180px]' : 'max-w-[200px]'
                }`}
              >
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <div>
                    <p className={`font-medium text-gray-800 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {currentMessage.title}
                    </p>
                    <p className={`text-gray-600 mt-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                      {currentMessage.subtitle}
                    </p>
                  </div>
                </div>
                {/* Speech bubble tail - points down on mobile, right on desktop */}
                <div className={`absolute w-4 h-4 bg-white/70 backdrop-blur-sm border-emerald-100/50 transform rotate-45 ${
                  isMobile 
                    ? '-bottom-2 right-6 border-r border-b' 
                    : '-bottom-2 right-8 border-r border-b'
                }`} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FloatingOnboardButton;
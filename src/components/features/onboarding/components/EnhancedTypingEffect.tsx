import { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';

interface EnhancedTypingEffectProps {
  text: string;
  speed?: number;
  showCursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
  className?: string;
}

export default function EnhancedTypingEffect({ 
  text, 
  speed = 40,
  showCursor = true,
  cursorChar = '|',
  onComplete,
  className = ''
}: EnhancedTypingEffectProps) {
  const [displayText, setDisplayText] = useState('');
  const [showBlink, setShowBlink] = useState(true);
  const completed = useRef(false);

  useEffect(() => {
    completed.current = false;
    setDisplayText('');
    let index = 0;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.substring(0, index + 1));
        index += 1;
      } else if (!completed.current) {
        completed.current = true;
        onComplete?.();
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  // Cursor blinking effect
  useEffect(() => {
    if (showCursor) {
      const blinkInterval = setInterval(() => {
        setShowBlink((prev) => !prev);
      }, 500);
      return () => clearInterval(blinkInterval);
    }
  }, [showCursor]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <m.span
          animate={{ opacity: showBlink ? 1 : 0 }}
          transition={{ duration: 0.1 }}
          className="text-slate-600 ml-0.5"
        >
          {cursorChar}
        </m.span>
      )}
    </span>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTypingTextProps {
  text: string | string[];
  speed?: number;
  delay?: number;
  repeat?: boolean;
  cursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
  onStart?: () => void;
  className?: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
}

export function AnimatedTypingText({
  text,
  speed = 50,
  delay = 0,
  repeat = false,
  cursor = true,
  cursorChar = '|',
  onComplete,
  onStart,
  className = '',
  as: Component = 'p',
}: AnimatedTypingTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  const textArray = Array.isArray(text) ? text : [text];
  const currentText = textArray[currentIndex] || '';

  useEffect(() => {
    const startTyping = () => {
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          onStart?.();
          typeText();
        }, delay);
      } else {
        onStart?.();
        typeText();
      }
    };

    const typeText = () => {
      setIsTyping(true);
      let charIndex = 0;

      const typeChar = () => {
        if (charIndex <= currentText.length) {
          setDisplayText(currentText.slice(0, charIndex));
          charIndex++;
          timeoutRef.current = setTimeout(typeChar, speed);
        } else {
          setIsTyping(false);
          onComplete?.();
          
          if (repeat && textArray.length > 1) {
            // Wait before starting next text
            timeoutRef.current = setTimeout(() => {
              setCurrentIndex((prev) => (prev + 1) % textArray.length);
            }, 2000);
          } else if (repeat && textArray.length === 1) {
            // Repeat the same text
            timeoutRef.current = setTimeout(() => {
              setDisplayText('');
              typeText();
            }, 2000);
          }
        }
      };

      typeChar();
    };

    startTyping();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentText, speed, delay, repeat, onComplete, onStart]);

  // Cursor blinking effect
  useEffect(() => {
    if (cursor) {
      intervalRef.current = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [cursor]);

  // Reset when currentIndex changes
  useEffect(() => {
    setDisplayText('');
  }, [currentIndex]);

  return (
    <Component className={className}>
      <span>{displayText}</span>
      {cursor && (
        <motion.span
          animate={{ opacity: showCursor ? 1 : 0 }}
          transition={{ duration: 0.1 }}
          className="inline-block"
        >
          {cursorChar}
        </motion.span>
      )}
    </Component>
  );
}

// Advanced typing component with more features
export function AdvancedTypingText({
  texts,
  typingSpeed = 50,
  deletingSpeed = 30,
  pauseDuration = 2000,
  loop = true,
  showCursor = true,
  cursorClassName = '',
  className = '',
  onTextComplete,
  onAllComplete,
}: {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
  showCursor?: boolean;
  cursorClassName?: string;
  className?: string;
  onTextComplete?: (text: string, index: number) => void;
  onAllComplete?: () => void;
}) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentFullText = texts[currentTextIndex];
    
    const timeout = setTimeout(() => {
      if (isPaused) {
        setIsPaused(false);
        if (texts.length > 1) {
          setIsDeleting(true);
        } else if (loop) {
          setCurrentText('');
        }
        return;
      }

      if (isDeleting) {
        setCurrentText(prev => prev.slice(0, -1));
        
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentTextIndex(prev => (prev + 1) % texts.length);
        }
      } else {
        setCurrentText(currentFullText.slice(0, currentText.length + 1));
        
        if (currentText === currentFullText) {
          onTextComplete?.(currentText, currentTextIndex);
          
          if (currentTextIndex === texts.length - 1 && !loop) {
            onAllComplete?.();
            return;
          }
          
          setIsPaused(true);
        }
      }
    }, isDeleting ? deletingSpeed : isPaused ? pauseDuration : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, isPaused, currentTextIndex, texts, typingSpeed, deletingSpeed, pauseDuration, loop]);

  return (
    <span className={className}>
      {currentText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className={`inline-block ${cursorClassName}`}
        >
          |
        </motion.span>
      )}
    </span>
  );
}

// Typewriter with character-by-character animation
export function TypewriterText({
  text,
  delay = 0,
  speed = 100,
  className = '',
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleChars(prev => {
          if (prev >= text.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay, speed]);

  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: index < visibleChars ? 1 : 0 }}
          transition={{ duration: 0.1 }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

// Code typing effect for syntax highlighting
export function CodeTypingText({
  code,
  language = 'javascript',
  speed = 50,
  delay = 0,
  className = '',
}: {
  code: string;
  language?: string;
  speed?: number;
  delay?: number;
  className?: string;
}) {
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= code.length) {
            clearInterval(interval);
            return prev;
          }
          setDisplayedCode(code.slice(0, prev + 1));
          return prev + 1;
        });
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [code, speed, delay]);

  return (
    <pre className={`bg-gray-900 text-green-400 p-4 rounded-lg overflow-hidden ${className}`}>
      <code>
        {displayedCode}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block"
        >
          _
        </motion.span>
      </code>
    </pre>
  );
}
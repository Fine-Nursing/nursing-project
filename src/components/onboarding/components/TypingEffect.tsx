// components/TypingEffect.tsx
import { useEffect, useRef, useState } from 'react';

interface TypingEffectProps {
  text: string;
  onComplete?: () => void;
}

export default function TypingEffect({ text, onComplete }: TypingEffectProps) {
  const [displayText, setDisplayText] = useState('');
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
    }, 40);

    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <span>{displayText}</span>;
}

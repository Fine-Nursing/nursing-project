// components/QuestionContent.tsx
import { motion } from 'framer-motion';
import { memo } from 'react';
import TypingEffect from './TypingEffect';

interface QuestionContentProps {
  title: string;
  subtitle?: string;
  isTypingComplete: boolean;
  onTypingComplete: () => void;
}
const QuestionContent = memo(
  ({
    title,
    subtitle,
    isTypingComplete,
    onTypingComplete,
  }: QuestionContentProps) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        <TypingEffect text={title} onComplete={onTypingComplete} />
      </h2>
      {subtitle && (
        <motion.p
          className="text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: isTypingComplete ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
);

export default QuestionContent;

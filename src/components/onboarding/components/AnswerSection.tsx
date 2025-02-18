// components/AnswersSection.tsx
import { motion } from 'framer-motion';
import { memo } from 'react';

interface AnswersSectionProps {
  options?: string[];
  currentValue: string;
  isTypingComplete: boolean;
  onValueChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
}

const AnswersSection = memo(
  ({
    options,
    currentValue,
    isTypingComplete,
    onValueChange,
    onSubmit,
    placeholder,
  }: AnswersSectionProps) => {
    if (!isTypingComplete) return null;

    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          staggerChildren: 0.1, // 각 옵션이 순차적으로 나타남
        },
      },
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      },
    };

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {options ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {options.map((option) => (
              <motion.button
                key={option}
                variants={itemVariants}
                onClick={() => onSubmit(option)}
                className="p-4 text-left rounded-lg border-2 border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="block font-medium text-gray-900">
                  {option}
                </span>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div variants={itemVariants}>
            <input
              type="text"
              value={currentValue}
              onChange={(e) => onValueChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && currentValue) {
                  onSubmit(currentValue);
                }
              }}
              placeholder={placeholder}
              className="w-full p-4 rounded-lg border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all duration-300"
              autoFocus
            />
          </motion.div>
        )}
      </motion.div>
    );
  }
);

export default AnswersSection;

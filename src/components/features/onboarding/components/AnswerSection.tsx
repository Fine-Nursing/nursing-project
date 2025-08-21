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
  inputType?: 'text' | 'number'; // 추가: 입력 필드 타입 지정
}

const AnswersSection = memo(
  ({
    options,
    currentValue,
    isTypingComplete,
    onValueChange,
    onSubmit,
    placeholder,
    inputType = 'text', // 기본값은 text
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
                className="p-4 text-left rounded-lg border-2 border-gray-200 hover:border-slate-500 hover:bg-slate-50 transition-all duration-300"
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
          <motion.div variants={itemVariants} className="space-y-4">
            <input
              type={inputType}
              value={currentValue}
              onChange={(e) => onValueChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && currentValue) {
                  onSubmit(currentValue);
                }
              }}
              placeholder={placeholder}
              className="w-full p-4 rounded-lg border-2 border-gray-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all duration-300"
              min={inputType === 'number' ? 0 : undefined}
              max={inputType === 'number' ? 50 : undefined}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: currentValue ? 1 : 0, 
                y: currentValue ? 0 : 10 
              }}
              className="flex justify-end"
            >
              <motion.button
                type="button"
                onClick={() => currentValue && onSubmit(currentValue)}
                disabled={!currentValue}
                className="px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Continue</span>
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                  />
                </svg>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    );
  }
);

AnswersSection.displayName = 'AnswersSection';

export default AnswersSection;

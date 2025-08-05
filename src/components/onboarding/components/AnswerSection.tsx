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
          <motion.div variants={itemVariants}>
            <div className="relative">
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
                className="w-full p-4 pr-24 rounded-lg border-2 border-gray-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none transition-all duration-300"
                min={inputType === 'number' ? 0 : undefined}
                max={inputType === 'number' ? 50 : undefined}
              />
              <motion.button
                type="button"
                onClick={() => currentValue && onSubmit(currentValue)}
                disabled={!currentValue}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-md text-sm font-medium transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                  opacity: currentValue ? 1 : 0, 
                  scale: currentValue ? 1 : 0.9 
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center gap-1">
                  Next
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                </span>
              </motion.button>
            </div>
            {/* 모바일을 위한 추가 버튼 (입력 필드 아래) */}
            <motion.button
              type="button"
              onClick={() => currentValue && onSubmit(currentValue)}
              disabled={!currentValue}
              className="w-full mt-3 py-3 bg-slate-500 hover:bg-slate-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none sm:hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: currentValue ? 1 : 0, 
                y: currentValue ? 0 : 10 
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Continue →
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    );
  }
);

AnswersSection.displayName = 'AnswersSection';

export default AnswersSection;

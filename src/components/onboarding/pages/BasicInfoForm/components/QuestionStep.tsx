import React from 'react';
import { motion } from 'framer-motion';
// import AnswersSection from '../../../components/AnswerSection';
import EnhancedTypingEffect from '../../../components/EnhancedTypingEffect';
import AnimatedInput from '../../../components/AnimatedInput';
import SelectionCard from '../../../components/SelectionCard';
import type { QuestionStepProps } from '../types';

export function QuestionStep({ 
  question, 
  value, 
  onValueChange, 
  onContinue,
  isTypingComplete,
  setIsTypingComplete 
}: QuestionStepProps) {
  const handleTypingComplete = () => {
    setIsTypingComplete(true);
  };

  const handleValueSubmit = (newValue: string | number) => {
    onValueChange(newValue);
    onContinue();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <EnhancedTypingEffect
            text={question.title}
            speed={30}
            className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white"
            onComplete={handleTypingComplete}
          />
          
          {question.subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: isTypingComplete ? 1 : 0 }}
              className="text-lg text-gray-600 dark:text-slate-300 mb-8"
            >
              {question.subtitle}
            </motion.p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isTypingComplete ? 1 : 0, y: isTypingComplete ? 0 : 20 }}
          transition={{ delay: 0.2 }}
        >
          {question.options ? (
            <div className="grid gap-4">
              {question.options.map((option) => (
                <SelectionCard
                  key={option}
                  value={option}
                  label={option}
                  isSelected={value === option}
                  onClick={() => handleValueSubmit(option)}
                />
              ))}
            </div>
          ) : (
            <AnimatedInput
              type={question.inputType || 'text'}
              placeholder={question.key === 'name' ? 'Your name' : 'Enter value'}
              value={value.toString()}
              onChange={(newValue) => onValueChange(newValue)}
              className="text-lg"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
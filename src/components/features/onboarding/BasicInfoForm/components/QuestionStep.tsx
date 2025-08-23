import { motion, AnimatePresence } from 'framer-motion';
import { User, GraduationCap, Briefcase, Clock } from 'lucide-react';
import ActionButton from 'src/components/ui/button/ActionButton';
import EnhancedTypingEffect from '../../components/EnhancedTypingEffect';
import AnimatedInput from '../../components/AnimatedInput';
import SelectionCard from '../../components/SelectionCard';
import AnimatedProgressBar from '../../components/AnimatedProgressBar';
import type { BasicQuestion } from '../types';

interface QuestionStepProps {
  activeQuestion: BasicQuestion;
  progress: number;
  activeQuestionIndex: number;
  totalQuestions: number;
  isTypingComplete: boolean;
  handleTypingComplete: () => void;
  getFormDataValue: (key: string) => string;
  handleValueChange: (value: string) => void;
  handleValueSubmit: (value: string) => void;
  handleGoBack: () => void;
  setStep: (step: any) => void;
}

export default function QuestionStep({
  activeQuestion,
  progress,
  activeQuestionIndex,
  totalQuestions,
  isTypingComplete,
  handleTypingComplete,
  getFormDataValue,
  handleValueChange,
  handleValueSubmit,
  handleGoBack,
  setStep,
}: QuestionStepProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <AnimatedProgressBar 
          progress={progress} 
          showPercentage={false}
          height="h-1"
          className="max-w-md mx-auto"
        />
        <div className="text-center mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Question {activeQuestionIndex + 1} of {totalQuestions}
          </p>
        </div>
      </div>

      <div className="relative min-h-[450px] sm:min-h-[500px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuestion.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="mb-10 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                <EnhancedTypingEffect 
                  text={activeQuestion.title} 
                  onComplete={handleTypingComplete}
                  speed={20}  // 30ms → 20ms (1.5배 빠르게)
                  showCursor
                />
              </h2>
              {activeQuestion.subtitle && (
                <motion.p
                  className="text-lg text-gray-500 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isTypingComplete ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeQuestion.subtitle}
                </motion.p>
              )}
            </div>

            {isTypingComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}  // 0.3 → 0.2 (타이핑 속도에 맞춰 조정)
              >
                {activeQuestion.options ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {activeQuestion.options.map((option, index) => (
                      <motion.div
                        key={option}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}  // 0.05 → 0.03 (더 빠르게)
                      >
                        <SelectionCard
                          value={option}
                          label={option}
                          isSelected={getFormDataValue(activeQuestion.key) === option}
                          onClick={() => handleValueSubmit(option)}
                          icon={
                            activeQuestion.key === 'education' ? <GraduationCap className="w-4 h-4 text-slate-600" /> :
                            activeQuestion.key === 'nursingRole' ? <Briefcase className="w-4 h-4 text-slate-600" /> :
                            null
                          }
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <AnimatedInput
                      value={getFormDataValue(activeQuestion.key)}
                      onChange={handleValueChange}
                      placeholder={
                        activeQuestion.key === 'experienceYears'
                          ? 'Enter years of experience'
                          : `Enter your ${activeQuestion.key}`
                      }
                      type={activeQuestion.inputType}
                      icon={
                        activeQuestion.key === 'name' ? <User className="w-5 h-5" /> :
                        activeQuestion.key === 'experienceYears' ? <Clock className="w-5 h-5" /> :
                        null
                      }
                      maxLength={activeQuestion.key === 'name' ? 50 : undefined}
                      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                          const value = getFormDataValue(activeQuestion.key);
                          if (value && (!activeQuestion.validation || activeQuestion.validation(value))) {
                            handleValueSubmit(value);
                          }
                        }
                      }}
                    />
                    <div className="mt-8">
                    <ActionButton
                      onClick={() => {
                        const value = getFormDataValue(activeQuestion.key);
                        if (value && (!activeQuestion.validation || activeQuestion.validation(value))) {
                          handleValueSubmit(value);
                        }
                      }}
                      disabled={!getFormDataValue(activeQuestion.key) || 
                               (activeQuestion.validation && !activeQuestion.validation(getFormDataValue(activeQuestion.key)))}
                      className="w-full"
                    >
                      Continue →
                    </ActionButton>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {isTypingComplete && (
        <div className="mt-6 sm:mt-8 flex justify-between">
          <div className="flex gap-4">
            <ActionButton onClick={handleGoBack} variant="outline" className="px-4 py-2 text-sm sm:text-base">
              ← Back
            </ActionButton>
          </div>
          <ActionButton onClick={() => setStep('welcome')} variant="outline" className="px-4 py-2 text-sm sm:text-base">
            Cancel
          </ActionButton>
        </div>
      )}
    </div>
  );
}
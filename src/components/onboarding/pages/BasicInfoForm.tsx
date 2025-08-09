'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useMemo } from 'react';

import ActionButton from 'src/components/button/ActionButton';
import useOnboardingStore from 'src/store/onboardingStores';
import type { EducationLevel, NursingRole } from 'src/types/onboarding';
import useBasicInfoMutation from 'src/api/onboarding/useBasicInfoMutation';
import toast from 'react-hot-toast';
import { User, GraduationCap, Briefcase, Clock } from 'lucide-react';
import QuestionContent from '../components/QuestionContent';
import AnswersSection from '../components/AnswerSection';
import EnhancedTypingEffect from '../components/EnhancedTypingEffect';
import AnimatedInput from '../components/AnimatedInput';
import SelectionCard from '../components/SelectionCard';
import AnimatedProgressBar from '../components/AnimatedProgressBar';
import SummaryCard from '../components/SummaryCard';
import CustomDropdown from '../components/CustomDropdown';

type BasicQuestion = {
  key: 'name' | 'education' | 'nursingRole' | 'experienceYears';
  title: string;
  subtitle: string;
  validation?: (value: string) => boolean;
  options?: string[];
  inputType?: 'text' | 'number';
};

export default function BasicInfoForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const basicInfoMutation = useBasicInfoMutation();

  const questions = useMemo<BasicQuestion[]>(
    () => [
      {
        key: 'name',
        title: "Hi! Let's begin with your name — what should I call you?",
        subtitle: '',
        validation: (value: string) => value.length > 0,
      },
      {
        key: 'education',
        title: "Awesome — what's your highest completed education level?",
        subtitle: 'This helps me understand your academic background',
        options: [
          'High School Diploma or Equivalent',
          'Vocational/Technical Certificate',
          "Associate's Degree",
          "Bachelor's Degree",
          "Master's Degree",
          'Doctorate Degree',
          "Post-Master's Certificate",
          'Specialized Nursing Certification',
        ] as EducationLevel[],
      },
      {
        key: 'nursingRole',
        title:
          'Amazing! Now, could you tell me about your current nursing role?',
        subtitle: 'Select the position that best describes your role',
        options: [
          'Certified Nursing Assistant (CNA)',
          'Licensed Practical Nurse (LPN)',
          'Registered Nurse (RN)',
          'Nurse Practitioner (NP)',
          'Clinical Nurse Specialist (CNS)',
          'Certified Nurse Midwife (CNM)',
          'Certified Registered Nurse Anesthetist (CRNA)',
          'Nurse Administrator',
          'Travel Nurse',
          'Staff Nurse',
          'Public Health Nurse',
          'Emergency Room Nurse',
          'Critical Care Nurse',
          'Pediatric Nurse',
          'Geriatric Nurse',
          'Neonatal Nurse',
          'Psychiatric Nurse',
          'Hospice Nurse',
          'Case Manager Nurse',
        ] as NursingRole[],
      },
      {
        key: 'experienceYears',
        title: 'And lastly, how many years of experience do you have?',
        subtitle: 'Your experience is valuable to us',
        inputType: 'number',
        validation: (value: string) => {
          const num = Number(value);
          return !Number.isNaN(num) && num >= 0 && num <= 50;
        },
      },
    ],
    []
  );

  const activeQuestion = questions[activeQuestionIndex];
  const progress = ((activeQuestionIndex + 1) / questions.length) * 100;

  const handleTypingComplete = useCallback(() => {
    setIsTypingComplete(true);
  }, []);

  const handleValueChange = useCallback(
    (value: string) => {
      if (activeQuestion) {
        updateFormData({ [activeQuestion.key]: value });
      }
    },
    [activeQuestion, updateFormData]
  );

  const handleValueSubmit = useCallback(
    (value: string) => {
      handleValueChange(value);
      if (activeQuestionIndex < questions.length - 1) {
        setIsTypingComplete(false);
        setActiveQuestionIndex((prev) => prev + 1);
      } else {
        setShowSummary(true);
      }
    },
    [activeQuestionIndex, questions.length, handleValueChange]
  );

  const handleGoBack = useCallback(() => {
    if (activeQuestionIndex > 0) {
      setIsTypingComplete(true);
      setActiveQuestionIndex((prev) => prev - 1);
    } else {
      setStep('welcome');
    }
  }, [activeQuestionIndex, setStep]);

  const handleReset = useCallback(() => {
    setShowSummary(false);
    setActiveQuestionIndex(0);
    setIsTypingComplete(false);
    questions.forEach((q) => updateFormData({ [q.key]: '' }));
  }, [questions, updateFormData]);

  const formatExperience = (value: string) => {
    if (!value) return '';
    return `${value} years`;
  };

  // Continue 버튼 클릭 시 API 호출
  const handleContinue = async () => {
    try {
      const payload = {
        name: formData.name || '',
        education: formData.education || '',
        nursingRole: formData.nursingRole || '',
        experienceYears: Number(formData.experienceYears) || 0,
      };

      await basicInfoMutation.mutateAsync(payload);
      // 성공 시 자동으로 employment 단계로 이동 (onSuccess에서 처리)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save information'
      );
    }
  };

  const getFieldLabel = (key: string) => {
    if (key === 'name') return 'Your Name';
    if (key === 'education') return 'Education Level';
    if (key === 'nursingRole') return 'Nursing Role';
    return 'Years of Experience';
  };

  const getFormDataValue = (key: string): string => {
    const value = formData[key as keyof typeof formData];

    if (value === undefined || value === null) return '';
    if (typeof value === 'number') return String(value);
    if (typeof value !== 'string') return '';

    return value;
  };

  // 모든 필드가 채워졌는지 확인
  const isFormValid = () =>
    questions.every((q) => {
      const value = getFormDataValue(q.key);
      return value !== '';
    });

  // 요약 화면
  if (showSummary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4 py-6 sm:py-12"
      >
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
            Perfect! Let&apos;s Review Your Information
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
            Please review your details and make any changes if needed.
          </p>
        </div>

        <SummaryCard
          title="Your Information"
          items={questions.map((q) => ({
            label: getFieldLabel(q.key),
            value: q.key === 'experienceYears' 
              ? getFormDataValue(q.key)
              : getFormDataValue(q.key),
            icon: q.key === 'name' ? <User className="w-4 h-4" /> :
                  q.key === 'education' ? <GraduationCap className="w-4 h-4" /> :
                  q.key === 'nursingRole' ? <Briefcase className="w-4 h-4" /> :
                  <Clock className="w-4 h-4" />,
            options: q.options,
            inputType: q.inputType
          }))}
          onEdit={(label, newValue) => {
            const question = questions.find(q => getFieldLabel(q.key) === label);
            if (question) {
              updateFormData({ [question.key]: newValue });
            }
          }}
          className="mb-6 sm:mb-10"
        />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex gap-4 order-2 sm:order-1">
            <ActionButton
              onClick={handleReset}
              variant="outline"
              className="px-6 py-3 text-base"
            >
              Start Over
            </ActionButton>
            <ActionButton
              onClick={() => setStep('welcome')}
              variant="outline"
              className="px-6 py-3 text-base"
            >
              Cancel
            </ActionButton>
          </div>
          <ActionButton
            onClick={handleContinue}
            disabled={basicInfoMutation.isPending || !isFormValid()}
            className="w-full sm:w-auto px-8 py-4 text-lg order-1 sm:order-2"
          >
            {basicInfoMutation.isPending ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Saving...
              </span>
            ) : (
              'Continue to Next Step →'
            )}
          </ActionButton>
        </div>
      </motion.div>
    );
  }

  // 질문 입력 화면
  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="mb-6">
        <AnimatedProgressBar 
          progress={progress} 
          showPercentage={false}
          height="h-1"
          className="max-w-md mx-auto"
        />
        <div className="text-center mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Question {activeQuestionIndex + 1} of {questions.length}
          </p>
        </div>
      </div>

      <div className="relative min-h-[300px] sm:min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuestion.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                <EnhancedTypingEffect 
                  text={activeQuestion.title} 
                  onComplete={handleTypingComplete}
                  speed={30}
                  showCursor
                />
              </h2>
              {activeQuestion.subtitle && (
                <motion.p
                  className="text-gray-500 dark:text-gray-400"
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
                transition={{ delay: 0.3 }}
              >
                {activeQuestion.options ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeQuestion.options.map((option, index) => (
                      <motion.div
                        key={option}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
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

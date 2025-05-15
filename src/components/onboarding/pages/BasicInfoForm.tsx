'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useMemo } from 'react';
import ActionButton from 'src/components/button/ActionButton';
import useOnboardingStore from 'src/store/onboardingStores';
import type { EducationLevel, NursingRole } from 'src/types/onboarding';
import QuestionContent from '../components/QuestionContent';
import AnswersSection from '../components/AnswerSection';

/**
 * 1) 질문 객체가 가질 수 있는 속성을 정의합니다.
 * - key: 'name' | 'education' | 'nursingRole' | 'experienceGroup'
 * - title, subtitle: 문자열
 * - validation?: (값) => boolean
 * - options?: (값의 배열)
 * - inputType?: 'text' | 'number' - 추가: 입력 타입 지정
 */
type BasicQuestion = {
  key: 'name' | 'education' | 'nursingRole' | 'experienceGroup';
  title: string;
  subtitle: string;
  validation?: (value: string) => boolean;
  options?: string[]; // EducationLevel | NursingRole | ExperienceGroup 등 문자열 유니온도 가능
  inputType?: 'text' | 'number'; // 추가: 입력 타입 속성
};

export default function BasicInfoForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  /**
   * 2) questions 배열을 생성할 때, BasicQuestion[] 타입을 명시합니다.
   *    첫 번째 질문에는 options가 없고, 그 밖의 질문에는 options가 있는 형태로 작성.
   */
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
        key: 'experienceGroup',
        title: 'And lastly, how many years of experience do you have?',
        subtitle: 'Your experience is valuable to us',
        // options 속성 제거하고 inputType과 validation 추가
        inputType: 'number',
        validation: (value: string) => {
          const num = Number(value);
          // isNaN 대신 Number.isNaN 사용
          return !Number.isNaN(num) && num >= 0 && num <= 50;
        },
      },
    ],
    []
  );

  const activeQuestion = questions[activeQuestionIndex];
  const progress = (activeQuestionIndex / questions.length) * 100;

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
      setIsTypingComplete(true); // Keep typing complete for previous questions
      setActiveQuestionIndex((prev) => prev - 1);
    } else {
      // If we're at the first question, going back means going to welcome step
      setStep('welcome');
    }
  }, [activeQuestionIndex, setStep]);

  const handleReset = useCallback(() => {
    setShowSummary(false);
    setActiveQuestionIndex(0);
    setIsTypingComplete(false);
    questions.forEach((q) => updateFormData({ [q.key]: '' }));
  }, [questions, updateFormData]);

  // 경력 표시용 포맷 함수 추가
  const formatExperience = (value: string) => {
    if (!value) return '';
    return `${value} years`;
  };

  // 필드 레이블 가져오기 (중첩된 삼항 연산자를 피하기 위한 함수)
  const getFieldLabel = (key: string) => {
    if (key === 'name') return 'Your Name';
    if (key === 'education') return 'Education Level';
    if (key === 'nursingRole') return 'Nursing Role';
    return 'Years of Experience';
  };

  // formData에서 안전하게 값 가져오기 (타입 문제 해결)
  const getFormDataValue = (key: string): string => {
    // formData[key]를 안전하게 문자열로 반환
    const value = formData[key as keyof typeof formData];

    // 값이 없거나 문자열이 아닌 경우 빈 문자열 반환
    if (value === undefined || value === null) return '';

    // 숫자 값인 경우 문자열로 변환
    if (typeof value === 'number') return String(value);

    // 문자열이 아닌 다른 타입은 일단 빈 문자열 반환 (실제로는 이런 경우가 없어야 함)
    if (typeof value !== 'string') return '';

    return value;
  };

  // ---------- 요약 화면 ----------
  if (showSummary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4 py-12"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Perfect! Let&apos;s Review Your Information
          </h2>
          <p className="text-gray-500 text-lg">
            Please review your details and make any changes if needed.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          {questions.map((q, index) => (
            <div
              key={q.key}
              className={`group py-6 ${
                index !== questions.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {getFieldLabel(q.key)}
                </h3>
                {editingField !== q.key && (
                  <button
                    type="button"
                    onClick={() => setEditingField(q.key)}
                    className="text-sm text-emerald-600 hover:text-emerald-700 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-2"
                  >
                    <span>Edit</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="transition-transform group-hover:translate-x-0.5"
                    >
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {editingField === q.key ? (
                <div className="mt-2">
                  {q.options ? (
                    <select
                      value={getFormDataValue(q.key)}
                      onChange={(e) => {
                        updateFormData({ [q.key]: e.target.value });
                        setEditingField(null);
                      }}
                      className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                    >
                      {q.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={q.inputType || 'text'}
                      value={getFormDataValue(q.key)}
                      onChange={(e) =>
                        updateFormData({ [q.key]: e.target.value })
                      }
                      onBlur={() => setEditingField(null)}
                      className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                      placeholder={
                        q.key === 'experienceGroup'
                          ? 'Enter years'
                          : `Enter your ${q.key}`
                      }
                      min={q.key === 'experienceGroup' ? 0 : undefined}
                      max={q.key === 'experienceGroup' ? 50 : undefined}
                    />
                  )}
                </div>
              ) : (
                <p className="text-xl text-gray-900 font-medium mt-1">
                  {q.key === 'experienceGroup'
                    ? formatExperience(getFormDataValue(q.key))
                    : getFormDataValue(q.key)}
                </p>
              )}
            </div>
          ))}
        </div>

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
            onClick={() => setStep('employment')}
            disabled={false}
            // disabled={!Object.values(formData).every(Boolean)}
            className="w-full sm:w-auto px-8 py-4 text-lg order-1 sm:order-2"
          >
            Continue to Next Step →
          </ActionButton>
        </div>
      </motion.div>
    );
  }

  // ---------- 질문 입력 화면 ----------
  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Your Progress</span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeQuestion.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <QuestionContent
              title={activeQuestion.title}
              subtitle={activeQuestion.subtitle}
              isTypingComplete={isTypingComplete}
              onTypingComplete={handleTypingComplete}
            />

            {isTypingComplete && (
              <AnswersSection
                options={activeQuestion.options}
                currentValue={getFormDataValue(activeQuestion.key)}
                isTypingComplete={isTypingComplete}
                onValueChange={handleValueChange}
                onSubmit={handleValueSubmit}
                placeholder={
                  activeQuestion.key === 'experienceGroup'
                    ? 'Enter years of experience'
                    : `Enter your ${activeQuestion.key}`
                }
                inputType={activeQuestion.inputType}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {isTypingComplete && (
        <div className="mt-8 flex justify-between">
          <div className="flex gap-4">
            {/* Back button */}
            <ActionButton onClick={handleGoBack} variant="outline">
              ← Back
            </ActionButton>
          </div>
          <ActionButton onClick={() => setStep('welcome')} variant="outline">
            Cancel
          </ActionButton>
        </div>
      )}
    </div>
  );
}

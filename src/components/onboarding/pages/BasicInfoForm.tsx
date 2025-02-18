'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useMemo } from 'react';
import ActionButton from 'src/components/button/ActionButton';
import useOnboardingStore from 'src/store/onboardingStores';
import type {
  EducationLevel,
  ExperienceGroup,
  NursingRole,
} from 'src/types/onboarding';
import QuestionContent from '../components/QuestionContent';
import AnswersSection from '../components/AnswerSection';

export default function BasicInfoForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const questions = useMemo(
    () =>
      [
        {
          key: 'name',
          title:
            "Hi there! I'm excited to get to know you better! What's your name?",
          subtitle: 'Let me know what to call you',
          validation: (value: string) => value.length > 0,
        },
        {
          key: 'education',
          title: 'Great! And what level of education have you completed?',
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
          options: [
            '1-3 years',
            '3-5 years',
            '5-10 years',
            '10+ years',
          ] as ExperienceGroup[],
        },
      ] as const,
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

  const handleReset = useCallback(() => {
    setShowSummary(false);
    setActiveQuestionIndex(0);
    setIsTypingComplete(false);
    questions.forEach((q) => updateFormData({ [q.key]: '' }));
  }, [questions, updateFormData]);
  if (showSummary) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4 py-12"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Perfect! Let's Review Your Information
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
                  {q.subtitle}
                </h3>
                {editingField !== q.key && (
                  <button
                    type="button"
                    onClick={() => setEditingField(q.key)}
                    className="text-sm text-teal-600 hover:text-teal-700 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-2"
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
                      value={formData[q.key] || ''}
                      onChange={(e) => {
                        updateFormData({ [q.key]: e.target.value });
                        setEditingField(null);
                      }}
                      className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      autoFocus
                    >
                      {q.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData[q.key] || ''}
                      onChange={(e) =>
                        updateFormData({ [q.key]: e.target.value })
                      }
                      onBlur={() => setEditingField(null)}
                      className="w-full p-3 text-lg bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                      autoFocus
                    />
                  )}
                </div>
              ) : (
                <p className="text-xl text-gray-900 font-medium mt-1">
                  {formData[q.key]}
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
  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Your Progress</span>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-teal-500"
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
                currentValue={formData[activeQuestion.key] || ''}
                isTypingComplete={isTypingComplete}
                onValueChange={handleValueChange}
                onSubmit={handleValueSubmit}
                placeholder={`Enter your ${activeQuestion.key}`}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {isTypingComplete && (
        <div className="mt-8 flex justify-end">
          <ActionButton onClick={() => setStep('welcome')} variant="outline">
            Cancel
          </ActionButton>
        </div>
      )}
    </div>
  );
}

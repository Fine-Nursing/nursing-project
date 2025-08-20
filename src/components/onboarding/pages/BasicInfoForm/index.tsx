'use client';

import { motion } from 'framer-motion';
import { useState, useCallback, useMemo } from 'react';
import useOnboardingStore from 'src/store/onboardingStores';
import useBasicInfoMutation from 'src/api/onboarding/useBasicInfoMutation';
import toast from 'react-hot-toast';
import AnimatedProgressBar from '../../components/AnimatedProgressBar';
import { BASIC_INFO_QUESTIONS } from './constants';
import { QuestionStep } from './components/QuestionStep';
import { SummaryStep } from './components/SummaryStep';
import type { BasicInfoFormData } from './types';

export default function BasicInfoForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const basicInfoMutation = useBasicInfoMutation();

  const questions = useMemo(() => BASIC_INFO_QUESTIONS, []);
  const activeQuestion = questions[activeQuestionIndex];
  const progress = ((activeQuestionIndex + 1) / questions.length) * 100;

  // Type-safe form data
  const basicInfoData: BasicInfoFormData = {
    name: formData.name || '',
    education: formData.education || '',
    nursingRole: formData.nursingRole || '',
    experienceYears: formData.experienceYears || '',
  };

  const handleValueChange = useCallback(
    (value: string | number) => {
      if (activeQuestion) {
        updateFormData({ [activeQuestion.key]: value });
      }
    },
    [activeQuestion, updateFormData]
  );

  const handleContinue = useCallback(() => {
    if (activeQuestionIndex < questions.length - 1) {
      setIsTypingComplete(false);
      setActiveQuestionIndex((prev) => prev + 1);
    } else {
      setShowSummary(true);
    }
  }, [activeQuestionIndex, questions.length]);

  const handleBackToQuestions = useCallback(() => {
    setShowSummary(false);
    setActiveQuestionIndex(questions.length - 1);
    setIsTypingComplete(true);
  }, [questions.length]);

  const handleEdit = useCallback((field: string) => {
    const questionIndex = questions.findIndex(q => q.key === field);
    if (questionIndex !== -1) {
      setActiveQuestionIndex(questionIndex);
      setShowSummary(false);
      setIsTypingComplete(true);
    }
  }, [questions]);

  const handleFormDataUpdate = useCallback((data: Partial<BasicInfoFormData>) => {
    const sanitizedData = { ...data };
    // Convert empty strings to undefined for compatibility
    if (sanitizedData.education === '') {
      sanitizedData.education = undefined;
    }
    if (sanitizedData.nursingRole === '') {
      sanitizedData.nursingRole = undefined;
    }
    updateFormData(sanitizedData as any);
  }, [updateFormData]);

  const handleSubmit = useCallback(async () => {
    try {
      if (!basicInfoData.name || !basicInfoData.education || 
          !basicInfoData.nursingRole || !basicInfoData.experienceYears) {
        toast.error('Please fill in all required fields');
        return;
      }

      const payload = {
        name: basicInfoData.name,
        education: basicInfoData.education,
        nursingRole: basicInfoData.nursingRole,
        experienceYears: Number(basicInfoData.experienceYears),
      };

      await basicInfoMutation.mutateAsync(payload);
      toast.success('Basic information saved successfully!');
      setStep('employment');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save basic information'
      );
    }
  }, [basicInfoData, basicInfoMutation, setStep]);

  const currentValue = activeQuestion ? 
    basicInfoData[activeQuestion.key as keyof BasicInfoFormData] : '';

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Progress Bar - Only show during questions */}
      {!showSummary && (
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700">
          <div className="max-w-4xl mx-auto p-4">
            <AnimatedProgressBar 
              progress={progress}
            />
          </div>
        </div>
      )}

      {showSummary ? (
        <SummaryStep
          formData={basicInfoData}
          onEdit={handleEdit}
          onSubmit={handleSubmit}
          onBack={handleBackToQuestions}
          isSubmitting={basicInfoMutation.isPending}
          editingField={editingField}
          setEditingField={setEditingField}
          updateFormData={handleFormDataUpdate}
        />
      ) : (
        <QuestionStep
          question={activeQuestion}
          value={currentValue}
          onValueChange={handleValueChange}
          onContinue={handleContinue}
          isTypingComplete={isTypingComplete}
          setIsTypingComplete={setIsTypingComplete}
        />
      )}
    </div>
  );
}
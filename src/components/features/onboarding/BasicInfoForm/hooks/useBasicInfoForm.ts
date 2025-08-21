import { useState, useCallback, useMemo } from 'react';
import useOnboardingStore from 'src/store/onboardingStores';
import useBasicInfoMutation from 'src/api/onboarding/useBasicInfoMutation';
import toast from 'react-hot-toast';
import { BASIC_INFO_QUESTIONS } from '../constants';

export function useBasicInfoForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);

  const basicInfoMutation = useBasicInfoMutation();

  const questions = useMemo(() => BASIC_INFO_QUESTIONS, []);
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

  const handleContinue = useCallback(async () => {
    try {
      const payload = {
        name: formData.name || '',
        education: formData.education || '',
        nursingRole: formData.nursingRole || '',
        experienceYears: Number(formData.experienceYears) || 0,
      };

      await basicInfoMutation.mutateAsync(payload);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save information'
      );
    }
  }, [formData, basicInfoMutation]);

  const getFieldLabel = useCallback((key: string) => {
    if (key === 'name') return 'Your Name';
    if (key === 'education') return 'Education Level';
    if (key === 'nursingRole') return 'Nursing Role';
    return 'Years of Experience';
  }, []);

  const getFormDataValue = useCallback((key: string): string => {
    const value = formData[key as keyof typeof formData];

    if (value === undefined || value === null) return '';
    if (typeof value === 'number') return String(value);
    if (typeof value !== 'string') return '';

    return value;
  }, [formData]);

  const isFormValid = useCallback(() =>
    questions.every((q) => {
      const value = getFormDataValue(q.key);
      return value !== '';
    }), [questions, getFormDataValue]);

  return {
    // State
    isTypingComplete,
    activeQuestionIndex,
    showSummary,
    editingField,
    
    // Data
    questions,
    activeQuestion,
    progress,
    
    // Mutation
    basicInfoMutation,
    
    // Handlers
    handleTypingComplete,
    handleValueChange,
    handleValueSubmit,
    handleGoBack,
    handleReset,
    handleContinue,
    
    // Utils
    getFieldLabel,
    getFormDataValue,
    isFormValid,
    
    // Store actions
    setStep,
    updateFormData,
  };
}
'use client';

import QuestionStep from './components/QuestionStep';
import SummaryStep from './components/SummaryStep';
import { useBasicInfoForm } from './hooks/useBasicInfoForm';

export default function BasicInfoForm() {
  const {
    // State
    isTypingComplete,
    activeQuestionIndex,
    showSummary,
    
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
  } = useBasicInfoForm();

  // 요약 화면
  if (showSummary) {
    return (
      <SummaryStep
        questions={questions}
        getFieldLabel={getFieldLabel}
        getFormDataValue={getFormDataValue}
        updateFormData={updateFormData}
        handleReset={handleReset}
        setStep={setStep}
        handleContinue={handleContinue}
        isLoading={basicInfoMutation.isPending}
        isFormValid={isFormValid}
      />
    );
  }

  // 질문 입력 화면
  return (
    <QuestionStep
      activeQuestion={activeQuestion}
      progress={progress}
      activeQuestionIndex={activeQuestionIndex}
      totalQuestions={questions.length}
      isTypingComplete={isTypingComplete}
      handleTypingComplete={handleTypingComplete}
      getFormDataValue={getFormDataValue}
      handleValueChange={handleValueChange}
      handleValueSubmit={handleValueSubmit}
      handleGoBack={handleGoBack}
      setStep={setStep}
    />
  );
}
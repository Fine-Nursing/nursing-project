import type { EducationLevel, NursingRole } from 'src/types/onboarding';

export type BasicQuestion = {
  key: 'name' | 'education' | 'nursingRole' | 'experienceYears';
  title: string;
  subtitle: string;
  validation?: (value: string) => boolean;
  options?: string[];
  inputType?: 'text' | 'number';
};

export interface BasicInfoFormData {
  name: string;
  education: EducationLevel | '';
  nursingRole: NursingRole | '';
  experienceYears: number | '';
}

export interface QuestionStepProps {
  question: BasicQuestion;
  value: string | number;
  onValueChange: (value: string | number) => void;
  onContinue: () => void;
  isTypingComplete: boolean;
  setIsTypingComplete: (complete: boolean) => void;
}

export interface SummaryStepProps {
  formData: BasicInfoFormData;
  onEdit: (field: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  editingField: string | null;
  setEditingField: (field: string | null) => void;
  updateFormData: (data: Partial<BasicInfoFormData>) => void;
}
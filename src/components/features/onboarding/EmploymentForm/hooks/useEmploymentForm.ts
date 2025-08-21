import { useState, useCallback, useMemo } from 'react';
import useOnboardingStore from 'src/store/onboardingStores';
import useEmploymentMutation from 'src/api/onboarding/useEmploymentMutation';
import toast from 'react-hot-toast';
import type { SectionInfo } from '../types';
import { validateCompensationSection } from '../utils/calculations';

export function useEmploymentForm() {
  const { formData, updateFormData, setStep } = useOnboardingStore();
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [customRatio, setCustomRatio] = useState<string>('');
  const [showCustomSpecialty, setShowCustomSpecialty] = useState(false);
  const [customSpecialty, setCustomSpecialty] = useState<string>('');

  const employmentMutation = useEmploymentMutation();

  const sections: SectionInfo[] = useMemo(() => [
    { 
      label: 'Workplace',
      isCompleted: completedSections.includes(0),
      isActive: currentSection === 0
    },
    { 
      label: 'Role',
      isCompleted: completedSections.includes(1),
      isActive: currentSection === 1
    },
    { 
      label: 'Compensation',
      isCompleted: completedSections.includes(2),
      isActive: currentSection === 2
    },
  ], [completedSections, currentSection]);

  const validateWorkplaceSection = useCallback(() => {
    return !!(
      formData.organizationName &&
      formData.organizationCity &&
      formData.organizationState
    );
  }, [formData]);

  const validateRoleSection = useCallback(() => {
    return !!(
      formData.employmentType &&
      formData.specialty
    );
  }, [formData]);

  const validateCurrentSection = useCallback(() => {
    switch (currentSection) {
      case 0: return validateWorkplaceSection();
      case 1: return validateRoleSection();
      case 2: return validateCompensationSection(formData);
      default: return false;
    }
  }, [currentSection, validateWorkplaceSection, validateRoleSection, formData]);

  const handleNextSection = useCallback(() => {
    if (validateCurrentSection()) {
      if (!completedSections.includes(currentSection)) {
        setCompletedSections([...completedSections, currentSection]);
      }
      if (currentSection < sections.length - 1) {
        setCurrentSection(currentSection + 1);
      } else {
        setShowSummary(true);
      }
    } else {
      toast.error('Please fill in all required information');
    }
  }, [validateCurrentSection, completedSections, currentSection, sections.length]);

  const handlePreviousSection = useCallback(() => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    } else {
      setStep('basicInfo');
    }
  }, [currentSection, setStep]);

  const handleSectionClick = useCallback((sectionIndex: number) => {
    if (sectionIndex <= Math.max(...completedSections, -1) + 1) {
      setCurrentSection(sectionIndex);
    }
  }, [completedSections]);

  const handleSubmit = useCallback(async () => {
    try {
      // Final validation
      if (!validateWorkplaceSection() || !validateRoleSection() || !validateCompensationSection(formData)) {
        toast.error('Please complete all sections before submitting');
        return;
      }

      const payload = {
        organizationName: formData.organizationName,
        organizationCity: formData.organizationCity,
        organizationState: formData.organizationState,
        employmentType: formData.employmentType,
        specialty: formData.specialty,
        subSpecialty: formData.subSpecialty,
        baseSalary: Number((formData as any).baseSalary),
        salaryUnit: (formData as any).salaryUnit,
        shiftType: (formData as any).shiftType,
        nurseName: (formData as any).nurseName,
        experienceInSpecialty: Number((formData as any).experienceInSpecialty),
        nurseToPatientRatio: (formData as any).nurseToPatientRatio,
        differentials: (formData as any).differentials || [],
      };

      await employmentMutation.mutateAsync(payload as any);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save employment information'
      );
    }
  }, [formData, validateWorkplaceSection, validateRoleSection, employmentMutation]);

  const resetForm = useCallback(() => {
    setShowSummary(false);
    setCurrentSection(0);
    setCompletedSections([]);
    setCustomRatio('');
    setShowCustomSpecialty(false);
    setCustomSpecialty('');
  }, []);

  return {
    // State
    currentSection,
    completedSections,
    showSummary,
    customRatio,
    setCustomRatio,
    showCustomSpecialty,
    setShowCustomSpecialty,
    customSpecialty,
    setCustomSpecialty,
    
    // Data
    sections,
    formData,
    
    // Mutation
    employmentMutation,
    
    // Handlers
    handleNextSection,
    handlePreviousSection,
    handleSectionClick,
    handleSubmit,
    resetForm,
    
    // Validation
    validateCurrentSection,
    validateWorkplaceSection,
    validateRoleSection,
    
    // Store actions
    updateFormData,
    setStep,
  };
}
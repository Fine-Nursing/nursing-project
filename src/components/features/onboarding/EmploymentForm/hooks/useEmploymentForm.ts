import { useState, useCallback, useMemo } from 'react';
import useOnboardingStore from 'src/store/onboardingStores';
import useEmploymentMutation from 'src/api/onboarding/useEmploymentMutation';
import toast from 'react-hot-toast';
import type { EmploymentType, ShiftType } from 'src/types/onboarding';
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

  const validateWorkplaceSection = useCallback(() => !!(
      formData.organizationName &&
      formData.organizationCity &&
      formData.organizationState
    ), [formData]);

  const validateRoleSection = useCallback(() => !!(
      formData.employmentType &&
      formData.specialty &&
      formData.shiftType &&
      formData.nurseToPatientRatio
    ), [formData]);

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

  const handleContinue = useCallback(async () => {
    try {
      // Debug logging
      console.log('Form Data:', formData);
      console.log('Workplace valid:', validateWorkplaceSection());
      console.log('Role valid:', validateRoleSection());
      console.log('Compensation valid:', validateCompensationSection(formData));
      
      // Final validation
      if (!validateWorkplaceSection() || !validateRoleSection() || !validateCompensationSection(formData)) {
        toast.error('Please complete all sections before submitting');
        return;
      }

      // Debugging log
      console.log('Sending to API:', {
        organizationName: formData.organizationName,
        organizationCity: formData.organizationCity,
        organizationState: formData.organizationState,
      });
      
      const payload = {
        organizationName: formData.organizationName || '',
        organizationCity: formData.organizationCity || '',
        organizationState: formData.organizationState || '',
        specialty: formData.specialty || '',
        subSpecialty: formData.subSpecialty || undefined,
        // Calculate start year based on experience years from BasicInfo
        employmentStartYear: new Date().getFullYear() - (formData.experienceYears || 0),
        employmentType: formData.employmentType as EmploymentType,
        shiftType: formData.shiftType as ShiftType,
        nurseToPatientRatio: formData.nurseToPatientRatio || '',
        basePay: formData.basePay || 0,
        paymentFrequency: formData.paymentFrequency || 'hourly',
        isUnionized: formData.isUnionized || false,
        // Include unit and group to match Backend DTO
        individualDifferentials: formData.individualDifferentials?.map((diff: any) => ({
          type: diff.type,
          amount: diff.amount,  // Already converted to hourly rate
          unit: 'hourly' as const,  // All amounts are converted to hourly rate, so 'hourly'
          group: diff.group || 'Custom',  // Set to 'Custom' if group is not specified
        })) || [],
        differentialsFreeText: formData.differentialsFreeText || undefined,
      };

      await employmentMutation.mutateAsync(payload);
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
    setCurrentSection,
    completedSections,
    setCompletedSections,
    showSummary,
    setShowSummary,
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
    handleSectionClick,
    handleContinue,
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
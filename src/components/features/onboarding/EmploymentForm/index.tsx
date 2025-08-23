import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useMemo } from 'react';
import { useJsApiLoader, type Libraries } from '@react-google-maps/api';
import toast from 'react-hot-toast';
import CompactStepIndicator from '../components/CompactStepIndicator';
import WorkplaceSection from './components/WorkplaceSection';
import RoleSection from './components/RoleSection';
import CompensationSection from './components/CompensationSection';
import SummaryView from './components/SummaryView';
import { useEmploymentForm } from './hooks/useEmploymentForm';
import { DIFFERENTIAL_LIST } from 'src/lib/constants/differential';
import type { IndividualDifferentialItem } from 'src/types/onboarding';

const libraries: Libraries = ['places'];

export default function EmploymentForm() {
  const {
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
    
    // Validation
    validateWorkplaceSection,
    validateRoleSection,
    
    // Store actions
    updateFormData,
    setStep,
  } = useEmploymentForm();
  
  // Differential states
  const [differentialInput, setDifferentialInput] = useState('');
  const [showDifferentialSuggestions, setShowDifferentialSuggestions] = useState(false);
  const [customDiff, setCustomDiff] = useState<{
    type: string;
    amount: number;
    unit?: 'hourly' | 'annual';  // Optional for UI display only
    group?: string;
  }>({
    type: '',
    amount: 0,
    unit: 'hourly',  // Default for display
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // Differential functions
  const differentialFilteredList = useMemo(() => {
    if (!differentialInput) return [];
    const input = differentialInput.toLowerCase();
    return DIFFERENTIAL_LIST.filter(
      (diff) =>
        diff.display.toLowerCase().includes(input) ||
        diff.group.toLowerCase().includes(input)
    ).slice(0, 8);
  }, [differentialInput]);

  const calculateTotalDifferentials = (differentials: IndividualDifferentialItem[]) => 
    differentials.reduce(
      (totals, diff) => {
        // 모든 값이 시급으로 저장됨
        totals.hourly += diff.amount;
        // annual은 시급 * 2080으로 계산 (표시용)
        totals.annual = totals.hourly * 2080;
        return totals;
      },
      { hourly: 0, annual: 0 }
    );

  const handleDifferentialInputChange = (value: string) => {
    setDifferentialInput(value);
    setShowDifferentialSuggestions(true);

    // Auto-select if exact match
    const exactMatch = DIFFERENTIAL_LIST.find(
      (diff) => diff.display.toLowerCase() === value.toLowerCase()
    );
    if (exactMatch) {
      setCustomDiff({
        ...customDiff,
        type: exactMatch.display,
        group: exactMatch.group,
      });
    } else {
      setCustomDiff({
        ...customDiff,
        type: value,
        group: 'Other',
      });
    }
  };

  const handleDifferentialSelectAndSet = (diffType: string) => {
    const selected = DIFFERENTIAL_LIST.find((diff) => diff.display === diffType);
    if (selected) {
      setDifferentialInput(selected.display);
      setCustomDiff({
        ...customDiff,
        type: selected.display,
        group: selected.group,
      });
    }
    setShowDifferentialSuggestions(false);
  };

  const addPopularDifferential = (diffType: string) => {
    // Check if already added
    if (formData.individualDifferentials?.some((d: IndividualDifferentialItem) => d.type === diffType)) {
      // Remove if already exists
      const filtered = formData.individualDifferentials.filter((d: IndividualDifferentialItem) => d.type !== diffType);
      updateFormData({ individualDifferentials: filtered });
      toast.success(`Removed ${diffType} differential`);
      return;
    }

    // Set up for custom amount input
    const selected = DIFFERENTIAL_LIST.find(d => d.display === diffType);
    setDifferentialInput(diffType);
    setCustomDiff({
      type: diffType,
      amount: diffType === 'Holiday' ? 2 : diffType === 'Weekend' ? 1.5 : 1, // Suggested defaults
      unit: 'hourly',
      group: selected ? selected.group : 'Shift Differentials'
    });
    toast(`💡 Set ${diffType} - now enter the amount below`, {
      icon: '📝',
      duration: 3000
    });
  };

  const addCustomDifferential = () => {
    if (!customDiff.type || customDiff.amount <= 0) return;

    // Annual을 Hourly로 변환 (2080시간 = 52주 * 40시간 기준)
    const hourlyAmount = customDiff.unit === 'annual' 
      ? Number((customDiff.amount / 2080).toFixed(2))  // 소수점 2자리로 반올림
      : customDiff.amount;

    // Check for duplicates (type만으로 체크, unit 제외)
    if (
      formData.individualDifferentials?.some(
        (d: IndividualDifferentialItem) => d.type === customDiff.type
      )
    ) {
      toast.error('This differential already exists');
      return;
    }

    const newDiff: IndividualDifferentialItem = {
      type: customDiff.type,
      amount: hourlyAmount,  // 항상 시급으로 저장
      // UI 표시용으로 원래 입력값과 unit 정보 저장 (optional)
      unit: 'hourly',  // DB에는 전송 안 되지만 UI 표시용
      group: customDiff.group || 'Other',
    };

    const updatedDifferentials = [
      ...(formData.individualDifferentials || []),
      newDiff,
    ];

    updateFormData({ individualDifferentials: updatedDifferentials });
    
    // Reset form
    setCustomDiff({ type: '', amount: 0, unit: 'hourly' });
    setDifferentialInput('');
    
    // 변환 정보 포함한 성공 메시지
    if (customDiff.unit === 'annual') {
      toast.success(`Differential added! ($${customDiff.amount}/year → $${hourlyAmount}/hour)`);
    } else {
      toast.success('Differential added!');
    }
  };

  const removeDifferential = (index: number) => {
    const updated = [...(formData.individualDifferentials || [])];
    updated.splice(index, 1);
    updateFormData({ individualDifferentials: updated });
  };

  // Navigation handlers
  const handleNextSection = useCallback(() => {
    if (currentSection === 0 && validateWorkplaceSection()) {
      if (!completedSections.includes(0)) {
        setCompletedSections([...completedSections, 0]);
      }
      setCurrentSection(1);
    } else if (currentSection === 1 && validateRoleSection()) {
      if (!completedSections.includes(1)) {
        setCompletedSections([...completedSections, 1]);
      }
      setCurrentSection(2);
    } else {
      toast.error('Please fill in all required information');
    }
  }, [currentSection, completedSections, setCompletedSections, setCurrentSection, validateWorkplaceSection, validateRoleSection]);

  const handlePreviousSection = useCallback(() => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    } else {
      setStep('basicInfo');
    }
  }, [currentSection, setCurrentSection, setStep]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // We're on the last section (Compensation), so show summary
    setShowSummary(true);
  }, [setShowSummary]);

  if (showSummary) {
    return (
      <SummaryView
        formData={formData}
        updateFormData={updateFormData}
        calculateTotalDifferentials={calculateTotalDifferentials}
        handleContinue={handleContinue}
        setShowSummary={setShowSummary}
        employmentMutation={employmentMutation}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-8">
        <CompactStepIndicator
          steps={sections}
          currentStep={currentSection}
          onStepClick={handleSectionClick}
        />
      </div>

      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {currentSection === 0 && (
              <WorkplaceSection
                key="workplace"
                formData={formData}
                updateFormData={updateFormData}
                handleNextSection={handleNextSection}
                handlePreviousSection={handlePreviousSection}
                validateWorkplaceSection={validateWorkplaceSection}
                isLoaded={isLoaded}
              />
            )}

            {currentSection === 1 && (
              <RoleSection
                key="role"
                formData={formData}
                updateFormData={updateFormData}
                handleNextSection={handleNextSection}
                handlePreviousSection={handlePreviousSection}
                validateRoleSection={validateRoleSection}
                showCustomSpecialty={showCustomSpecialty}
                setShowCustomSpecialty={setShowCustomSpecialty}
                customSpecialty={customSpecialty}
                setCustomSpecialty={setCustomSpecialty}
                customRatio={customRatio}
                setCustomRatio={setCustomRatio}
              />
            )}

            {currentSection === 2 && (
              <CompensationSection
                key="compensation"
                formData={formData}
                updateFormData={updateFormData}
                handlePreviousSection={handlePreviousSection}
                handleSubmit={handleSubmit}
                differentialInput={differentialInput}
                setDifferentialInput={setDifferentialInput}
                showDifferentialSuggestions={showDifferentialSuggestions}
                setShowDifferentialSuggestions={setShowDifferentialSuggestions}
                customDiff={customDiff}
                setCustomDiff={setCustomDiff}
                differentialFilteredList={differentialFilteredList}
                handleDifferentialInputChange={handleDifferentialInputChange}
                handleDifferentialSelectAndSet={handleDifferentialSelectAndSet}
                addPopularDifferential={addPopularDifferential}
                addCustomDifferential={addCustomDifferential}
                removeDifferential={removeDifferential}
                calculateTotalDifferentials={calculateTotalDifferentials}
              />
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}
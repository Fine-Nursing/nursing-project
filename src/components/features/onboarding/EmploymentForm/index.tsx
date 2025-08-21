import { motion, AnimatePresence } from 'framer-motion';
import CompactStepIndicator from '../components/CompactStepIndicator';
import WorkplaceSection from './components/WorkplaceSection';
import RoleSection from './components/RoleSection';
import CompensationSection from './components/CompensationSection';
import { useEmploymentForm } from './hooks/useEmploymentForm';
import { useDifferentialPayroll } from './hooks/useDifferentialPayroll';
import { validateCompensationSection } from './utils/calculations';

export default function EmploymentForm() {
  const {
    // State
    currentSection,
    completedSections,
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
    
    // Validation
    validateWorkplaceSection,
    validateRoleSection,
    
    // Store actions
    updateFormData,
  } = useEmploymentForm();

  const {
    differentialInput,
    setDifferentialInput,
    showDifferentialSuggestions,
    setShowDifferentialSuggestions,
    customDiff,
    setCustomDiff,
    differentialFilteredList,
    totalDifferentials,
    addDifferential,
    addCustomDifferential,
    removeDifferential,
    editDifferential,
  } = useDifferentialPayroll(formData, updateFormData);

  const isLoading = employmentMutation.isPending;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 lg:p-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Employment Information
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
              Tell us about your workplace and professional details
            </p>
          </div>

          {/* Step Indicator */}
          <CompactStepIndicator
            steps={sections}
            currentStep={currentSection}
            onStepClick={handleSectionClick}
          />

          {/* Form Sections */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              {currentSection === 0 && (
                <WorkplaceSection
                  key="workplace"
                  formData={formData}
                  updateFormData={updateFormData}
                  handleNextSection={handleNextSection}
                  handlePreviousSection={handlePreviousSection}
                  validateWorkplaceSection={validateWorkplaceSection}
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
                />
              )}

              {currentSection === 2 && (
                <CompensationSection
                  key="compensation"
                  formData={formData}
                  updateFormData={updateFormData}
                  handlePreviousSection={handlePreviousSection}
                  handleSubmit={handleSubmit}
                  validateCompensationSection={() => validateCompensationSection(formData)}
                  isLoading={isLoading}
                  customRatio={customRatio}
                  setCustomRatio={setCustomRatio}
                  differentialInput={differentialInput}
                  setDifferentialInput={setDifferentialInput}
                  showDifferentialSuggestions={showDifferentialSuggestions}
                  setShowDifferentialSuggestions={setShowDifferentialSuggestions}
                  customDiff={customDiff}
                  setCustomDiff={setCustomDiff}
                  differentialFilteredList={differentialFilteredList}
                  totalDifferentials={totalDifferentials}
                  addDifferential={addDifferential}
                  addCustomDifferential={addCustomDifferential}
                  removeDifferential={removeDifferential}
                  editDifferential={editDifferential}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
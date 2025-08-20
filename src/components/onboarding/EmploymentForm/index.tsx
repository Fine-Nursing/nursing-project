import { motion, AnimatePresence } from 'framer-motion';
import CompactStepIndicator from '../components/CompactStepIndicator';
import WorkplaceSection from './components/WorkplaceSection';
import RoleSection from './components/RoleSection';
import CompensationSection from './components/CompensationSection';
import { useEmploymentForm } from './hooks/useEmploymentForm';
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

  const isLoading = employmentMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Employment Information
            </h2>
            <p className="text-gray-600">
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
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
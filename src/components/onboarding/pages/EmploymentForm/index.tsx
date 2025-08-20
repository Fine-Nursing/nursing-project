import React, { useState, useCallback } from 'react';
import { useEmploymentFlow } from './hooks/useEmploymentFlow';
import { useFormValidation } from './hooks/useFormValidation';
import { useFormSubmission } from './hooks/useFormSubmission';
import { WorkplaceLocationPicker } from './components/WorkplaceLocationPicker';
import { JobDetailsInput } from './components/JobDetailsInput';
import { PayrollConfiguration } from './components/PayrollConfiguration';
import { EmploymentReview } from './components/EmploymentReview';
import { FormHeader } from './components/FormHeader';
import { FormNavigation } from './components/FormNavigation';
import { initialJobDetails, initialLocationData } from './constants';
import type {
  EmploymentFormProps,
  LocationData,
  JobDetailsData,
  PayrollData,
} from './types';

export const EmploymentForm: React.FC<EmploymentFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const {
    currentSection,
    showSummary,
    sections,
    isLastSection,
    allSectionsCompleted,
    goToNextSection,
    goToPreviousSection,
    goToSection,
    markSectionCompleted,
  } = useEmploymentFlow();

  // Form data state
  const [locationData, setLocationData] = useState<LocationData>({
    ...initialLocationData,
    ...initialData?.location,
  });

  const [jobDetailsData, setJobDetailsData] = useState<JobDetailsData>({
    ...initialJobDetails,
    ...initialData?.jobDetails,
  });

  const [payrollData, setPayrollData] = useState<PayrollData | null>(null);

  // Form validation
  const {
    formErrors,
    validateCurrentSection,
    validateAllData,
    clearErrors,
  } = useFormValidation(currentSection, locationData, jobDetailsData, payrollData);

  // Form submission
  const { isSubmitting, handleSubmit } = useFormSubmission(
    locationData,
    jobDetailsData,
    payrollData,
    validateAllData,
    onSubmit
  );

  // Section navigation handlers
  const handleNextSection = useCallback(() => {
    const isValid = validateCurrentSection();
    
    if (isValid) {
      markSectionCompleted(currentSection);
      goToNextSection();
    }
  }, [validateCurrentSection, markSectionCompleted, currentSection, goToNextSection]);

  const handlePreviousSection = useCallback(() => {
    clearErrors();
    goToPreviousSection();
  }, [clearErrors, goToPreviousSection]);

  // Data change handlers
  const handleLocationConfirmed = useCallback((data: LocationData) => {
    setLocationData(data);
  }, []);

  const handleJobDetailsChange = useCallback((field: keyof JobDetailsData, value: any) => {
    setJobDetailsData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handlePayrollDataChange = useCallback((data: PayrollData) => {
    setPayrollData(data);
  }, []);

  // Edit handlers for review section
  const handleEdit = useCallback((section: 'location' | 'jobDetails' | 'payroll') => {
    const sectionIndex = section === 'location' ? 0 : section === 'jobDetails' ? 1 : 2;
    goToSection(sectionIndex);
  }, [goToSection]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <FormHeader
        title="Employment Information"
        sections={sections}
        currentSection={currentSection}
        onSectionClick={goToSection}
      />

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {!showSummary ? (
          <>
            {/* Section Content */}
            {currentSection === 0 && (
              <WorkplaceLocationPicker
                onLocationConfirmed={handleLocationConfirmed}
                initialValues={locationData}
              />
            )}
            
            {currentSection === 1 && (
              <JobDetailsInput
                data={jobDetailsData}
                onChange={handleJobDetailsChange}
                errors={formErrors}
              />
            )}
            
            {currentSection === 2 && (
              <PayrollConfiguration
                onPayrollDataChange={handlePayrollDataChange}
                initialData={payrollData || undefined}
              />
            )}

            <FormNavigation
              currentSection={currentSection}
              isLastSection={isLastSection}
              hasErrors={Object.keys(formErrors).length > 0}
              onNext={handleNextSection}
              onPrevious={handlePreviousSection}
              onCancel={onCancel}
            />
          </>
        ) : (
          // Review Section
          payrollData && (
            <EmploymentReview
              locationData={locationData}
              jobDetailsData={jobDetailsData}
              payrollData={payrollData}
              onEdit={handleEdit}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              errors={formErrors}
            />
          )
        )}
      </div>
    </div>
  );
};

export default EmploymentForm;
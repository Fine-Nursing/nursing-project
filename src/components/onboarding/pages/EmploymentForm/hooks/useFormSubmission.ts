import { useState, useCallback } from 'react';
import type { LocationData, JobDetailsData, PayrollData, EmploymentFormProps } from '../types';

export function useFormSubmission(
  locationData: LocationData,
  jobDetailsData: JobDetailsData,
  payrollData: PayrollData | null,
  validateAllData: () => boolean,
  onSubmit?: EmploymentFormProps['onSubmit']
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const isValid = validateAllData();
    
    if (isValid && payrollData && onSubmit) {
      setIsSubmitting(true);
      
      try {
        const formData = {
          location: locationData,
          jobDetails: jobDetailsData,
          payroll: payrollData,
        };
        
        await onSubmit(formData);
      } catch (error) {
        console.error('Error submitting form:', error);
        // Handle submission error
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [
    validateAllData,
    payrollData,
    locationData,
    jobDetailsData,
    onSubmit,
  ]);

  return {
    isSubmitting,
    handleSubmit,
  };
}
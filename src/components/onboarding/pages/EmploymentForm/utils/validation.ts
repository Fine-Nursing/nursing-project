import type { LocationData, JobDetailsData, PayrollData } from '../types';

export const validateLocationData = (locationData: LocationData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!locationData.organizationName && !locationData.organizationCity) {
    errors.location = 'Please provide at least an organization name or city';
  }
  
  return errors;
};

export const validateJobDetailsData = (jobDetailsData: JobDetailsData): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!jobDetailsData.nursingRole) {
    errors.nursingRole = 'Nursing role is required';
  }
  
  if (!jobDetailsData.nursingSpecialty) {
    errors.nursingSpecialty = 'Nursing specialty is required';
  }
  
  if (!jobDetailsData.educationLevel) {
    errors.educationLevel = 'Education level is required';
  }
  
  if (!jobDetailsData.yearsOfExperience || parseInt(jobDetailsData.yearsOfExperience) < 0) {
    errors.yearsOfExperience = 'Valid years of experience is required';
  }
  
  return errors;
};

export const validatePayrollData = (payrollData: PayrollData | null): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!payrollData) {
    errors.payroll = 'Payroll information is required';
    return errors;
  }
  
  if (payrollData.validation && !payrollData.validation.isValid) {
    payrollData.validation.errors.forEach((error, index) => {
      errors[`payroll_${index}`] = error;
    });
  }
  
  return errors;
};

export const validateSectionData = (
  sectionIndex: number,
  locationData: LocationData,
  jobDetailsData: JobDetailsData,
  payrollData: PayrollData | null
): Record<string, string> => {
  let errors: Record<string, string> = {};
  
  switch (sectionIndex) {
    case 0: // Workplace Location
      errors = validateLocationData(locationData);
      break;
    case 1: // Job Details
      errors = validateJobDetailsData(jobDetailsData);
      break;
    case 2: // Payroll Configuration
      errors = validatePayrollData(payrollData);
      break;
    default:
      break;
  }
  
  return errors;
};

export const validateAllSections = (
  locationData: LocationData,
  jobDetailsData: JobDetailsData,
  payrollData: PayrollData | null
): Record<string, string> => {
  const locationErrors = validateLocationData(locationData);
  const jobDetailsErrors = validateJobDetailsData(jobDetailsData);
  const payrollErrors = validatePayrollData(payrollData);
  
  return {
    ...locationErrors,
    ...jobDetailsErrors,
    ...payrollErrors,
  };
};
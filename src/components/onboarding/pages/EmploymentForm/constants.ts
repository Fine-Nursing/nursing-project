import type { LocationData, JobDetailsData } from './types';

export const initialJobDetails: JobDetailsData = {
  nursingRole: '',
  nursingSpecialty: '',
  contractLength: '',
  startDate: '',
  educationLevel: '',
  yearsOfExperience: '',
  certifications: [],
  workSchedule: {
    shiftType: '',
    hoursPerWeek: '',
    daysPerWeek: '',
    preferredShifts: [],
  },
  additionalInfo: '',
};

export const initialLocationData: LocationData = {
  organizationName: '',
  organizationCity: '',
  organizationState: '',
};
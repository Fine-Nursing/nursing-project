import React from 'react';

interface JobDetailsData {
  nursingRole: string;
  nursingSpecialty: string;
  contractLength: string;
  startDate: string;
  educationLevel: string;
  yearsOfExperience: string;
  certifications: string[];
  workSchedule: {
    shiftType: string;
    hoursPerWeek: string;
    daysPerWeek: string;
    preferredShifts: string[];
  };
  additionalInfo: string;
}

interface JobDetailsInputProps {
  data: JobDetailsData;
  onChange: (field: keyof JobDetailsData, value: any) => void;
  errors?: Record<string, string>;
}

const nursingRoles = [
  'Registered Nurse (RN)',
  'Licensed Practical Nurse (LPN)',
  'Charge Nurse',
  'Staff Nurse',
  'Travel Nurse',
  'ICU Nurse',
  'ER Nurse',
  'OR Nurse',
  'Pediatric Nurse',
  'Psychiatric Nurse',
  'Nurse Practitioner (NP)',
  'Clinical Nurse Specialist',
  'Nurse Manager',
  'Other'
];

const nursingSpecialties = [
  'Medical-Surgical',
  'Intensive Care Unit (ICU)',
  'Emergency Room (ER)',
  'Operating Room (OR)',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Oncology',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Psychiatry',
  'Geriatrics',
  'Home Health',
  'Rehabilitation',
  'Critical Care',
  'Telemetry',
  'Dialysis',
  'Post-Anesthesia Care Unit (PACU)',
  'Labor & Delivery',
  'Neonatal ICU (NICU)',
  'Other'
];

const educationLevels = [
  'Associate Degree in Nursing (ADN)',
  'Bachelor of Science in Nursing (BSN)',
  'Master of Science in Nursing (MSN)',
  'Doctor of Nursing Practice (DNP)',
  'PhD in Nursing',
  'Diploma in Nursing',
  'Other'
];

const contractLengths = [
  '13 weeks',
  '26 weeks',
  '52 weeks',
  'Permanent',
  'Per Diem',
  'Other'
];

const shiftTypes = [
  'Day Shift (7am-7pm)',
  'Night Shift (7pm-7am)',
  'Rotating Shifts',
  'Evening Shift (3pm-11pm)',
  'NOC Shift (11pm-7am)',
  'Flexible',
  'Other'
];

const commonCertifications = [
  'BLS (Basic Life Support)',
  'ACLS (Advanced Cardiac Life Support)',
  'PALS (Pediatric Advanced Life Support)',
  'TNCC (Trauma Nursing Core Course)',
  'CCRN (Critical Care Registered Nurse)',
  'CEN (Certified Emergency Nurse)',
  'CNOR (Certified Perioperative Nurse)',
  'CMSRN (Certified Medical-Surgical Registered Nurse)',
  'PCCN (Progressive Care Certified Nurse)',
  'Other'
];

export const JobDetailsInput: React.FC<JobDetailsInputProps> = ({
  data,
  onChange,
  errors = {}
}) => {
  const handleInputChange = (field: keyof JobDetailsData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    onChange(field, e.target.value);
  };

  const handleCertificationChange = (certification: string, checked: boolean) => {
    const updatedCertifications = checked
      ? [...data.certifications, certification]
      : data.certifications.filter(cert => cert !== certification);
    onChange('certifications', updatedCertifications);
  };

  const handleWorkScheduleChange = (field: keyof JobDetailsData['workSchedule']) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onChange('workSchedule', {
      ...data.workSchedule,
      [field]: e.target.value
    });
  };

  const handlePreferredShiftsChange = (shift: string, checked: boolean) => {
    const updatedShifts = checked
      ? [...data.workSchedule.preferredShifts, shift]
      : data.workSchedule.preferredShifts.filter(s => s !== shift);
    
    onChange('workSchedule', {
      ...data.workSchedule,
      preferredShifts: updatedShifts
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Job Details & Requirements
        </h3>
      </div>

      {/* Basic Job Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nursing Role *
          </label>
          <select
            value={data.nursingRole}
            onChange={handleInputChange('nursingRole')}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.nursingRole ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select nursing role</option>
            {nursingRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {errors.nursingRole && (
            <p className="mt-1 text-sm text-red-600">{errors.nursingRole}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nursing Specialty *
          </label>
          <select
            value={data.nursingSpecialty}
            onChange={handleInputChange('nursingSpecialty')}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.nursingSpecialty ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select specialty</option>
            {nursingSpecialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
          {errors.nursingSpecialty && (
            <p className="mt-1 text-sm text-red-600">{errors.nursingSpecialty}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Education Level *
          </label>
          <select
            value={data.educationLevel}
            onChange={handleInputChange('educationLevel')}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.educationLevel ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Select education level</option>
            {educationLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {errors.educationLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.educationLevel}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience *
          </label>
          <input
            type="number"
            value={data.yearsOfExperience}
            onChange={handleInputChange('yearsOfExperience')}
            min="0"
            max="50"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.yearsOfExperience ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter years of experience"
          />
          {errors.yearsOfExperience && (
            <p className="mt-1 text-sm text-red-600">{errors.yearsOfExperience}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Length
          </label>
          <select
            value={data.contractLength}
            onChange={handleInputChange('contractLength')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select contract length</option>
            {contractLengths.map(length => (
              <option key={length} value={length}>{length}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Start Date
          </label>
          <input
            type="date"
            value={data.startDate}
            onChange={handleInputChange('startDate')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Certifications
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {commonCertifications.map(certification => (
            <label key={certification} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.certifications.includes(certification)}
                onChange={(e) => handleCertificationChange(certification, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{certification}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Work Schedule */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Work Schedule Preferences</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Shift Type
            </label>
            <select
              value={data.workSchedule.shiftType}
              onChange={handleWorkScheduleChange('shiftType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select shift type</option>
              {shiftTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hours per Week
            </label>
            <input
              type="number"
              value={data.workSchedule.hoursPerWeek}
              onChange={handleWorkScheduleChange('hoursPerWeek')}
              min="1"
              max="80"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 36, 40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Days per Week
            </label>
            <input
              type="number"
              value={data.workSchedule.daysPerWeek}
              onChange={handleWorkScheduleChange('daysPerWeek')}
              min="1"
              max="7"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 3, 5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preferred Shifts (select all that apply)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {shiftTypes.map(shift => (
              <label key={shift} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.workSchedule.preferredShifts.includes(shift)}
                  onChange={(e) => handlePreferredShiftsChange(shift, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{shift}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Information
        </label>
        <textarea
          value={data.additionalInfo}
          onChange={handleInputChange('additionalInfo')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Any additional information about your job preferences, special requirements, or other relevant details..."
        />
      </div>
    </div>
  );
};
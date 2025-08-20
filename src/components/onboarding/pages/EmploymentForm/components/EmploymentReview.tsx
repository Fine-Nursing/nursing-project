import React from 'react';
import type { DifferentialItem } from '../hooks/useDifferentialCalculator';

interface LocationData {
  organizationName: string;
  organizationCity: string;
  organizationState: string;
}

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

interface PayrollData {
  hourlyRate: string;
  weeklyHours: string;
  payFrequency: string;
  contractType: string;
  customRatio: string;
  differentialItems: DifferentialItem[];
  baseWeeklyPay: number;
  totalDifferentialWeekly: number;
  totalWeeklyPay: number;
  estimatedAnnualPay: number;
}

interface EmploymentReviewProps {
  locationData: LocationData;
  jobDetailsData: JobDetailsData;
  payrollData: PayrollData;
  onEdit: (section: 'location' | 'jobDetails' | 'payroll') => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  errors?: Record<string, string>;
}

export const EmploymentReview: React.FC<EmploymentReviewProps> = ({
  locationData,
  jobDetailsData,
  payrollData,
  onEdit,
  onSubmit,
  isSubmitting = false,
  errors = {}
}) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Review Your Employment Information
        </h3>
        <p className="text-sm text-gray-600">
          Please review all the information below before submitting. You can edit any section by clicking the "Edit" button.
        </p>
      </div>

      {/* Location Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-md font-medium text-gray-900">Workplace Location</h4>
          <button
            onClick={() => onEdit('location')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        
        <div className="space-y-2">
          {locationData.organizationName && (
            <div>
              <span className="text-sm font-medium text-gray-700">Organization:</span>
              <span className="ml-2 text-gray-900">{locationData.organizationName}</span>
            </div>
          )}
          {(locationData.organizationCity || locationData.organizationState) && (
            <div>
              <span className="text-sm font-medium text-gray-700">Location:</span>
              <span className="ml-2 text-gray-900">
                {locationData.organizationCity}
                {locationData.organizationCity && locationData.organizationState && ', '}
                {locationData.organizationState}
              </span>
            </div>
          )}
          {!locationData.organizationName && !locationData.organizationCity && !locationData.organizationState && (
            <p className="text-sm text-gray-500 italic">No location information provided</p>
          )}
        </div>
      </div>

      {/* Job Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-md font-medium text-gray-900">Job Details</h4>
          <button
            onClick={() => onEdit('jobDetails')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-700">Role:</span>
            <span className="ml-2 text-gray-900">{jobDetailsData.nursingRole || 'Not specified'}</span>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-700">Specialty:</span>
            <span className="ml-2 text-gray-900">{jobDetailsData.nursingSpecialty || 'Not specified'}</span>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-700">Education:</span>
            <span className="ml-2 text-gray-900">{jobDetailsData.educationLevel || 'Not specified'}</span>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-700">Experience:</span>
            <span className="ml-2 text-gray-900">
              {jobDetailsData.yearsOfExperience ? `${jobDetailsData.yearsOfExperience} years` : 'Not specified'}
            </span>
          </div>
          
          {jobDetailsData.contractLength && (
            <div>
              <span className="text-sm font-medium text-gray-700">Contract Length:</span>
              <span className="ml-2 text-gray-900">{jobDetailsData.contractLength}</span>
            </div>
          )}
          
          {jobDetailsData.startDate && (
            <div>
              <span className="text-sm font-medium text-gray-700">Start Date:</span>
              <span className="ml-2 text-gray-900">
                {new Date(jobDetailsData.startDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Work Schedule */}
        {(jobDetailsData.workSchedule.shiftType || jobDetailsData.workSchedule.hoursPerWeek || jobDetailsData.workSchedule.daysPerWeek) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="text-sm font-medium text-gray-800 mb-2">Work Schedule</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {jobDetailsData.workSchedule.shiftType && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Shift Type:</span>
                  <span className="ml-2 text-gray-900 text-sm">{jobDetailsData.workSchedule.shiftType}</span>
                </div>
              )}
              {jobDetailsData.workSchedule.hoursPerWeek && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Hours/Week:</span>
                  <span className="ml-2 text-gray-900 text-sm">{jobDetailsData.workSchedule.hoursPerWeek}</span>
                </div>
              )}
              {jobDetailsData.workSchedule.daysPerWeek && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Days/Week:</span>
                  <span className="ml-2 text-gray-900 text-sm">{jobDetailsData.workSchedule.daysPerWeek}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Certifications */}
        {jobDetailsData.certifications.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="text-sm font-medium text-gray-800 mb-2">Certifications</h5>
            <div className="flex flex-wrap gap-2">
              {jobDetailsData.certifications.map(cert => (
                <span
                  key={cert}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        {jobDetailsData.additionalInfo && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="text-sm font-medium text-gray-800 mb-2">Additional Information</h5>
            <p className="text-sm text-gray-700">{jobDetailsData.additionalInfo}</p>
          </div>
        )}
      </div>

      {/* Payroll Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-md font-medium text-gray-900">Compensation Details</h4>
          <button
            onClick={() => onEdit('payroll')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <span className="text-sm font-medium text-gray-700">Hourly Rate:</span>
            <span className="ml-2 text-gray-900">
              {payrollData.hourlyRate ? `$${parseFloat(payrollData.hourlyRate).toFixed(2)}` : 'Not specified'}
            </span>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-700">Weekly Hours:</span>
            <span className="ml-2 text-gray-900">{payrollData.weeklyHours || 'Not specified'}</span>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-700">Pay Frequency:</span>
            <span className="ml-2 text-gray-900 capitalize">
              {payrollData.payFrequency || 'Not specified'}
            </span>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-700">Contract Type:</span>
            <span className="ml-2 text-gray-900 capitalize">
              {payrollData.contractType || 'Not specified'}
            </span>
          </div>
        </div>

        {/* Differentials */}
        {payrollData.differentialItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="text-sm font-medium text-gray-800 mb-3">Differential Pay</h5>
            <div className="space-y-2">
              {payrollData.differentialItems.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <div>
                    <span className="text-sm font-medium">{item.type}</span>
                    <span className="ml-2 text-xs text-gray-600">({item.group})</span>
                  </div>
                  <span className="text-sm text-gray-900">
                    ${item.amount.toFixed(2)}/{item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pay Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h5 className="text-sm font-medium text-gray-800 mb-3">Pay Summary</h5>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  ${payrollData.baseWeeklyPay.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600">Base Weekly</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  ${payrollData.totalDifferentialWeekly.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600">Differential Weekly</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">
                  ${payrollData.totalWeeklyPay.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600">Total Weekly</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">
                  ${payrollData.estimatedAnnualPay.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Estimated Annual</div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Ratio */}
        {payrollData.customRatio && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="text-sm font-medium text-gray-800 mb-2">Additional Notes</h5>
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              {payrollData.customRatio}
            </p>
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-md font-medium text-red-800 mb-2">Please fix the following errors:</h4>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field} className="text-sm text-red-600">{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={onSubmit}
          disabled={isSubmitting || Object.keys(errors).length > 0}
          className={`px-8 py-3 rounded-lg font-medium transition-colors ${
            isSubmitting || Object.keys(errors).length > 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Employment Information'}
        </button>
      </div>
    </div>
  );
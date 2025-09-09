import { m } from 'framer-motion';
import { 
  Briefcase, Stethoscope, Award, Check, Clock, Calendar, 
  Activity, MapPin, Users, Sun, Moon, Sunrise 
} from 'lucide-react';
import { useState, useEffect } from 'react';
import ActionButton from 'src/components/ui/button/ActionButton';
import { useSpecialties } from 'src/hooks/useSpecialties';
import type { EmploymentType, ShiftType } from 'src/types/onboarding';
import SelectionCard from '../../components/SelectionCard';
import CustomDropdown from '../../components/CustomDropdown';
import AnimatedInput from '../../components/AnimatedInput';

interface RoleSectionProps {
  formData: any;
  updateFormData: (data: any) => void;
  handleNextSection: () => void;
  handlePreviousSection: () => void;
  validateRoleSection: () => boolean;
  showCustomSpecialty: boolean;
  setShowCustomSpecialty: (show: boolean) => void;
  customSpecialty: string;
  setCustomSpecialty: (value: string) => void;
  customRatio: string;
  setCustomRatio: (value: string) => void;
}

const employmentTypeOptions = [
  { value: 'Full-time', icon: <Clock className="w-5 h-5" />, description: '36+ hours per week' },
  { value: 'Part-time', icon: <Calendar className="w-5 h-5" />, description: 'Less than 36 hours' },
  { value: 'Per Diem/PRN', icon: <Activity className="w-5 h-5" />, description: 'As-needed basis' },
  { value: 'Temporary/Contract', icon: <Award className="w-5 h-5" />, description: 'Fixed-term employment' },
  { value: 'Travel Nursing', icon: <MapPin className="w-5 h-5" />, description: 'Short-term assignments' },
  { value: 'Agency Nursing', icon: <Users className="w-5 h-5" />, description: 'Staffing agency placement' },
];

const shiftTypeOptions = [
  { value: 'Day Shift', icon: <Sun className="w-5 h-5" />, description: 'Daytime hours' },
  { value: 'Evening Shift', icon: <Sunrise className="w-5 h-5" />, description: 'Evening hours' },
  { value: 'Night Shift', icon: <Moon className="w-5 h-5" />, description: 'Overnight hours' },
  { value: 'Rotating Shift', icon: <Clock className="w-5 h-5" />, description: 'Variable shifts' },
];

const nurseRatioOptions = ['1:1', '1:2', '1:3', '1:4', '1:5', 'Custom'];

export default function RoleSection({
  formData,
  updateFormData,
  handleNextSection,
  handlePreviousSection,
  validateRoleSection,
  showCustomSpecialty,
  setShowCustomSpecialty,
  customSpecialty,
  setCustomSpecialty,
  customRatio,
  setCustomRatio,
}: RoleSectionProps) {
  const { getAllSpecialties, getSubSpecialties } = useSpecialties();
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(null);
  
  // Get all specialties from API
  const { data: specialtiesData, isLoading: specialtiesLoading } = getAllSpecialties;
  
  // Get sub-specialties for selected specialty
  const { data: subSpecialtiesData } = getSubSpecialties(selectedSpecialtyId);
  
  // Map specialties to dropdown format
  const specialtyOptions = specialtiesData?.specialties?.map(s => s.name) || [];
  if (specialtyOptions.length > 0 && !specialtyOptions.includes('Other')) {
    specialtyOptions.push('Other');
  }
  
  // Handle specialty selection
  const handleSpecialtyChange = (value: string) => {
    if (value === 'Other') {
      setShowCustomSpecialty(true);
      setCustomSpecialty('');
      updateFormData({ specialty: '' });
      setSelectedSpecialtyId(null);
    } else {
      updateFormData({ specialty: value });
      // Find the ID for the selected specialty
      const selected = specialtiesData?.specialties?.find(s => s.name === value);
      setSelectedSpecialtyId(selected?.id || null);
    }
  };
  return (
    <m.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-xl shadow-sm p-6 space-y-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Briefcase className="w-6 h-6 text-emerald-600" />
        Your Role & Schedule
      </h3>

      {/* Employment Type */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Employment Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {employmentTypeOptions.map((option) => (
            <SelectionCard
              key={option.value}
              value={option.value}
              label={option.value}
              description={option.description}
              isSelected={formData.employmentType === option.value}
              onClick={() => updateFormData({ employmentType: option.value as EmploymentType })}
              icon={option.icon}
            />
          ))}
        </div>
      </div>

      {/* Shift Type */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Primary Shift
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {shiftTypeOptions.map((option) => (
            <SelectionCard
              key={option.value}
              value={option.value}
              label={option.value}
              description={option.description}
              isSelected={formData.shiftType === option.value}
              onClick={() => updateFormData({ shiftType: option.value as ShiftType })}
              icon={option.icon}
            />
          ))}
        </div>
      </div>

      {/* Specialty Field - With Custom Input Option */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Nursing Specialty <span className="text-red-500">*</span>
        </label>
        {!showCustomSpecialty ? (
          <>
            <CustomDropdown
              value={formData.specialty || ''}
              onChange={handleSpecialtyChange}
              options={specialtyOptions}
              placeholder={specialtiesLoading ? "Loading specialties..." : "Search or select your specialty"}
              searchable
              className="w-full"
              icon={<Stethoscope className="w-5 h-5" />}
              disabled={specialtiesLoading}
            />
            <p className="text-xs text-gray-500">
              Can't find your specialty? Select "Other" to enter custom
            </p>
          </>
        ) : (
          <>
            <div className="flex gap-2">
              <AnimatedInput
                value={customSpecialty}
                onChange={setCustomSpecialty}
                placeholder="Enter your specialty"
                icon={<Stethoscope className="w-5 h-5" />}
                className="flex-1"
              />
              <ActionButton
                type="button"
                onClick={() => {
                  if (customSpecialty.trim()) {
                    updateFormData({ specialty: customSpecialty.trim() });
                    setShowCustomSpecialty(false);
                  }
                }}
                className="px-4 py-2"
              >
                Set
              </ActionButton>
              <ActionButton
                type="button"
                onClick={() => {
                  setShowCustomSpecialty(false);
                  setCustomSpecialty('');
                  updateFormData({ specialty: '' });
                }}
                variant="outline"
                className="px-4 py-2"
              >
                Cancel
              </ActionButton>
            </div>
            <p className="text-xs text-gray-500">
              Enter your specific specialty or area of practice
            </p>
          </>
        )}
        {formData.specialty && !showCustomSpecialty && (
          <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-emerald-600"
          >
            <Check className="w-4 h-4" />
            <span>Selected: {formData.specialty}</span>
          </m.div>
        )}
      </div>

      {/* Sub-specialty Field - Enhanced */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Sub-specialty or Certification <span className="text-gray-400 text-xs">(Optional)</span>
        </label>
        <div className="space-y-2">
          <AnimatedInput
            value={formData.subSpecialty || ''}
            onChange={(value) => updateFormData({ subSpecialty: value })}
            placeholder="e.g., Trauma ICU, CCRN, Pediatric Emergency"
            icon={<Award className="w-5 h-5" />}
          />
          {/* Quick suggestions from API */}
          {subSpecialtiesData?.subSpecialties && subSpecialtiesData.subSpecialties.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Suggestions based on {formData.specialty}:</p>
              <div className="flex flex-wrap gap-1">
                {subSpecialtiesData.subSpecialties.slice(0, 5).map((subSpec) => (
                  <m.button
                    key={subSpec.name}
                    type="button"
                    onClick={() => updateFormData({ subSpecialty: subSpec.name })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-700 rounded-md transition-colors"
                  >
                    {subSpec.name}
                  </m.button>
                ))}
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Add any specialized area or professional certification
        </p>
      </div>

      {/* Nurse to Patient Ratio */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Typical Nurse-to-Patient Ratio
        </label>
        {formData.nurseToPatientRatio === 'Custom' ? (
          <div className="flex gap-2 items-center">
            <AnimatedInput
              value={customRatio}
              onChange={setCustomRatio}
              placeholder="e.g., 1:10"
              className="flex-1"
            />
            <ActionButton
              type="button"
              onClick={() => {
                if (customRatio) {
                  updateFormData({ nurseToPatientRatio: customRatio });
                  setCustomRatio('');
                }
              }}
              className="px-4 py-2"
            >
              Set
            </ActionButton>
            <ActionButton
              type="button"
              onClick={() => {
                updateFormData({ nurseToPatientRatio: '' });
                setCustomRatio('');
              }}
              variant="outline"
              className="px-4 py-2"
            >
              Cancel
            </ActionButton>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {nurseRatioOptions.map((ratio) => (
              <m.button
                key={ratio}
                type="button"
                onClick={() => updateFormData({ nurseToPatientRatio: ratio })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                  formData.nurseToPatientRatio === ratio
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {ratio === 'Custom' ? 'Other' : ratio}
              </m.button>
            ))}
          </div>
        )}
        {formData.nurseToPatientRatio && formData.nurseToPatientRatio !== 'Custom' && (
          <m.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-green-600 mt-2"
          >
            ✓ Selected: {formData.nurseToPatientRatio}
          </m.p>
        )}
      </div>

      {/* Union Membership */}
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-100"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <m.div
              animate={{ scale: formData.isUnionized ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl"
            >
              {formData.isUnionized ? '🤝' : '🏢'}
            </m.div>
            <div>
              <label htmlFor="isUnionized" className="text-lg font-medium text-gray-900 cursor-pointer">
                Are you in a union?
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Union membership can affect your benefits and pay structure
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="isUnionized"
              checked={formData.isUnionized || false}
              onChange={(e) => updateFormData({ isUnionized: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600" />
          </label>
        </div>
      </m.div>

      {/* Navigation for Section 2 */}
      <div className="flex justify-between mt-6">
        <ActionButton
          type="button"
          onClick={handlePreviousSection}
          variant="outline"
          className="px-6 py-3"
        >
          ← Back
        </ActionButton>
        <ActionButton
          type="button"
          onClick={() => {
            console.log('Role validation check:', {
              employmentType: formData.employmentType,
              specialty: formData.specialty,
              shiftType: formData.shiftType,
              nurseToPatientRatio: formData.nurseToPatientRatio
            });
            handleNextSection();
          }}
          disabled={!validateRoleSection()}
          className="px-6 py-3"
        >
          Next: Compensation →
        </ActionButton>
      </div>
    </m.div>
  );
}
import { motion } from 'framer-motion';
import { Briefcase, Heart, Award, Check, Clock, Calendar, Activity, MapPin, Users } from 'lucide-react';
import ActionButton from 'src/components/ui/button/ActionButton';
import SelectionCard from '../../components/SelectionCard';
import CustomDropdown from '../../components/CustomDropdown';
import AnimatedInput from '../../components/AnimatedInput';
import { NURSING_SPECIALTIES } from 'src/lib/constants/specialties';
import { EMPLOYMENT_TYPE_OPTIONS } from '../constants';
import type { EmploymentType } from 'src/types/onboarding';

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
}

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
}: RoleSectionProps) {
  const employmentTypeOptionsWithIcons = EMPLOYMENT_TYPE_OPTIONS.map(option => ({
    ...option,
    icon: option.value === 'Full-time' ? <Clock className="w-5 h-5" /> :
          option.value === 'Part-time' ? <Calendar className="w-5 h-5" /> :
          option.value === 'Per Diem/PRN' ? <Activity className="w-5 h-5" /> :
          option.value === 'Temporary/Contract' ? <Award className="w-5 h-5" /> :
          option.value === 'Travel Nursing' ? <MapPin className="w-5 h-5" /> :
          <Users className="w-5 h-5" />
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <Briefcase className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Tell Us About Your Role
        </h3>
        <p className="text-gray-600">
          Help us understand your position and specialty
        </p>
      </div>

      <div className="space-y-6">
        {/* Employment Type */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Employment Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {employmentTypeOptionsWithIcons.map((option) => (
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

        {/* Specialty */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Nursing Specialty
          </label>
          <div className="space-y-2">
            {!showCustomSpecialty ? (
              <>
                <CustomDropdown
                  value={formData.specialty || ''}
                  onChange={(value) => {
                    if (value === 'Other') {
                      setShowCustomSpecialty(true);
                      setCustomSpecialty('');
                      updateFormData({ specialty: '' });
                    } else {
                      updateFormData({ specialty: value });
                    }
                  }}
                  options={NURSING_SPECIALTIES}
                  placeholder="Search or select your specialty"
                  searchable
                  className="w-full"
                  icon={<Heart className="w-5 h-5" />}
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
                    icon={<Heart className="w-5 h-5" />}
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
                    Add
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
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-emerald-600"
              >
                <Check className="w-4 h-4" />
                <span>Selected: {formData.specialty}</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Sub-specialty */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Sub-specialty or Certification <span className="text-gray-400 text-xs">(Optional)</span>
          </label>
          <div className="space-y-2">
            <AnimatedInput
              value={formData.subSpecialty || ''}
              onChange={(value) => updateFormData({ subSpecialty: value })}
              placeholder="e.g., CCRN, CEN, PCCN, Pediatric ICU"
              icon={<Award className="w-5 h-5" />}
            />
            <p className="text-xs text-gray-500">
              Add certifications, sub-specialties, or specific unit types
            </p>
          </div>
        </div>

        {/* Role Summary */}
        {formData.employmentType && formData.specialty && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-emerald-50 rounded-lg border border-emerald-200"
          >
            <div className="flex items-center gap-2 text-emerald-700 mb-2">
              <Briefcase className="w-4 h-4" />
              <span className="font-medium">Role Summary</span>
            </div>
            <div className="text-emerald-600 space-y-1">
              <p><span className="font-medium">Employment:</span> {formData.employmentType}</p>
              <p><span className="font-medium">Specialty:</span> {formData.specialty}</p>
              {formData.subSpecialty && (
                <p><span className="font-medium">Sub-specialty:</span> {formData.subSpecialty}</p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex justify-between pt-6">
        <ActionButton
          onClick={handlePreviousSection}
          variant="outline"
          className="px-6 py-3"
        >
          ← Back
        </ActionButton>
        
        <ActionButton
          onClick={handleNextSection}
          disabled={!validateRoleSection()}
          className="px-6 py-3"
        >
          Next: Compensation →
        </ActionButton>
      </div>
    </motion.div>
  );
}
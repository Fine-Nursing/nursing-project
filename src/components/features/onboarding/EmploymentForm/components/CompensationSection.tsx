import { m } from 'framer-motion';
import { DollarSign, X, Check, Plus, TrendingUp, Calculator } from 'lucide-react';
import { useMemo, useState } from 'react';
import ActionButton from 'src/components/ui/button/ActionButton';
import toast from 'react-hot-toast';
import type { IndividualDifferentialItem } from 'src/types/onboarding';
import AnimatedInput from '../../components/AnimatedInput';
import CustomDropdown from '../../components/CustomDropdown';
import DifferentialWithFrequency from './DifferentialWithFrequency';
import type { DifferentialItem } from 'src/api/useDifferentialAPI';

interface CompensationSectionProps {
  formData: any;
  updateFormData: (data: any) => void;
  handlePreviousSection: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  differentialInput: string;
  setDifferentialInput: (value: string) => void;
  showDifferentialSuggestions: boolean;
  setShowDifferentialSuggestions: (value: boolean) => void;
  customDiff: any;
  setCustomDiff: (value: any) => void;
  differentialFilteredList: any[];
  handleDifferentialInputChange: (value: string) => void;
  handleDifferentialSelectAndSet: (diffType: string) => void;
  addPopularDifferential: (diffType: string) => void;
  addCustomDifferential: () => void;
  removeDifferential: (index: number) => void;
  calculateTotalDifferentials: (differentials: IndividualDifferentialItem[]) => { hourly: number; annual: number };
}

const POPULAR_DIFFERENTIALS = [
  'Night Shift',
  'Weekend',
  'Holiday',
  'Call Pay',
  'Charge Nurse',
  'Float Pool',
  'Evening Shift',
  'Preceptor',
  'Critical Care',
  'Emergency',
  'Overtime',
  'Bilingual'
];

const ALL_DIFFERENTIALS = [
  // Shift Differentials
  'Night Shift',
  'Evening Shift',
  'Weekend',
  'Holiday',
  'On-call',
  'Call Pay',
  
  // Role-based Differentials
  'Charge Nurse',
  'Float Pool',
  'Preceptor',
  'Team Leader',
  'Resource Nurse',
  'Supervisor',
  
  // Specialty Differentials
  'Critical Care',
  'Emergency',
  'OR (Operating Room)',
  'ICU',
  'NICU',
  'Trauma',
  'Burn Unit',
  'Transplant',
  
  // Language & Skills
  'Bilingual',
  'BSN Degree',
  'Certification',
  'Experience',
  'Magnet Hospital',
  
  // Other
  'Travel',
  'Overtime',
  'Standby',
  'Callback',
  'Other'
];

export default function CompensationSection({
  formData,
  updateFormData,
  handlePreviousSection,
  handleSubmit,
  differentialInput,
  setDifferentialInput,
  showDifferentialSuggestions,
  setShowDifferentialSuggestions,
  customDiff,
  setCustomDiff,
  differentialFilteredList,
  handleDifferentialInputChange,
  handleDifferentialSelectAndSet,
  addPopularDifferential,
  addCustomDifferential,
  removeDifferential,
  calculateTotalDifferentials,
}: CompensationSectionProps) {
  const [showCustomDifferential, setShowCustomDifferential] = useState(false);
  const [customDifferentialName, setCustomDifferentialName] = useState('');
  const [useAdvancedDifferentials, setUseAdvancedDifferentials] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  // Handle differential selection from dropdown
  const handleDifferentialChange = (value: string) => {
    if (value === 'Other') {
      setShowCustomDifferential(true);
      setCustomDifferentialName('');
      setCustomDiff({ type: '', amount: 0, unit: 'hourly' });
    } else {
      setCustomDiff({ type: value, amount: 0, unit: 'hourly' });
      setShowCustomDifferential(false);
    }
  };

  // Convert legacy differentials to new format
  const convertToNewFormat = (legacy: IndividualDifferentialItem[]): DifferentialItem[] => {
    return legacy.map(item => ({
      type: item.type,
      value: item.amount,
      frequency: 1, // Default frequency for legacy data
    }));
  };

  // Convert new format back to legacy for compatibility
  const convertToLegacyFormat = (newItems: DifferentialItem[]): IndividualDifferentialItem[] => {
    return newItems.map(item => ({
      type: item.type,
      amount: item.value,
      unit: 'hourly' as const,
      group: 'Custom', // Will be updated based on backend category
    }));
  };
  return (
    <m.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-xl shadow-sm p-6 space-y-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-emerald-600" />
        Let's talk money & benefits
      </h3>

      {/* Base Pay */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Base Pay
          </label>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <AnimatedInput
                type="number"
                value={formData.basePay?.toString() || ''}
                onChange={(value) => updateFormData({
                  basePay: parseFloat(value) || undefined,
                })}
                placeholder="0.00"
                icon={<DollarSign className="w-5 h-5" />}
              />
            </div>
            <CustomDropdown
              options={['/ hour', '/ year']}
              value={formData.paymentFrequency === 'yearly' ? '/ year' : '/ hour'}
              onChange={(value) => updateFormData({
                paymentFrequency: value === '/ year' ? 'yearly' : 'hourly',
              })}
              className="w-32"
            />
          </div>
        </div>
      </div>

      {/* Enhanced Differential Calculator - Question-based */}
      <DifferentialWithFrequency
        basePay={formData.basePay || 0}
        paymentFrequency={formData.paymentFrequency || 'hourly'}
        shiftType={formData.shiftType}
        shiftHours={formData.shiftHours}
        differentials={convertToNewFormat(formData.individualDifferentials || [])}
        onDifferentialsChange={(newDifferentials) => {
          const legacyFormat = convertToLegacyFormat(newDifferentials);
          updateFormData({ individualDifferentials: legacyFormat });
        }}
        onPreviewChange={setPreviewData}
      />

      {/* Additional Notes */}
      <div className="space-y-2">
        <label
          htmlFor="differential-notes-textarea"
          className="block text-sm font-medium text-gray-700"
        >
          Additional notes about your differentials (optional):
        </label>
        <textarea
          id="differential-notes-textarea"
          value={formData.differentialsFreeText || ''}
          onChange={(e) => updateFormData({ differentialsFreeText: e.target.value })}
          placeholder="e.g., Specific conditions for bonuses, additional details, etc."
          className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl text-sm resize-none
                   focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
          rows={2}
        />
      </div>

      {/* Navigation for Section 3 */}
      <div className="flex justify-between mt-6">
        <ActionButton
          type="button"
          onClick={handlePreviousSection}
          variant="outline"
          className="px-3 py-1.5 sm:px-6 sm:py-3 text-sm sm:text-base"
        >
          ← Back
        </ActionButton>
        <ActionButton
          type="submit"
          onClick={handleSubmit}
          className="px-3 py-1.5 sm:px-8 sm:py-3 text-sm sm:text-base"
        >
          Review Everything →
        </ActionButton>
      </div>
    </m.div>
  );
}
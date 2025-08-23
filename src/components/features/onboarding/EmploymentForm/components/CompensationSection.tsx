import { motion } from 'framer-motion';
import { DollarSign, X, Check, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import ActionButton from 'src/components/ui/button/ActionButton';
import AnimatedInput from '../../components/AnimatedInput';
import CustomDropdown from '../../components/CustomDropdown';
import toast from 'react-hot-toast';
import type { IndividualDifferentialItem } from 'src/types/onboarding';

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
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-xl shadow-sm p-6 space-y-6"
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <motion.span
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
          className="text-2xl"
        >
          💵
        </motion.span>
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

      {/* Differential Pay Section - From Extras */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 space-y-4 border-2 border-green-100"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-3xl"
            >
              💰
            </motion.div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                Boost Your Total Compensation
              </h4>
              <p className="text-sm text-gray-600">
                Add your differential pay to see your true earnings
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            Optional
          </span>
        </div>

        {/* Add Differential Form */}
        <div className="space-y-4">
          {/* Differential Selection Dropdown */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Differential Type <span className="text-red-500">*</span>
            </label>
            {!showCustomDifferential ? (
              <>
                <CustomDropdown
                  value={customDiff.type || ''}
                  onChange={handleDifferentialChange}
                  options={ALL_DIFFERENTIALS}
                  placeholder="Search or select a differential"
                  searchable
                  className="w-full"
                  icon={<Plus className="w-5 h-5" />}
                />
                <p className="text-xs text-gray-500">
                  Can't find your differential? Select "Other" to enter custom
                </p>
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <AnimatedInput
                    value={customDifferentialName}
                    onChange={setCustomDifferentialName}
                    placeholder="Enter your differential"
                    icon={<Plus className="w-5 h-5" />}
                    className="flex-1"
                  />
                  <ActionButton
                    type="button"
                    onClick={() => {
                      if (customDifferentialName.trim()) {
                        setCustomDiff({ type: customDifferentialName.trim(), amount: 0, unit: 'hourly' });
                        setShowCustomDifferential(false);
                      }
                    }}
                    className="px-4 py-2"
                  >
                    Set
                  </ActionButton>
                  <ActionButton
                    type="button"
                    onClick={() => {
                      setShowCustomDifferential(false);
                      setCustomDifferentialName('');
                      setCustomDiff({ type: '', amount: 0, unit: 'hourly' });
                    }}
                    variant="outline"
                    className="px-4 py-2"
                  >
                    Cancel
                  </ActionButton>
                </div>
                <p className="text-xs text-gray-500">
                  Enter your specific differential or benefit type
                </p>
              </>
            )}
            {customDiff.type && !showCustomDifferential && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-emerald-600"
              >
                <Check className="w-4 h-4" />
                <span>Selected: {customDiff.type}</span>
              </motion.div>
            )}
          </div>

          {/* Quick suggestions */}
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Popular differentials:</p>
            <div className="flex flex-wrap gap-1">
              {POPULAR_DIFFERENTIALS.slice(0, 8).map((diffType) => (
                <motion.button
                  key={diffType}
                  type="button"
                  onClick={() => handleDifferentialChange(diffType)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-emerald-100 text-gray-600 hover:text-emerald-700 rounded-md transition-colors"
                >
                  {diffType}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Amount and Unit - only show when type is selected */}
          {customDiff.type && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Setting differential for: <span className="font-semibold text-emerald-700">{customDiff.type}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCustomDiff({ type: '', amount: 0, unit: 'hourly' });
                    setShowCustomDifferential(false);
                    setCustomDifferentialName('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.5"
                      value={customDiff.amount || ''}
                      onChange={(e) => setCustomDiff({
                        ...customDiff,
                        amount: parseFloat(e.target.value) || 0,
                      })}
                      autoFocus
                      className="w-full px-2 py-2 pl-6 text-sm bg-white border border-gray-200 rounded-lg
                               focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                    />
                  </div>
                </div>

                <CustomDropdown
                  options={['per hour', 'per year']}
                  value={customDiff.unit === 'annual' ? 'per year' : 'per hour'}
                  onChange={(value) => setCustomDiff({
                    ...customDiff,
                    unit: value === 'per year' ? 'annual' : 'hourly',
                  })}
                  className="w-28"
                />

                <ActionButton
                  type="button"
                  onClick={addCustomDifferential}
                  disabled={!customDiff.type || customDiff.amount <= 0}
                  className="px-4 py-2 text-sm"
                >
                  Add
                </ActionButton>
              </div>
            </motion.div>
          )}
        </div>

        {/* Current Differentials List */}
        {formData.individualDifferentials && formData.individualDifferentials.length > 0 && (
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700">
              Your Differentials:
            </h5>
            <div className="space-y-2">
              {formData.individualDifferentials.map((diff: IndividualDifferentialItem, index: number) => (
                <div
                  key={`${diff.group}-${diff.type}-${diff.amount}-${diff.unit}`}
                  className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full font-medium">
                      {diff.group}
                    </span>
                    <span className="font-medium text-gray-900">
                      {diff.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-600 font-semibold">
                      +${diff.amount}/hr
                      {/* 모든 값이 시급으로 저장되므로 항상 /hr 표시 */}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDifferential(index)}
                      className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                      aria-label={`Remove ${diff.type} differential`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Display */}
            {formData.individualDifferentials && formData.individualDifferentials.length > 0 && (
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                {(() => {
                  const totals = calculateTotalDifferentials(formData.individualDifferentials);
                  return (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-green-800">
                          Total Hourly Differentials:
                        </span>
                        <span className="text-lg font-bold text-green-600">
                          +${totals.hourly.toFixed(2)}/hr
                        </span>
                      </div>
                      {totals.annual > 0 && (
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-green-200">
                          <span className="font-medium text-green-800">
                            Annual Bonuses:
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            +${totals.annual.toLocaleString()}/year
                          </span>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

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
      </motion.div>


      {/* Navigation for Section 3 */}
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
          type="submit"
          onClick={handleSubmit}
          className="px-8 py-3"
        >
          Review Everything →
        </ActionButton>
      </div>
    </motion.div>
  );
}
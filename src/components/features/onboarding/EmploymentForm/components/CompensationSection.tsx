import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Clock, Users, Sun, Moon, Sunrise, Heart, Plus, X, Check } from 'lucide-react';
import ActionButton from 'src/components/ui/button/ActionButton';
import AnimatedInput from '../../components/AnimatedInput';
import SelectionCard from '../../components/SelectionCard';
import CustomDropdown from '../../components/CustomDropdown';
import { SHIFT_TYPE_OPTIONS, NURSE_RATIO_OPTIONS, POPULAR_DIFFERENTIALS } from '../constants';
import { formatCurrency } from '../utils/calculations';
import type { ShiftType, IndividualDifferentialItem } from 'src/types/onboarding';

interface CompensationSectionProps {
  formData: any;
  updateFormData: (data: any) => void;
  handlePreviousSection: () => void;
  handleSubmit: () => void;
  validateCompensationSection: () => boolean;
  isLoading: boolean;
  customRatio: string;
  setCustomRatio: (value: string) => void;
  differentialInput: string;
  setDifferentialInput: (value: string) => void;
  showDifferentialSuggestions: boolean;
  setShowDifferentialSuggestions: (value: boolean) => void;
  customDiff: any;
  setCustomDiff: (value: any) => void;
  differentialFilteredList: any[];
  totalDifferentials: any;
  addDifferential: (differential: any) => void;
  addCustomDifferential: () => void;
  removeDifferential: (index: number) => void;
  editDifferential: (index: number, field: string, value: any) => void;
}

export default function CompensationSection({
  formData,
  updateFormData,
  handlePreviousSection,
  handleSubmit,
  validateCompensationSection,
  isLoading,
  customRatio,
  setCustomRatio,
  differentialInput,
  setDifferentialInput,
  showDifferentialSuggestions,
  setShowDifferentialSuggestions,
  customDiff,
  setCustomDiff,
  differentialFilteredList,
  totalDifferentials,
  addDifferential,
  addCustomDifferential,
  removeDifferential,
  editDifferential,
}: CompensationSectionProps) {

  const shiftTypeOptionsWithIcons = SHIFT_TYPE_OPTIONS.map(option => ({
    ...option,
    icon: option.value === 'Day Shift' ? <Sun className="w-5 h-5" /> :
          option.value === 'Evening Shift' ? <Sunrise className="w-5 h-5" /> :
          option.value === 'Night Shift' ? <Moon className="w-5 h-5" /> :
          <Clock className="w-5 h-5" />
  }));

  const handleDifferentialSelectAndSet = (diffType: string) => {
    const exists = formData.individualDifferentials?.some((d: IndividualDifferentialItem) => d.type === diffType);
    if (exists) {
      const filtered = formData.individualDifferentials.filter((d: IndividualDifferentialItem) => d.type !== diffType);
      updateFormData({ individualDifferentials: filtered });
      return;
    }

    setCustomDiff({
      type: diffType,
      amount: diffType === 'Holiday' ? 2 : diffType === 'Weekend' ? 1.5 : 1,
      unit: 'hourly',
      group: 'Shift Differentials'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <DollarSign className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Compensation & Work Details
        </h3>
        <p className="text-gray-600">
          Help us understand your pay structure and work environment
        </p>
      </div>

      <div className="space-y-6">
        {/* Base Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Salary/Pay
            </label>
            <AnimatedInput
              value={formData.basePay || ''}
              onChange={(value) => updateFormData({ basePay: parseFloat(value) || 0 })}
              placeholder="e.g., 35"
              type="number"
              icon={<DollarSign className="w-5 h-5" />}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pay Unit
            </label>
            <CustomDropdown
              value={formData.paymentFrequency || ''}
              onChange={(value) => updateFormData({ paymentFrequency: value as 'hourly' | 'yearly' })}
              options={['hourly', 'yearly']}
              placeholder="Select unit"
              className="w-full"
            />
          </div>
        </div>

        {/* Shift Type */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Shift Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shiftTypeOptionsWithIcons.map((option) => (
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

        {/* Union Checkbox - From Original */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: formData.isUnionized ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className="text-2xl"
              >
                {formData.isUnionized ? '🤝' : '🏢'}
              </motion.div>
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
        </motion.div>


        {/* Nurse-to-Patient Ratio */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Typical Nurse-to-Patient Ratio
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {NURSE_RATIO_OPTIONS.map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => {
                  if (ratio === 'Custom') {
                    setCustomRatio('');
                  }
                  updateFormData({ nurseToPatientRatio: ratio });
                }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.nurseToPatientRatio === ratio
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
          
          {formData.nurseToPatientRatio === 'Custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex gap-2"
            >
              <AnimatedInput
                value={customRatio}
                onChange={setCustomRatio}
                placeholder="e.g., 1:8"
                className="flex-1"
              />
              <ActionButton
                onClick={() => {
                  if (customRatio.trim()) {
                    updateFormData({ nurseToPatientRatio: customRatio.trim() });
                  }
                }}
                className="px-4 py-2"
              >
                Set
              </ActionButton>
            </motion.div>
          )}
        </div>

        {/* Differential Pay Section - From Original */}
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

          {/* Popular Differentials */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <span className="text-lg">⚡</span> Quick select common differentials:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {POPULAR_DIFFERENTIALS.map((diffType) => {
                const isAdded = formData.individualDifferentials?.some((d: IndividualDifferentialItem) => d.type === diffType);
                const isSelected = customDiff.type === diffType;
                
                return (
                  <motion.button
                    key={diffType}
                    type="button"
                    onClick={() => handleDifferentialSelectAndSet(diffType)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      isAdded
                        ? 'border-emerald-500 bg-emerald-100 text-emerald-700'
                        : isSelected
                        ? 'border-blue-500 bg-blue-100 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isAdded && <Check className="w-4 h-4 inline mr-1" />}
                    {diffType}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Custom Differential Input */}
          {customDiff.type && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Setting differential for: <span className="font-semibold text-emerald-700">{customDiff.type}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCustomDiff({ type: '', amount: 0, unit: 'hourly' });
                    setDifferentialInput('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <AnimatedInput
                  value={customDiff.amount.toString()}
                  onChange={(value) => setCustomDiff(prev => ({ ...prev, amount: Number(value) || 0 }))}
                  placeholder="Amount"
                  type="number"
                  icon={<DollarSign className="w-4 h-4" />}
                />
                <CustomDropdown
                  value={customDiff.unit}
                  onChange={(value) => setCustomDiff(prev => ({ ...prev, unit: value as 'hourly' | 'annual' }))}
                  options={['hourly', 'annual']}
                  placeholder="Unit"
                />
              </div>
              
              <ActionButton
                onClick={addCustomDifferential}
                disabled={!customDiff.type || customDiff.amount <= 0}
                className="w-full mt-3"
              >
                Add Differential
              </ActionButton>
            </motion.div>
          )}

          {/* Current Differentials List */}
          {formData.individualDifferentials && formData.individualDifferentials.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-medium text-gray-900">Your Differentials:</h5>
              <div className="space-y-2">
                {formData.individualDifferentials.map((diff: IndividualDifferentialItem, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div>
                      <span className="font-medium text-gray-900">{diff.type}</span>
                      <span className="text-gray-600 ml-2">
                        {formatCurrency(diff.amount, diff.unit)}
                      </span>
                    </div>
                    <button
                      onClick={() => removeDifferential(index)}
                      className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Total Display */}
              <div className="p-3 bg-emerald-100 rounded-lg border border-emerald-200">
                <div className="font-semibold text-emerald-800">
                  Total Differentials: {formatCurrency(totalDifferentials.hourly, 'hourly')}
                  {totalDifferentials.annual > 0 && ` + ${formatCurrency(totalDifferentials.annual, 'annual')}`}
                </div>
              </div>
            </div>
          )}

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Additional notes about your differentials (optional):
            </label>
            <textarea
              value={formData.differentialsFreeText || ''}
              onChange={(e) => updateFormData({ differentialsFreeText: e.target.value })}
              placeholder="e.g., Specific conditions for bonuses, additional details, etc."
              className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl text-sm resize-none
                       focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              rows={2}
            />
          </div>
        </motion.div>
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
          onClick={handleSubmit}
          disabled={!validateCompensationSection() || isLoading}
          className="px-6 py-3"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Saving...
            </span>
          ) : (
            'Complete Employment Info →'
          )}
        </ActionButton>
      </div>
    </motion.div>
  );
}
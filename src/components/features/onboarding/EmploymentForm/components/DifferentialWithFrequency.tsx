import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Calculator, AlertCircle, Check, X, Info } from 'lucide-react';
import ActionButton from 'src/components/ui/button/ActionButton';
import CustomDropdown from '../../components/CustomDropdown';
import AnimatedInput from '../../components/AnimatedInput';
import {
  useDifferentialTypes,
  useAllDifferentialConfigs,
  useDifferentialPreview,
  DifferentialItem,
  DifferentialConfig,
  formatCurrency,
  formatHourlyRate,
  formatDifferentialTypeDisplay,
  getFrequencyInputType,
  getFrequencyOptions,
  formatFrequencyDisplay,
  validateFrequency,
  validateValue,
  formatDifferentialValue,
  calculateDifferentialMonthlyContribution,
} from 'src/api/useDifferentialAPI';

interface DifferentialWithFrequencyProps {
  basePay: number;
  paymentFrequency: 'hourly' | 'yearly';
  shiftType?: string;
  shiftHours?: number;
  differentials: DifferentialItem[];
  onDifferentialsChange: (differentials: DifferentialItem[]) => void;
  onPreviewChange?: (preview: any) => void;
}

interface DifferentialFormData {
  type: string;
  value: number;
  frequency: number;
}

export default function DifferentialWithFrequency({
  basePay,
  paymentFrequency,
  shiftType,
  shiftHours,
  differentials,
  onDifferentialsChange,
  onPreviewChange,
}: DifferentialWithFrequencyProps) {
  const [selectedCategory, setSelectedCategory] = useState<'essential' | 'common' | 'rare' | 'bonus'>('essential');
  const [activeForm, setActiveForm] = useState<DifferentialFormData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // API hooks
  const { data: differentialTypes, isLoading: typesLoading } = useDifferentialTypes();
  const { data: allConfigs, isLoading: configsLoading } = useAllDifferentialConfigs();
  const previewMutation = useDifferentialPreview();

  // Get recommended differentials based on shift type
  const getRecommendedDifferentials = (): string[] => {
    if (!shiftType || !differentialTypes) return [];

    const recommendations: string[] = [];

    // Always recommend based on shift type
    switch (shiftType) {
      case 'Night Shift':
        recommendations.push('Night', 'Weekend'); // Night workers often work weekends too
        break;
      case 'Evening Shift':
        recommendations.push('Evening_Shift', 'Weekend');
        break;
      case 'Day Shift':
        recommendations.push('Weekend', 'Holiday'); // Day shift workers get weekend/holiday pay
        break;
      case 'Rotating Shift':
        recommendations.push('Night', 'Evening_Shift', 'Weekend'); // Rotating gets all shifts
        break;
    }

    // Add common ones that apply to most
    recommendations.push('Holiday', 'Overtime', 'Certification');

    // Remove duplicates and filter to existing types
    return [...new Set(recommendations)].filter(type =>
      Object.keys(allConfigs || {}).includes(type)
    );
  };

  // Handle preview calculation manually
  const handlePreviewCalculation = () => {
    if (differentials.length > 0 && basePay > 0) {
      previewMutation.mutate({
        differentials,
        basePay,
        basePayUnit: paymentFrequency,
      }, {
        onSuccess: (data) => {
          onPreviewChange?.(data);
          setShowPreview(true);
        },
        onError: (error) => {
          console.error('Preview calculation failed:', error);
        }
      });
    }
  };

  const handleAddDifferential = (type: string) => {
    const config = allConfigs?.[type];
    if (!config) return;

    setActiveForm({
      type,
      value: config.valueRange.min,
      frequency: config.frequencyRange.min,
    });
  };

  const handleSaveDifferential = () => {
    if (!activeForm || !allConfigs) return;

    const config = allConfigs[activeForm.type];
    if (!config) return;

    // Basic validation - only check for reasonable values
    // Remove artificial limits so users can enter their actual compensation
    if (activeForm.value <= 0) {
      alert('Please enter a value greater than 0');
      return;
    }

    if (activeForm.frequency < 0) {
      alert('Frequency must be 0 or greater');
      return;
    }

    // Check if differential already exists
    const existingIndex = differentials.findIndex(d => d.type === activeForm.type);

    if (existingIndex >= 0) {
      // Update existing
      const updated = [...differentials];
      updated[existingIndex] = activeForm;
      onDifferentialsChange(updated);
    } else {
      // Add new
      onDifferentialsChange([...differentials, activeForm]);
    }

    setActiveForm(null);
  };

  const handleRemoveDifferential = (index: number) => {
    const updated = differentials.filter((_, i) => i !== index);
    onDifferentialsChange(updated);
  };

  const renderFrequencyInput = (config: DifferentialConfig, value: number, onChange: (value: number) => void) => {
    // Check if this is a Yes/No type question or one-time/annual bonus
    if (config.frequencyRange.unit.includes('yes') && config.frequencyRange.unit.includes('no') ||
        config.frequencyRange.unit === 'one-time' ||
        config.frequencyRange.unit === 'annual') {
      return (
        <div className="flex gap-3 flex-1">
          <button
            type="button"
            onClick={() => onChange(1)}
            className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all transform ${
              value === 1
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg scale-[1.02]'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50'
            }`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {value === 1 && <Check className="w-4 h-4 sm:w-5 sm:h-5" />}
              <span>Yes</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onChange(0)}
            className={`flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all transform ${
              value === 0
                ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg scale-[1.02]'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {value === 0 && <X className="w-4 h-4 sm:w-5 sm:h-5" />}
              <span>No</span>
            </div>
          </button>
        </div>
      );
    }

    const inputType = getFrequencyInputType(config.frequencyRange.unit);
    const options = getFrequencyOptions(config);

    if (inputType === 'select' && options.length > 0) {
      return (
        <CustomDropdown
          value={options.find(opt => opt.value === value)?.label || ''}
          onChange={(label) => {
            const option = options.find(opt => opt.label === label);
            if (option) onChange(option.value);
          }}
          options={options.map(opt => opt.label)}
          className="flex-1"
        />
      );
    }

    return (
      <AnimatedInput
        type="number"
        value={value.toString()}
        onChange={(val) => onChange(parseFloat(val) || 0)}
        placeholder="0"
        min={0}
        className="flex-1"
      />
    );
  };

  if (typesLoading || configsLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!differentialTypes || !allConfigs) {
    return (
      <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
        <p className="text-red-600 text-center">
          Failed to load differential configurations. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6"
    >
      <div>
        <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
          Differential Pay Calculator
        </h4>
        <p className="text-xs sm:text-sm text-gray-600">
          Answer specific questions about your work patterns to get accurate differential calculations
        </p>

        {/* Shift-based Recommendations */}
        {shiftType && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <h6 className="text-xs sm:text-sm font-medium text-emerald-800 mb-2">
              Recommended for {shiftType} workers:
            </h6>
            <div className="flex flex-wrap gap-2">
              {getRecommendedDifferentials().slice(0, 5).map((type) => {
                const isAdded = differentials.some(d => d.type === type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => !isAdded && handleAddDifferential(type)}
                    disabled={isAdded}
                    className={`px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs rounded-full font-medium transition-all ${
                      isAdded
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer'
                    }`}
                  >
                    {formatDifferentialTypeDisplay(type)}
                    {isAdded && ' ✓'}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs - Improved mobile layout */}
      <div className="grid grid-cols-2 sm:flex sm:gap-2 gap-2 mb-4">
        {Object.entries(differentialTypes).map(([category, types]) => {
          const categoryIcons = {
            essential: '•',
            common: '•',
            rare: '•',
            bonus: '•'
          };
          const categoryLabels = {
            essential: 'Essential',
            common: 'Common',
            rare: 'Specialized',
            bonus: 'Bonuses'
          };

          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category as any)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all transform ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md scale-[1.02]'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50'
              }`}
            >
              {categoryLabels[category as keyof typeof categoryLabels] || category}
              <span className="ml-1.5 text-xs opacity-80">({types.length})</span>
            </button>
          );
        })}
      </div>

      {/* Available Differentials */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-gray-700">
          Available {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Differentials:
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {differentialTypes[selectedCategory].map((type) => {
            const config = allConfigs[type];
            const isAdded = differentials.some(d => d.type === type);

            return (
              <m.button
                key={type}
                type="button"
                onClick={() => !isAdded && handleAddDifferential(type)}
                disabled={isAdded}
                whileHover={!isAdded ? { scale: 1.02 } : {}}
                whileTap={!isAdded ? { scale: 0.98 } : {}}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  isAdded
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-white hover:border-emerald-300 text-gray-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 pr-2">
                    <h6 className="font-medium text-xs sm:text-sm">
                      {formatDifferentialTypeDisplay(type)}
                    </h6>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {config?.description}
                    </p>
                  </div>
                  {isAdded ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Plus className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </m.button>
            );
          })}
        </div>
      </div>

      {/* Active Differential Form */}
      <AnimatePresence>
        {activeForm && allConfigs[activeForm.type] && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl p-4 sm:p-6 border-2 border-emerald-200"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h6 className="text-sm sm:text-lg font-semibold text-emerald-700">
                Setting up: {formatDifferentialTypeDisplay(activeForm.type)}
              </h6>
              <button
                type="button"
                onClick={() => setActiveForm(null)}
                className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Question */}
              <div className="bg-indigo-50 rounded-lg p-3 sm:p-4">
                <p className="text-indigo-800 font-medium text-xs sm:text-sm">
                  {allConfigs[activeForm.type].question}
                </p>
              </div>

              {/* Frequency Input */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  {(() => {
                    const unit = allConfigs[activeForm.type].frequencyRange.unit;
                    if (unit.includes('yes') || unit === 'one-time' || unit === 'annual') {
                      return 'Do you receive this?';
                    }
                    return `Frequency (${unit})`;
                  })()}
                </label>
                {renderFrequencyInput(
                  allConfigs[activeForm.type],
                  activeForm.frequency,
                  (frequency) => setActiveForm({ ...activeForm, frequency })
                )}
              </div>

              {/* Value Input */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  {(() => {
                    const unit = allConfigs[activeForm.type].valueRange.unit;
                    if (unit === 'multiplier') {
                      return 'Extra Pay Percentage';
                    } else if (unit === 'percentage') {
                      return 'Bonus Percentage';
                    } else if (unit.includes('$/hour')) {
                      return 'Hourly Differential';
                    } else {
                      return `Amount (${unit})`;
                    }
                  })()}
                </label>

                {/* Special handling for multiplier inputs - using percentage */}
                {allConfigs[activeForm.type].valueRange.unit === 'multiplier' ? (
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <span className="text-gray-500">+</span>
                      <AnimatedInput
                        type="number"
                        value={(((activeForm.value || 1) - 1) * 100).toFixed(0)}
                        onChange={(val) => {
                          const percent = parseFloat(val) || 0;
                          const multiplier = 1 + (percent / 100);
                          setActiveForm({ ...activeForm, value: multiplier });
                        }}
                        placeholder="0"
                        step="5"
                        min={0}
                        max={300}
                        className="flex-1"
                      />
                      <span className="text-xs sm:text-sm text-gray-500">% extra pay</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {activeForm.value <= 1 ? 'Regular pay (no extra)' :
                       activeForm.value === 1.5 ? 'Time and a half (1.5× your regular rate)' :
                       activeForm.value === 2 ? 'Double time (2× your regular rate)' :
                       activeForm.value === 2.5 ? 'Double and a half (2.5× your regular rate)' :
                       activeForm.value === 3 ? 'Triple time (3× your regular rate)' :
                       `${activeForm.value}× your regular hourly rate`}
                    </p>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    {allConfigs[activeForm.type].valueRange.unit.includes('percent') && (
                      <span className="text-gray-500">%</span>
                    )}
                    {(allConfigs[activeForm.type].valueRange.unit.includes('dollar') ||
                      allConfigs[activeForm.type].valueRange.unit.includes('hour') ||
                      allConfigs[activeForm.type].valueRange.unit.includes('month')) && (
                      <span className="text-gray-500">$</span>
                    )}
                    <AnimatedInput
                      type="number"
                      value={activeForm.value.toString()}
                      onChange={(val) => setActiveForm({ ...activeForm, value: parseFloat(val) || 0 })}
                      placeholder={allConfigs[activeForm.type].valueRange.unit.includes('percent') ? "0" : "0.00"}
                      step={allConfigs[activeForm.type].valueRange.unit.includes('percent') ? "1" : "0.5"}
                      min={0}
                      className="flex-1"
                    />
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      {allConfigs[activeForm.type].valueRange.unit}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <ActionButton
                  type="button"
                  onClick={handleSaveDifferential}
                  className="flex-1 px-3 py-1.5 sm:px-4 sm:py-2 text-sm"
                >
                  Add Differential
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={() => setActiveForm(null)}
                  variant="outline"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm"
                >
                  Cancel
                </ActionButton>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Current Differentials */}
      {differentials.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <h5 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            Your Current Differentials ({differentials.length})
          </h5>
          <div className="space-y-3">
            {differentials.map((diff, index) => {
              const config = allConfigs[diff.type];
              const getCategoryColor = (category: string) => {
                switch (category) {
                  case 'essential': return 'bg-emerald-100 text-emerald-700';
                  case 'common': return 'bg-blue-100 text-blue-700';
                  case 'rare': return 'bg-purple-100 text-purple-700';
                  case 'bonus': return 'bg-orange-100 text-orange-700';
                  default: return 'bg-gray-100 text-gray-700';
                }
              };

              return (
                <div
                  key={`${diff.type}-${index}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(config?.category || '')}`}>
                        {config?.category}
                      </span>
                      <span className="font-semibold text-gray-900 text-sm sm:text-base">
                        {formatDifferentialTypeDisplay(diff.type)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                      {(config?.frequencyRange.unit.includes('yes') ||
                        config?.frequencyRange.unit === 'one-time' ||
                        config?.frequencyRange.unit === 'annual') ? (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Status:</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            diff.frequency === 1
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {diff.frequency === 1 ? 'Active' : 'Not Applied'}
                          </span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Frequency:</span>
                          {formatFrequencyDisplay(diff.frequency, config?.frequencyRange.unit || '')}
                        </span>
                      )}
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Amount:</span>
                        {(() => {
                          const formatted = formatDifferentialValue(
                            diff.value,
                            config?.valueRange.unit || '',
                            diff.frequency
                          );

                          return (
                            <div className="flex items-center gap-2">
                              {/* Mobile: Simple display */}
                              <span className={`block sm:hidden font-bold ${formatted.color}`}>
                                {formatted.display}
                              </span>
                              {/* Desktop: Detailed display */}
                              <span className={`hidden sm:block font-semibold ${formatted.color}`}>
                                {formatted.display}
                              </span>
                              {formatted.description && (
                                <span className="hidden sm:block text-xs text-gray-500">
                                  {formatted.description}
                                </span>
                              )}
                              {formatted.tooltip && (
                                <span title={formatted.tooltip}>
                                  <Info className="hidden sm:block w-4 h-4 text-gray-400 cursor-help" />
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDifferential(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors mt-2 sm:mt-0 sm:ml-4 self-end sm:self-auto"
                    aria-label={`Remove ${formatDifferentialTypeDisplay(diff.type)} differential`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Preview Toggle */}
      {differentials.length > 0 && (
        <div className="flex items-center justify-center">
          <ActionButton
            type="button"
            onClick={() => {
              if (showPreview) {
                setShowPreview(false);
              } else {
                handlePreviewCalculation();
              }
            }}
            variant="outline"
            className="flex items-center gap-2"
            disabled={previewMutation.isPending}
          >
            <Calculator className="w-4 h-4" />
            {showPreview ? 'Hide Preview' : 'Show Calculation Preview'}
            {previewMutation.isPending && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
            )}
          </ActionButton>
        </div>
      )}

      {/* Preview Results */}
      <AnimatePresence>
        {showPreview && previewMutation.data && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-green-50 rounded-xl p-4 sm:p-6 border-2 border-green-200"
          >
            <h6 className="text-lg font-semibold text-green-800 mb-4">
              Compensation Preview
            </h6>
            {/* Summary Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-green-600">Base Monthly</p>
                <p className="text-lg sm:text-xl font-bold text-green-800">
                  {formatCurrency(previewMutation.data.metadata.base_monthly)}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-green-600">Total Monthly</p>
                <p className="text-lg sm:text-xl font-bold text-green-800">
                  {formatCurrency(previewMutation.data.metadata.total_monthly)}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-green-600">Effective Hourly</p>
                <p className="text-base sm:text-lg font-semibold text-green-700">
                  {formatHourlyRate(previewMutation.data.metadata.effective_hourly)}
                </p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-green-600">Annual Total</p>
                <p className="text-base sm:text-lg font-semibold text-green-700">
                  {formatCurrency(previewMutation.data.metadata.annual_total)}
                </p>
              </div>
            </div>

            {/* Differential Breakdown */}
            {differentials.length > 0 && (
              <div className="border-t border-green-200 pt-4">
                <h6 className="text-sm font-semibold text-green-700 mb-3">
                  Monthly Impact by Differential:
                </h6>
                <div className="space-y-2">
                  {differentials.map((diff, index) => {
                    const config = allConfigs?.[diff.type];
                    const monthlyContribution = calculateDifferentialMonthlyContribution(
                      diff,
                      config,
                      basePay
                    );
                    const formatted = formatDifferentialValue(
                      diff.value,
                      config?.valueRange.unit || '',
                      diff.frequency
                    );

                    return (
                      <div key={`${diff.type}-${index}`}
                           className="flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-white rounded-lg">
                        <div className="flex items-center gap-2 mb-1 sm:mb-0">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">
                            {formatDifferentialTypeDisplay(diff.type)}
                          </span>
                          <span className={`text-xs ${formatted.color}`}>
                            {formatted.display}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-green-700">
                          +${monthlyContribution.toFixed(2)}/mo
                        </span>
                      </div>
                    );
                  })}

                  {/* Total Differential Row */}
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-green-200">
                    <span className="text-sm font-semibold text-green-800">
                      Total Differentials
                    </span>
                    <span className="text-sm font-bold text-green-800">
                      +${(
                        previewMutation.data.metadata.total_monthly -
                        previewMutation.data.metadata.base_monthly
                      ).toFixed(2)}/mo
                    </span>
                  </div>
                </div>
              </div>
            )}
          </m.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {previewMutation.isError && (
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">
              Calculation error: {previewMutation.error?.message}
            </span>
          </div>
        </div>
      )}
    </m.div>
  );
}
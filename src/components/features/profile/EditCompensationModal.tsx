'use client';

import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Calculator, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import ActionButton from 'src/components/ui/button/ActionButton';
import CustomDropdown from '../onboarding/components/CustomDropdown';
import AnimatedInput from '../onboarding/components/AnimatedInput';
import DifferentialWithFrequency from '../onboarding/EmploymentForm/components/DifferentialWithFrequency';
import { DifferentialItem } from 'src/api/useDifferentialAPI';

interface CompensationData {
  basePay: number;
  basePayUnit: 'hourly' | 'yearly';
  differentials: DifferentialItem[];
  shiftHours?: number;
}

interface EditCompensationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompensation: CompensationData;
  onSave: (data: CompensationData) => Promise<void>;
  theme?: 'light' | 'dark';
}

export default function EditCompensationModal({
  isOpen,
  onClose,
  currentCompensation,
  onSave,
  theme = 'light',
}: EditCompensationModalProps) {
  const [formData, setFormData] = useState<CompensationData>({
    basePay: 0,
    basePayUnit: 'hourly',
    differentials: [],
    shiftHours: 12,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  // Initialize form data ONLY when modal opens (false → true transition)
  useEffect(() => {
    if (isOpen && !prevIsOpen && currentCompensation) {
      // Modal is opening, initialize form data
      setFormData({
        basePay: currentCompensation.basePay || 0,
        basePayUnit: currentCompensation.basePayUnit || 'hourly',
        differentials: currentCompensation.differentials || [],
        shiftHours: currentCompensation.shiftHours || 12,
      });
    }
    setPrevIsOpen(isOpen);
  }, [isOpen, prevIsOpen, currentCompensation]);

  const handleSave = async () => {
    if (!formData.basePay || formData.basePay <= 0) {
      toast.error('Please enter a valid base pay amount');
      return;
    }

    // Clean data to remove any null bytes or invalid characters
    const cleanedData = {
      ...formData,
      differentials: formData.differentials.map(diff => ({
        ...diff,
        type: (diff.type || '').replace(/\x00/g, '').trim(), // Remove null bytes
        value: diff.value || 0,
        frequency: diff.frequency || 1,
      })).filter(diff => diff.type && diff.value > 0), // Only include valid differentials
    };

    setIsLoading(true);
    try {
      await onSave(cleanedData);
      onClose();
    } catch (error) {
      // Error handling is done in parent component
      console.error('Failed to save compensation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      basePay: currentCompensation.basePay || 0,
      basePayUnit: currentCompensation.basePayUnit || 'hourly',
      differentials: currentCompensation.differentials || [],
      shiftHours: currentCompensation.shiftHours || 12,
    });
    onClose();
  };

  const updateFormData = (updates: Partial<CompensationData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={handleCancel}
          >
            {/* Modal */}
            <m.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`${
                theme === 'light' ? 'bg-white' : 'bg-slate-800'
              } rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`px-6 py-4 border-b ${
                theme === 'light' ? 'border-gray-200' : 'border-slate-700'
              }`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-semibold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  } flex items-center gap-2`}>
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                    Edit Compensation
                  </h2>
                  <button
                    onClick={handleCancel}
                    className={`p-2 rounded-lg transition-colors ${
                      theme === 'light'
                        ? 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
                        : 'hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className={`text-sm mt-1 ${
                  theme === 'light' ? 'text-gray-600' : 'text-slate-400'
                }`}>
                  Update your base pay and differential compensation
                </p>
              </div>

              {/* Content */}
              <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6 space-y-6">
                {/* Base Pay Section */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  } flex items-center gap-2`}>
                    <Calculator className="w-5 h-5 text-emerald-600" />
                    Base Pay
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${
                        theme === 'light' ? 'text-gray-700' : 'text-slate-300'
                      }`}>
                        Base Pay Amount
                      </label>
                      <div className="flex gap-4 items-center">
                        <div className="flex-1">
                          <AnimatedInput
                            type="number"
                            value={formData.basePay?.toString() || ''}
                            onChange={(value) => updateFormData({
                              basePay: parseFloat(value) || 0,
                            })}
                            placeholder="0.00"
                            icon={<DollarSign className="w-5 h-5" />}
                            step="0.5"
                            min={0}
                          />
                        </div>
                        <CustomDropdown
                          options={['/ hour', '/ year']}
                          value={formData.basePayUnit === 'yearly' ? '/ year' : '/ hour'}
                          onChange={(value) => updateFormData({
                            basePayUnit: value === '/ year' ? 'yearly' : 'hourly',
                          })}
                          className="w-32"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className={`block text-sm font-medium ${
                        theme === 'light' ? 'text-gray-700' : 'text-slate-300'
                      }`}>
                        Shift Hours
                      </label>
                      <div className="flex gap-2">
                        {[8, 10, 12, 16].map((hours) => (
                          <button
                            key={hours}
                            type="button"
                            onClick={() => updateFormData({ shiftHours: hours })}
                            className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                              formData.shiftHours === hours
                                ? 'bg-emerald-600 text-white shadow-md'
                                : theme === 'light'
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}>
                            {hours} hrs
                          </button>
                        ))}
                      </div>
                      <p className={`text-xs ${
                        theme === 'light' ? 'text-gray-500' : 'text-slate-400'
                      }`}>
                        <Clock className="w-3 h-3 inline mr-1" />
                        Hours per shift for accurate pay calculation
                      </p>
                    </div>
                  </div>
                </div>

                {/* Differential Pay Section */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${
                    theme === 'light' ? 'text-gray-900' : 'text-white'
                  }`}>
                    Differential Pay
                  </h3>

                  <DifferentialWithFrequency
                    basePay={formData.basePay || 0}
                    paymentFrequency={formData.basePayUnit || 'hourly'}
                    shiftHours={formData.shiftHours}
                    differentials={formData.differentials}
                    onDifferentialsChange={(newDifferentials) => {
                      updateFormData({ differentials: newDifferentials });
                    }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className={`px-6 py-4 border-t ${
                theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-slate-700 bg-slate-800'
              } flex justify-end gap-3`}>
                <ActionButton
                  type="button"
                  onClick={handleCancel}
                  variant="outline"
                  className="px-6 py-2"
                  disabled={isLoading}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </ActionButton>
              </div>
            </m.div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
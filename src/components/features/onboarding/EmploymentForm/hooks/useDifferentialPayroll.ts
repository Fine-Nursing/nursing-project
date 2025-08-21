import { useState, useMemo, useCallback } from 'react';
import { DIFFERENTIAL_LIST } from 'src/lib/constants/differential';
import type { IndividualDifferentialItem } from 'src/types/onboarding';
import type { CustomDifferential } from '../types';
import { calculateTotalDifferentials } from '../utils/calculations';

export function useDifferentialPayroll(formData: any, updateFormData: (data: any) => void) {
  const [differentialInput, setDifferentialInput] = useState('');
  const [showDifferentialSuggestions, setShowDifferentialSuggestions] = useState(false);
  const [customDiff, setCustomDiff] = useState<CustomDifferential>({
    type: '',
    amount: 0,
    unit: 'hourly',
  });

  const differentialFilteredList = useMemo(() => {
    if (!differentialInput) return [];
    const input = differentialInput.toLowerCase();
    return DIFFERENTIAL_LIST.filter(
      (diff) =>
        diff.display.toLowerCase().includes(input) ||
        diff.group.toLowerCase().includes(input)
    ).slice(0, 8);
  }, [differentialInput]);

  const totalDifferentials = useMemo(() => {
    const differentials = formData.individualDifferentials || [];
    return calculateTotalDifferentials(differentials);
  }, [formData.individualDifferentials]);

  const addDifferential = useCallback((differential: any) => {
    const currentDifferentials = formData.individualDifferentials || [];
    const exists = currentDifferentials.some((d: IndividualDifferentialItem) => 
      d.type === differential.type
    );
    
    if (!exists) {
      const newDifferential: IndividualDifferentialItem = {
        type: differential.type || differential.display,
        amount: differential.amount || 0,
        unit: differential.unit || 'hourly',
        group: differential.group || 'Custom',
      };
      
      updateFormData({
        individualDifferentials: [...currentDifferentials, newDifferential]
      });
    }
    
    setDifferentialInput('');
    setShowDifferentialSuggestions(false);
  }, [formData.individualDifferentials, updateFormData]);

  const addCustomDifferential = useCallback(() => {
    if (customDiff.type && customDiff.amount > 0) {
      addDifferential(customDiff);
      setCustomDiff({
        type: '',
        amount: 0,
        unit: 'hourly',
      });
    }
  }, [customDiff, addDifferential]);

  const removeDifferential = useCallback((index: number) => {
    const currentDifferentials = formData.individualDifferentials || [];
    const newDifferentials = currentDifferentials.filter((_: any, i: number) => i !== index);
    updateFormData({ individualDifferentials: newDifferentials });
  }, [formData.individualDifferentials, updateFormData]);

  const editDifferential = useCallback((index: number, field: keyof IndividualDifferentialItem, value: any) => {
    const currentDifferentials = [...(formData.individualDifferentials || [])];
    currentDifferentials[index] = {
      ...currentDifferentials[index],
      [field]: value
    };
    updateFormData({ individualDifferentials: currentDifferentials });
  }, [formData.individualDifferentials, updateFormData]);

  return {
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
  };
}
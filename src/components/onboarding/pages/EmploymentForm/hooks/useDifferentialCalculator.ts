import { useState, useCallback, useMemo } from 'react';

export interface DifferentialItem {
  id: string;
  type: string;
  amount: number;
  unit: 'hourly' | 'shift' | 'weekly' | 'monthly';
  group: string;
}

export interface PayrollState {
  hourlyRate: string;
  weeklyHours: string;
  payFrequency: string;
  contractType: string;
  customRatio: string;
  differentialItems: DifferentialItem[];
}

export const useDifferentialCalculator = () => {
  // Payroll calculation states
  const [hourlyRate, setHourlyRate] = useState<string>('');
  const [weeklyHours, setWeeklyHours] = useState<string>('40');
  const [payFrequency, setPayFrequency] = useState<string>('');
  const [contractType, setContractType] = useState<string>('');
  const [customRatio, setCustomRatio] = useState<string>('');

  // Differential management
  const [differentialItems, setDifferentialItems] = useState<DifferentialItem[]>([]);
  const [isAddingDifferential, setIsAddingDifferential] = useState(false);
  const [newDifferentialType, setNewDifferentialType] = useState<string>('');
  const [newDifferentialAmount, setNewDifferentialAmount] = useState<string>('');
  const [newDifferentialUnit, setNewDifferentialUnit] = useState<'hourly' | 'shift' | 'weekly' | 'monthly'>('hourly');
  const [newDifferentialGroup, setNewDifferentialGroup] = useState<string>('');

  // Available differential types
  const differentialTypes = [
    'Night Differential',
    'Weekend Differential',
    'Holiday Pay',
    'On-call Pay',
    'Charge Nurse Differential',
    'Preceptor Differential',
    'Shift Differential',
    'Overtime Premium',
    'Certification Bonus',
    'Experience Premium',
    'Custom Differential'
  ];

  const differentialGroups = [
    'Time-based',
    'Role-based', 
    'Skill-based',
    'Performance-based',
    'Other'
  ];

  // Payroll calculations
  const baseWeeklyPay = useMemo(() => {
    const rate = parseFloat(hourlyRate) || 0;
    const hours = parseFloat(weeklyHours) || 0;
    return rate * hours;
  }, [hourlyRate, weeklyHours]);

  const totalDifferentialWeekly = useMemo(() => differentialItems.reduce((total, item) => {
      const {amount} = item;
      switch (item.unit) {
        case 'hourly':
          return total + (amount * (parseFloat(weeklyHours) || 0));
        case 'shift':
          // Assume 3 shifts per week on average
          return total + (amount * 3);
        case 'weekly':
          return total + amount;
        case 'monthly':
          return total + (amount / 4.33); // Convert monthly to weekly
        default:
          return total;
      }
    }, 0), [differentialItems, weeklyHours]);

  const totalWeeklyPay = useMemo(() => baseWeeklyPay + totalDifferentialWeekly, [baseWeeklyPay, totalDifferentialWeekly]);

  const estimatedAnnualPay = useMemo(() => totalWeeklyPay * 52, [totalWeeklyPay]);

  // Handlers for basic payroll fields
  const updateHourlyRate = useCallback((value: string) => {
    setHourlyRate(value);
  }, []);

  const updateWeeklyHours = useCallback((value: string) => {
    setWeeklyHours(value);
  }, []);

  const updatePayFrequency = useCallback((value: string) => {
    setPayFrequency(value);
  }, []);

  const updateContractType = useCallback((value: string) => {
    setContractType(value);
  }, []);

  const updateCustomRatio = useCallback((value: string) => {
    setCustomRatio(value);
  }, []);

  // Differential management handlers
  const startAddingDifferential = useCallback(() => {
    setIsAddingDifferential(true);
    setNewDifferentialType('');
    setNewDifferentialAmount('');
    setNewDifferentialUnit('hourly');
    setNewDifferentialGroup('');
  }, []);

  const cancelAddingDifferential = useCallback(() => {
    setIsAddingDifferential(false);
    setNewDifferentialType('');
    setNewDifferentialAmount('');
    setNewDifferentialUnit('hourly');
    setNewDifferentialGroup('');
  }, []);

  const addDifferential = useCallback(() => {
    if (!newDifferentialType || !newDifferentialAmount) {
      return false; // Validation failed
    }

    const newDifferential: DifferentialItem = {
      id: Date.now().toString(),
      type: newDifferentialType,
      amount: parseFloat(newDifferentialAmount),
      unit: newDifferentialUnit,
      group: newDifferentialGroup || 'Other'
    };

    setDifferentialItems(prev => [...prev, newDifferential]);
    cancelAddingDifferential();
    return true;
  }, [newDifferentialType, newDifferentialAmount, newDifferentialUnit, newDifferentialGroup, cancelAddingDifferential]);

  const removeDifferential = useCallback((id: string) => {
    setDifferentialItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateDifferential = useCallback((id: string, updates: Partial<DifferentialItem>) => {
    setDifferentialItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  // Data validation
  const validatePayrollData = useCallback(() => {
    const errors: string[] = [];
    
    if (!hourlyRate || parseFloat(hourlyRate) <= 0) {
      errors.push('Valid hourly rate is required');
    }
    
    if (!weeklyHours || parseFloat(weeklyHours) <= 0 || parseFloat(weeklyHours) > 168) {
      errors.push('Valid weekly hours (1-168) is required');
    }
    
    if (!payFrequency) {
      errors.push('Pay frequency is required');
    }
    
    if (!contractType) {
      errors.push('Contract type is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [hourlyRate, weeklyHours, payFrequency, contractType]);

  // Reset all data
  const resetPayrollData = useCallback(() => {
    setHourlyRate('');
    setWeeklyHours('40');
    setPayFrequency('');
    setContractType('');
    setCustomRatio('');
    setDifferentialItems([]);
    cancelAddingDifferential();
  }, [cancelAddingDifferential]);

  // Export current payroll state
  const getPayrollState = useCallback((): PayrollState => ({
      hourlyRate,
      weeklyHours,
      payFrequency,
      contractType,
      customRatio,
      differentialItems,
    }), [hourlyRate, weeklyHours, payFrequency, contractType, customRatio, differentialItems]);

  // Load payroll state
  const loadPayrollState = useCallback((state: PayrollState) => {
    setHourlyRate(state.hourlyRate);
    setWeeklyHours(state.weeklyHours);
    setPayFrequency(state.payFrequency);
    setContractType(state.contractType);
    setCustomRatio(state.customRatio);
    setDifferentialItems(state.differentialItems);
  }, []);

  return {
    // Basic payroll state
    hourlyRate,
    weeklyHours,
    payFrequency,
    contractType,
    customRatio,
    
    // Differential state
    differentialItems,
    isAddingDifferential,
    newDifferentialType,
    newDifferentialAmount,
    newDifferentialUnit,
    newDifferentialGroup,
    
    // Calculated values
    baseWeeklyPay,
    totalDifferentialWeekly,
    totalWeeklyPay,
    estimatedAnnualPay,
    
    // Available options
    differentialTypes,
    differentialGroups,
    
    // Basic payroll handlers
    updateHourlyRate,
    updateWeeklyHours,
    updatePayFrequency,
    updateContractType,
    updateCustomRatio,
    
    // Differential handlers
    startAddingDifferential,
    cancelAddingDifferential,
    addDifferential,
    removeDifferential,
    updateDifferential,
    
    // New differential form handlers
    setNewDifferentialType,
    setNewDifferentialAmount,
    setNewDifferentialUnit,
    setNewDifferentialGroup,
    
    // Utility functions
    validatePayrollData,
    resetPayrollData,
    getPayrollState,
    loadPayrollState,
  };
};
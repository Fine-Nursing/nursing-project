import React from 'react';
import { useDifferentialCalculator } from '../../hooks/useDifferentialCalculator';
import { BasicPaySection } from './components/BasicPaySection';
import { DifferentialSection } from './components/DifferentialSection';
import { CustomRatioSection } from './components/CustomRatioSection';
import { PaySummary } from './components/PaySummary';
import type { PayrollConfigurationProps } from './types';

export const PayrollConfiguration: React.FC<PayrollConfigurationProps> = ({
  onPayrollDataChange,
  initialData
}) => {
  const {
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
    
    // New differential form handlers
    setNewDifferentialType,
    setNewDifferentialAmount,
    setNewDifferentialUnit,
    setNewDifferentialGroup,
    
    // Utility functions
    validatePayrollData,
    getPayrollState,
    loadPayrollState,
  } = useDifferentialCalculator();

  // Load initial data
  React.useEffect(() => {
    if (initialData) {
      const state = {
        hourlyRate: initialData.hourlyRate || '',
        weeklyHours: initialData.weeklyHours || '40',
        payFrequency: initialData.payFrequency || '',
        contractType: initialData.contractType || '',
        customRatio: initialData.customRatio || '',
        differentialItems: initialData.differentialItems || [],
      };
      loadPayrollState(state);
    }
  }, [initialData, loadPayrollState]);

  // Notify parent of changes
  React.useEffect(() => {
    if (onPayrollDataChange) {
      const currentState = getPayrollState();
      const calculatedData = {
        ...currentState,
        baseWeeklyPay,
        totalDifferentialWeekly,
        totalWeeklyPay,
        estimatedAnnualPay,
        validation: validatePayrollData(),
      };
      onPayrollDataChange(calculatedData);
    }
  }, [
    hourlyRate,
    weeklyHours,
    payFrequency,
    contractType,
    customRatio,
    differentialItems,
    baseWeeklyPay,
    totalDifferentialWeekly,
    totalWeeklyPay,
    estimatedAnnualPay,
    onPayrollDataChange,
    getPayrollState,
    validatePayrollData,
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Compensation & Pay Structure
        </h3>
      </div>

      <BasicPaySection
        hourlyRate={hourlyRate}
        weeklyHours={weeklyHours}
        payFrequency={payFrequency}
        contractType={contractType}
        updateHourlyRate={updateHourlyRate}
        updateWeeklyHours={updateWeeklyHours}
        updatePayFrequency={updatePayFrequency}
        updateContractType={updateContractType}
      />

      <DifferentialSection
        differentialItems={differentialItems}
        isAddingDifferential={isAddingDifferential}
        newDifferentialType={newDifferentialType}
        newDifferentialAmount={newDifferentialAmount}
        newDifferentialUnit={newDifferentialUnit}
        newDifferentialGroup={newDifferentialGroup}
        differentialTypes={differentialTypes}
        differentialGroups={differentialGroups}
        startAddingDifferential={startAddingDifferential}
        cancelAddingDifferential={cancelAddingDifferential}
        addDifferential={addDifferential}
        removeDifferential={removeDifferential}
        setNewDifferentialType={setNewDifferentialType}
        setNewDifferentialAmount={setNewDifferentialAmount}
        setNewDifferentialUnit={setNewDifferentialUnit}
        setNewDifferentialGroup={setNewDifferentialGroup}
      />

      <CustomRatioSection
        customRatio={customRatio}
        updateCustomRatio={updateCustomRatio}
      />

      <PaySummary
        baseWeeklyPay={baseWeeklyPay}
        totalDifferentialWeekly={totalDifferentialWeekly}
        totalWeeklyPay={totalWeeklyPay}
        estimatedAnnualPay={estimatedAnnualPay}
      />
    </div>
  );
};

export default PayrollConfiguration;
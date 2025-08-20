import React from 'react';
import { DifferentialForm } from './DifferentialForm';
import { DifferentialList } from './DifferentialList';
import type { DifferentialSectionProps } from '../types';

export function DifferentialSection({
  differentialItems,
  isAddingDifferential,
  newDifferentialType,
  newDifferentialAmount,
  newDifferentialUnit,
  newDifferentialGroup,
  differentialTypes,
  differentialGroups,
  startAddingDifferential,
  cancelAddingDifferential,
  addDifferential,
  removeDifferential,
  setNewDifferentialType,
  setNewDifferentialAmount,
  setNewDifferentialUnit,
  setNewDifferentialGroup,
}: DifferentialSectionProps) {
  const handleAddDifferential = () => {
    const success = addDifferential();
    if (!success) {
      alert('Please fill in all required fields for the differential.');
    }
  };

  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-md font-medium text-gray-900">Differential Pay & Bonuses</h4>
        {!isAddingDifferential && (
          <button
            onClick={startAddingDifferential}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Add Differential
          </button>
        )}
      </div>

      {isAddingDifferential && (
        <DifferentialForm
          newDifferentialType={newDifferentialType}
          newDifferentialAmount={newDifferentialAmount}
          newDifferentialUnit={newDifferentialUnit}
          newDifferentialGroup={newDifferentialGroup}
          differentialTypes={differentialTypes}
          differentialGroups={differentialGroups}
          setNewDifferentialType={setNewDifferentialType}
          setNewDifferentialAmount={setNewDifferentialAmount}
          setNewDifferentialUnit={setNewDifferentialUnit}
          setNewDifferentialGroup={setNewDifferentialGroup}
          onAdd={handleAddDifferential}
          onCancel={cancelAddingDifferential}
        />
      )}

      <DifferentialList
        differentialItems={differentialItems}
        removeDifferential={removeDifferential}
      />
    </div>
  );
}
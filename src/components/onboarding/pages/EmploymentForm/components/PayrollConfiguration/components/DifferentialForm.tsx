import React from 'react';
import { differentialUnits } from '../constants';

interface DifferentialFormProps {
  newDifferentialType: string;
  newDifferentialAmount: string;
  newDifferentialUnit: string;
  newDifferentialGroup: string;
  differentialTypes: string[];
  differentialGroups: string[];
  setNewDifferentialType: (value: string) => void;
  setNewDifferentialAmount: (value: string) => void;
  setNewDifferentialUnit: (value: any) => void;
  setNewDifferentialGroup: (value: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}

export function DifferentialForm({
  newDifferentialType,
  newDifferentialAmount,
  newDifferentialUnit,
  newDifferentialGroup,
  differentialTypes,
  differentialGroups,
  setNewDifferentialType,
  setNewDifferentialAmount,
  setNewDifferentialUnit,
  setNewDifferentialGroup,
  onAdd,
  onCancel,
}: DifferentialFormProps) {
  return (
    <div className="bg-white rounded-lg p-4 mb-4 border border-blue-200">
      <h5 className="text-sm font-medium text-gray-800 mb-3">Add New Differential</h5>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
          <select
            value={newDifferentialType}
            onChange={(e) => setNewDifferentialType(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select type</option>
            {differentialTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Amount</label>
          <div className="relative">
            <span className="absolute left-2 top-1 text-gray-500 text-sm">$</span>
            <input
              type="number"
              value={newDifferentialAmount}
              onChange={(e) => setNewDifferentialAmount(e.target.value)}
              step="0.01"
              min="0"
              className="w-full pl-6 pr-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
          <select
            value={newDifferentialUnit}
            onChange={(e) => setNewDifferentialUnit(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
          >
            {differentialUnits.map(unit => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Group</label>
          <select
            value={newDifferentialGroup}
            onChange={(e) => setNewDifferentialGroup(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select group</option>
            {differentialGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={onAdd}
          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
        >
          Add Differential
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}